import { motion } from 'framer-motion';
import { useEffect, useRef } from 'react';
import type { Question } from '@/data/questions';

export function QuestionCard({ question, index }: { question: Question; index: number }) {
  const heading=useRef<HTMLHeadingElement>(null);
  useEffect(()=>{heading.current?.focus({preventScroll:true});},[index]);
  return <motion.div className="question-area" initial={{opacity:0,y:15}} animate={{opacity:1,y:0}} transition={{duration:.45}}>
    <div className="question-kicker"><span>CÂU HỎI {String(index+1).padStart(2,'0')}</span><i/>{question.topic}</div>
    <div className="question-frame"><div><h1 ref={heading} tabIndex={-1}>{question.question}</h1></div></div>
  </motion.div>;
}
