import styles from "./Offer.module.css";
import type { ScoreKey } from "../../types/test";
import { products } from "../../data/products";
import { disclaimer } from "../../data/results";
import { useCountdown } from "../../lib/timer";
import { openExternalLink, hapticTap } from "../../lib/telegram";
import Timer from "../Timer/Timer";

type Props = {
  productKey: ScoreKey;
  offerDeadline: number | null;
  onRestart: () => void;
};

export default function Offer({ productKey, offerDeadline, onRestart }: Props) {
  const product = products[productKey];
  const { expired } = useCountdown(offerDeadline);

  const price = expired ? product.fullPrice : product.discountPrice;
  const url = expired ? product.fullUrl : product.discountUrl;

  function handleCta() {
    hapticTap();
    openExternalLink(url);
  }

  return (
    <div className={styles.wrap}>
      <div className={styles.scrollArea}>
        <span className={styles.eyebrow}>Что делать дальше</span>
        <h1 className={styles.title}>{product.title}</h1>

        <ul className={styles.bullets}>
          {product.bullets.map((bullet, i) => (
            <li key={i}>{bullet}</li>
          ))}
        </ul>

        <p className={styles.objection}>
          Оплата через Lava.top. Доступ открывается сразу после оплаты — без ожидания и без консультаций.
        </p>

        <p className={`disclaimer ${styles.disclaimer}`}>{disclaimer}</p>

        <button className={styles.restart} onClick={onRestart}>
          Пройти тест заново
        </button>
      </div>

      <div className={styles.footer}>
        {offerDeadline !== null && <Timer deadline={offerDeadline} />}
        <div className={styles.priceRow}>
          <div className={styles.priceBlock}>
            <span className={styles.price}>
              {price} {product.currency}
            </span>
            {!expired && (
              <span className={styles.oldPrice}>
                {product.fullPrice} {product.currency}
              </span>
            )}
          </div>
          <button className={`${styles.cta} tap-target`} onClick={handleCta}>
            Получить протокол
          </button>
        </div>
      </div>
    </div>
  );
}
