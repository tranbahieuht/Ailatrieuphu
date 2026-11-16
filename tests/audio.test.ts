import test from 'node:test';
import assert from 'node:assert/strict';
import { AudioManager } from '../src/lib/AudioManager';

class FakeAudio {
  static instances:FakeAudio[]=[];
  src='';volume=1;muted=false;loop=false;paused=true;plays:string[]=[];
  onended:(()=>void)|null=null;
  onerror:(()=>void)|null=null;
  constructor(){FakeAudio.instances.push(this);}
  async play(){this.paused=false;this.plays.push(this.src);}
  pause(){this.paused=true;}
  removeAttribute(){this.src='';}
  load(){}
}
const manifest={intro:'/audio/intro.wav','question-easy':'/audio/easy.wav','question-hard':'/audio/hard.wav',correct:'/audio/correct.wav'};
const settle=()=>new Promise(resolve=>setTimeout(resolve,35));
let fakeTime=0;
Object.defineProperty(globalThis,'Audio',{value:FakeAudio,configurable:true});
Object.defineProperty(globalThis,'performance',{value:{now:()=>fakeTime+=150},configurable:true});
Object.defineProperty(globalThis,'requestAnimationFrame',{value:(fn:FrameRequestCallback)=>setTimeout(()=>fn(fakeTime),1),configurable:true});
Object.defineProperty(globalThis,'cancelAnimationFrame',{value:(id:number)=>clearTimeout(id),configurable:true});

test('âm nhạc: tắt tiếng không bị yêu cầu đang chờ phát lại; kết thúc xóa nhạc yêu cầu',async()=>{
  globalThis.fetch=async()=>Response.json(manifest);
  const a=new AudioManager();a.unlock();
  const pending=a.playMusic('question-easy');
  a.setSettings(true,.5);await pending;await settle();
  const music=FakeAudio.instances.at(-2)!;
  assert.equal(music.paused,true);assert.ok(!music.plays.includes('/audio/easy.wav'));
  a.stopAll();a.setSettings(false,.5);await settle();assert.equal(music.paused,true);
  a.dispose();
});
test('âm nhạc: chỉ có một kênh nền, đổi track đúng, hiệu ứng không thay nền',async()=>{
  globalThis.fetch=async()=>Response.json(manifest);
  const a=new AudioManager();a.unlock();await a.playMusic('question-easy');await settle();
  const music=FakeAudio.instances.at(-2)!,effect=FakeAudio.instances.at(-1)!;
  assert.equal(music.src,'/audio/easy.wav');assert.equal(music.loop,true);
  await a.playEffect('correct');assert.equal(effect.src,'/audio/correct.wav');assert.equal(music.src,'/audio/easy.wav');
  await a.playMusic('question-hard');assert.equal(music.src,'/audio/hard.wav');assert.equal(FakeAudio.instances.at(-2),music);
  a.suspend(true);assert.equal(music.paused,true);assert.equal(effect.paused,true);
  a.suspend(false);await settle();assert.equal(music.src,'/audio/hard.wav');assert.equal(music.paused,false);
  a.dispose();assert.equal(music.paused,true);assert.equal(effect.paused,true);
});
test('âm nhạc: stopAll trong lúc manifest tải ngăn mọi nhạc và hiệu ứng đến muộn',async()=>{
  let release!:(value:Response)=>void;
  globalThis.fetch=()=>new Promise<Response>(resolve=>{release=resolve;});
  const a=new AudioManager();a.unlock();const pending=a.playMusic('intro');const fx=a.playEffect('correct');a.stopAll();
  release(Response.json(manifest));await Promise.all([pending,fx]);await settle();
  const music=FakeAudio.instances.at(-2)!,effect=FakeAudio.instances.at(-1)!;
  assert.ok(!music.plays.includes('/audio/intro.wav'));assert.ok(!effect.plays.includes('/audio/correct.wav'));
  a.dispose();
});
test('âm nhạc: manifest không có track vẫn hoạt động, thông báo lỗi chỉ một lần',async()=>{
  globalThis.fetch=async()=>Response.json({});
  const a=new AudioManager();let warnings=0;a.onUnavailable=()=>warnings++;a.unlock();
  await a.playMusic('intro');await a.playEffect('correct');assert.equal(warnings,1);a.dispose();
});
test('âm nhạc: đổi track liên tiếp hủy fade cũ, không treo Promise hoặc phát nhạc đến muộn',async()=>{
  globalThis.fetch=async()=>Response.json(manifest);
  const a=new AudioManager();a.unlock();await a.playMusic('intro');
  const first=a.playMusic('question-easy');await Promise.resolve();await Promise.resolve();
  const second=a.playMusic('question-hard');await Promise.all([first,second]);
  assert.equal(FakeAudio.instances.at(-2)!.src,'/audio/hard.wav');a.dispose();
});

test('intro chờ nhạc kết thúc, không gọi lại khi chuyển bài hoặc tắt tiếng',async()=>{
  globalThis.fetch=async()=>Response.json(manifest);
  const a=new AudioManager();a.unlock();let completed=0;
  await a.playMusic('intro',false,()=>completed++);
  const music=FakeAudio.instances.at(-2)!;
  assert.equal(completed,0);assert.equal(music.loop,false);
  music.onended?.();assert.equal(completed,1);
  music.onended?.();assert.equal(completed,1);
  await a.playMusic('intro',false,()=>completed++);
  const staleEnd=music.onended;
  a.stopAll();staleEnd?.();assert.equal(completed,1);
  await a.playMusic('intro',false,()=>completed++);
  a.setSettings(true,.5);assert.equal(completed,2);
  music.onended?.();assert.equal(completed,2);
  await a.playMusic('intro',false,()=>completed++);assert.equal(completed,3);
  a.dispose();
});

test('intro lỗi tải vẫn cho vào trò chơi',async()=>{
  globalThis.fetch=async()=>Response.json(manifest);
  const a=new AudioManager();a.unlock();let completed=0;let warnings=0;
  a.onUnavailable=()=>warnings++;
  await a.playMusic('intro',false,()=>completed++);
  FakeAudio.instances.at(-2)!.onerror?.();
  assert.equal(completed,1);assert.equal(warnings,1);
  a.dispose();
});
