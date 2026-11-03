"use client";

import { useEffect, useState } from "react";
import styles from "./PowerSwitch.module.css";

type Props = {
  /** Mennyi idő múlva kapcsoljon BE magától (ms). `null` → már bekapcsolva indul. */
  autoOnAfter?: number | null;
  /** Csak akkor kapcsoljon be, amikor láthatóvá válik (pl. a láblécben). */
  onWhenVisible?: boolean;
  className?: string;
};

/**
 * A BrandZone-logó „O" betűje: egy kapcsoló. A címekben a betű helyén áll,
 * mérete a környező betűmérethez igazodik (em egységek).
 * Dekoratív elem (aria-hidden): a mellette lévő sr-only szöveg hordozza a jelentést.
 * Egérrel kattintva ki-be kapcsolható (apró „easter egg"), billentyűzetről nem érhető el,
 * mert nincs funkciója.
 */
export function PowerSwitch({ autoOnAfter = 1150, onWhenVisible = false, className = "" }: Props) {
  const [on, setOn] = useState(autoOnAfter === null);
  const [node, setNode] = useState<HTMLSpanElement | null>(null);

  useEffect(() => {
    if (autoOnAfter === null || !node) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let timer: number | undefined;
    const start = () => {
      timer = window.setTimeout(() => setOn(true), reduce ? 0 : autoOnAfter);
    };

    if (!onWhenVisible) {
      start();
      return () => window.clearTimeout(timer);
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          start();
          io.disconnect();
        }
      },
      { threshold: 0.6 },
    );
    io.observe(node);
    return () => {
      io.disconnect();
      window.clearTimeout(timer);
    };
  }, [autoOnAfter, onWhenVisible, node]);

  return (
    <span
      ref={setNode}
      aria-hidden="true"
      className={`${styles.switch} ${className}`}
      data-on={on || undefined}
      onClick={() => setOn((v) => !v)}
    >
      <span className={styles.knob} />
    </span>
  );
}
