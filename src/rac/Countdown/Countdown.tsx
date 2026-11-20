"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { cx } from "../cx";
import styles from "./Countdown.module.css";

export interface CountdownProps {
  /** Moment to count down to: a Date, ISO string, or epoch ms. */
  target: Date | string | number;
  /** Optional label shown before the digits. */
  label?: ReactNode;
  /** Shown instead of the digits once the target has passed. */
  doneText?: ReactNode;
  /** Switch to the urgent style when less than this many ms remain. Default 24h. */
  urgentBelow?: number;
  /** Called once when the countdown reaches zero. */
  onComplete?: () => void;
  className?: string;
}

const UNITS: Array<[label: string, size: number]> = [
  ["days", 86400],
  ["hrs", 3600],
  ["min", 60],
  ["sec", 1],
];

const pad = (n: number) => String(n).padStart(2, "0");

/** A ticking days / hours / minutes / seconds countdown. */
export function Countdown({
  target,
  label,
  doneText = "Closed",
  urgentBelow = 86_400_000,
  onComplete,
  className,
}: CountdownProps) {
  const end = new Date(target).getTime();
  // null until mounted so server and client markup match.
  const [left, setLeft] = useState<number | null>(null);
  const done = useRef(false);
  const cb = useRef(onComplete);
  cb.current = onComplete;

  useEffect(() => {
    done.current = false;
    const tick = () => {
      const ms = Math.max(0, end - Date.now());
      setLeft(ms);
      if (ms === 0 && !done.current) {
        done.current = true;
        cb.current?.();
        clearInterval(id);
      }
    };
    const id = setInterval(tick, 1000);
    tick();
    return () => clearInterval(id);
  }, [end]);

  const finished = left === 0;
  const urgent = left !== null && left > 0 && left < urgentBelow;
  let rest = left === null ? 0 : Math.floor(left / 1000);

  return (
    <div
      className={cx(styles.root, urgent && styles.urgent, finished && styles.done, className)}
      role="timer"
      aria-live="off"
    >
      {label && <span className={styles.label}>{label}</span>}
      {finished ? (
        <span className={styles.doneText}>{doneText}</span>
      ) : (
        <span className={styles.units}>
          {UNITS.map(([name, size]) => {
            const value = Math.floor(rest / size);
            rest -= value * size;
            const text = left === null ? "--" : pad(value);
            return (
              <span key={name} className={styles.unit}>
                {/* key change restarts the flip animation on every new value */}
                <span key={text} className={styles.value}>
                  {text}
                </span>
                <span className={styles.name}>{name}</span>
              </span>
            );
          })}
        </span>
      )}
    </div>
  );
}
