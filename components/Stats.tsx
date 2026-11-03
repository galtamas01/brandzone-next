"use client";

import { useEffect, useRef } from "react";
import type { Counter } from "@/content/data";
import styles from "./Stats.module.css";

const format = (n: number) => Math.round(n).toLocaleString("fr-FR").replace(/ | /g, " ");
const easeOutExpo = (t: number) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t));

type Props = { counters: Counter[]; labels: Record<Counter["id"], string> };

/**
 * Számlálók: a végérték már a HTML-ben szerepel (SEO, JS nélkül is helyes),
 * és csak láthatóvá váláskor számol fel 0-ról, egyszer, 1.8 mp alatt.
 * A szám szélessége nem ugrál, mert tabular-nums és a végértékkel azonos a helyfoglalás.
 */
export function Stats({ counters, labels }: Props) {
  const ref = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const nodes = Array.from(root.querySelectorAll<HTMLElement>("[data-target]"));
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        io.disconnect();
        const start = performance.now();
        const DURATION = 1800;
        const tick = (now: number) => {
          const t = Math.min(1, (now - start) / DURATION);
          for (const node of nodes) node.textContent = format(Number(node.dataset.target) * easeOutExpo(t));
          if (t < 1) requestAnimationFrame(tick);
        };
        nodes.forEach((n) => (n.textContent = "0"));
        requestAnimationFrame(tick);
      },
      { threshold: 0.4 },
    );
    io.observe(root);
    return () => io.disconnect();
  }, []);

  return (
    <ul ref={ref} className={styles.stats}>
      {counters.map((c, i) => (
        <li key={c.id} className={styles.stat} data-reveal style={{ "--i": i } as React.CSSProperties}>
          <p className={styles.value}>
            <span className={styles.ghost} aria-hidden="true">
              {format(c.count)}
            </span>
            <span className={styles.num} data-target={c.count}>
              {format(c.count)}
            </span>
            <span className={styles.plus}>+</span>
          </p>
          <p className={styles.label}>{labels[c.id]}</p>
        </li>
      ))}
    </ul>
  );
}
