import { useEffect, useState } from "react";
import styles from "./Calculating.module.css";

const MESSAGES = ["Анализируем ваши ответы…", "Смотрим на повторяющиеся реакции…", "Сопоставляем паттерны…"];

const TOTAL_MS = 2600;

type Props = {
  onDone: () => void;
};

export default function Calculating({ onDone }: Props) {
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const stepMs = TOTAL_MS / MESSAGES.length;
    const messageInterval = window.setInterval(() => {
      setMessageIndex((i) => Math.min(i + 1, MESSAGES.length - 1));
    }, stepMs);

    const doneTimeout = window.setTimeout(() => {
      onDone();
    }, TOTAL_MS);

    return () => {
      window.clearInterval(messageInterval);
      window.clearTimeout(doneTimeout);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={styles.wrap}>
      <div className={styles.ring} aria-hidden="true" />
      <p className={styles.text} aria-live="polite">
        {MESSAGES[messageIndex]}
      </p>
    </div>
  );
}
