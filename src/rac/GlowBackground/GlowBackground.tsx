import type { CSSProperties, ElementType, ReactNode } from "react";
import { cx } from "../cx";
import styles from "./GlowBackground.module.css";

export interface GlowBackgroundProps {
  children?: ReactNode;
  /** Up to three glow colours. Defaults to the --rac-glow-* tokens. */
  colors?: [string?, string?, string?];
  /** Drift the glows slowly. Default true. */
  animated?: boolean;
  /** Overlay a faint dot grid. Default false. */
  grid?: boolean;
  /** Element to render. Default "section". */
  as?: ElementType;
  className?: string;
  style?: CSSProperties;
}

/** Dark section with soft, slowly drifting colour glows behind its content. */
export function GlowBackground({
  children,
  colors,
  animated = true,
  grid = false,
  as: Tag = "section",
  className,
  style,
}: GlowBackgroundProps) {
  const vars = {
    ...(colors?.[0] ? { "--rac-glow-1": colors[0] } : {}),
    ...(colors?.[1] ? { "--rac-glow-2": colors[1] } : {}),
    ...(colors?.[2] ? { "--rac-glow-3": colors[2] } : {}),
    ...style,
  } as CSSProperties;

  return (
    <Tag className={cx(styles.root, animated && styles.animated, className)} style={vars}>
      <div className={styles.layer} aria-hidden="true">
        <span className={cx(styles.glow, styles.g1)} />
        <span className={cx(styles.glow, styles.g2)} />
        <span className={cx(styles.glow, styles.g3)} />
        {grid && <span className={styles.grid} />}
      </div>
      <div className={styles.content}>{children}</div>
    </Tag>
  );
}
