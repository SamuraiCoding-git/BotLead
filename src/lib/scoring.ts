import type { AnswerMap, ScoreKey, Scores, ScoringResult } from "../types/test";

const KEYS: ScoreKey[] = ["A", "B", "C", "D", "E"];

/**
 * Pure function: always recomputes scores from the full answer map.
 * This is the deliberate fix for double counting — nothing ever increments
 * or decrements a running total. Changing an old answer just changes what
 * this function sums next time it's called.
 */
export function calculateScores(answers: AnswerMap): Scores {
  const scores: Scores = { A: 0, B: 0, C: 0, D: 0, E: 0 };
  for (const key of Object.values(answers)) {
    if (KEYS.includes(key)) {
      scores[key] += 1;
    }
  }
  return scores;
}

export function resolveScoring(answers: AnswerMap): ScoringResult {
  const scores = calculateScores(answers);
  const maxValue = Math.max(...KEYS.map((k) => scores[k]));
  const tiedKeys = KEYS.filter((k) => scores[k] === maxValue);

  const isTie = tiedKeys.length > 1;
  const primary = tiedKeys[0];

  // Secondary = highest scoring key among the rest (ties broken by fixed A-E order).
  const remaining = KEYS.filter((k) => k !== primary).sort((a, b) => scores[b] - scores[a]);
  const secondary = remaining.length > 0 && scores[remaining[0]] > 0 ? remaining[0] : null;

  return { scores, primary, secondary, isTie, tiedKeys };
}
