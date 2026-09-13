import styles from "./Progress.module.css";

type Props = {
  current: number;
  total: number;
};

export default function Progress({ current, total }: Props) {
  const pct = Math.min(100, Math.round((current / total) * 100));

  return (
    <div className={styles.wrap} role="progressbar" aria-valuenow={current} aria-valuemin={1} aria-valuemax={total}>
      <div className={styles.track}>
        <div className={styles.fill} style={{ width: `${pct}%` }} />
      </div>
      <span className={styles.label}>
        {current} / {total}
      </span>
    </div>
  );
}
