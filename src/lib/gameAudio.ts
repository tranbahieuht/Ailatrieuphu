import type { GameState } from './game';
import type { Track } from './AudioManager';

export function revealTrack(state: Pick<GameState, 'outcome' | 'correctCount'>): Track {
  if (state.outcome === 'timeout') return 'timeout';
  if (state.outcome === 'wrong') return 'wrong';
  if (state.correctCount === 15) return 'victory';
  if (state.correctCount === 10) return 'correct-10';
  return state.correctCount === 5 ? 'milestone' : 'correct';
}
