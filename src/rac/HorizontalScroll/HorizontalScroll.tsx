"use client";

import { Children, useEffect, useRef, useState, type ReactNode } from "react";
import { cx } from "../cx";
import styles from "./HorizontalScroll.module.css";

export interface HorizontalScrollProps {
  /** Each direct child becomes one panel in the strip. */
  children: ReactNode;
  /** Optional heading area shown above the strip while pinned. */
  header?: ReactNode;
  /** Show the progress bar and "1 / n" counter. Default true. */
  progress?: boolean;
  /** Below this viewport width it becomes a native swipe strip. Default 900. */
  breakpoint?: number;
  /** Offset from the top of the viewport for the pinned area, in px. */
  top?: number;
  className?: string;
}

/**
 * Pins a section while vertical scrolling moves a strip of panels sideways.
 * On small screens (or with reduced motion) it falls back to a native
 * horizontally scrollable, snap-aligned strip.
 */
export function HorizontalScroll({
  children,
  header,
  progress = true,
  breakpoint = 900,
  top = 0,
  className,
}: HorizontalScrollProps) {
  const outer = useRef<HTMLDivElement>(null);
  const viewport = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLSpanElement>(null);
  const [pinned, setPinned] = useState(false);
  const [index, setIndex] = useState(1);
  const count = Children.count(children);

  useEffect(() => {
    const o = outer.current;
    const v = viewport.current;
    const t = track.current;
    if (!o || !v || !t) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    let shift = 0;
    let frame = 0;
    let active = false;

    const update = () => {
      frame = 0;
      if (!active) return;
      const total = o.offsetHeight - window.innerHeight;
      const p = total > 0 ? Math.min(1, Math.max(0, -o.getBoundingClientRect().top / total)) : 0;
      t.style.transform = `translate3d(${-p * shift}px,0,0)`;
      if (bar.current) bar.current.style.transform = `scaleX(${p})`;
      setIndex(Math.min(count, Math.floor(p * count) + 1));
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    const measure = () => {
      active = window.innerWidth > breakpoint && !reduce.matches;
      setPinned(active);
      if (!active) {
        o.style.height = "";
        t.style.transform = "";
        return;
      }
      shift = Math.max(0, t.scrollWidth - v.clientWidth);
      o.style.height = `${window.innerHeight + shift}px`;
      update();
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(t);
    window.addEventListener("resize", measure);
    window.addEventListener("scroll", onScroll, { passive: true });
    reduce.addEventListener("change", measure);

    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
      window.removeEventListener("scroll", onScroll);
      reduce.removeEventListener("change", measure);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [breakpoint, count]);

  return (
    <div ref={outer} className={cx(styles.outer, pinned && styles.pinned, className)}>
      <div className={styles.pin} style={{ top }}>
        {header && <div className={styles.header}>{header}</div>}
        <div ref={viewport} className={styles.viewport}>
          <div ref={track} className={styles.track}>
            {Children.map(children, (child) => (
              <div className={styles.panel}>{child}</div>
            ))}
          </div>
        </div>
        {progress && pinned && (
          <div className={styles.progress} aria-hidden="true">
            <span className={styles.count}>
              {String(index).padStart(2, "0")} / {String(count).padStart(2, "0")}
            </span>
            <span className={styles.rail}>
              <span ref={bar} className={styles.bar} />
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
