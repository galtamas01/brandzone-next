import fs from "node:fs";
import path from "node:path";
import { getDictionary } from "@/content/copy";
import { ROUTES, type Locale } from "@/lib/i18n";
import { ArrowRight } from "@/components/Icons";
import styles from "./SubPage.module.css";

/**
 * Adatvédelmi tájékoztató. A szöveg a content/policy/<nyelv>.html fájlban van
 * (a régi oldalról átvéve), build közben olvassuk be – jogi szövegnél így egy helyen
 * javítható, kódot nem kell hozzá érinteni.
 */
export function PolicyPage({ locale }: { locale: Locale }) {
  const d = getDictionary(locale);
  const html = fs.readFileSync(path.join(process.cwd(), "content", "policy", `${locale}.html`), "utf8");

  return (
    <>
      <header className={styles.bar}>
        <a href={ROUTES[locale].home} className={styles.logo} aria-label={d.nav.home}>
          <img src="/img/logo-white.png" alt="BrandZone" width={762} height={346} />
        </a>
        <a href={ROUTES[locale].home} className={styles.back}>
          <ArrowRight size={16} className={styles.backIcon} />
          {d.policy.back}
        </a>
      </header>
      <main id="main" className={styles.policyMain}>
        <article className={styles.prose} dangerouslySetInnerHTML={{ __html: html }} />
      </main>
    </>
  );
}
