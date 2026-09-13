import { useEffect, useMemo, useState } from "react";
import type { AppState } from "./types/app";
import type { AnswerMap, ScoreKey, TestQuestion } from "./types/test";
import { questions, questionByTiePair } from "./data/testData";
import { resolveScoring } from "./lib/scoring";
import * as storage from "./lib/storage";
import { OFFER_WINDOW_MS, RESTART_REFRESHES_OFFER_DEADLINE } from "./data/products";

import Onboarding from "./components/Onboarding/Onboarding";
import Question from "./components/Question/Question";
import Progress from "./components/Progress/Progress";
import Calculating from "./components/Calculating/Calculating";
import Result from "./components/Result/Result";
import Offer from "./components/Offer/Offer";

type OnboardingStatus = "new" | "in-progress" | "completed";

function findResumeIndex(activeQuestions: TestQuestion[], answers: AnswerMap): number {
  const firstUnanswered = activeQuestions.findIndex((q) => !(q.id in answers));
  return firstUnanswered === -1 ? activeQuestions.length - 1 : firstUnanswered;
}

export default function App() {
  const persisted = useMemo(() => storage.loadState(), []);

  const [appState, setAppState] = useState<AppState>(() => {
    if (persisted.completedAt) return "onboarding"; // returning-completed view, handled inside Onboarding
    if (persisted.startedAt && Object.keys(persisted.answers).length > 0) return "onboarding"; // returning-in-progress view
    return "onboarding";
  });

  const [activeQuestions, setActiveQuestions] = useState<TestQuestion[]>(questions);
  const [answers, setAnswers] = useState<AnswerMap>(persisted.answers as AnswerMap);
  const [currentIndex, setCurrentIndex] = useState<number>(() => findResumeIndex(questions, persisted.answers as AnswerMap));
  const [primary, setPrimary] = useState<ScoreKey | null>(null);
  const [secondary, setSecondary] = useState<ScoreKey | null>(null);
  const [offerDeadline, setOfferDeadline] = useState<number | null>(persisted.offerDeadline);

  useEffect(() => {
    storage.saveVersion();
  }, []);

  const onboardingStatus: OnboardingStatus = persisted.completedAt
    ? "completed"
    : persisted.startedAt && Object.keys(persisted.answers).length > 0
      ? "in-progress"
      : "new";

  function beginNewTest() {
    const now = Date.now();
    storage.saveStartedAt(now);
    setActiveQuestions(questions);
    setAnswers({});
    setCurrentIndex(0);
    setAppState("testing");
  }

  function resumeTest() {
    setActiveQuestions(questions);
    setCurrentIndex(findResumeIndex(questions, answers));
    setAppState("testing");
  }

  function viewExistingResult() {
    const result = resolveScoring(answers);
    setPrimary(result.primary);
    setSecondary(result.secondary);
    setAppState("result");
  }

  function restartTest() {
    storage.resetForRestart(RESTART_REFRESHES_OFFER_DEADLINE);
    if (!RESTART_REFRESHES_OFFER_DEADLINE) {
      // keep whatever deadline already existed (possibly none) — do not grant a new one
    }
    setAnswers({});
    setActiveQuestions(questions);
    setCurrentIndex(0);
    setPrimary(null);
    setSecondary(null);
    setAppState("testing");
    storage.saveStartedAt(Date.now());
  }

  function finalizeCompletion(finalAnswers: AnswerMap) {
    const result = resolveScoring(finalAnswers);
    const completedAt = Date.now();

    storage.saveAnswers(finalAnswers);
    storage.saveCompletedAt(completedAt);
    storage.saveScoringSnapshot(result.scores, result.primary, result.secondary);

    let deadline = offerDeadline;
    if (deadline === null) {
      const offerStartedAt = completedAt;
      deadline = offerStartedAt + OFFER_WINDOW_MS;
      storage.saveOfferWindow(offerStartedAt, deadline);
      setOfferDeadline(deadline);
    }

    setPrimary(result.primary);
    setSecondary(result.secondary);
    setAppState("calculating");
  }

  function handleSelectAnswer(questionId: number, key: ScoreKey) {
    const updated: AnswerMap = { ...answers, [questionId]: key };
    setAnswers(updated);
    storage.saveAnswers(updated);

    const isLastQuestion = currentIndex === activeQuestions.length - 1;

    if (!isLastQuestion) {
      setCurrentIndex((i) => i + 1);
      return;
    }

    // Last question just answered — check whether a tie needs disambiguating.
    const result = resolveScoring(updated);
    if (result.isTie && result.tiedKeys.length >= 2) {
      const tieQuestion = questionByTiePair(result.tiedKeys[0], result.tiedKeys[1]);
      const alreadyAsked = tieQuestion && activeQuestions.some((q) => q.id === tieQuestion.id);
      if (tieQuestion && !alreadyAsked) {
        setActiveQuestions((prev) => [...prev, tieQuestion]);
        setCurrentIndex((i) => i + 1);
        return;
      }
      // No tie-breaker question available in the bank — fall back to a
      // deterministic pick (first tied key in fixed A-E order) rather than
      // leaving the result undefined.
    }

    finalizeCompletion(updated);
  }

  function handleBack() {
    setCurrentIndex((i) => Math.max(0, i - 1));
  }

  function handleCalculatingDone() {
    setAppState("result");
  }

  function goToOffer() {
    setAppState("offer");
  }

  const currentQuestion = activeQuestions[currentIndex];

  return (
    <div className="screen">
      {appState === "onboarding" && (
        <Onboarding
          status={onboardingStatus}
          progress={{ current: Object.keys(answers).length, total: questions.length }}
          onStart={beginNewTest}
          onResume={resumeTest}
          onViewResult={viewExistingResult}
          onRestart={restartTest}
        />
      )}

      {appState === "testing" && currentQuestion && (
        <>
          <Progress current={currentIndex + 1} total={activeQuestions.length} />
          <Question
            key={currentQuestion.id}
            question={currentQuestion}
            selectedKey={answers[currentQuestion.id] ?? null}
            onSelect={(key) => handleSelectAnswer(currentQuestion.id, key)}
            onBack={currentIndex > 0 ? handleBack : undefined}
          />
        </>
      )}

      {appState === "calculating" && <Calculating onDone={handleCalculatingDone} />}

      {appState === "result" && primary && (
        <Result primaryKey={primary} secondaryKey={secondary} onContinue={goToOffer} />
      )}

      {appState === "offer" && primary && (
        <Offer productKey={primary} offerDeadline={offerDeadline} onRestart={restartTest} />
      )}
    </div>
  );
}
