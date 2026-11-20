import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";
import { cx } from "../cx";
import styles from "./Button.module.css";

type Common = {
  children: ReactNode;
  /** Visual style. Default "solid". */
  variant?: "solid" | "outline" | "ghost";
  /** Default "md". */
  size?: "sm" | "md" | "lg";
  /** Show an arrow that slides on hover. */
  arrow?: boolean;
  /** Lift with a hard offset shadow on hover. */
  lift?: boolean;
  className?: string;
};

export type ButtonProps =
  | (Common & { href: string } & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "className" | "children">)
  | (Common & { href?: undefined } & Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className" | "children">);

/** Button (or link, when `href` is set) with hover and press animations. */
export function Button(props: ButtonProps) {
  const { children, variant = "solid", size = "md", arrow, lift, className, ...rest } = props;
  const cls = cx(styles.btn, styles[variant], styles[size], lift && styles.lift, className);

  const inner = (
    <>
      <span>{children}</span>
      {arrow && (
        <span className={styles.arrow} aria-hidden="true">
          <svg viewBox="0 0 16 16" width="16" height="16" fill="none">
            <path
              d="M3 8h10M9 4l4 4-4 4"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <svg viewBox="0 0 16 16" width="16" height="16" fill="none">
            <path
              d="M3 8h10M9 4l4 4-4 4"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      )}
    </>
  );

  if (typeof rest.href === "string") {
    return (
      <a className={cls} {...(rest as AnchorHTMLAttributes<HTMLAnchorElement>)}>
        {inner}
      </a>
    );
  }
  return (
    <button type="button" className={cls} {...(rest as ButtonHTMLAttributes<HTMLButtonElement>)}>
      {inner}
    </button>
  );
}
