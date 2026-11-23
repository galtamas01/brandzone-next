import type { Partner } from "@/content/data";
import type { Dictionary } from "@/content/copy";
import { SectionHead } from "@/components/ui/SectionHead";
import styles from "./Clients.module.css";

type Props = { dict: Dictionary; partners: Partner[] };

/** Egy csoportban ennyiszer ismétlődik a sor, hogy széles (2560px) kijelzőn se maradjon hézag. */
const REPEAT = 3;

function Logo({ p, hidden = false }: { p: Partner; hidden?: boolean }) {
  return (
    <a
      href={p.url}
      target="_blank"
      rel="noopener noreferrer"
      className={styles.logo}
      tabIndex={hidden ? -1 : undefined}
      aria-hidden={hidden || undefined}
    >
      <img src={p.img} alt={hidden ? "" : p.alt} width={84} height={84} loading="lazy" decoding="async" />
    </a>
  );
}

/**
 * Partnerlogók két, ellentétes irányba futó sorban.
 * A sáv két azonos csoportot tartalmaz és -50%-ig csúszik, így nincs illesztési hézag.
 * A második csoport aria-hidden, a képernyőolvasó csak egyszer olvassa fel a listát.
 */
export function Clients({ dict, partners }: Props) {
  const half = Math.ceil(partners.length / 2);
  const rows = [partners.slice(0, half), partners.slice(half)];

  return (
    <section className={styles.section} aria-labelledby="clients-title">
      <div className="container">
        <SectionHead label={dict.clients.label} title={dict.clients.title} id="clients-title" />
      </div>

      <div className={styles.marquees}>
        {rows.map((row, r) => (
          <div
            key={r}
            className={styles.marquee}
            data-reverse={r % 2 === 1 || undefined}
            style={{ "--dur": `${row.length * REPEAT * 2.6}s` } as React.CSSProperties}
          >
            <div className={styles.track}>
              {[0, 1].map((copy) => (
                <ul key={copy} className={styles.group} aria-hidden={copy === 1 || undefined}>
                  {Array.from({ length: REPEAT }, () => row)
                    .flat()
                    .map((p, i) => (
                      <li key={p.img + i}>
                        <Logo p={p} hidden={copy === 1 || i >= row.length} />
                      </li>
                    ))}
                </ul>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
