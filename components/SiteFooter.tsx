import type { Dictionary } from "@/content/copy";
import { LOCALES, ROUTES, type Locale } from "@/lib/i18n";
import { SocialIcon } from "@/components/Icons";
import { BLOG_COPY } from "@/content/blog-copy";
import { indexPath } from "@/lib/blog-shared";
import styles from "./SiteFooter.module.css";

const SOCIAL_NAMES = { tiktok: "TikTok", instagram: "Instagram", facebook: "Facebook", youtube: "YouTube" };

export function SiteFooter({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const year = new Date().getFullYear(); // a build éve (minden deploy újragenerálja)

  return (
    <footer className={styles.footer}>
      <div className="container">
        <div className={styles.row}>
          <ul className={styles.socials}>
            {dict.footer.socials.map((s) => (
              <li key={s.network}>
                <a href={s.href} target="_blank" rel="noopener noreferrer" aria-label={SOCIAL_NAMES[s.network]}>
                  <SocialIcon network={s.network} size={20} />
                </a>
              </li>
            ))}
          </ul>

          <address className={styles.address}>
            <a href={`mailto:${dict.footer.email}`}>{dict.footer.email}</a>
          </address>

          <nav aria-label={dict.nav.language} className={styles.langs}>
            {LOCALES.map((l) => (
              <a key={l} href={ROUTES[l].home} hrefLang={l} lang={l} aria-current={l === locale ? "true" : undefined}>
                {l.toUpperCase()}
              </a>
            ))}
          </nav>
        </div>

        <div className={styles.legal}>
          <p>
            <strong>BRANDZONE</strong> © {year} · {dict.footer.location}
          </p>
          {locale === "hu" || locale === "ro" ? <a href={indexPath(locale)}>{BLOG_COPY[locale].nav}</a> : null}
          <a href={ROUTES[locale].policy}>{dict.footer.policy}</a>
          <a href="#top" className={styles.top}>
            {dict.footer.backToTop} ↑
          </a>
        </div>
      </div>
    </footer>
  );
}
