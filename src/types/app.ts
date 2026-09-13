export type AppState =
  | "onboarding"
  | "testing"
  | "calculating"
  | "result"
  | "offer"
  | "expired";

/**
 * Everything the app persists to localStorage. Kept as one shape so
 * storage.ts can version, validate and migrate it as a single unit.
 */
export type PersistedState = {
  version: string;
  startedAt: number | null;
  completedAt: number | null;
  answers: Record<number, string>;
  offerStartedAt: number | null;
  offerDeadline: number | null;
};
