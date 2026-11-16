import { motion } from 'framer-motion';
import { useEffect, useRef } from 'react';
import { ArrowRight, Home, RotateCcw, Trophy, Flag, BookOpen } from 'lucide-react';
import { questions, sources } from '@/data/questions';
import { finalScore, formatScore, LETTERS, type GameState } from '@/lib/game';

export function ResultScreen({ state, onReplay, onHome }: {state:GameState;onReplay:()=>void;onHome:()=>void}) {
  const heading=useRef<HTMLHeadingElement>(null);
  useEffect(()=>{heading.current?.focus({preventScroll:true});},[]);
  const victory = state.outcome==='victory', stopped=state.outcome==='stopped';
  const q=questions[state.index];
  return <motion.main className={`result-screen ${victory?'victory':''}`} initial={{opacity:0,y:24}} animate={{opacity:1,y:0}}>
    {victory&&<div className="confetti" aria-hidden="true">{Array.from({length:48},(_,i)=><i key={i} style={{left:`${(i*37)%100}%`,animationDelay:`${(i%12)*.22}s`,background:i%2?'#e7c575':'#76a8ff',transform:`rotate(${i*17}deg)`}}/>)}</div>}
    <div className="result-trophy">{stopped?<Flag size={58} strokeWidth={1.3}/>:<Trophy size={76} strokeWidth={1.1}/>}</div>
    <span className="eyebrow">{victory?'BẢN LĨNH ĐƯỢC KHẲNG ĐỊNH':stopped?'MỘT QUYẾT ĐỊNH BẢN LĨNH':'HÀNH TRÌNH KHÉP LẠI'}</span>
    <h1 ref={heading} tabIndex={-1}>{victory?'TRIỆU PHÚ TRIẾT HỌC':stopped?'GIỮ TRỌN THÀNH QUẢ':state.outcome==='timeout'?'THỜI GIAN ĐÃ HẾT':'HẸN BẠN Ở ĐỈNH CAO'}</h1>
    <p className="result-name">{state.name}</p>
    <div className="result-score">{formatScore(finalScore(state))}<span>ĐIỂM {stopped?'ĐÃ GIỮ':'ĐẠT ĐƯỢC'}</span></div>
    <p className="result-progress">Đã chinh phục <strong>{state.correctCount} / 15</strong> câu hỏi{!victory&&!stopped?' · Điểm được tính tại mốc an toàn đã vượt qua.':''}</p>
    {!victory&&!stopped&&<div className="result-review"><div className="eyebrow"><BookOpen size={15}/> CÙNG NHÌN LẠI · CÂU {state.index+1}</div><h2>{q.question}</h2><p className="correct-text">{LETTERS[q.correct]}. {q.answers[q.correct]}</p><p>{q.explanation}</p><a href={sources[q.source].url} target="_blank" rel="noreferrer">Xem tài liệu tham khảo <ArrowRight size={13}/></a></div>}
    <div className="result-actions"><button className="primary-button" onClick={onReplay}><RotateCcw size={18}/> CHINH PHỤC LẦN NỮA</button><button className="secondary-button" onClick={onHome}><Home size={17}/> Về trang chủ</button></div>
  </motion.main>;
}
