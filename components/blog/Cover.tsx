"use client";

import { useEffect, useRef } from "react";
import styles from "./Cover.module.css";
import "./cover-art.css";

/**
 * Cikkborító. Ha a cikk mappájában van cover.svg, az az egyedi grafika jelenik meg (változatlanul,
 * a saját fehér vonalaival és animációival). Ha nincs, a slugból generált szintvonal-minta lép a helyére
 * (determinisztikus, így új cikkhez nem kell borítót rajzolni): kilenc fehér vonal egy domb körül.
 *
 * Hoverra a borító minden vonalán végigfut egy zöld vonal. Ehhez betöltéskor minden vonalas alakzatról
 * készül egy másolat (.bz-trace), közvetlenül az eredeti mögé. A másolat ugyanazt az osztályt és animációt
 * kapja, így követi az eredeti mozgását (billenő mérleg, felbukkanó buborékok). A zöld rajzolás a
 * stroke-dashoffset átmenete, amit a kártya hoverja (PostCard.module.css) indít el.
 */

const TRACEABLE = "path, line, circle, rect, ellipse, polyline, polygon";

/** Ennél halványabb vonalat nem rajzolunk zölddel (a rács 0.03, a kamera-ikon 0.08–0.1, a főbb vonalak 0.15 fölött vannak). */
const MIN_ALPHA = 0.12;

/** A vonal tényleges átlátszatlansága: a szín alfája szorozva a stroke-opacity-vel. */
function strokeAlpha(cs: CSSStyleDeclaration) {
  const m = cs.stroke.match(/rgba?\(([^)]+)\)/);
  const parts = m ? m[1].split(/[,/\s]+/).filter(Boolean) : [];
  const colorAlpha = parts.length > 3 ? parseFloat(parts[3]) : 1;
  const strokeOpacity = parseFloat(cs.strokeOpacity);
  return (
    (Number.isNaN(colorAlpha) ? 1 : colorAlpha) *
    (Number.isNaN(strokeOpacity) ? 1 : strokeOpacity)
  );
}

function addTraces(root: HTMLElement) {
  if (root.dataset.traced) return;
  root.dataset.traced = "1";
  const shapes = Array.from(
    root.querySelectorAll<SVGGeometryElement>(TRACEABLE),
  );
  for (const el of shapes) {
    if (el.closest("defs, clipPath, mask, pattern, symbol, marker")) continue;
    const cs = getComputedStyle(el);
    if (cs.stroke === "none" || parseFloat(cs.strokeWidth) === 0) continue;
    // A nagyon halvány vonalak (rács, finom részletek) háttérként szolgálnak, azok nem lesznek zöldek.
    if (strokeAlpha(cs) < MIN_ALPHA) continue;
    const clone = el.cloneNode(false) as SVGGeometryElement;
    clone.removeAttribute("id");
    clone.setAttribute("pathLength", "1");
    clone.setAttribute("aria-hidden", "true");
    clone.classList.add("bz-trace");
    el.after(clone);
  }
}

const W = 400;
const H = 260;
const LINES = 9;
const STEP = 20; // vízszintes mintavétel (px)

/** Gyors, determinisztikus véletlen (mulberry32). */
function rng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function hash(s: string) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++)
    h = Math.imul(h ^ s.charCodeAt(i), 16777619);
  return h >>> 0;
}

/** Pontokból sima görbe (Catmull-Rom → köbös Bézier). */
function smooth(pts: [number, number][]) {
  const f = (n: number) => n.toFixed(1);
  let d = `M${f(pts[0][0])} ${f(pts[0][1])}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] ?? pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] ?? p2;
    const c1: [number, number] = [
      p1[0] + (p2[0] - p0[0]) / 6,
      p1[1] + (p2[1] - p0[1]) / 6,
    ];
    const c2: [number, number] = [
      p2[0] - (p3[0] - p1[0]) / 6,
      p2[1] - (p3[1] - p1[1]) / 6,
    ];
    d += ` C${f(c1[0])} ${f(c1[1])} ${f(c2[0])} ${f(c2[1])} ${f(p2[0])} ${f(p2[1])}`;
  }
  return d;
}

function buildPaths(seed: string) {
  const r = rng(hash(seed));
  const amp1 = 16 + r() * 16;
  const amp2 = 6 + r() * 8;
  const f1 = 0.009 + r() * 0.008;
  const f2 = 0.021 + r() * 0.012;
  const ph1 = r() * Math.PI * 2;
  const ph2 = r() * Math.PI * 2;
  // A „domb": egy csúcs, amely a vonalakat felfelé tolja
  const hillX = 90 + r() * 220;
  const hillRow = 2 + r() * (LINES - 5);
  const hillH = 42 + r() * 36;
  const hillSx = 55 + r() * 45;
  const hillSr = 1.5 + r() * 1.4;

  const paths: string[] = [];
  for (let i = 0; i < LINES; i++) {
    const base = H * 0.1 + (i * H * 0.8) / (LINES - 1);
    const pts: [number, number][] = [];
    for (let x = -STEP; x <= W + STEP; x += STEP) {
      const wave =
        amp1 * Math.sin(x * f1 + ph1 + i * 0.28) +
        amp2 * Math.sin(x * f2 + ph2 - i * 0.4);
      const hill =
        hillH *
        Math.exp(
          -((x - hillX) ** 2) / (2 * hillSx ** 2) -
            (i - hillRow) ** 2 / (2 * hillSr ** 2),
        );
      pts.push([x, base + wave - hill]);
    }
    paths.push(smooth(pts));
  }
  return paths;
}

export function Cover({ seed, svg }: { seed: string; svg?: string | null }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (ref.current) addTraces(ref.current);
  }, []);

  // A cover.svg a saját, megbízható tartalmunk (a repóban van), ezért közvetlenül beágyazzuk.
  if (svg)
    return (
      <div
        ref={ref}
        className={styles.art}
        dangerouslySetInnerHTML={{ __html: svg }}
      />
    );

  const paths = buildPaths(seed);
  return (
    <div ref={ref} className={styles.art}>
      <svg
        className={styles.cover}
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
        focusable="false"
      >
        <g className={styles.lines}>
          {paths.map((d, i) => (
            <path key={i} d={d} />
          ))}
        </g>
      </svg>
    </div>
  );
}
