import type { ReactNode } from "react";
import { ArrowRight } from "@/components/Icons";
import styles from "./RollButton.module.css";

type Props = {
  href?: string;
  children: ReactNode;
  variant?: "light" | "green";
  size?: "sm" | "md" | "lg";
  type?: "submit" | "button";
  className?: string;
  /** Zöld (vagy fehér) kör nyíllal a gomb végén. Az ajánlatkérő CTA-kon (menü, hero) kikapcsolva. */
  chip?: boolean;
  /** A nyíl iránya: jobbra (alap) vagy lefelé. */
  arrow?: "right" | "down";
};

/**
 * Pirula alakú gomb. Hoverre csak kicsit megnő (a `--hover-scale` tokent a globals.css adja),
 * lenyomáskor összenyomódik. Linkként (href) vagy űrlap-gombként (type) is használható.
 * A név a korábbi „felgördülő feliratú" változatból maradt, hogy a használata ne változzon.
 */
export function RollButton({
  href,
  children,
  variant = "light",
  size = "md",
  type = "button",
  className = "",
  chip = true,
  arrow = "right",
}: Props) {
  const cls = `${styles.btn} ${styles[variant]} ${styles[size]} ${chip ? "" : styles.plain} ${className}`;
  const inner = (
    <>
      <span className={styles.label}>{children}</span>
      {chip ? (
        <span className={styles.chip} aria-hidden="true">
          <ArrowRight size={16} className={arrow === "down" ? styles.down : undefined} />
        </span>
      ) : null}
    </>
  );

  if (href) {
    return (
      <a href={href} className={cls}>
        {inner}
      </a>
    );
  }
  return (
    <button type={type} className={cls}>
      {inner}
    </button>
  );
}
