'use client';
import { motion } from 'framer-motion';
import { ArrowRight, BookOpen, ChevronRight, ShieldCheck, Sparkles, Trophy } from 'lucide-react';
import { Emblem } from './Emblem';

export function WelcomeScreen({ name, setName, onStart, onRules }: { name: string; setName: (name:string)=>void; onStart:()=>void; onRules:()=>void }) {
  return <motion.main className="welcome" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0,scale:1.04,filter:'blur(12px)'}} transition={{duration:.65}}>
    <div className="welcome-content">
      <motion.div initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{delay:.1}} className="eyebrow"><span className="gold-line"/> SÂN KHẤU CỦA TRI THỨC</motion.div>
      <motion.h1 initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:.2,duration:.7}}>CHINH PHỤC<br/>TRIẾT HỌC<br/><span>MÁC – LÊNIN</span></motion.h1>
      <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:.35,duration:.7}}>
        <p className="welcome-topic">Học thuyết hình thái kinh tế – xã hội</p>
        <p className="welcome-description">Mỗi câu trả lời là một bước tiến.<br/>Bạn đã sẵn sàng để trở thành triệu phú tri thức?</p>
        <form className="entry-form" onSubmit={e => {e.preventDefault(); onStart();}}>
          <label htmlFor="player-name">TÊN NGƯỜI CHƠI <span>· không bắt buộc</span></label>
          <input id="player-name" autoComplete="off" maxLength={40} placeholder="Hôm nay, ai sẽ lên ghế nóng?" value={name} onChange={e=>setName(e.target.value)}/>
          <button className="primary-button start-button" type="submit"><span>BƯỚC LÊN GHẾ NÓNG</span><ArrowRight size={21}/></button>
        </form>
        <button className="text-button rules-button" onClick={onRules}><BookOpen size={16}/> Luật chơi <ChevronRight size={14}/></button>
      </motion.div>
    </div>
    <div className="welcome-stage" aria-hidden="true">
      <div className="stage-coordinate coordinate-top">THE KNOWLEDGE CHALLENGE <span>01 / 15</span></div>
      <div className="hero-halo"/><div className="hero-axis axis-h"/><div className="hero-axis axis-v"/>
      <motion.div className="hero-emblem" initial={{opacity:0,scale:.8,rotate:-8}} animate={{opacity:1,scale:1,rotate:0}} transition={{duration:1.5,delay:.2}}><Emblem/></motion.div>
      <div className="platform"><div/><div/><div/></div>
      <div className="stage-caption"><span/><Sparkles size={14}/><span>ÁNH ĐÈN ĐÃ BẬT. SÂN KHẤU LÀ CỦA BẠN.</span><span/></div>
      <div className="floating-ticket"><Trophy size={25}/><div><small>ĐỈNH CAO TRI THỨC</small><strong>30.000 <span>điểm</span></strong></div></div>
    </div>
    <div className="welcome-stats">
      <div><strong>15</strong><span>CÂU HỎI<span>Thử thách bản lĩnh</span></span></div>
      <div><strong>03</strong><span>QUYỀN TRỢ GIÚP<span>Luôn có sự đồng hành</span></span></div>
      <div><strong>01</strong><span>VINH QUANG<span>Dành cho người chinh phục</span></span></div>
      <p><ShieldCheck size={21}/><span>3 mốc an toàn<strong>Câu 5 · Câu 10 · Câu 15</strong></span></p>
    </div>
  </motion.main>;
}
