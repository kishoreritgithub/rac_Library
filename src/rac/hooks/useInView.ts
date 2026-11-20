"use client";

import { useEffect, useRef, useState } from "react";

export interface UseInViewOptions {
  /** Portion of the element that must be visible (0 to 1). */
  threshold?: number;
  /** Margin around the viewport, CSS syntax, e.g. "0px 0px -10% 0px". */
  rootMargin?: string;
  /** Stop observing after the first time the element enters. */
  once?: boolean;
}

/** Tracks whether an element is inside the viewport. */
export function useInView<T extends Element = HTMLDivElement>({
  threshold = 0.15,
  rootMargin = "0px",
  once = true,
}: UseInViewOptions = {}) {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          if (once) io.disconnect();
        } else if (!once) {
          setInView(false);
        }
      },
      { threshold, rootMargin },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold, rootMargin, once]);

  return { ref, inView };
}
