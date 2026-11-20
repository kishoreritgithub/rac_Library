"use client";

import { useId, useMemo, useState, type ReactNode } from "react";
import { cx } from "../cx";
import styles from "./FaqTabs.module.css";

export interface FaqItem {
  question: string;
  answer: ReactNode;
  /** Used to build the filter tabs. Items without one only show under "All". */
  category?: string;
}

export interface FaqTabsProps {
  items: FaqItem[];
  /** Label for the tab that shows everything. Default "All". */
  allLabel?: string;
  /** Allow several answers open at once. Default false. */
  multiple?: boolean;
  /** Index of the item open on first render, or null for none. Default null. */
  defaultOpen?: number | null;
  className?: string;
}

/** FAQ accordion with category filter tabs and animated open/close. */
export function FaqTabs({
  items,
  allLabel = "All",
  multiple = false,
  defaultOpen = null,
  className,
}: FaqTabsProps) {
  const uid = useId();
  const [filter, setFilter] = useState<string | null>(null);
  const [open, setOpen] = useState<Set<number>>(
    () => new Set(defaultOpen == null ? [] : [defaultOpen]),
  );

  const categories = useMemo(
    () => Array.from(new Set(items.map((i) => i.category).filter((c): c is string => !!c))),
    [items],
  );

  const toggle = (i: number) =>
    setOpen((prev) => {
      const next = new Set(multiple ? prev : []);
      if (prev.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });

  const tabs: Array<[label: string, value: string | null]> = [
    [allLabel, null],
    ...categories.map((c): [string, string] => [c, c]),
  ];

  let shown = 0;

  return (
    <div className={cx(styles.root, className)}>
      {categories.length > 0 && (
        <div className={styles.tabs} role="tablist" aria-label="Filter questions">
          {tabs.map(([label, value]) => (
            <button
              key={label}
              type="button"
              role="tab"
              aria-selected={filter === value}
              className={cx(styles.tab, filter === value && styles.tabOn)}
              onClick={() => setFilter(value)}
            >
              {label}
            </button>
          ))}
        </div>
      )}

      <div className={styles.list}>
        {items.map((item, i) => {
          if (filter !== null && item.category !== filter) return null;
          const isOpen = open.has(i);
          const order = shown++;
          return (
            <div
              // Re-key on filter so the enter animation replays when tabs change.
              key={`${filter ?? "all"}-${i}`}
              className={cx(styles.item, isOpen && styles.open)}
              style={{ animationDelay: `${order * 45}ms` }}
            >
              <button
                type="button"
                id={`${uid}-q-${i}`}
                className={styles.question}
                aria-expanded={isOpen}
                aria-controls={`${uid}-a-${i}`}
                onClick={() => toggle(i)}
              >
                <span>{item.question}</span>
                <span className={styles.icon} aria-hidden="true" />
              </button>
              <div
                id={`${uid}-a-${i}`}
                role="region"
                aria-labelledby={`${uid}-q-${i}`}
                className={styles.panel}
              >
                <div className={styles.inner} inert={!isOpen}>
                  <div className={styles.answer}>{item.answer}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
