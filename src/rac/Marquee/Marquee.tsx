import type { CSSProperties, ReactNode } from "react";
import { cx } from "../cx";
import styles from "./Marquee.module.css";

export interface MarqueeProps {
  children: ReactNode;
  /** Seconds for one full loop. Default 30. */
  speed?: number;
  /** Scroll right-to-left ("left") or left-to-right ("right"). Default "left". */
  direction?: "left" | "right";
  /** Pause while hovered or focused. Default true. */
  pauseOnHover?: boolean;
  /** Fade the left and right edges. Default true. */
  fade?: boolean;
  /** Gap between items in px. Default 48. */
  gap?: number;
  className?: string;
}

/** Endless horizontal ticker. Pure CSS, no JavaScript at runtime. */
export function Marquee({
  children,
  speed = 30,
  direction = "left",
  pauseOnHover = true,
  fade = true,
  gap = 48,
  className,
}: MarqueeProps) {
  const vars = {
    "--rac-marquee-dur": `${speed}s`,
    "--rac-marquee-gap": `${gap}px`,
  } as CSSProperties;

  return (
    <div
      className={cx(
        styles.root,
        fade && styles.fade,
        pauseOnHover && styles.pause,
        direction === "right" && styles.reverse,
        className,
      )}
      style={vars}
    >
      <div className={styles.group}>{children}</div>
      {/* Duplicate keeps the loop seamless; hidden from assistive tech. */}
      <div className={styles.group} aria-hidden="true" inert>
        {children}
      </div>
    </div>
  );
}
