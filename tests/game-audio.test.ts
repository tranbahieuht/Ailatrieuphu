import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync, statSync } from 'node:fs';
import { resolve } from 'node:path';
import { revealTrack } from '../src/lib/gameAudio';

test('nhạc đúng câu 10 và 15 có ưu tiên riêng; câu 5 giữ nhạc mốc',()=>{
  for(let count=1;count<=15;count++){
    const expected=count===15?'victory':count===10?'correct-10':count===5?'milestone':'correct';
    assert.equal(revealTrack({outcome:'correct',correctCount:count}),expected);
    assert.equal(revealTrack({outcome:'wrong',correctCount:count}),'wrong');
    assert.equal(revealTrack({outcome:'timeout',correctCount:count}),'timeout');
  }
});

test('manifest trỏ đến đủ 5 bản nhạc đã nhập và các tệp dự phòng có thật',()=>{
  const manifest=JSON.parse(readFileSync(resolve('public/audio/manifest.json'),'utf8'));
  for(const name of ['intro','correct-10','victory','ending','wrong']){
    assert.equal(manifest[name],`/audio/${name}.mp3`);
    assert.ok(statSync(resolve(`public/audio/${name}.mp3`)).size>1000);
  }
  for(const url of Object.values(manifest)){
    assert.ok(typeof url==='string'&&url.startsWith('/audio/'));
    assert.ok(existsSync(resolve('public',String(url).slice(1))));
  }
});
