import type { Metadata } from "next";
import { PowerSwitch } from "@/components/ui/PowerSwitch";
import { RollButton } from "@/components/ui/RollButton";
import "./globals.css";
import styles from "@/components/SubPage.module.css";

export const metadata: Metadata = {
  title: "404 | BRANDZONE",
  robots: { index: false, follow: false },
};

/** Saját 404-oldal mindhárom nyelvhez (nem tudjuk, melyik nyelvről jött a látogató). */
export default function GlobalNotFound() {
  return (
    <html lang="ro">
      <body>
        <main className={styles.thanks}>
          <img className={styles.thanksLogo} src="/img/logo-white.png" alt="BrandZone" width={762} height={346} />
          <h1 className={styles.thanksTitle}>
            <span>4<PowerSwitch autoOnAfter={null} />4</span>
          </h1>
          <p className={styles.thanksLead}>
            Pagina nu există. · Az oldal nem található. · Page not found.
          </p>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", justifyContent: "center" }}>
            <RollButton href="/" size="md">RO</RollButton>
            <RollButton href="/hu" size="md">HU</RollButton>
            <RollButton href="/en" size="md">EN</RollButton>
          </div>
        </main>
      </body>
    </html>
  );
}
