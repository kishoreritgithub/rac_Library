"use client";

import { useEffect, useId, useState, type ReactNode } from "react";
import { cx } from "../cx";
import styles from "./NavDrawer.module.css";

export interface NavLink {
  label: string;
  href: string;
}

export interface NavDrawerProps {
  /** Logo or brand name on the left. */
  brand: ReactNode;
  links: NavLink[];
  /** Buttons shown on the right (and at the bottom of the mobile menu). */
  actions?: ReactNode;
  /** Stick to the top of the viewport. Default true. */
  sticky?: boolean;
  /** Dark colour scheme. Default false. */
  dark?: boolean;
  className?: string;
}

/**
 * Top navigation that gains a border once the page scrolls and collapses
 * into an animated burger + slide-down menu on small screens.
 */
export function NavDrawer({
  brand,
  links,
  actions,
  sticky = true,
  dark = false,
  className,
}: NavDrawerProps) {
  const menuId = useId();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const onResize = () => window.innerWidth > 860 && setOpen(false);
    const prev = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);
    return () => {
      document.documentElement.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
    };
  }, [open]);

  return (
    <header
      className={cx(
        styles.nav,
        sticky && styles.sticky,
        dark && styles.dark,
        scrolled && styles.scrolled,
        open && styles.open,
        className,
      )}
    >
      <div className={styles.bar}>
        <div className={styles.brand}>{brand}</div>

        <nav className={styles.links} aria-label="Main">
          {links.map((l) => (
            <a key={l.href} href={l.href} className={styles.link}>
              {l.label}
            </a>
          ))}
        </nav>

        {actions && <div className={styles.actions}>{actions}</div>}

        <button
          type="button"
          className={styles.burger}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls={menuId}
          onClick={() => setOpen((v) => !v)}
        >
          <span />
          <span />
        </button>
      </div>

      <div id={menuId} className={styles.menu} inert={!open}>
        <nav className={styles.menuLinks} aria-label="Mobile">
          {links.map((l, i) => (
            <a
              key={l.href}
              href={l.href}
              className={styles.menuLink}
              style={{ transitionDelay: open ? `${80 + i * 50}ms` : "0ms" }}
              onClick={() => setOpen(false)}
            >
              {l.label}
            </a>
          ))}
        </nav>
        {actions && <div className={styles.menuActions}>{actions}</div>}
      </div>

      <div className={styles.scrim} onClick={() => setOpen(false)} aria-hidden="true" />
    </header>
  );
}
