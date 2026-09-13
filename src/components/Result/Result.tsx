import styles from "./Result.module.css";
import type { ScoreKey } from "../../types/test";
import { results, disclaimer } from "../../data/results";
import { products } from "../../data/products";

type Props = {
  primaryKey: ScoreKey;
  secondaryKey: ScoreKey | null;
  onContinue: () => void;
};

export default function Result({ primaryKey, secondaryKey, onContinue }: Props) {
  const profile = results[primaryKey];
  const secondaryProfile = secondaryKey ? results[secondaryKey] : null;
  const product = products[primaryKey];

  return (
    <div className={styles.wrap}>
      <section className={styles.hero}>
        <span className={styles.eyebrow}>Ваш ведущий сценарий</span>
        <h1 className={styles.title}>{profile.title}</h1>
        <p className={styles.hook}>{profile.hook}</p>
      </section>

      <div className={styles.maskCard}>
        <span className={styles.maskLabel}>Архетипическая маска</span>
        <span className={styles.maskName}>{profile.mask}</span>
      </div>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Как это выглядит изнутри</h2>
        {profile.intro.map((paragraph, i) => (
          <p key={i} className={styles.sectionText}>
            {paragraph}
          </p>
        ))}
      </section>

      <section className={`${styles.section} ${styles.confront}`}>
        <h2 className={styles.sectionTitle}>Что вы редко признаёте себе</h2>
        <p className={styles.sectionText}>{profile.hiddenTruth}</p>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>В отношениях</h2>
        {profile.relationships.map((paragraph, i) => (
          <p key={i} className={styles.sectionText}>
            {paragraph}
          </p>
        ))}
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>В работе и деньгах</h2>
        {profile.workAndMoney.map((paragraph, i) => (
          <p key={i} className={styles.sectionText}>
            {paragraph}
          </p>
        ))}
      </section>

      <section className={styles.blindSpotCard}>
        <h2 className={styles.sectionTitle}>Ваша слепая зона</h2>
        <p className={styles.sectionText}>{profile.blindSpot}</p>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Что происходит под стрессом</h2>
        <p className={styles.sectionText}>{profile.bodyMarkers}</p>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Цена сценария</h2>
        <ul className={styles.list}>
          {profile.costOfPattern.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      </section>

      {secondaryProfile && (
        <section className={styles.secondaryCard}>
          <h2 className={styles.sectionTitle}>Рядом заметен сценарий «{secondaryProfile.title}»</h2>
          <p className={styles.sectionText}>{profile.secondaryIntro(secondaryProfile.title)}</p>
        </section>
      )}

      <section className={styles.pivot}>
        <p className={styles.pivotText}>Это не обязательно часть вашей личности.</p>
        <p className={styles.sectionText}>{profile.whatCanChange}</p>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Что дальше</h2>
        <p className={styles.sectionText}>
          Вы уже знаете, какой сценарий включается. Но знание само по себе его не меняет. {product.title} —
          конкретный способ начать работать с этим на практике.
        </p>
      </section>

      <button className={styles.cta} onClick={onContinue}>
        Получить протокол выхода из сценария
      </button>

      <p className="disclaimer">{disclaimer}</p>
    </div>
  );
}
