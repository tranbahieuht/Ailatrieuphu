export type Track = 'intro' | 'question-easy' | 'question-medium' | 'question-hard' | 'final-answer' | 'correct' | 'correct-10' | 'wrong' | 'milestone' | 'victory' | 'ending' | 'timeout' | 'lifeline' | 'warning';

// One music channel, one effects channel. Generation guards cancel stale async playback.
export class AudioManager {
  private music: HTMLAudioElement | null = null;
  private effect: HTMLAudioElement | null = null;
  private manifest: Partial<Record<Track,string>> = {};
  private ready: Promise<void> | null = null;
  private muted = false;
  private volume = .55;
  private generation = 0;
  private effectGeneration = 0;
  private fade: number | null = null;
  private fadeResolve: (() => void) | null = null;
  private requested: {track:Track;loop:boolean} | null = null;
  private enabled = false;
  private suspended = false;
  private warned = false;
  private musicEnded: (() => void) | null = null;
  onUnavailable?: () => void;

  constructor() {
    // Fetch metadata before the start gesture, so initial play can be synchronous.
    this.ready = fetch('/audio/manifest.json').then(async r => {
      if (r.ok) this.manifest = await r.json(); else this.unavailable();
    }).catch(() => this.unavailable());
  }

  unlock() {
    // Create both channels and call play synchronously inside the initiating gesture.
    if (!this.music) this.music = new Audio();
    if (!this.effect) this.effect = new Audio();
    this.enabled = true;
    // Prime HTMLMediaElements within the click event for mobile autoplay rules.
    // A data URI is a local, silent PCM sample, not an external dependency.
    const silence='data:audio/wav;base64,UklGRiYAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQIAAAAAAA==';
    for(const channel of [this.music,this.effect]) {
      if(!channel.src) {
        channel.src=silence;channel.volume=0;
        void channel.play().catch(()=>{});
      }
    }
  }
  private unavailable() { if (!this.warned) { this.warned=true; this.onUnavailable?.(); } }
  private cancelFade() {
    if(this.fade!==null)cancelAnimationFrame(this.fade);
    this.fade=null;
    this.fadeResolve?.();
    this.fadeResolve=null;
  }
  setSettings(muted:boolean,volume:number) {
    const wasMuted = this.muted;
    this.muted=muted; this.volume=Math.max(0,Math.min(1,volume));
    if (this.effect) { this.effect.muted=muted; this.effect.volume=this.volume; }
    if (this.music) { this.music.muted=muted; this.music.volume=this.volume*.65; }
    if (muted) {
      const onEnded=this.musicEnded;this.musicEnded=null;
      this.generation++; this.effectGeneration++; this.cancelFade(); this.music?.pause(); this.effect?.pause();
      onEnded?.();
    }
    else if (wasMuted && this.requested && !this.suspended) void this.playMusic(this.requested.track,this.requested.loop);
  }
  async playMusic(track:Track,loop=true,onEnded?:()=>void) {
    this.requested={track,loop};
    const generation=++this.generation;
    this.musicEnded=onEnded??null;
    const complete=()=>{
      if(generation!==this.generation)return;
      const callback=this.musicEnded;this.musicEnded=null;callback?.();
    };
    this.cancelFade();
    if (!this.enabled || this.muted || this.suspended) { complete();return; }
    await this.ready;
    if(generation!==this.generation || this.muted || this.suspended)return;
    const url=this.manifest[track];
    if (!url) { this.music?.pause(); this.unavailable();complete();return; }
    const channel=this.music!;
    const startVolume=channel.volume;
    await new Promise<void>(resolve=>{
      this.fadeResolve=resolve;
      const start=performance.now();
      const step=()=>{
        if(generation!==this.generation){resolve();return;}
        const progress=Math.min(1,(performance.now()-start)/220);
        channel.volume=startVolume*(1-progress);
        if(progress<1)this.fade=requestAnimationFrame(step);else {this.fade=null;this.fadeResolve=null;resolve();}
      };
      step();
    });
    if(generation!==this.generation||this.muted||this.suspended)return;
    channel.pause(); channel.src=url; channel.loop=loop; channel.volume=0; channel.muted=false;
    channel.onended=loop?null:complete;
    channel.onerror=()=>{if(generation===this.generation){this.unavailable();complete();}};
    try {
      await channel.play();
      if(generation!==this.generation||this.muted||this.suspended){channel.pause();return;}
      const start=performance.now();
      const step=()=>{
        if(generation!==this.generation)return;
        const progress=Math.min(1,(performance.now()-start)/450);
        channel.volume=this.volume*.65*progress;
        if(progress<1)this.fade=requestAnimationFrame(step);
      };
      step();
    } catch { if (generation===this.generation) {this.unavailable();complete();} }
  }
  async playEffect(track:Track) {
    const generation=++this.effectGeneration;
    if(!this.enabled||this.muted||this.suspended)return;
    await this.ready;
    if(generation!==this.effectGeneration||this.muted||this.suspended)return;
    const url=this.manifest[track];
    if(!url){this.unavailable();return;}
    const channel=this.effect!; channel.pause();channel.src=url;channel.loop=false;channel.volume=this.volume;channel.muted=false;
    try {
      await channel.play();
      if(generation!==this.effectGeneration||this.muted||this.suspended)channel.pause();
    } catch { if(generation===this.effectGeneration)this.unavailable(); }
  }
  suspend(paused:boolean) {
    if(this.suspended===paused)return;
    this.suspended=paused;
    if(paused){this.generation++;this.effectGeneration++;this.cancelFade();this.music?.pause();this.effect?.pause();}
    else if(this.requested&&!this.muted)void this.playMusic(this.requested.track,this.requested.loop);
  }
  stopMusic() {
    this.generation++;this.requested=null;
    this.musicEnded=null;
    if(this.music){this.music.onended=null;this.music.onerror=null;}
    this.cancelFade();
    this.music?.pause();
  }
  stopAll() { this.stopMusic();this.effectGeneration++;this.effect?.pause();this.suspended=false; }
  dispose() {
    this.stopAll();
    [this.music,this.effect].forEach(a=>{if(a){a.removeAttribute('src');a.load();}});
    this.music=null;this.effect=null;
  }
}
