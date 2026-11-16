import { motion } from 'framer-motion';
import { Check, X } from 'lucide-react';
import { LETTERS } from '@/lib/game';
import type { AnswerIndex } from '@/data/questions';

export function AnswerButton({ index, text, selected, correct, wrong, hidden, disabled, suspense, onSelect }: {
  index: AnswerIndex; text: string; selected: boolean; correct: boolean; wrong: boolean;
  hidden: boolean; disabled: boolean; suspense: boolean; onSelect: () => void;
}) {
  return <motion.div className={`answer-wrap ${hidden?'eliminated':''}`} initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} transition={{delay:.2+index*.13,duration:.4}}>
    <button className={`answer-button ${selected?'is-selected':''} ${correct?'is-correct':''} ${wrong?'is-wrong':''} ${suspense&&selected?'is-suspense':''}`} disabled={disabled||hidden} onClick={onSelect} aria-pressed={selected} aria-label={`${LETTERS[index]}: ${hidden ? 'Đã loại' : text}`}>
      <span className="answer-letter">{LETTERS[index]}<span>:</span></span><span className="answer-text">{hidden ? '—' : text}</span>
      {correct ? <Check className="answer-mark" size={20}/> : wrong ? <X className="answer-mark" size={20}/> : <span className="answer-diamond"/>}
    </button>
  </motion.div>;
}
