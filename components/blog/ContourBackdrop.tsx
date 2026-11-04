import styles from "./ContourBackdrop.module.css";

/** 1×1-es átlátszó GIF: csökkentett mozgásnál a zöld festés helyére kerül (az animált SVG le sem töltődik). */
const BLANK = "data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==";

/**
 * A hero szintvonalai a blog fejlécében: ugyanaz a három kép (fehér alap, animált zöld festés,
 * csökkentett mozgásnál az eredeti zöld vonalas kép), halványabban és alul elfúvó maszkkal,
 * hogy a cím olvasható maradjon.
 */
export function ContourBackdrop() {
  return (
    <div className={styles.wrap} aria-hidden="true">
      <picture>
        <source media="(prefers-reduced-motion: reduce)" srcSet="/img/vonal-static.svg" />
        <img src="/img/vonal-base.svg" alt="" width={1024} height={1983} decoding="async" />
      </picture>
      <picture>
        <source media="(prefers-reduced-motion: reduce)" srcSet={BLANK} />
        <img src="/img/vonal-anim.svg" alt="" width={1024} height={1983} decoding="async" />
      </picture>
    </div>
  );
}
