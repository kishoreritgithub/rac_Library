"use client";

import { useEffect, useState, type ReactNode } from "react";
import { cx } from "../cx";
import { useInView } from "../hooks/useInView";
import styles from "./StatCounter.module.css";

export interface StatCounterProps {
  /** Final number to count up to. */
  value: number;
  /** Number to start from. Default 0. */
  from?: number;
  /** Animation length in ms. Default 1600. */
  duration?: number;
  /** Decimal places to show. Default 0. */
  decimals?: number;
  prefix?: string;
  suffix?: string;
  /** Caption under the number. */
  label?: ReactNode;
  /** BCP 47 locale for digit grouping, e.g. "en-IN". Default "en-US". */
  locale?: string;
  className?: string;
}

const easeOutExpo = (t: number) => (t >= 1 ? 1 : 1 - Math.pow(2, -10 * t));

/** A number that counts up the first time it scrolls into view. */
export function StatCounter({
  value,
  from = 0,
  duration = 1600,
  decimals = 0,
  prefix = "",
  suffix = "",
  label,
  locale = "en-US",
  className,
}: StatCounterProps) {
  const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0.4 });
  const [current, setCurrent] = useState(from);

  useEffect(() => {
    if (!inView) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setCurrent(value);
      return;
    }
    let frame = 0;
    const start = performance.now();
    const step = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      setCurrent(from + (value - from) * easeOutExpo(t));
      if (t < 1) frame = requestAnimationFrame(step);
    };
    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [inView, value, from, duration]);

  const format = (n: number) =>
    n.toLocaleString(locale, { minimumFractionDigits: decimals, maximumFractionDigits: decimals });

  return (
    <div ref={ref} className={cx(styles.root, inView && styles.in, className)}>
      <div className={styles.value}>
        {/* Screen readers get the final figure, not every frame. */}
        <span className={styles.srOnly}>
          {prefix}
          {format(value)}
          {suffix}
        </span>
        <span aria-hidden="true">
          {prefix}
          {format(current)}
          {suffix}
        </span>
      </div>
      {label && <div className={styles.label}>{label}</div>}
    </div>
  );
}
