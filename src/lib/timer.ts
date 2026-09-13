import { useEffect, useState } from "react";

export type CountdownParts = {
  totalMs: number;
  hours: number;
  minutes: number;
  seconds: number;
  expired: boolean;
};

function toParts(remainingMs: number): CountdownParts {
  const clamped = Math.max(0, remainingMs);
  const totalSeconds = Math.floor(clamped / 1000);
  return {
    totalMs: clamped,
    hours: Math.floor(totalSeconds / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
    expired: remainingMs <= 0
  };
}

export function formatCountdown(parts: CountdownParts): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${pad(parts.hours)}:${pad(parts.minutes)}:${pad(parts.seconds)}`;
}

/**
 * Ticks once per second against a fixed deadline and cleans up its interval
 * on unmount or when the deadline changes — no dangling timers.
 */
export function useCountdown(deadline: number | null): CountdownParts {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (deadline === null) return;

    const id = window.setInterval(() => {
      setNow(Date.now());
    }, 1000);

    return () => window.clearInterval(id);
  }, [deadline]);

  if (deadline === null) {
    return toParts(0);
  }

  return toParts(deadline - now);
}
