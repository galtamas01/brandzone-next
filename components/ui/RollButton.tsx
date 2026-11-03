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
  /** A nyíl iránya: jobbra (alap) vagy lefelé (pl. „Referenciák"). */
  arrow?: "right" | "down";
};

/**
 * Pirula alakú gomb felgördülő felirattal és forduló nyíl-chippel
 * (MotionSites „text-roll button" recept, Emil-féle tokenekkel).
 * Linkként (href) vagy űrlap-gombként (type) is használható.
 */
export function RollButton({
  href,
  children,
  variant = "light",
  size = "md",
  type = "button",
  className = "",
  arrow = "right",
}: Props) {
  const cls = `${styles.btn} ${styles[variant]} ${styles[size]} ${className}`;
  const inner = (
    <>
      <span className={styles.label}>
        <span className={styles.roll}>
          <span>{children}</span>
          <span aria-hidden="true">{children}</span>
        </span>
      </span>
      <span className={styles.chip} aria-hidden="true">
        <ArrowRight size={16} className={arrow === "down" ? styles.down : undefined} />
      </span>
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
