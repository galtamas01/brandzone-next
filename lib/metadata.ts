import type { Metadata, Viewport } from "next";
import { getDictionary } from "@/content/copy";
import { alternatesFor, ROUTES, type Locale } from "@/lib/i18n";
import { GOOGLE_SITE_VERIFICATION, SITE_URL } from "@/lib/site";

const OG_LOCALE: Record<Locale, string> = { ro: "ro_RO", hu: "hu_HU", en: "en_US" };

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  interactiveWidget: "resizes-content",
  themeColor: "#0a0a0a",
  colorScheme: "dark",
};

const base: Metadata = {
  metadataBase: new URL(SITE_URL),
  authors: [{ name: "Gal Tamas" }],
  icons: { icon: "/favicon.png" },
  formatDetection: { telephone: false },
  verification: { google: GOOGLE_SITE_VERIFICATION },
  other: { "llms-txt": "/llms.txt" },
};

export function homeMetadata(locale: Locale): Metadata {
  const d = getDictionary(locale);
  return {
    ...base,
    title: d.meta.title,
    description: d.meta.description,
    alternates: { canonical: ROUTES[locale].home, languages: alternatesFor("home") },
    openGraph: {
      type: "website",
      url: ROUTES[locale].home,
      title: d.meta.ogTitle,
      description: d.meta.ogDescription,
      locale: OG_LOCALE[locale],
      images: [{ url: "/brandzone-logo.jpg" }],
    },
  };
}

export function policyMetadata(locale: Locale): Metadata {
  const d = getDictionary(locale);
  return {
    ...base,
    title: d.policy.metaTitle,
    alternates: { canonical: ROUTES[locale].policy, languages: alternatesFor("policy") },
  };
}

export function thanksMetadata(locale: Locale): Metadata {
  const d = getDictionary(locale);
  return {
    ...base,
    title: d.thanks.metaTitle,
    robots: { index: false, follow: false },
  };
}

/** Organization JSON-LD a főoldalakhoz (nyelvenként a régi oldal adataival). */
export function organizationJsonLd(locale: Locale) {
  const d = getDictionary(locale);
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "BrandZone",
    url: "https://www.brandzone.ro",
    logo: "https://www.brandzone.ro/brandzone-logo.jpg",
    description: d.jsonLd.description,
    sameAs: d.jsonLd.sameAs,
    contactPoint: {
      "@type": "ContactPoint",
      telephone: d.jsonLd.telephone,
      email: d.jsonLd.email,
      contactType: "sales",
      areaServed: "RO",
      availableLanguage: ["Romanian", "Hungarian", "English"],
    },
  };
}
