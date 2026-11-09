import type { ReviewsCopy } from "@/content/copy";
import { ReviewCard } from "@/components/ReviewCard";
import styles from "./ReviewCards.module.css";

/**
 * Google-értékelések: alacsony kártyák, fejléc nélkül. Desktopon három egymás mellett,
 * telefonon/tableten a videókhoz hasonló, scroll-snapes vízszintes sáv.
 */
export function ReviewCards({ copy }: { copy: ReviewsCopy }) {
  return (
    <div className={styles.block}>
      <ul className={styles.list} aria-label={copy.title}>
        {copy.items.map((item, i) => (
          <li key={item.name} className={styles.item} data-reveal style={{ "--i": Math.min(i, 4) } as React.CSSProperties}>
            <ReviewCard item={item} more={copy.more} less={copy.less} />
          </li>
        ))}
      </ul>
    </div>
  );
}
