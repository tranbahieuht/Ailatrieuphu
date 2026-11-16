import test from 'node:test';
import assert from 'node:assert/strict';
import { questions } from '../src/data/questions';
import { gameReducer, initialState, safeScore, finalScore, fiftyFifty, audienceVotes, SCORES, type GameState, type Action } from '../src/lib/game';

const reduce = (state:GameState,...actions:Action[]) => actions.reduce(gameReducer,state);
const start = () => reduce(initialState,{type:'START',name:'Người chơi thử'},{type:'READY'});
const correct = (state:GameState) => reduce(state,{type:'SELECT',index:questions[state.index].correct},{type:'CONFIRM'},{type:'REVEAL'});

test('15 câu hỏi đầy đủ, số thứ tự và đáp án hợp lệ, có giải thích và gợi ý',()=>{
  assert.equal(questions.length,15);
  questions.forEach((q,i)=>{assert.equal(q.id,i+1);assert.equal(q.answers.length,4);assert.ok(q.answers[q.correct]);assert.ok(q.explanation.length>30);assert.ok(q.hint.length>20);});
  assert.deepEqual(SCORES,[100,200,300,500,1000,1500,2000,3000,4000,5000,7000,10000,15000,20000,30000]);
});
test('thắng đủ 15 câu, giải thích giữ nguyên đến khi chủ động chuyển tiếp',()=>{
  let s=start();
  for(let i=0;i<15;i++){
    s=correct(s);assert.equal(s.phase,'revealed');assert.equal(s.correctCount,i+1);assert.equal(s.index,i);
    s=gameReducer(s,{type:'TICK',elapsed:90000});assert.equal(s.phase,'revealed');assert.equal(s.index,i);
    s=gameReducer(s,{type:'NEXT'});
  }
  assert.equal(s.phase,'finished');assert.equal(s.outcome,'victory');assert.equal(finalScore(s),30000);
});
test('sai ở mọi câu nhận đúng mốc an toàn đã vượt qua',()=>{
  for(let failAt=0;failAt<15;failAt++){
    let s=start();
    for(let i=0;i<failAt;i++)s=gameReducer(correct(s),{type:'NEXT'});
    s=reduce(s,{type:'SELECT',index:((questions[failAt].correct+1)%4) as 0|1|2|3},{type:'CONFIRM'},{type:'REVEAL'},{type:'RESULT'});
    assert.equal(s.phase,'finished');assert.equal(s.outcome,'wrong');assert.equal(s.correctCount,failAt);assert.equal(finalScore(s),safeScore(failAt));
  }
});
test('hết giờ nhận mốc an toàn, không thể chốt hoặc tiếp câu',()=>{
  let s=start();for(let i=0;i<5;i++)s=gameReducer(correct(s),{type:'NEXT'});
  s=gameReducer(s,{type:'TICK',elapsed:30500});assert.equal(s.remaining,0);assert.equal(s.outcome,'timeout');
  const frozen=reduce(s,{type:'SELECT',index:0},{type:'CONFIRM'},{type:'NEXT'});assert.deepEqual(frozen,s);
  s=gameReducer(s,{type:'RESULT'});assert.equal(finalScore(s),1000);
});
test('đồng hồ tính phần giây, hỗ trợ độ trễ tab, dừng trong intro và suspense',()=>{
  let s=gameReducer(initialState,{type:'START',name:''});
  assert.equal(gameReducer(s,{type:'TICK',elapsed:2000}).remaining,30000);
  s=reduce(s,{type:'READY'},{type:'TICK',elapsed:1234});assert.equal(s.remaining,28766);
  s=reduce(s,{type:'SELECT',index:0},{type:'CONFIRM'},{type:'TICK',elapsed:99999});assert.equal(s.phase,'suspense');assert.equal(s.remaining,28766);
});
test('tạm dừng và chuyên gia giữ thời gian còn lại; khán giả không dừng đồng hồ',()=>{
  let s=reduce(start(),{type:'TICK',elapsed:2222},{type:'PAUSE'});
  assert.equal(gameReducer(s,{type:'TICK',elapsed:10000}).remaining,27778);
  s=reduce(s,{type:'PAUSE'},{type:'LIFELINE',kind:'expert'},{type:'TICK',elapsed:20000});assert.equal(s.remaining,27778);
  s=reduce(s,{type:'CLOSE_MODAL'},{type:'TICK',elapsed:1000});assert.equal(s.remaining,26778);
  s=reduce(s,{type:'LIFELINE',kind:'audience',votes:[10,60,20,10]},{type:'TICK',elapsed:2000});assert.equal(s.remaining,24778);
});
test('50:50 luôn loại hai đáp án sai khác nhau và không thể dùng lại',()=>{
  for(let answer=0;answer<4;answer++)for(let i=0;i<100;i++){
    const removed=fiftyFifty(answer);assert.equal(removed.length,2);assert.equal(new Set(removed).size,2);assert.ok(!removed.includes(answer));
  }
  const s=gameReducer(start(),{type:'LIFELINE',kind:'fifty',hidden:[0,2]});
  assert.deepEqual(gameReducer(s,{type:'LIFELINE',kind:'fifty',hidden:[2,3]}),s);
  assert.deepEqual(gameReducer(s,{type:'SELECT',index:0}),s);
});
test('50:50 bỏ lựa chọn nếu đáp án đang chọn bị loại; giữ trạng thái đúng',()=>{
  const s=reduce(start(),{type:'SELECT',index:0},{type:'LIFELINE',kind:'fifty',hidden:[0,2]});
  assert.equal(s.selected,null);assert.equal(s.phase,'question');assert.deepEqual(gameReducer(s,{type:'CONFIRM'}),s);
});
test('bình chọn luôn 100%, đáp án bị loại luôn 0%',()=>{
  for(let answer=0;answer<4;answer++)for(let i=0;i<200;i++){
    const hidden=i%2?fiftyFifty(answer):[];
    const votes=audienceVotes(answer,hidden);assert.equal(votes.reduce((a,b)=>a+b),100);
    hidden.forEach(index=>assert.equal(votes[index],0));votes.forEach(v=>assert.ok(Number.isInteger(v)&&v>=0&&v<=100));
  }
});
test('chốt khóa lựa chọn, trợ giúp, tạm dừng; công bố đúng một lần',()=>{
  const s=reduce(start(),{type:'SELECT',index:questions[0].correct},{type:'CONFIRM'});
  assert.deepEqual(reduce(s,{type:'SELECT',index:0},{type:'LIFELINE',kind:'expert'},{type:'PAUSE'},{type:'CONFIRM'}),s);
  const revealed=gameReducer(s,{type:'REVEAL'});assert.deepEqual(gameReducer(revealed,{type:'REVEAL'}),revealed);
});
test('dừng sau mỗi câu đúng giữ toàn bộ điểm, chơi lại khôi phục trợ giúp và dữ liệu',()=>{
  let s=correct(start());s=gameReducer(s,{type:'STOP'});assert.equal(s.outcome,'stopped');assert.equal(finalScore(s),100);
  s=gameReducer(s,{type:'START',name:'Lượt mới'});assert.equal(s.index,0);assert.equal(s.remaining,30000);assert.deepEqual(s.used,[]);assert.deepEqual(s.hidden,[]);assert.equal(s.correctCount,0);assert.equal(s.name,'Lượt mới');assert.equal(questions.length,15);
});
test('hết giờ khi khán giả đang mở sẽ đóng popup và công bố đáp án',()=>{
  const s=reduce(start(),{type:'LIFELINE',kind:'audience',votes:[0,100,0,0]},{type:'TICK',elapsed:30000});assert.equal(s.modal,null);assert.equal(s.phase,'revealed');assert.equal(s.outcome,'timeout');
});
