'use client';
import { useCallback, useEffect, useReducer, useRef, useState } from 'react';
import { AnimatePresence, motion, MotionConfig } from 'framer-motion';
import { ArrowRight, BookOpen, Check, CircleHelp, Clock3, Expand, Flag, Keyboard, Minimize2, Pause, Phone, Play, ShieldCheck, Sparkles, Trophy, Volume2, VolumeX } from 'lucide-react';
import { questions, sources, type AnswerIndex } from '@/data/questions';
import { audienceVotes, currentScore, fiftyFifty, formatScore, gameReducer, initialState, isAnswering, LETTERS, safeScore, SCORES, type Lifeline } from '@/lib/game';
import { AudioManager } from '@/lib/AudioManager';
import { revealTrack } from '@/lib/gameAudio';
import { Emblem } from './Emblem';
import { Modal } from './Modal';
import { WelcomeScreen } from './WelcomeScreen';
import { QuestionCard } from './QuestionCard';
import { AnswerButton } from './AnswerButton';
import { ScoreLadder } from './ScoreLadder';
import { LifelinePanel } from './LifelinePanel';
import { ResultScreen } from './ResultScreen';

export function GameStage() {
  const [state,dispatch]=useReducer(gameReducer,initialState);
  const [name,setName]=useState('');
  const [rules,setRules]=useState(false);
  const [muted,setMuted]=useState(false);
  const [volume,setVolume]=useState(.55);
  const [fullscreen,setFullscreen]=useState(false);
  const [expertSeconds,setExpertSeconds]=useState(20);
  const [notice,setNotice]=useState('');
  const audio=useRef<AudioManager|null>(null);
  const seconds=Math.ceil(state.remaining/1000);
  const q=questions[state.index];
  const playing=state.phase!=='welcome'&&state.phase!=='finished';
  const screen=state.phase==='welcome'?'welcome':state.phase==='finished'?'finished':'game';
  const clockRunning=isAnswering(state)&&!state.paused&&state.modal!=='expert';
  const milestone=state.phase==='revealed'&&state.outcome==='correct'&&state.correctCount%5===0;

  useEffect(()=>{window.scrollTo({top:0,behavior:'instant'});},[screen,state.index]);

  useEffect(()=>{
    const manager=new AudioManager();
    manager.onUnavailable=()=>setNotice('Âm thanh chưa sẵn sàng. Bạn vẫn có thể tiếp tục chơi.');
    audio.current=manager;
    try { const saved=JSON.parse(localStorage.getItem('trieu-phu-preferences')||'null'); if(saved){setMuted(Boolean(saved.muted));setVolume(typeof saved.volume==='number'?Math.min(1,Math.max(0,saved.volume)):.55);} }catch{}
    return ()=>{manager.dispose();audio.current=null;};
  },[]);
  useEffect(()=>{
    audio.current?.setSettings(muted,volume);
    try{localStorage.setItem('trieu-phu-preferences',JSON.stringify({muted,volume}));}catch{}
  },[muted,volume]);
  useEffect(()=>{
    if(!notice)return;
    const timer=setTimeout(()=>setNotice(''),6000);return()=>clearTimeout(timer);
  },[notice]);
  useEffect(()=>{
    const update=()=>setFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener('fullscreenchange',update);return()=>document.removeEventListener('fullscreenchange',update);
  },[]);
  const toggleFullscreen=useCallback(async()=>{
    try { if(document.fullscreenElement)await document.exitFullscreen();else if(document.documentElement.requestFullscreen)await document.documentElement.requestFullscreen();else setNotice('Trình duyệt này chưa hỗ trợ toàn màn hình.'); }
    catch {setNotice('Không thể mở toàn màn hình. Hãy dùng phím F11 trên máy tính.');}
  },[]);
  const start=useCallback(()=>{audio.current?.unlock();audio.current?.stopAll();dispatch({type:'START',name});},[name]);
  const goHome=()=>{audio.current?.stopAll();dispatch({type:'HOME'});};

  useEffect(()=>{
    if(!state.entering)return;
    let active=true;
    const ready=()=>{if(active)dispatch({type:'READY'});};
    void audio.current?.playMusic('intro',false,ready);
    // Escape hatch if a browser never reports a media completion/error event.
    const timer=setTimeout(ready,35000);
    return()=>{active=false;clearTimeout(timer);};
  },[state.entering]);
  useEffect(()=>{
    if(!clockRunning)return;
    let previous=performance.now();
    const tick=()=>{const now=performance.now();dispatch({type:'TICK',elapsed:now-previous});previous=now;};
    const timer=setInterval(tick,100);
    document.addEventListener('visibilitychange',tick);
    return()=>{clearInterval(timer);document.removeEventListener('visibilitychange',tick);};
  },[clockRunning,state.index]);
  useEffect(()=>{
    if(state.phase!=='suspense')return;
    const timer=setTimeout(()=>dispatch({type:'REVEAL'}),2800);return()=>clearTimeout(timer);
  },[state.phase]);
  useEffect(()=>{
    if(state.modal!=='expert')return;
    setExpertSeconds(20);
    const deadline=performance.now()+20000;
    const timer=setInterval(()=>{const left=Math.max(0,Math.ceil((deadline-performance.now())/1000));setExpertSeconds(left);if(left===0)dispatch({type:'CLOSE_MODAL'});},100);
    return()=>clearInterval(timer);
  },[state.modal]);

  // Audio transitions run only on phase/question changes, never on a clock tick.
  useEffect(()=>{
    const manager=audio.current;if(!manager)return;
    if(state.entering)return;
    if(state.phase==='question'){
      manager.stopAll();
      void manager.playMusic(state.index<5?'question-easy':state.index<10?'question-medium':'question-hard');
    }
    if(state.phase==='suspense'){manager.stopAll();void manager.playMusic('final-answer',false);}
    if(state.phase==='revealed'){
      manager.stopMusic();
      void manager.playEffect(revealTrack(state));
    }
    if(state.phase==='finished'){
      manager.stopAll();
      void manager.playMusic('ending',false);
    }
    if(state.phase==='welcome')manager.stopAll();
  },[state.phase,state.index,state.entering,state.outcome,state.correctCount]);
  useEffect(()=>{audio.current?.suspend(state.paused||state.modal==='expert');},[state.paused,state.modal]);
  useEffect(()=>{if(seconds>0&&seconds<=10&&isAnswering(state)&&!state.paused&&!state.modal)void audio.current?.playEffect('warning');},[seconds,state.paused,state.modal,state.phase,state.entering]);

  const useLifeline=useCallback((kind:Lifeline)=>{
    if(!isAnswering(state)||state.paused||state.modal||state.used.includes(kind))return;
    void audio.current?.playEffect('lifeline');
    dispatch({type:'LIFELINE',kind,hidden:kind==='fifty'?fiftyFifty(q.correct):undefined,votes:kind==='audience'?audienceVotes(q.correct,state.hidden):undefined});
  },[state,q.correct]);

  useEffect(()=>{
    const handler=(e:KeyboardEvent)=>{
      if(e.ctrlKey||e.metaKey||e.altKey||e.repeat)return;
      if((e.target as HTMLElement)?.closest('input,textarea,select,[contenteditable="true"]'))return;
      if(rules||state.modal)return;
      const key=e.key.toLowerCase();
      if(key==='f'){e.preventDefault();void toggleFullscreen();return;}
      if(key==='m'){e.preventDefault();audio.current?.unlock();setMuted(v=>!v);return;}
      if(key===' '&&isAnswering(state)){e.preventDefault();dispatch({type:'PAUSE'});return;}
      const index=LETTERS.findIndex(letter=>letter.toLowerCase()===key);
      if(index>=0&&isAnswering(state)){e.preventDefault();dispatch({type:'SELECT',index:index as AnswerIndex});return;}
      if(['1','2','3'].includes(key)&&isAnswering(state)){e.preventDefault();useLifeline((['fifty','audience','expert'] as const)[Number(key)-1]);return;}
      // Preserve normal Enter activation on focused controls.
      if(key!=='enter')return;
      const focusedControl=(e.target as HTMLElement)?.closest('button,a');
      if(focusedControl&&!focusedControl.classList.contains('answer-button'))return;
      e.preventDefault();
      if(state.phase==='welcome')start();
      else if(state.phase==='selected')dispatch({type:'CONFIRM'});
      else if(state.phase==='revealed')dispatch({type:state.outcome==='correct'?'NEXT':'RESULT'});
      else if(state.phase==='finished')start();
    };
    window.addEventListener('keydown',handler);return()=>window.removeEventListener('keydown',handler);
  },[state,rules,start,toggleFullscreen,useLifeline]);

  return <MotionConfig reducedMotion="user"><div className={`show-app game-phase-${state.phase} ${state.phase==='suspense'?'stage-suspense':''} ${milestone?'stage-milestone':''}`}>
    <div className="stage-background" aria-hidden="true"><div className="light-beam beam-left"/><div className="light-beam beam-right"/><div className="background-grid"/><div className="background-ring ring-a"/><div className="background-ring ring-b"/><div className="stage-grain"/></div>
    <header className="show-header">
      <a className="brand" href="#" onClick={e=>{e.preventDefault();if(state.phase==='welcome'||state.phase==='finished')goHome();}} aria-label="Ai là triệu phú"><span className="brand-symbol">✦</span><span>AI LÀ TRIỆU PHÚ<small>PHIÊN BẢN TRIẾT HỌC</small></span></a>
      <div className="header-center">{playing?<><span className="on-air-dot"/> ĐANG TRÊN GHẾ NÓNG</>:<><span className="on-air-dot"/> TRẢI NGHIỆM GAMESHOW TƯƠNG TÁC</>}</div>
      <div className="header-controls">
        <div className="audio-control"><button className="icon-button" aria-label={muted?'Bật âm thanh':'Tắt âm thanh'} title="Âm thanh (M)" onClick={()=>{audio.current?.unlock();setMuted(v=>!v);}}>{muted?<VolumeX size={19}/>:<Volume2 size={19}/>}</button><input aria-label="Âm lượng" title="Âm lượng" type="range" min="0" max="1" step=".05" value={volume} onChange={e=>{audio.current?.unlock();setVolume(Number(e.target.value));}}/></div>
        <span className="control-divider"/><button className="icon-button fullscreen-button" onClick={toggleFullscreen} aria-label={fullscreen?'Thoát toàn màn hình':'Toàn màn hình'} title="Toàn màn hình (F)">{fullscreen?<Minimize2 size={18}/>:<Expand size={18}/>}<span>Toàn màn hình</span></button>
      </div>
    </header>
    <AnimatePresence mode="wait">
      {state.phase==='welcome'?<WelcomeScreen key="welcome" name={name} setName={setName} onStart={start} onRules={()=>setRules(true)}/>:
      state.phase==='finished'?<ResultScreen key="result" state={state} onReplay={start} onHome={goHome}/>:
      <motion.main className="game-layout" key="game" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}>
        <section className="game-main">
          <div className="game-status"><div><span className="mini-label">NGƯỜI CHƠI</span><strong>{state.name}</strong></div><div className="current-score"><span className="mini-label">ĐIỂM HIỆN TẠI</span><strong>{formatScore(currentScore(state.correctCount))} <small>điểm</small></strong></div></div>
          <div className="game-centerpiece"><Emblem compact/><div className="stage-ribbon">CHINH PHỤC TRIẾT HỌC MÁC – LÊNIN</div></div>
          <div className="mobile-lifelines"><LifelinePanel used={state.used} disabled={!isAnswering(state)||state.paused||Boolean(state.modal)} onUse={useLifeline}/></div>
          <div className="question-meta"><span><i/> {state.index<5?'KHỞI ĐỘNG':state.index<10?'VƯỢT THỬ THÁCH':'CHINH PHỤC ĐỈNH CAO'} <b>{String(state.index+1).padStart(2,'0')} / 15</b></span><span className="question-value"><Trophy size={15}/>{formatScore(SCORES[state.index])} điểm</span></div>
          <AnimatePresence mode="wait"><motion.div key={state.index} initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0,x:-20}} transition={{duration:.25}}>
            <QuestionCard question={q} index={state.index}/>
            <div className="answers-grid">{q.answers.map((answer,i)=><AnswerButton key={i} index={i as AnswerIndex} text={answer} selected={state.selected===i} correct={state.phase==='revealed'&&q.correct===i} wrong={state.phase==='revealed'&&state.selected===i&&q.correct!==i} hidden={state.hidden.includes(i)} disabled={!isAnswering(state)||state.paused||Boolean(state.modal)} suspense={state.phase==='suspense'} onSelect={()=>dispatch({type:'SELECT',index:i as AnswerIndex})}/>)}</div>
          </motion.div></AnimatePresence>
          <div className="game-actions">
            <div className={`clock ${seconds<=10?'clock-urgent':''} ${state.paused?'clock-paused':''}`} role="timer" aria-label={`Còn ${seconds} giây`}><svg viewBox="0 0 56 56"><circle cx="28" cy="28" r="24"/><circle className="clock-progress" cx="28" cy="28" r="24" strokeDasharray={151} strokeDashoffset={151*(1-state.remaining/30000)}/></svg><strong>{String(seconds).padStart(2,'0')}</strong></div>
            {state.phase==='revealed'?<div className="reveal-buttons">{state.outcome==='correct'&&state.correctCount<15&&<button className="secondary-button stop-button" onClick={()=>dispatch({type:'STOP'})}><Flag size={16}/> Dừng & giữ điểm</button>}<button className="primary-button confirm-button" onClick={()=>dispatch({type:state.outcome==='correct'?'NEXT':'RESULT'})}>{state.outcome==='correct'?(state.correctCount===15?'NHẬN VINH QUANG':'CÂU TIẾP THEO'):'XEM KẾT QUẢ'}<ArrowRight size={18}/></button></div>:
            <><div className="game-action-message">{state.paused?<><Pause size={15}/> Đồng hồ đã tạm dừng</>:state.phase==='suspense'?<><span className="suspense-dots"/> Khoảnh khắc quyết định…</>:state.phase==='selected'?<>Bạn chọn <strong>{LETTERS[state.selected!]}</strong>. Đây là đáp án cuối cùng?</>:<>Chọn đáp án của bạn</>}</div><button className="primary-button confirm-button" disabled={state.phase!=='selected'||state.paused||Boolean(state.modal)||state.entering} onClick={()=>dispatch({type:'CONFIRM'})}>{state.phase==='suspense'?'ĐANG CÔNG BỐ…':'CHỐT ĐÁP ÁN'}<Check size={18}/></button></>}
          </div>
          <AnimatePresence>{state.phase==='revealed'&&<motion.div className={`explanation ${state.outcome==='correct'?'explanation-correct':'explanation-wrong'}`} initial={{opacity:0,height:0}} animate={{opacity:1,height:'auto'}}>
            <div className="explanation-heading">{state.outcome==='correct'?<Check size={18}/>:<Clock3 size={18}/>}<strong>{milestone?(state.correctCount===15?'BẠN ĐÃ CHINH PHỤC 15 CÂU HỎI!':`VƯỢT MỐC AN TOÀN · ${formatScore(safeScore(state.correctCount))} ĐIỂM`):state.outcome==='correct'?'CHÍNH XÁC!':state.outcome==='timeout'?'HẾT GIỜ! ĐÁP ÁN ĐÚNG LÀ '+LETTERS[q.correct]:'ĐÁP ÁN ĐÚNG LÀ '+LETTERS[q.correct]}</strong></div>
            <p>{q.explanation}</p><a href={sources[q.source].url} target="_blank" rel="noreferrer">Nguồn kiến thức <ArrowRight size={12}/></a>
          </motion.div>}</AnimatePresence>
          <div className="game-bottom"><span><ShieldCheck size={14}/> Mốc đã giữ: <b>{formatScore(safeScore(state.correctCount))} điểm</b></span><button className="text-button" onClick={()=>dispatch({type:'PAUSE'})} disabled={!isAnswering(state)||Boolean(state.modal)}>{state.paused?<Play size={14}/>:<Pause size={14}/>} {state.paused?'Tiếp tục':'Tạm dừng'}</button></div>
        </section>
        <aside className="game-sidebar"><div className="sidebar-lifelines"><LifelinePanel used={state.used} disabled={!isAnswering(state)||state.paused||Boolean(state.modal)} onUse={useLifeline}/></div><ScoreLadder index={state.index} correctCount={state.correctCount}/></aside>
      </motion.main>}
    </AnimatePresence>
    <footer className="show-footer"><span>TRI THỨC LÀ HÀNH TRÌNH. BẢN LĨNH LÀ LỰA CHỌN.</span><div><Keyboard size={14}/><span>{playing?'A–D chọn · Enter chốt / tiếp · 1–3 trợ giúp · Space tạm dừng':'Enter bắt đầu'}<i/>F toàn màn hình</span></div><button onClick={()=>setRules(true)} className="text-button" disabled={playing}><CircleHelp size={14}/> Luật chơi</button></footer>
    <AnimatePresence>
      {rules&&<Modal title="Hành trình đến đỉnh cao" onClose={()=>setRules(false)}>
        <p className="modal-intro">15 câu hỏi. 3 quyền trợ giúp. Một sân khấu để khẳng định bản lĩnh.</p>
        <div className="rules-grid"><div><Clock3/><strong>30 giây / câu</strong><p>Chọn A, B, C hoặc D, sau đó chốt đáp án. Đọc giải thích rồi chủ động sang câu tiếp.</p></div><div><ShieldCheck/><strong>3 mốc an toàn</strong><p>Câu 5: 1.000 · Câu 10: 5.000 · Câu 15: 30.000 điểm. Sai hoặc hết giờ nhận mốc đã vượt qua.</p></div><div><Sparkles/><strong>Đồng hành cùng bạn</strong><p>50:50 loại 2 đáp án sai. Khán giả bình chọn mô phỏng. Chuyên gia tư vấn 20 giây, tạm dừng đồng hồ.</p></div><div><Flag/><strong>Giữ thành quả</strong><p>Sau mỗi đáp án đúng, bạn có thể dừng để giữ toàn bộ điểm hiện tại. Mỗi quyền trợ giúp dùng 1 lần.</p></div></div>
        <div className="rules-keyboard"><Keyboard size={18}/><p><b>A / B / C / D</b> chọn · <b>Enter</b> chốt / tiếp<br/><b>1 / 2 / 3</b> trợ giúp · <b>Space</b> tạm dừng · <b>M</b> âm thanh · <b>F</b> toàn màn hình. Dùng Tab để chọn mọi nút.</p></div>
        <details className="source-details"><summary><BookOpen size={15}/> Tài liệu & nội dung câu hỏi</summary><p>Bộ 15 câu hỏi được biên soạn mới theo chủ đề học thuyết hình thái kinh tế – xã hội. Bình chọn và tư vấn đều là mô phỏng phục vụ học tập.</p>{Object.entries(sources).map(([key,source])=><a key={key} href={source.url} target="_blank" rel="noreferrer">{source.title}<ArrowRight size={13}/></a>)}</details>
        <button className="primary-button modal-cta" onClick={()=>setRules(false)}>ĐÃ HIỂU, SẴN SÀNG CHINH PHỤC <ArrowRight size={17}/></button>
      </Modal>}
      {state.modal==='audience'&&<Modal title="Hỏi ý kiến khán giả" onClose={()=>dispatch({type:'CLOSE_MODAL'})}><p className="modal-intro">Khán phòng đã đưa ra lựa chọn. Quyết định cuối cùng vẫn là của bạn.</p><div className="audience-chart">{state.votes.map((vote,i)=><div key={i}><strong>{vote}%</strong><div className="bar-track"><motion.div initial={{height:0}} animate={{height:`${vote}%`}} transition={{duration:1,delay:i*.12}}/></div><span>{LETTERS[i]}</span></div>)}</div><p className="simulation-note">Bình chọn mô phỏng, không bảo đảm đáp án chính xác.<br/>Đồng hồ câu hỏi vẫn đang chạy: <b>{seconds} giây</b>.</p><button className="primary-button modal-cta" onClick={()=>dispatch({type:'CLOSE_MODAL'})}>TRỞ LẠI CÂU HỎI <ArrowRight size={17}/></button></Modal>}
      {state.modal==='expert'&&<Modal title="Kết nối chuyên gia" onClose={()=>dispatch({type:'CLOSE_MODAL'})}><div className="expert-avatar"><Phone size={34}/><span/></div><p className="expert-status">ĐANG TƯ VẤN · CUỘC GỌI MÔ PHỎNG</p><blockquote>“{q.hint}”</blockquote><div className="expert-timer"><Clock3 size={18}/><strong>{expertSeconds}s</strong><span>Thời gian tư vấn còn lại</span></div><p className="simulation-note">Đồng hồ câu hỏi đang tạm dừng ở {seconds} giây.<br/>Tự tiếp tục khi kết thúc tư vấn hoặc đóng cửa sổ.</p><button className="primary-button modal-cta" onClick={()=>dispatch({type:'CLOSE_MODAL'})}>KẾT THÚC TƯ VẤN <ArrowRight size={17}/></button></Modal>}
      {state.entering&&<motion.div className="entrance-curtain" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0,scale:1.4,filter:'blur(15px)'}} transition={{duration:.55}}><Emblem/><p>CHÀO MỪNG ĐẾN VỚI GHẾ NÓNG</p><strong>{state.name}</strong><button className="secondary-button" onClick={()=>dispatch({type:'READY'})}>VÀO CHƠI NGAY <ArrowRight size={18}/></button></motion.div>}
      {notice&&<motion.div role="status" className="toast" initial={{opacity:0,y:15}} animate={{opacity:1,y:0}} exit={{opacity:0}}>{notice}</motion.div>}
    </AnimatePresence>
    <div className="sr-only" aria-live="polite">{state.phase==='revealed'?`${state.outcome==='correct'?'Chính xác':'Kết thúc lượt chơi'}. Đáp án ${LETTERS[q.correct]}. ${q.explanation}`:state.phase==='question'?`Câu ${state.index+1}. ${q.question}`:''}</div>
  </div></MotionConfig>;
}
