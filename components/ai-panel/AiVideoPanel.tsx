"use client";

/**
 * Az „AI-támogatott videó" kártya képe helyén futó animáció: eredeti felvétel, begépelődő prompt, szkennelés
 * (autó + ruha), töltőképernyő, majd a generált videó. Csak akkor fut, ha a panel legalább 35%-ban látszik;
 * kigörgetéskor alaphelyzetbe áll. Csökkentett mozgásnál rögtön a kész állapotot mutatja.
 * A szövegek a content/copy.ts-ben vannak (services.aiPanel), nyelvenként; az időzítés lent, a TIMING-ban.
 * A szkennelő keretek helye az ai-panel.css-ben (.bzai-box--car, .bzai-box--outfit) a képhez igazodik: másik
 * kép esetén ezeket kell átírni.
 */

import { useEffect, useMemo, useRef } from "react";
import type { AiPanelCopy } from "@/content/copy";
import "./ai-panel.css";

const TIMING = { start: 400, char: 40, pause: 320, scan: 2400, load: 1900, hold: 6800 };

/** Állandó „véletlen" érték, így a szerver és a böngésző ugyanazt rendereli. */
function rnd(i: number, salt: number) {
  const x = Math.sin((i + 1) * 12.9898 + salt * 78.233) * 43758.5453;
  return x - Math.floor(x);
}

function createEngine(root: HTMLElement, s: AiPanelCopy) {
  const typedEl = root.querySelector<HTMLElement>(".bzai-typed")!;
  const btnLabel = root.querySelector<HTMLElement>(".bzai-btn-label")!;
  const chip = root.querySelector<HTMLElement>(".bzai-chip")!;
  const pctEl = root.querySelector<HTMLElement>(".bzai-pct")!;
  const video = root.querySelector<HTMLVideoElement>(".bzai-video")!;
  let timers: ReturnType<typeof setTimeout>[] = [];
  let raf = 0;
  let running = false;

  const later = (fn: () => void, ms: number) => {
    timers.push(setTimeout(fn, ms));
  };
  const clearAll = () => {
    timers.forEach(clearTimeout);
    timers = [];
    cancelAnimationFrame(raf);
  };
  const setPhase = (p: string) => root.setAttribute("data-phase", p);

  const count = (from: number, to: number, dur: number, onValue: (v: number) => void) => {
    const t0 = performance.now();
    const tick = (now: number) => {
      const k = Math.min(1, (now - t0) / dur);
      onValue(Math.round(from + (to - from) * k));
      if (k < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
  };

  const reset = () => {
    setPhase("typing");
    typedEl.textContent = "";
    btnLabel.textContent = s.btn.idle;
    chip.textContent = s.chip.orig;
    pctEl.textContent = "0%";
    video.pause();
  };

  const reveal = () => {
    cancelAnimationFrame(raf);
    setPhase("revealed");
    chip.textContent = s.chip.done;
    btnLabel.textContent = s.btn.done;
    video.currentTime = 0;
    // Ha a böngésző nem engedi az automatikus indítást (pl. energiatakarékos mód), a poszter marad.
    video.play().catch(() => {});
    later(cycle, TIMING.hold);
  };

  const load = () => {
    setPhase("loading");
    chip.textContent = s.chip.load;
    count(35, 100, TIMING.load, (v) => {
      pctEl.textContent = v + "%";
      btnLabel.textContent = s.btn.load + " " + v + "%";
    });
    later(reveal, TIMING.load);
  };

  const scan = () => {
    setPhase("scanning");
    btnLabel.textContent = s.btn.scan;
    later(load, TIMING.scan);
  };

  function cycle() {
    clearAll();
    reset();
    let i = 0;
    const type = () => {
      i += 1;
      typedEl.textContent = s.prompt.slice(0, i);
      if (i < s.prompt.length) later(type, TIMING.char);
      else later(scan, TIMING.pause);
    };
    later(type, TIMING.start);
  }

  return {
    start() {
      if (running) return;
      running = true;
      cycle();
    },
    stop() {
      running = false;
      clearAll();
      reset();
    },
    showFinal() {
      clearAll();
      setPhase("revealed");
      typedEl.textContent = s.prompt;
      btnLabel.textContent = s.btn.done;
      chip.textContent = s.chip.done;
    },
    destroy() {
      running = false;
      clearAll();
    },
  };
}

type Props = {
  copy: AiPanelCopy;
  before?: string;
  video?: string;
  poster?: string;
};

export function AiVideoPanel({
  copy: s,
  before = "/img/services/ai/eredeti.webp",
  video = "/img/services/ai/video.mp4",
  poster = "/img/services/ai/poster.webp",
}: Props) {
  const rootRef = useRef<HTMLDivElement>(null);

  const cells = useMemo(
    () =>
      Array.from({ length: 180 }, (_, i) => ({
        "--d": (rnd(i, 1) * 1.2).toFixed(2) + "s",
        "--s": (rnd(i, 2) * 0.9).toFixed(2) + "s",
      })) as React.CSSProperties[],
    [],
  );

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    root.style.setProperty("--bzai-scan", TIMING.scan + "ms");
    root.style.setProperty("--bzai-load", TIMING.load + "ms");
    const engine = createEngine(root, s);

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || !("IntersectionObserver" in window)) {
      engine.showFinal();
      return () => engine.destroy();
    }
    // Csak akkor fut, amikor a panel látszik; kigörgetéskor alaphelyzetbe áll.
    const io = new IntersectionObserver(
      (entries) => entries.forEach((en) => (en.isIntersecting ? engine.start() : engine.stop())),
      { threshold: 0.35 },
    );
    io.observe(root);
    return () => {
      io.disconnect();
      engine.destroy();
    };
  }, [s]);

  return (
    <div ref={rootRef} className="bzai" data-phase="typing">
      <div className="bzai-inner">
        <div className="bzai-prompt">
          <div className="bzai-head">
            <span className="bzai-label">PROMPT</span>
            <span className="bzai-badge">AI</span>
          </div>
          <p className="bzai-text">
            {/* Láthatatlan, a teljes prompttal: ez foglalja le a helyet, így a gépelés közben nem ugrál a méret. */}
            <span className="bzai-sizer" aria-hidden="true">
              {s.prompt}
            </span>
            <span className="bzai-live">
              <span className="bzai-typed"></span>
              <span className="bzai-caret" aria-hidden="true"></span>
            </span>
          </p>
          <div className="bzai-row">
            <div className="bzai-bar">
              <i></i>
            </div>
            <span className="bzai-btn" aria-hidden="true">
              <span className="bzai-spin"></span>
              <span className="bzai-btn-label">{s.btn.idle}</span>
            </span>
          </div>
        </div>

        <div className="bzai-media">
          <img className="bzai-before" src={before} alt={s.altBefore} width={1280} height={714} loading="lazy" decoding="async" />
          <video
            className="bzai-video"
            src={video}
            poster={poster}
            muted
            loop
            playsInline
            preload="metadata"
            aria-label={s.altVideo}
          />

          <div className="bzai-scan" aria-hidden="true">
            <div className="bzai-dim"></div>
            <div className="bzai-box bzai-box--car">
              <div className="bzai-beam"></div>
            </div>
            <span className="bzai-tag bzai-tag--car">{s.tagCar}</span>
            <div className="bzai-box bzai-box--outfit">
              <div className="bzai-beam"></div>
            </div>
            <span className="bzai-tag bzai-tag--outfit">{s.tagOutfit}</span>
            <span className="bzai-status">
              <i></i>
              {s.status}
            </span>
          </div>

          <div className="bzai-grid" aria-hidden="true">
            {cells.map((style, i) => (
              <span key={i} className="bzai-cell" style={style}></span>
            ))}
          </div>

          <div className="bzai-load" aria-hidden="true">
            <span className="bzai-load-spin"></span>
            <span className="bzai-pct">0%</span>
            <span className="bzai-load-label">{s.loading}</span>
          </div>

          <div className="bzai-sweep" aria-hidden="true"></div>
          <span className="bzai-chip">{s.chip.orig}</span>
        </div>
      </div>
    </div>
  );
}
