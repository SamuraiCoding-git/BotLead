import { TEST_VERSION } from "../data/testData";
import type { PersistedState } from "../types/app";
import type { AnswerMap } from "../types/test";

/**
 * All localStorage keys the app uses, kept in one place per the spec.
 * Each field of PersistedState maps to one of these keys so the shape on
 * disk is easy to read manually if ever needed.
 */
const KEYS = {
  version: "soul_test_version",
  startedAt: "soul_test_started_at",
  completedAt: "soul_test_completed_at",
  answers: "soul_test_answers",
  offerStartedAt: "soul_test_offer_started_at",
  offerDeadline: "soul_test_offer_deadline",
  scores: "soul_test_scores",
  primary: "soul_test_primary",
  secondary: "soul_test_secondary"
} as const;

/**
 * localStorage can throw (private browsing, quota, disabled storage).
 * Every call is wrapped so a storage failure never crashes the app —
 * it just behaves as if nothing was ever saved.
 */
function safeGet(key: string): string | null {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function safeSet(key: string, value: string): void {
  try {
    window.localStorage.setItem(key, value);
  } catch {
    // Frontend-only MVP: if storage is unavailable, the session simply
    // won't persist across reloads. Nothing more we can safely do here.
  }
}

function safeRemove(key: string): void {
  try {
    window.localStorage.removeItem(key);
  } catch {
    // no-op
  }
}

function parseNumberOrNull(raw: string | null): number | null {
  if (raw === null) return null;
  const n = Number(raw);
  return Number.isFinite(n) ? n : null;
}

function parseAnswers(raw: string | null): Record<number, string> {
  if (!raw) return {};
  try {
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
      return parsed as Record<number, string>;
    }
    return {};
  } catch {
    return {};
  }
}

export function clearAll(): void {
  Object.values(KEYS).forEach(safeRemove);
}

/**
 * Reads persisted state, validating shape and version. Anything that looks
 * corrupted or from an incompatible older version is treated as absent
 * rather than crashing the app.
 */
export function loadState(): PersistedState {
  const storedVersion = safeGet(KEYS.version);

  if (storedVersion && storedVersion !== TEST_VERSION) {
    // Incompatible data shape from a previous test version — safest default
    // is a clean reset rather than trying to guess a migration.
    clearAll();
  }

  return {
    version: TEST_VERSION,
    startedAt: parseNumberOrNull(safeGet(KEYS.startedAt)),
    completedAt: parseNumberOrNull(safeGet(KEYS.completedAt)),
    answers: parseAnswers(safeGet(KEYS.answers)),
    offerStartedAt: parseNumberOrNull(safeGet(KEYS.offerStartedAt)),
    offerDeadline: parseNumberOrNull(safeGet(KEYS.offerDeadline))
  };
}

export function saveVersion(): void {
  safeSet(KEYS.version, TEST_VERSION);
}

export function saveStartedAt(timestamp: number): void {
  safeSet(KEYS.startedAt, String(timestamp));
}

export function saveAnswers(answers: AnswerMap): void {
  safeSet(KEYS.answers, JSON.stringify(answers));
}

export function saveCompletedAt(timestamp: number): void {
  safeSet(KEYS.completedAt, String(timestamp));
}

export function saveScoringSnapshot(scores: unknown, primary: string, secondary: string | null): void {
  safeSet(KEYS.scores, JSON.stringify(scores));
  safeSet(KEYS.primary, primary);
  if (secondary) {
    safeSet(KEYS.secondary, secondary);
  } else {
    safeRemove(KEYS.secondary);
  }
}

export function saveOfferWindow(offerStartedAt: number, offerDeadline: number): void {
  safeSet(KEYS.offerStartedAt, String(offerStartedAt));
  safeSet(KEYS.offerDeadline, String(offerDeadline));
}

export function resetForRestart(keepOfferWindow: boolean): void {
  safeRemove(KEYS.startedAt);
  safeRemove(KEYS.completedAt);
  safeRemove(KEYS.answers);
  safeRemove(KEYS.scores);
  safeRemove(KEYS.primary);
  safeRemove(KEYS.secondary);
  if (!keepOfferWindow) {
    safeRemove(KEYS.offerStartedAt);
    safeRemove(KEYS.offerDeadline);
  }
}
