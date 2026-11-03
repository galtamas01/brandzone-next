import type { Dictionary } from "@/content/copy";
import { TEAM, TEAM_PHOTO } from "@/content/team";
import { SectionHead } from "@/components/ui/SectionHead";
import { Rail } from "@/components/ui/Rail";
import { LinkedIn } from "@/components/Icons";
import styles from "./Team.module.css";

export function Team({ dict }: { dict: Dictionary }) {
  return (
    <section id="rolunk" className={styles.section} aria-labelledby="team-title">
      <div className="container">
        <div className={styles.intro}>
          <div className={styles.copy}>
            <SectionHead index="04" label={dict.team.label} title={dict.team.title} id="team-title" />
            <div className={styles.paragraphs}>
              {dict.team.paragraphs.map((p, i) => (
                <p key={i} data-reveal style={{ "--i": i } as React.CSSProperties}>
                  {p}
                </p>
              ))}
            </div>
          </div>
          <figure className={styles.photo} data-reveal>
            <img
              src={TEAM_PHOTO.src}
              alt={dict.team.groupAlt}
              width={TEAM_PHOTO.width}
              height={TEAM_PHOTO.height}
              loading="lazy"
              decoding="async"
            />
          </figure>
        </div>
      </div>

      <Rail label={dict.team.title} prevLabel={dict.team.prev} nextLabel={dict.team.next}>
        {TEAM.map((m, i) => (
          <li key={m.name} className={styles.member} data-reveal style={{ "--i": Math.min(i, 4) } as React.CSSProperties}>
            <div className={styles.portrait}>
              <img src={m.photo} alt={m.name} width={640} height={768} loading="lazy" decoding="async" />
              {m.linkedin ? (
                <a
                  href={m.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.linkedin}
                  aria-label={`${dict.team.linkedin}: ${m.name}`}
                >
                  <LinkedIn size={16} />
                </a>
              ) : null}
            </div>
            <h3 className={styles.name}>{m.name}</h3>
            <p className={styles.role}>{m.role}</p>
          </li>
        ))}
      </Rail>
    </section>
  );
}
