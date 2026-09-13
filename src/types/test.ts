// Five scenario keys, corresponding to Liz Bourbeau's five wounds concept,
// deliberately kept as abstract letters in the codebase — the product never
// exposes these letters to the user.
export type ScoreKey = "A" | "B" | "C" | "D" | "E";

export type TestOption = {
  key: ScoreKey;
  text: string;
};

export type TestQuestion = {
  id: number;
  question: string;
  options: TestOption[];
  /**
   * Marks a question that is only shown when the main scoring produces a tie
   * between two or more leading scenarios. Regular questions omit this field.
   */
  isTieBreaker?: boolean;
  /** For tie-breaker questions: which two scenarios this question disambiguates. */
  tieBreakerFor?: [ScoreKey, ScoreKey];
};

/** answers[questionId] = chosen option key. A plain object keeps re-answering idempotent. */
export type AnswerMap = Record<number, ScoreKey>;

export type Scores = Record<ScoreKey, number>;

export type ScoringResult = {
  scores: Scores;
  primary: ScoreKey;
  secondary: ScoreKey | null;
  isTie: boolean;
  tiedKeys: ScoreKey[];
};
