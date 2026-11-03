import { getDictionary } from "@/content/copy";
import { ROUTES, type Locale } from "@/lib/i18n";
import { PowerSwitch } from "@/components/ui/PowerSwitch";
import { RollButton } from "@/components/ui/RollButton";
import { CookieBanner } from "@/components/CookieBanner";
import { Tracking } from "@/components/Tracking";
import styles from "./SubPage.module.css";

/** Köszönőoldal az űrlap beküldése után (a Netlify Forms ide irányít). */
export function ThanksPage({ locale }: { locale: Locale }) {
  const d = getDictionary(locale);

  return (
    <>
      <main id="main" className={styles.thanks}>
        <img className={styles.thanksLogo} src="/img/logo-white.png" alt="BrandZone" width={762} height={346} />
        <h1 className={styles.thanksTitle}>
          <span className={styles.switch} aria-hidden="true">
            <PowerSwitch autoOnAfter={500} />
          </span>
          {d.thanks.title}
        </h1>
        <p className={styles.thanksLead}>{d.thanks.lead}</p>
        <RollButton href={ROUTES[locale].home} size="lg">
          {d.thanks.back}
        </RollButton>
      </main>
      <p className={styles.thanksFoot}>BRANDZONE © {new Date().getFullYear()} · Romania · Odorheiu Secuiesc</p>
      <CookieBanner dict={d} policyHref={ROUTES[locale].policy} />
      <Tracking openAiEvent="lead_created" />
    </>
  );
}
