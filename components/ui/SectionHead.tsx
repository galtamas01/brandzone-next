import type { ReactNode } from "react";
import styles from "./SectionHead.module.css";

type Props = {
  label: string;
  title: ReactNode;
  id?: string;
  tone?: "dark" | "light";
  aside?: ReactNode;
};

/** Szekciófejléc: címke sor és nagy cím, opcionális jobb oldali elemmel. */
export function SectionHead({ label, title, id, tone = "dark", aside }: Props) {
  return (
    <header className={`${styles.head} ${tone === "light" ? styles.light : ""}`}>
      <div>
        <p className={styles.label} data-reveal>
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
