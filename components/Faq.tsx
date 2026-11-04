import type { Dictionary } from "@/content/copy";
import type { FaqItem } from "@/content/data";
import { SectionHead } from "@/components/ui/SectionHead";
import { Plus } from "@/components/Icons";
import styles from "./Faq.module.css";

/**
 * GYIK natív <details>/<summary> elemekkel: billentyűzettel, képernyőolvasóval
 * és JS nélkül is működik. A válaszok HTML-t tartalmazhatnak (listák) a data.json-ból.
 * A JSON-LD FAQPage jelölés a keresők számára is kiadja a kérdéseket.
 */
export function Faq({ dict, items }: { dict: Dictionary; items: FaqItem[] }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim() },
    })),
  };

  return (
    <section id="faq-title" className={styles.section} aria-labelledby="faq-heading">
      <div className={`container ${styles.grid}`}>
        <div className={styles.head}>
          <SectionHead label={dict.faq.label} title={dict.faq.title} id="faq-heading" />
        </div>
        <div className={styles.list}>
          {items.map((f, i) => (
            <details key={i} className={styles.item} data-reveal style={{ "--i": i } as React.CSSProperties}>
              <summary className={styles.question}>
                <span>{f.question}</span>
                <span className={styles.icon} aria-hidden="true">
                  <Plus size={18} />
                </span>
              </summary>
              <div className={styles.answer} dangerouslySetInnerHTML={{ __html: f.answer }} />
            </details>
          ))}
        </div>
      </div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </section>
  );
}
