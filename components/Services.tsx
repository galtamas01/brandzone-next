import type { Dictionary } from "@/content/copy";
import { SectionHead } from "@/components/ui/SectionHead";
import { ServiceIcon } from "@/components/Icons";
import styles from "./Services.module.css";

/**
 * Szolgáltatások egy világos „papír" lapon. Desktopon a kártyák sticky-k és
 * egymásra csúsznak görgetéskor (csak CSS, nincs JS); mobilon egyszerűen egymás alatt.
 */
export function Services({ dict }: { dict: Dictionary }) {
  const total = String(dict.services.items.length).padStart(2, "0");

  return (
    <section id="szolgaltatasok" className={styles.sheet} aria-labelledby="services-title">
      <div className="container">
        <SectionHead index="03" label={dict.services.label} title={dict.services.title} id="services-title" tone="light" />

        <ol className={styles.stack}>
          {dict.services.items.map((s, i) => (
            <li key={s.id} className={styles.slot} style={{ "--i": i } as React.CSSProperties}>
              <article className={styles.card} aria-labelledby={`service-${s.id}`}>
                <div className={styles.text}>
                  <p className={styles.count}>
                    {String(i + 1).padStart(2, "0")} <span>/ {total}</span>
                  </p>
                  <h3 id={`service-${s.id}`} className={styles.title}>
                    {s.title.map((part, k) =>
                      part.accent ? (
                        <em key={k} className={styles.accent}>
                          {part.text}
                        </em>
                      ) : (
                        <span key={k}>{part.text}</span>
                      ),
                    )}
                  </h3>
                  <p className={styles.body}>{s.body}</p>
                  <ul className={styles.bullets}>
                    {s.bullets.map((b) => (
                      <li key={b.text}>
                        <span className={styles.icon}>
                          <ServiceIcon name={b.icon} size={18} />
                        </span>
                        {b.text}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className={styles.visual} data-bleed={s.image.bleed || undefined}>
                  <img
                    src={s.image.src}
                    alt={s.image.alt}
                    width={s.image.width}
                    height={s.image.height}
                    loading="lazy"
                    decoding="async"
                  />
                </div>
              </article>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
