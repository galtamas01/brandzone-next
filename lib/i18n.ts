export type Locale = "ro" | "hu" | "en";

export const LOCALES: readonly Locale[] = ["ro", "hu", "en"];

/**
 * Minden nyelv oldalainak útvonala. Ezek a régi oldal URL-jei, ne változtasd
 * meg őket SEO-ok miatt (Google-indexelés, külső linkek).
 */
export const ROUTES: Record<Locale, { home: string; policy: string; thanks: string; caseStudy: string }> = {
  ro: {
    home: "/",
    policy: "/policy/politica-de-confidentialitate",
    thanks: "/form-submit/multumim",
    caseStudy: "/studiu-de-caz/perfekt",
  },
  hu: {
    home: "/hu",
    policy: "/policy/adatvedelmi-tajekoztato",
    thanks: "/form-submit/koszonjuk",
    caseStudy: "/esettanulmany/perfekt",
  },
  en: {
    home: "/en",
    policy: "/policy/privacy-policy",
    thanks: "/form-submit/thank-you",
    caseStudy: "/case-study/perfekt",
  },
};

/** A Netlify-űrlap neve nyelvenként (a régi oldallal azonos, a beküldések egy helyen maradnak). */
export const FORM_NAMES: Record<Locale, string> = { ro: "form-ro", hu: "form-hu", en: "form-en" };

/** hreflang → URL párok egy adott oldaltípushoz. */
export function alternatesFor(page: "home" | "policy" | "caseStudy") {
  return {
    ro: ROUTES.ro[page],
    hu: ROUTES.hu[page],
    en: ROUTES.en[page],
    "x-default": ROUTES.ro[page],
  };
}
