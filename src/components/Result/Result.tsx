import { useState } from "react";
import styles from "./Result.module.css";
import type { ScoreKey } from "../../types/test";
import { results, disclaimer } from "../../data/results";
import { products } from "../../data/products";
import Accordion, { type AccordionItem } from "../Accordion/Accordion";

type Props = {
  primaryKey: ScoreKey;
  secondaryKey: ScoreKey | null;
  onContinue: () => void;
};

export default function Result({ primaryKey, secondaryKey, onContinue }: Props) {
  const profile = results[primaryKey];
  const secondaryProfile = secondaryKey ? results[secondaryKey] : null;
  const product = products[primaryKey];
  const [forceOpenId, setForceOpenId] = useState<string | null>(null);

  const items: AccordionItem[] = [
    {
      id: "inside",
      title: "Что происходит внутри",
      content: profile.intro.map((paragraph, i) => <p key={i}>{paragraph}</p>)
    },
    {
      id: "relationships",
      title: "Как это проявляется в отношениях",
      content: profile.relationships.map((paragraph, i) => <p key={i}>{paragraph}</p>)
    },
    {
      id: "work",
      title: "Работа, деньги и самореализация",
      content: profile.workAndMoney.map((paragraph, i) => <p key={i}>{paragraph}</p>)
    },
    {
      id: "hidden",
      title: "Что вы редко признаёте себе",
      content: <p>{profile.hiddenTruth}</p>
    },
    {
      id: "blindspot",
      title: "Ваша слепая зона",
      content: <p>{profile.blindSpot}</p>
    },
    {
      id: "body",
      title: "Тело и поведение под стрессом",
      content: <p>{profile.bodyMarkers}</p>
    },
    {
      id: "cost",
      title: "Цена этого сценария",
      content: (
        <ul className={styles.list}>
          {profile.costOfPattern.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      )
    },
    ...(secondaryProfile
      ? [
          {
            id: "secondary",
            title: `Вторичный сценарий: «${secondaryProfile.title}»`,
            content: <p>{profile.secondaryIntro(secondaryProfile.title)}</p>
          }
        ]
      : []),
    {
      id: "character",
      title: "Черта характера или защитный паттерн?",
      content: <p>Это не обязательно часть вашей личности.</p>
    },
    {
      id: "change",
      title: "Что можно изменить",
      content: <p>{profile.whatCanChange}</p>
    }
  ];

  return (
    <div className={styles.wrap}>
      <div className={styles.scrollArea}>
        <section className={styles.hero}>
          <span className={styles.eyebrow}>Ваш ведущий сценарий</span>
          <h1 className={styles.title}>{profile.title}</h1>
          <span className={styles.maskName}>Маска: {profile.mask}</span>
          <p className={styles.hook}>{profile.hook}</p>
        </section>

        <button className={styles.expandCta} onClick={() => setForceOpenId("inside")}>
          Узнать подробнее ↓
        </button>

        <Accordion items={items} forceOpenId={forceOpenId} />

        <p className={`disclaimer ${styles.disclaimer}`}>{disclaimer}</p>
      </div>

      <div className={styles.footer}>
        <div className={styles.footerPrice}>
          <span className={styles.footerPriceValue}>
            {product.discountPrice} {product.currency}
          </span>
          <span className={styles.footerPriceLabel}>{product.title}</span>
        </div>
        <button className={`${styles.footerCta} tap-target`} onClick={onContinue}>
          Получить протокол →
        </button>
      </div>
    </div>
  );
}
