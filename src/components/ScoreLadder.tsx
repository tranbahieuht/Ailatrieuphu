import { Check, Flag, Star, Trophy } from 'lucide-react';
import { SCORES, formatScore } from '@/lib/game';

export function ScoreLadder({ index, correctCount }: { index:number; correctCount:number }) {
  return <section className="score-ladder" aria-label="Thang điểm">
    <div className="panel-heading"><Trophy size={17}/><h2>HÀNH TRÌNH TRI THỨC</h2></div>
    <ol reversed>{SCORES.map((score,i)=>({score,i})).reverse().map(({score,i})=> <li key={i} className={`${i===index?'ladder-current':''} ${i<correctCount?'ladder-passed':''} ${(i+1)%5===0?'ladder-milestone':''}`} aria-current={i===index?'step':undefined}>
      <span className="ladder-number">{String(i+1).padStart(2,'0')}</span>
      <span className="ladder-symbol">{i<correctCount ? <Check size={13}/> : (i+1)%5===0 ? <Star size={13}/> : <i/>}</span>
      <strong>{formatScore(score)}</strong>{i===index&&<Flag size={12}/>}
    </li>)}</ol>
    <div className="ladder-legend"><Star size={12}/> Mốc an toàn · Giữ điểm khi trả lời sai</div>
  </section>;
}
