import styles from "./Question.module.css";
import type { ScoreKey, TestQuestion } from "../../types/test";
import { hapticTap } from "../../lib/telegram";

type Props = {
  question: TestQuestion;
  selectedKey: ScoreKey | null;
  onSelect: (key: ScoreKey) => void;
  onBack?: () => void;
};

export default function Question({ question, selectedKey, onSelect, onBack }: Props) {
  function handleSelect(key: ScoreKey) {
    hapticTap();
    onSelect(key);
  }

  return (
    <div className={styles.wrap}>
      <h2 className={styles.question}>{question.question}</h2>

      <div className={styles.options} role="radiogroup" aria-label={question.question}>
        {question.options.map((option) => (
          <button
            key={option.key}
            className={`${styles.option} tap-target`}
            data-selected={selectedKey === option.key}
            role="radio"
            aria-checked={selectedKey === option.key}
            onClick={() => handleSelect(option.key)}
          >
            {option.text}
          </button>
        ))}
      </div>

      {onBack && (
        <button className={styles.back} onClick={onBack}>
          ← Предыдущий вопрос
        </button>
      )}
    </div>
  );
}
