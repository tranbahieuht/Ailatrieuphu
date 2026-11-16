import { mkdirSync, existsSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

// Original procedural soundtrack. No recordings, samples or melodies from a TV show.
// Copyright 2026; dedicated to the public domain under CC0-1.0.
const directory = resolve('public/audio');
mkdirSync(directory, { recursive: true });
const sampleRate = 22050;
const arrangements = {
  intro: { seconds: 8, bpm: 120, root: 146.83, bright: true },
  'question-easy': { seconds: 16, bpm: 90, root: 73.416, quiet: true },
  'question-medium': { seconds: 16, bpm: 105, root: 65.406, quiet: true },
  'question-hard': { seconds: 16, bpm: 120, root: 61.735, quiet: true },
  'final-answer': { seconds: 3, bpm: 160, root: 73.416, tension: true },
  correct: { seconds: 2.4, bpm: 150, root: 146.83, bright: true },
  wrong: { seconds: 2.8, bpm: 90, root: 65.406, dark: true },
  milestone: { seconds: 4, bpm: 120, root: 146.83, bright: true },
  victory: { seconds: 8, bpm: 120, root: 130.813, bright: true },
  timeout: { seconds: 2, bpm: 120, root: 55, dark: true },
  lifeline: { seconds: 1.2, bpm: 150, root: 220, bright: true },
  warning: { seconds: .35, bpm: 120, root: 440, tension: true },
};
const manifest = {};
for (const [name, a] of Object.entries(arrangements)) {
  const count = Math.floor(a.seconds * sampleRate);
  const buffer = Buffer.alloc(44 + count * 4);
  buffer.write('RIFF'); buffer.writeUInt32LE(buffer.length - 8, 4); buffer.write('WAVE', 8);
  buffer.write('fmt ', 12); buffer.writeUInt32LE(16, 16); buffer.writeUInt16LE(1, 20);
  buffer.writeUInt16LE(2, 22); buffer.writeUInt32LE(sampleRate, 24); buffer.writeUInt32LE(sampleRate * 4, 28);
  buffer.writeUInt16LE(4, 32); buffer.writeUInt16LE(16, 34); buffer.write('data', 36); buffer.writeUInt32LE(count * 4, 40);
  const beat = 60 / a.bpm, notes = a.bright ? [0, 4, 7, 12, 7, 16, 12, 19] : [0, 7, 10, 14, 12, 7, 3, 10];
  for (let i = 0; i < count; i++) {
    const t = i / sampleRate;
    const phrase = Math.floor(t / (beat * 4)) % 4;
    const root = a.root * 2 ** ([0, -2, -5, -2][phrase] / 12);
    const fade = Math.min(1, t / .06, (a.seconds - t) / (a.quiet ? .06 : .7));
    const pad = [1, a.bright ? 1.25992 : 1.1892, 1.4983].reduce((sum, n, k) => sum + Math.sin(2*Math.PI*root*n*t + .15*Math.sin(t*.7+k))*.042, 0);
    const eighth = beat / 2, step = Math.floor(t / eighth), local = t % eighth;
    const freq = root * 2 ** (notes[step % notes.length] / 12) * (a.tension ? 4 : 2);
    const pluck = (Math.sin(2*Math.PI*freq*local) + .25*Math.sin(2*Math.PI*freq*2*local)) * Math.exp(-local*9) * .16;
    const kickTime = t % beat;
    const kick = Math.sin(2*Math.PI*(46*kickTime + 4*(1-Math.exp(-kickTime*24)))) * Math.exp(-kickTime*19)*.16;
    const shimmer = Math.sin(i*127.1)*Math.sin(i*311.7)*Math.exp(-local*65)*.023;
    const drone = a.dark ? Math.sin(2*Math.PI*(root*(1-t/a.seconds*.3))*t)*.11*Math.exp(-t*.8) : 0;
    const signal = (pad + pluck + kick + shimmer + drone) * fade * (a.quiet ? .65 : 1);
    for (let channel = 0; channel < 2; channel++) {
      const width = Math.sin(2*Math.PI*root*2.003*t + channel*.22)*.008*fade;
      buffer.writeInt16LE(Math.round(Math.max(-.95, Math.min(.95, signal+width))*32767),44+i*4+channel*2);
    }
  }
  const fallback = `original-${name}.wav`;
  if (!existsSync(resolve(directory, fallback))) writeFileSync(resolve(directory, fallback), buffer);
  manifest[name] = existsSync(resolve(directory, `${name}.mp3`)) ? `/audio/${name}.mp3` : `/audio/${fallback}`;
}
// Dedicated supplied cues; keep sensible fallbacks when no override is present.
for (const [name, fallback] of Object.entries({ 'correct-10': 'milestone', ending: 'intro' })) {
  manifest[name] = existsSync(resolve(directory, `${name}.mp3`)) ? `/audio/${name}.mp3` : manifest[fallback];
}
writeFileSync(resolve(directory,'manifest.json'), JSON.stringify(manifest,null,2)+'\n');
console.log('Audio ready: supplied MP3 overrides detected; original WAV fallbacks available.');
