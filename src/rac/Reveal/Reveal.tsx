"use client";

import type { CSSProperties, ElementType, ReactNode } from "react";
import { cx } from "../cx";
import { useInView } from "../hooks/useInView";
import styles from "./Reveal.module.css";

export type RevealDirection = "up" | "down" | "left" | "right" | "none";

export interface RevealProps {
  children: ReactNode;
  /** Direction the content travels from. Default "up". */
  direction?: RevealDirection;
  /** Delay in ms before the transition starts. */
  delay?: number;
  /** Transition length in ms. Defaults to the --rac-dur token. */
  duration?: number;
  /** Travel distance in px. Default 28. */
  distance?: number;
  /** Add a blur that clears as the content arrives. */
  blur?: boolean;
  /** Animate only the first time it enters the viewport. Default true. */
  once?: boolean;
  /** Portion of the element visible before it triggers. Default 0.15. */
  threshold?: number;
  /** Element to render. Default "div". */
  as?: ElementType;
  className?: string;
  style?: CSSProperties;
}

const OFFSET: Record<RevealDirection, [number, number]> = {
  up: [0, 1],
  down: [0, -1],
  left: [1, 0],
  right: [-1, 0],
  none: [0, 0],
};

/** Fades and slides its children in when they scroll into view. */
export function Reveal({
  children,
  direction = "up",
  delay = 0,
  duration,
  distance = 28,
  blur = false,
  once = true,
  threshold = 0.15,
  as: Tag = "div",
  className,
  style,
}: RevealProps) {
  const { ref, inView } = useInView<HTMLElement>({ threshold, once });
  const [x, y] = OFFSET[direction];

  const vars = {
    "--rac-reveal-x": `${x * distance}px`,
    "--rac-reveal-y": `${y * distance}px`,
    "--rac-reveal-delay": `${delay}ms`,
    ...(duration != null ? { "--rac-reveal-dur": `${duration}ms` } : {}),
    ...style,
  } as CSSProperties;

  return (
    <Tag
      ref={ref}
      className={cx(styles.reveal, blur && styles.blur, inView && styles.in, className)}
      style={vars}
    >
      {children}
    </Tag>
  );
}
