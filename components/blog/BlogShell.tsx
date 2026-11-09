import type { ReactNode } from "react";
import { getDictionary } from "@/content/copy";
import { ROUTES, type Locale } from "@/lib/i18n";
import { indexPath } from "@/lib/blog-shared";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { CookieBanner } from "@/components/CookieBanner";
import { RevealObserver } from "@/components/RevealObserver";
import { Tracking } from "@/components/Tracking";

/**
 * A blog oldalainak közös váza (menü, lábléc, süti-sáv, mérőkódok).
 * A nyelvváltó a blogban a másik nyelv blogcímlapjára, az EN pedig a főoldalra visz,
 * mert a magyar és a román cikkek önálló tartalmak, nem egymás fordításai.
 * Más aloldal (pl. az esettanulmány) is használhatja: a `langHrefs` felülírja a nyelvváltó céljait,
 * a `current={null}` pedig kikapcsolja a „Blog" menüpont kiemelését.
 */
export function BlogShell({
  lang,
  children,
  jsonLd = [],
  langHrefs = { hu: indexPath("hu"), ro: indexPath("ro") },
  current = "blog",
}: {
  lang: Locale;
  children: ReactNode;
  jsonLd?: object[];
  langHrefs?: Partial<Record<Locale, string>>;
  current?: "blog" | null;
}) {
  const dict = getDictionary(lang);
  return (
    <>
      <SiteHeader
        locale={lang}
        dict={dict}
        subpage
        current={current ?? undefined}
        langHrefs={langHrefs}
      />
      <main id="main">{children}</main>
      <SiteFooter locale={lang} dict={dict} />
      <CookieBanner dict={dict} policyHref={ROUTES[lang].policy} />
      <RevealObserver />
      <Tracking meta />
      {jsonLd.map((data, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
      ))}
    </>
  );
}
