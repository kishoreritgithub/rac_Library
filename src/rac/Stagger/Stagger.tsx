"use client";

import { Children, type CSSProperties, type ReactNode } from "react";
import { Reveal, type RevealDirection } from "../Reveal/Reveal";

export interface StaggerProps {
  children: ReactNode;
  /** Gap in ms between each child starting. Default 90. */
  step?: number;
  /** Delay in ms before the first child. */
  delay?: number;
  direction?: RevealDirection;
  distance?: number;
  className?: string;
  style?: CSSProperties;
}

/** Reveals each direct child one after another. */
export function Stagger({
  children,
  step = 90,
  delay = 0,
  direction = "up",
  distance,
  className,
  style,
}: StaggerProps) {
  return (
    <div className={className} style={style}>
      {Children.toArray(children).map((child, i) => (
        <Reveal key={i} direction={direction} distance={distance} delay={delay + i * step}>
          {child}
        </Reveal>
      ))}
    </div>
  );
}
