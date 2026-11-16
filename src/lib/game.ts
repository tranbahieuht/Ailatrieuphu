import { questions, type AnswerIndex } from '@/data/questions';

export const SCORES = [100, 200, 300, 500, 1000, 1500, 2000, 3000, 4000, 5000, 7000, 10000, 15000, 20000, 30000] as const;
export const LETTERS = ['A', 'B', 'C', 'D'] as const;
export const formatScore = (score: number) => score.toLocaleString('vi-VN');
export type Phase = 'welcome' | 'question' | 'selected' | 'suspense' | 'revealed' | 'finished';
export type Lifeline = 'fifty' | 'audience' | 'expert';
export type Outcome = 'correct' | 'wrong' | 'timeout' | 'stopped' | 'victory' | null;
export type GameState = {
  phase: Phase; index: number; correctCount: number; selected: AnswerIndex | null;
  remaining: number; paused: boolean; entering: boolean; outcome: Outcome;
  used: Lifeline[]; hidden: number[]; modal: 'audience' | 'expert' | null;
  votes: number[]; name: string;
};
export const initialState: GameState = {
  phase: 'welcome', index: 0, correctCount: 0, selected: null, remaining: 30000,
  paused: false, entering: false, outcome: null, used: [], hidden: [], modal: null, votes: [], name: '',
};
export type Action =
  | { type: 'START'; name: string } | { type: 'READY' } | { type: 'HOME' }
  | { type: 'SELECT'; index: AnswerIndex } | { type: 'CONFIRM' } | { type: 'REVEAL' }
  | { type: 'TICK'; elapsed: number } | { type: 'PAUSE' } | { type: 'NEXT' }
  | { type: 'RESULT' } | { type: 'STOP' } | { type: 'CLOSE_MODAL' }
  | { type: 'LIFELINE'; kind: Lifeline; hidden?: number[]; votes?: number[] };

export const currentScore = (count: number) => count > 0 ? SCORES[count - 1] : 0;
export const safeScore = (count: number) => count >= 15 ? 30000 : count >= 10 ? 5000 : count >= 5 ? 1000 : 0;
export function finalScore(state: GameState) {
  return state.outcome === 'stopped' || state.outcome === 'victory' ? currentScore(state.correctCount) : safeScore(state.correctCount);
}
export function isAnswering(state: GameState) {
  return (state.phase === 'question' || state.phase === 'selected') && !state.entering;
}
export function gameReducer(state: GameState, action: Action): GameState {
  switch (action.type) {
    case 'START': return { ...initialState, phase: 'question', entering: true, name: action.name.trim().slice(0, 40) || 'Người chinh phục' };
    case 'HOME': return { ...initialState };
    case 'READY': return { ...state, entering: false };
    case 'SELECT':
      return isAnswering(state) && !state.paused && !state.modal && !state.hidden.includes(action.index)
        ? { ...state, phase: 'selected', selected: action.index } : state;
    case 'CONFIRM': return state.phase === 'selected' && !state.paused && !state.modal && !state.entering
      ? { ...state, phase: 'suspense' } : state;
    case 'REVEAL': {
      if (state.phase !== 'suspense') return state;
      const correct = state.selected === questions[state.index].correct;
      return { ...state, phase: 'revealed', outcome: correct ? 'correct' : 'wrong', correctCount: state.correctCount + Number(correct), modal: null };
    }
    case 'TICK': {
      if (!isAnswering(state) || state.paused || state.modal === 'expert') return state;
      const remaining = Math.max(0, state.remaining - Math.max(0, action.elapsed));
      return remaining > 0 ? { ...state, remaining } : { ...state, remaining: 0, phase: 'revealed', outcome: 'timeout', modal: null };
    }
    case 'PAUSE': return isAnswering(state) && !state.modal ? { ...state, paused: !state.paused } : state;
    case 'NEXT':
      if (state.phase !== 'revealed' || state.outcome !== 'correct') return state;
      if (state.index === 14) return { ...state, phase: 'finished', outcome: 'victory' };
      return { ...state, phase: 'question', index: state.index + 1, remaining: 30000, selected: null, hidden: [], outcome: null, paused: false, votes: [] };
    case 'STOP': return state.phase === 'revealed' && state.outcome === 'correct'
      ? { ...state, phase: 'finished', outcome: state.correctCount === 15 ? 'victory' : 'stopped' } : state;
    case 'RESULT': return state.phase === 'revealed' ? { ...state, phase: 'finished', outcome: state.correctCount === 15 ? 'victory' : state.outcome } : state;
    case 'CLOSE_MODAL': return { ...state, modal: null };
    case 'LIFELINE': {
      if (!isAnswering(state) || state.paused || state.modal || state.used.includes(action.kind)) return state;
      return { ...state, used: [...state.used, action.kind],
        hidden: action.kind === 'fifty' ? action.hidden ?? [] : state.hidden,
        selected: action.kind === 'fifty' && action.hidden?.includes(state.selected ?? -1) ? null : state.selected,
        phase: action.kind === 'fifty' && action.hidden?.includes(state.selected ?? -1) ? 'question' : state.phase,
        modal: action.kind === 'fifty' ? null : action.kind,
        votes: action.votes ?? state.votes,
      };
    }
    default: return state;
  }
}

export function fiftyFifty(correct: number, random = Math.random): number[] {
  const wrong = [0, 1, 2, 3].filter(i => i !== correct);
  for (let i = wrong.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [wrong[i], wrong[j]] = [wrong[j], wrong[i]];
  }
  return wrong.slice(0, 2);
}
export function audienceVotes(correct: number, hidden: number[], random = Math.random): number[] {
  const weights = [0, 1, 2, 3].map(i => hidden.includes(i) ? 0 : i === correct ? 45 + random() * 25 : 4 + random() * 20);
  const sum = weights.reduce((a, b) => a + b, 0);
  const exact = weights.map(w => w / sum * 100);
  const rounded = exact.map(Math.floor);
  const order = exact.map((value, i) => ({ i, fraction: value - rounded[i] })).sort((a, b) => b.fraction - a.fraction);
  const rest = 100 - rounded.reduce((a, b) => a + b, 0);
  for (let i = 0; i < rest; i++) rounded[order[i].i]++;
  return rounded;
}
