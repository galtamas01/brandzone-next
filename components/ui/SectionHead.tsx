import type { ReactNode } from "react";
import styles from "./SectionHead.module.css";

type Props = {
  index: string;
  label: string;
  title: ReactNode;
  id?: string;
  tone?: "dark" | "light";
  aside?: ReactNode;
};

/** Szekciófejléc: „01 — Címke" sor és nagy cím, opcionális jobb oldali elemmel. */
export function SectionHead({ index, label, title, id, tone = "dark", aside }: Props) {
  return (
    <header className={`${styles.head} ${tone === "light" ? styles.light : ""}`}>
      <div>
        <p className={styles.label} data-reveal>
          <span className={styles.index}>{index}</span>
          <span className={styles.rule} aria-hidden="true" />
          {label}
        </p>
        <h2 id={id} className={styles.title} data-reveal style={{ "--i": 1 } as React.CSSProperties}>
          {title}
        </h2>
      </div>
      {aside ? (
        <div className={styles.aside} data-reveal style={{ "--i": 2 } as React.CSSProperties}>
          {aside}
        </div>
      ) : null}
    </header>
  );
}
