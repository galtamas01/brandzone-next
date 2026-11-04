import type { Dictionary } from "@/content/copy";
import { RollButton } from "@/components/ui/RollButton";
import { HeroShell, HeroSwitch } from "@/components/HeroShell";
import { ArrowDown } from "@/components/Icons";
import styles from "./Hero.module.css";

/** 1×1-es átlátszó GIF: a zöld festés helyére kerül, ha a látogató csökkentett mozgást kér (így az animált SVG le sem töltődik). */
const BLANK = "data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==";

export function Hero({ dict }: { dict: Dictionary }) {
  return (
    <HeroShell className={styles.hero} labelledBy="hero-title">
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
            <img
              className={styles.paint}
              src="/img/vonal-anim.svg"
              alt=""
              width={1024}
              height={1983}
              loading="eager"
              decoding="async"
            />
          </picture>
          {/* Visszakapcsoláskor villan fel: minden vonal zölden (csökkentett mozgásnál nincs). */}
          <picture>
            <source media="(prefers-reduced-motion: reduce)" srcSet={BLANK} />
            <img
              className={styles.flash}
              src="/img/vonal-flash.svg"
              alt=""
              width={1024}
              height={1983}
              loading="eager"
              decoding="async"
            />
          </picture>
        </div>

        {/* 1. réteg: olvashatóság */}
        <div className={styles.scrim} aria-hidden="true" />

        <div className={styles.content}>
          <div className={styles.titleCol}>
            <p className={`${styles.eyebrow} ${styles.in}`} style={{ "--d": "250ms" } as React.CSSProperties}>
              {dict.hero.eyebrow}
            </p>
            {/* A h1 nevét a sr-only szöveg adja, mert a sorban egy kezelhető kapcsoló is van. */}
            <h1 id="hero-title" className={styles.title} aria-labelledby="hero-title-text">
              <span id="hero-title-text" className="sr-only">
                BRANDS ON.
              </span>
              <span className={styles.line} aria-hidden="true">
                <span style={{ "--d": "300ms" } as React.CSSProperties}>Brands</span>
              </span>
              <span className={styles.line}>
                <span style={{ "--d": "420ms" } as React.CSSProperties}>
                  <HeroSwitch label={dict.hero.switchLabel} />
                  <span className={styles.words} aria-hidden="true">
                    <span className={styles.wordOn}>N.</span>
                    <span className={styles.wordOff}>FF.</span>
                  </span>
                </span>
              </span>
            </h1>
          </div>

          <div className={styles.side}>
            <div className={`${styles.leads} ${styles.in}`} style={{ "--d": "750ms" } as React.CSSProperties}>
              <p className={`${styles.lead} ${styles.leadOn}`}>
                {dict.hero.lead}
                {dict.hero.leadRest ? <span> {dict.hero.leadRest}</span> : null}
              </p>
              <p className={`${styles.lead} ${styles.leadOff}`}>
                {dict.hero.offLead} <span>{dict.hero.offHint}</span>
              </p>
            </div>
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
    </HeroShell>
  );
}
