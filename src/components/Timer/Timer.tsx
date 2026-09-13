import styles from "./Timer.module.css";
import { formatCountdown, useCountdown } from "../../lib/timer";

type Props = {
  deadline: number | null;
};

export default function Timer({ deadline }: Props) {
  const parts = useCountdown(deadline);

  if (deadline === null) return null;

  return (
    <div className={styles.wrap}>
      <span className={styles.label}>{parts.expired ? "Спеццена закончилась" : "Спеццена действует ещё"}</span>
      {!parts.expired && (
        <span className={styles.value} data-expired={parts.expired}>
          {formatCountdown(parts)}
        </span>
      )}
    </div>
  );
}
