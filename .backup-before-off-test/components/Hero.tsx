import type { Dictionary } from "@/content/copy";
import { RollButton } from "@/components/ui/RollButton";
import { PowerSwitch } from "@/components/ui/PowerSwitch";
import { ArrowDown } from "@/components/Icons";
import styles from "./Hero.module.css";

/** 1×1-es átlátszó GIF: a zöld festés helyére kerül, ha a látogató csökkentett mozgást kér (így az animált SVG le sem töltődik). */
const BLANK = "data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==";

export function Hero({ dict }: { dict: Dictionary }) {
  return (
    <section className={styles.hero} aria-labelledby="hero-title">
      <div className={styles.frame}>
        {/* 0. réteg: a régi oldal szintvonalai. Két egymásra tett kép: a fehér alap és az animált zöld
            festés (a fejlesztői leírás a scripts/build-vonal.py-ban). Csökkentett mozgásnál az alap helyére
            az eredeti, öt zöld vonalas kép kerül, a festés helyére pedig egy átlátszó pixel. */}
        <div className={styles.lines} aria-hidden="true">
          <picture>
            <source media="(prefers-reduced-motion: reduce)" srcSet="/img/vonal-static.svg" />
            <img src="/img/vonal-base.svg" alt="" width={1024} height={1983} loading="eager" decoding="async" />
          </picture>
          <picture>
            <source media="(prefers-reduced-motion: reduce)" srcSet={BLANK} />
            <img src="/img/vonal-anim.svg" alt="" width={1024} height={1983} loading="eager" decoding="async" />
          </picture>
        </div>

        {/* 1. réteg: olvashatóság */}
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
              <RollButton href="#arajanlat" size="lg" chip={false}>
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
