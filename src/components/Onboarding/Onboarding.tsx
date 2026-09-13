import styles from "./Onboarding.module.css";
import { disclaimer } from "../../data/results";

type Props = {
  status: "new" | "in-progress" | "completed";
  progress: { current: number; total: number };
  onStart: () => void;
  onResume: () => void;
  onViewResult: () => void;
  onRestart: () => void;
};

export default function Onboarding({ status, progress, onStart, onResume, onViewResult, onRestart }: Props) {
  return (
    <div className={styles.wrap}>
      <div className={styles.top}>
        <div className={styles.eyebrowless} aria-hidden="true" />
        <h1 className={styles.headline}>
          У каждого есть сценарий, который <em>включается без спроса</em> — в конфликте, в тишине, в решающий момент
        </h1>
        <p className={styles.subhead}>
          12 вопросов помогут заметить паттерн, который годами управляет вашими реакциями — в отношениях, на работе и
          наедине с собой.
        </p>

        <div className={styles.meta}>
          <div className={styles.metaItem}>
            <span className={styles.metaValue}>3 мин</span>
            <span className={styles.metaLabel}>на прохождение</span>
          </div>
          <div className={styles.metaItem}>
            <span className={styles.metaValue}>12</span>
            <span className={styles.metaLabel}>вопросов</span>
          </div>
        </div>

        {status === "in-progress" && (
          <div className={styles.resumeCard}>
            <strong>Тест не завершён</strong>
            <p>
              Отвечено {progress.current} из {progress.total} вопросов. Можно продолжить с того же места.
            </p>
          </div>
        )}

        {status === "completed" && (
          <div className={styles.resumeCard}>
            <strong>Результат уже готов</strong>
            <p>Вы уже прошли тест — можно посмотреть свой сценарий и текущее предложение.</p>
          </div>
        )}
      </div>

      <div className={styles.bottom}>
        {status === "new" && (
          <button className={`${styles.cta} tap-target`} onClick={onStart}>
            Начать тест
          </button>
        )}

        {status === "in-progress" && (
          <>
            <button className={`${styles.cta} tap-target`} onClick={onResume}>
              Продолжить тест
            </button>
            <button className={styles.secondaryLink} onClick={onStart}>
              Начать заново
            </button>
          </>
        )}

        {status === "completed" && (
          <>
            <button className={`${styles.cta} tap-target`} onClick={onViewResult}>
              Посмотреть мой результат
            </button>
            <button className={styles.secondaryLink} onClick={onRestart}>
              Пройти тест заново
            </button>
          </>
        )}

        <p className="disclaimer">{disclaimer}</p>
      </div>
    </div>
  );
}
