import { RollButton } from "@/components/ui/RollButton";
import { ROUTES, type Locale } from "@/lib/i18n";
import styles from "./BlogCta.module.css";

type Props = {
  locale: Locale;
  title: string;
  /** Szerzői HTML lehet (pl. <strong>, <a>), a meta.json-ból érkezik. */
  text: string;
  button: string;
};

/** Zárókártya: a cikk végén árajánlatkérés, a címlapon kapcsolatfelvétel (a főoldali űrlapra mutat). */
export function BlogCta({ locale, title, text, button }: Props) {
  return (
    <section className={styles.cta} data-reveal>
      <div className={styles.copy}>
        <h2 className={styles.title}>{title}</h2>
        <p className={styles.text} dangerouslySetInnerHTML={{ __html: text }} />
      </div>
      <RollButton href={`${ROUTES[locale].home}#arajanlat`} size="lg" chip={false} variant="green">
        {button}
      </RollButton>
    </section>
  );
}
