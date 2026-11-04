import type { ReactNode } from "react";
import { getDictionary } from "@/content/copy";
import { ROUTES } from "@/lib/i18n";
import { indexPath, type BlogLang } from "@/lib/blog-shared";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { CookieBanner } from "@/components/CookieBanner";
import { RevealObserver } from "@/components/RevealObserver";
import { Tracking } from "@/components/Tracking";

/**
 * A blog oldalainak közös váza (menü, lábléc, süti-sáv, mérőkódok).
 * A nyelvváltó a blogban a másik nyelv blogcímlapjára, az EN pedig a főoldalra visz,
 * mert a magyar és a román cikkek önálló tartalmak, nem egymás fordításai.
 */
export function BlogShell({
  lang,
  children,
  jsonLd = [],
}: {
  lang: BlogLang;
  children: ReactNode;
  jsonLd?: object[];
}) {
  const dict = getDictionary(lang);
  return (
    <>
      <SiteHeader
        locale={lang}
        dict={dict}
        subpage
        current="blog"
        langHrefs={{ hu: indexPath("hu"), ro: indexPath("ro") }}
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
