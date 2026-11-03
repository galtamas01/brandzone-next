"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { ChevronLeft, ChevronRight } from "@/components/Icons";
import styles from "./Rail.module.css";

type Props = {
  children: ReactNode;
  label: string;
  prevLabel: string;
  nextLabel: string;
  className?: string;
  /** Ha true, a sínben indított videó leállítja a többit (referenciák). */
  singleVideo?: boolean;
};

/**
 * Vízszintes sín natív scroll-snappel (mobilon a böngésző saját fizikája,
 * nincs JS-es húzás). Desktopon előre/hátra gombok; a gombok a végeken letiltódnak.
 */
export function Rail({ children, label, prevLabel, nextLabel, className = "", singleVideo = false }: Props) {
  const ref = useRef<HTMLUListElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const update = () => {
      setAtStart(el.scrollLeft < 8);
      setAtEnd(el.scrollLeft + el.clientWidth > el.scrollWidth - 8);
    };
    update();
    el.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);

    // A play/pause események nem buborékolnak, de capture fázisban elkaphatók.
    const onPlay = (e: Event) => {
      if (!singleVideo || !(e.target instanceof HTMLVideoElement)) return;
      el.querySelectorAll("video").forEach((v) => v !== e.target && v.pause());
    };
    el.addEventListener("play", onPlay, true);

    return () => {
      el.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      el.removeEventListener("play", onPlay, true);
    };
  }, [singleVideo]);

  const scroll = (dir: 1 | -1) => {
    const el = ref.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: reduce ? "auto" : "smooth" });
  };

  return (
    <div className={`${styles.wrap} ${className}`}>
      <ul ref={ref} className={styles.rail} aria-label={label} tabIndex={0}>
        {children}
      </ul>
      <div className={styles.controls}>
        <button type="button" className={styles.btn} onClick={() => scroll(-1)} disabled={atStart} aria-label={prevLabel}>
          <ChevronLeft size={20} />
        </button>
        <button type="button" className={styles.btn} onClick={() => scroll(1)} disabled={atEnd} aria-label={nextLabel}>
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
}
