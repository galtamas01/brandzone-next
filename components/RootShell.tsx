import type { ReactNode } from "react";
import { getDictionary } from "@/content/copy";
import type { Locale } from "@/lib/i18n";
import "@/app/globals.css";

/**
 * A három nyelvi „root layout" közös váza. Azért kell nyelvenként külön root layout
 * (app/(ro), app/(hu), app/(en)), mert a <html lang> attribútumnak oldalanként
 * helyesnek kell lennie, a régi URL-ek (/, /hu, /en) pedig nem kaphatnak nyelvi előtagot.
 */
export function RootShell({ locale, children }: { locale: Locale; children: ReactNode }) {
  const d = getDictionary(locale);
  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        {/* A görgetésre megjelenő elemeket csak akkor rejtjük el, ha a JS fut. */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
        <link rel="alternate" type="text/plain" title="llms.txt" href="/llms.txt" />
      </head>
      <body id="top">
        <a className="skip-link" href="#main">
          {d.nav.skip}
        </a>
        {children}
        <div className="page-grain" aria-hidden="true" />
      </body>
    </html>
  );
}
