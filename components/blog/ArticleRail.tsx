"use client";

import { useEffect, useRef, useState } from "react";
import type { TocEntry } from "@/lib/blog-shared";
import styles from "./ArticleRail.module.css";

type Props = {
  toc: TocEntry[];
  /** A cikktörzs elemének id-ja, ennek a haladását követjük. */
  bodyId: string;
  label: string;
};

/**
 * Olvasási folyamat zöld vonallal. Asztali gépen a bal oldali tartalomjegyzék egy függőleges vonal,
 * amelyen a szakaszok pontok: olvasás közben a zöld vonal a pontok között haladva festődik végig,
 * a már elolvasott pontok zöldek, az éppen olvasott kiemelt. Mobilon a képernyő tetején egy vékony
 * zöld sáv mutatja az arányt. Egyetlen passzív scroll-figyelő, requestAnimationFrame-mel összefogva;
 * a vonalat közvetlenül a DOM-on (transform) frissítjük, React csak a szakaszváltáskor renderel újra.
 */
export function ArticleRail({ toc, bodyId, label }: Props) {
  const barRef = useRef<HTMLSpanElement>(null);
  const fillRef = useRef<HTMLSpanElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLOListElement>(null);
  const [active, setActive] = useState(-1);

  useEffect(() => {
    const article = document.getElementById(bodyId);
    if (!article) return;
    const heads = toc.map((t) => document.getElementById(t.id)).filter((h): h is HTMLElement => !!h);

    let artTop = 0;
    let artH = 1;
    let ys: number[] = [];
    let dots: number[] = [];
    let trackH = 1;
    let raf = 0;
    let current = -1;

    const clamp = (v: number) => Math.min(1, Math.max(0, v));

    const measure = () => {
      const sy = window.scrollY;
      artTop = article.getBoundingClientRect().top + sy;
      artH = Math.max(1, article.offsetHeight);
      ys = heads.map((h) => h.getBoundingClientRect().top + sy);
      trackH = Math.max(1, trackRef.current?.offsetHeight ?? 1);
      // a pont a lista elem első sorának közepén ül
      dots = Array.from(listRef.current?.children ?? []).map((li) => {
        const el = li as HTMLElement;
        const a = el.firstElementChild as HTMLElement | null;
        const line = a ? parseFloat(getComputedStyle(a).lineHeight) || 22 : 22;
        return el.offsetTop + line / 2;
      });
    };

    const update = () => {
      raf = 0;
      // az olvasási „vonal" a képernyő felső harmadában van
      const ref = window.scrollY + window.innerHeight * 0.32;
      const overall = clamp((ref - artTop) / artH);
      if (barRef.current) barRef.current.style.transform = `scaleX(${overall})`;

      let fillY = overall * trackH;
      let idx = -1;
      if (ys.length && dots.length === ys.length) {
        if (ref < ys[0]) {
          fillY = dots[0] * clamp((ref - artTop) / Math.max(1, ys[0] - artTop));
        } else {
          idx = ys.length - 1;
          while (idx > 0 && ys[idx] > ref) idx--;
          const nextY = idx + 1 < ys.length ? ys[idx + 1] : artTop + artH;
          const nextDot = idx + 1 < dots.length ? dots[idx + 1] : trackH;
          const frac = clamp((ref - ys[idx]) / Math.max(1, nextY - ys[idx]));
          fillY = dots[idx] + frac * (nextDot - dots[idx]);
        }
      }
      if (fillRef.current) fillRef.current.style.transform = `scaleY(${clamp(fillY / trackH)})`;
      if (idx !== current) {
        current = idx;
        setActive(idx);
      }
    };

    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    const remeasure = () => {
      measure();
      schedule();
    };

    measure();
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", remeasure);
    const ro = new ResizeObserver(remeasure);
    ro.observe(article);
    // a webfont betöltése után a magasságok változhatnak
    document.fonts?.ready.then(remeasure).catch(() => {});

    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", remeasure);
      ro.disconnect();
      if (raf) cancelAnimationFrame(raf);
    };
  }, [toc, bodyId]);

  return (
    <>
      <div className={styles.topbar} aria-hidden="true">
        <span ref={barRef} className={styles.topfill} />
      </div>

      {toc.length > 1 ? (
        <nav className={styles.rail} aria-label={label}>
          <p className={styles.label}>{label}</p>
          <div ref={trackRef} className={styles.track}>
            <span className={styles.line} aria-hidden="true">
              <span ref={fillRef} className={styles.fill} />
            </span>
            <ol ref={listRef} className={styles.list}>
              {toc.map((t, i) => (
                <li key={t.id} className={styles.item} data-state={i < active ? "done" : i === active ? "active" : "todo"}>
                  <a href={`#${t.id}`} aria-current={i === active ? "location" : undefined}>
                    {t.text}
                  </a>
                </li>
              ))}
            </ol>
          </div>
        </nav>
      ) : null}
    </>
  );
}
