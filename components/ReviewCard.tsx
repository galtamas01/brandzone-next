"use client";

import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
import type { ReviewItem } from "@/content/copy";
import { GoogleG, Star, VerifiedBadge } from "@/components/ui/ReviewIcons";
import styles from "./ReviewCards.module.css";

/** Az „Olvass tovább" sor magassága + a fölötte lévő térköz (px); a CSS-ben ugyanez a --more-row. */
const MORE_ROW = 40;
const DURATION = 320;

const useIsoLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

type Fit = { more: boolean; lines: number | null };

type Props = { item: ReviewItem; more: string; less: string };

/**
 * Alacsony (4:3) értékelés-kártya. Ami a kártyába nem fér be, azt a rendelkezésre álló sorszámnál
 * vágja (line-clamp), és „Olvass tovább" gombot kap; kattintásra a kártya lefelé kinyílik
 * (a többi kártya változatlan marad), újabb kattintásra visszazárul.
 * A sorszámot nem találgatjuk: a kártya valós méretéből és sormagasságából számoljuk, és méretváltozáskor újra.
 */
export function ReviewCard({ item, more, less }: Props) {
  const cardRef = useRef<HTMLElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);
  const noteRef = useRef<HTMLParagraphElement>(null);
  const textId = useId();

  const [expanded, setExpanded] = useState(false);
  const [fit, setFit] = useState<Fit>({ more: false, lines: null });
  const expandedRef = useRef(false);
  const fitRef = useRef(fit);
  const busy = useRef(false);
  expandedRef.current = expanded;
  fitRef.current = fit;

  const measure = useCallback(() => {
    const body = bodyRef.current;
    const text = textRef.current;
    if (!body || !text || expandedRef.current || busy.current) return;

    // Teljes (vágatlan) szövegmagasság: a --lines ideiglenesen 999, még festés előtt visszaállítjuk.
    const prev = text.style.getPropertyValue("--lines");
    text.style.setProperty("--lines", "999");
    const fullH = text.offsetHeight;
    if (prev) text.style.setProperty("--lines", prev);
    else text.style.removeProperty("--lines");

    const lineH = parseFloat(getComputedStyle(text).lineHeight) || 24;
    const note = noteRef.current;
    const noteH = note ? note.offsetHeight + (parseFloat(getComputedStyle(note).marginTop) || 0) : 0;
    // A gomb-sor nélküli rendelkezésre álló magasság (a body magassága a gomb jelenlététől függ).
    const avail = body.clientHeight + (fitRef.current.more ? MORE_ROW : 0);

    const next: Fit =
      fullH + noteH <= avail + 1
        ? { more: false, lines: 999 }
        : { more: true, lines: Math.max(2, Math.floor((avail - MORE_ROW - noteH) / lineH)) };
    setFit((cur) => (cur.more === next.more && cur.lines === next.lines ? cur : next));
  }, []);

  useIsoLayoutEffect(() => {
    measure();
  }, [measure, item.text]);

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;
    let width = card.offsetWidth;
    const ro = new ResizeObserver(() => {
      if (card.offsetWidth !== width) {
        width = card.offsetWidth;
        measure();
      }
    });
    ro.observe(card);
    document.fonts?.ready.then(measure).catch(() => {});
    return () => ro.disconnect();
  }, [measure]);

  /** A kártya magasságát from → to px-re animálja (a magasság itt elfogadható: nincs transform-megfelelője). */
  const animateHeight = (el: HTMLElement, from: number, to: number, done: () => void) => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || Math.abs(from - to) < 2) {
      done();
      return;
    }
    busy.current = true;
    el.style.transition = "none";
    el.style.height = `${from}px`;
    void el.offsetHeight; // reflow: innen indul az átmenet
    el.style.transition = `height ${DURATION}ms var(--ease-out)`;
    el.style.height = `${to}px`;
    let finished = false;
    const finish = () => {
      if (finished) return;
      finished = true;
      el.removeEventListener("transitionend", onEnd);
      el.style.transition = "";
      busy.current = false;
      done();
    };
    const onEnd = (e: TransitionEvent) => {
      if (e.target === el && e.propertyName === "height") finish();
    };
    el.addEventListener("transitionend", onEnd);
    window.setTimeout(finish, DURATION + 120);
  };

  const toggle = () => {
    const el = cardRef.current;
    if (!el || busy.current) return;
    const from = el.offsetHeight;
    if (!expanded) {
      flushSync(() => setExpanded(true));
      el.style.height = "";
      const to = el.offsetHeight;
      animateHeight(el, from, to, () => {
        el.style.height = "";
      });
    } else {
      // Az összezárt magasságot a CSS adja (arány + min-height): kinyitott állapot nélkül lemérjük.
      el.removeAttribute("data-expanded");
      el.style.height = "";
      const to = el.offsetHeight;
      el.setAttribute("data-expanded", "");
      // Összezáráskor a teljes szöveg a mozgás végéig látszik, csak utána vágjuk újra.
      animateHeight(el, from, to, () => {
        flushSync(() => setExpanded(false));
        el.style.height = "";
        measure();
      });
    }
  };

  const { avatar } = item;

  return (
    <article ref={cardRef} className={styles.card} data-expanded={expanded ? "" : undefined}>
      <div className={styles.top}>
        {"src" in avatar ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img className={styles.avatar} src={avatar.src} alt="" width={56} height={56} loading="lazy" decoding="async" />
        ) : (
          <span className={styles.avatar} style={{ background: avatar.color }} aria-hidden="true">
            {avatar.letter}
          </span>
        )}
        <div className={styles.who}>
          <p className={styles.name}>{item.name}</p>
          <p className={styles.time}>{item.time}</p>
        </div>
        <span className={styles.g}>
          <GoogleG size={28} />
        </span>
      </div>

      <div className={styles.stars} role="img" aria-label={`${item.rating}/5`}>
        {Array.from({ length: item.rating }, (_, i) => (
          <Star key={i} size={24} />
        ))}
        <span className={styles.badge}>
          <VerifiedBadge size={22} />
        </span>
      </div>

      <div ref={bodyRef} className={styles.body}>
        <p
          ref={textRef}
          id={textId}
          className={styles.text}
          style={fit.lines != null ? ({ "--lines": expanded ? 999 : fit.lines } as React.CSSProperties) : undefined}
        >
          {item.text}
        </p>
        {item.note ? (
          <p ref={noteRef} className={styles.note}>
            {item.note}
          </p>
        ) : null}
      </div>

      {fit.more ? (
        <button type="button" className={styles.more} onClick={toggle} aria-expanded={expanded} aria-controls={textId}>
          {expanded ? less : more}
        </button>
      ) : null}
    </article>
  );
}
