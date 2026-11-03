import type { Dictionary } from "@/content/copy";
import { getAllVideoIds } from "@/content/data";
import { HERO_VIDEO } from "@/lib/site";
import { RollButton } from "@/components/ui/RollButton";
import { PowerSwitch } from "@/components/ui/PowerSwitch";
import { HeroVideo } from "@/components/HeroVideo";
import { ArrowDown } from "@/components/Icons";
import styles from "./Hero.module.css";

const COLUMNS = 6;

/** A poszterfal oszlopai: a referencia-poszterek körbeforgatva, hogy minden oszlop más legyen. */
function wallColumns(ids: string[]) {
  const perCol = 4;
  return Array.from({ length: COLUMNS }, (_, c) =>
    Array.from({ length: perCol }, (_, r) => ids[(c * 3 + r * 5) % ids.length]),
  );
}

export function Hero({ dict }: { dict: Dictionary }) {
  const columns = wallColumns(getAllVideoIds());

  return (
    <section className={styles.hero} aria-labelledby="hero-title">
      <div className={styles.frame}>
        {/* 0. réteg: poszterfal – azonnal látszik, és ez a fallback, ha a videó nem tölt be */}
        <div className={styles.wall} aria-hidden="true">
          {columns.map((col, c) => (
            <div key={c} className={styles.col}>
              {col.map((id, r) => (
                <img key={r} src={`/img/wall/${id}.webp`} alt="" width={240} height={427} loading="eager" decoding="async" />
              ))}
            </div>
          ))}
        </div>

        {/* 1. réteg: háttérvideó, betöltés után beúszik */}
        <HeroVideo src={HERO_VIDEO} className={styles.video} />

        {/* 2. réteg: olvashatóság */}
        <div className={styles.scrim} aria-hidden="true" />

        <div className={styles.content}>
          <div className={styles.titleCol}>
            <p className={`${styles.eyebrow} ${styles.in}`} style={{ "--d": "250ms" } as React.CSSProperties}>
              <span className={styles.dot} aria-hidden="true" />
              {dict.hero.eyebrow}
            </p>
            <h1 id="hero-title" className={styles.title}>
              <span className="sr-only">BRANDS ON.</span>
              <span className={styles.line} aria-hidden="true">
                <span style={{ "--d": "300ms" } as React.CSSProperties}>Brands</span>
              </span>
              <span className={styles.line} aria-hidden="true">
                <span style={{ "--d": "420ms" } as React.CSSProperties}>
                  <PowerSwitch autoOnAfter={1150} />N.
                </span>
              </span>
            </h1>
          </div>

          <div className={styles.side}>
            <p className={`${styles.lead} ${styles.in}`} style={{ "--d": "750ms" } as React.CSSProperties}>
              {dict.hero.lead}
              {dict.hero.leadRest ? <span> {dict.hero.leadRest}</span> : null}
            </p>
            <div className={`${styles.actions} ${styles.in}`} style={{ "--d": "900ms" } as React.CSSProperties}>
              <RollButton href="#arajanlat" size="lg">
                {dict.hero.cta}
              </RollButton>
              <a href="#referenciak" className={styles.secondary}>
                {dict.hero.secondary}
                <ArrowDown size={16} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
