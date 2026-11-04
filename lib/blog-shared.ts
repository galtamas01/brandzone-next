import { SITE_URL } from "@/lib/site";

/**
 * A blog kliensoldalon is használható, tiszta (fájlrendszer nélküli) részei:
 * típusok, útvonalak, dátumformázás. A cikkek beolvasása a lib/blog.ts-ben van (csak build közben fut).
 */

export type BlogLang = "hu" | "ro";
export const BLOG_LANGS: readonly BlogLang[] = ["hu", "ro"];

/** A régi URL-ek. Ne változtasd meg őket (Google-indexelés, külső linkek). */
export const BLOG_BASE: Record<BlogLang, string> = { hu: "/blog", ro: "/blog-ro" };

export type Highlight = { value: string; label: string };
export type FaqEntry = { q: string; a: string };
export type TocEntry = { id: string; text: string };

/** A kártyáknak és a szűrőnek elég ez a tömör változat (ezt küldjük a kliensnek). */
export type PostSummary = {
  lang: BlogLang;
  slug: string;
  title: string;
  excerpt: string;
  eyebrow: string;
  readingTime: string;
  datePublished: string;
  /** A cikk saját borító-SVG-je (content/blog/<nyelv>/<slug>/cover.svg), ha van. */
  cover: string | null;
};

export const indexPath = (lang: BlogLang) => `${BLOG_BASE[lang]}/`;
export const postPath = (lang: BlogLang, slug: string) => `${BLOG_BASE[lang]}/${slug}`;
export const absolute = (p: string) => `${SITE_URL}${p}`;

const MONTHS: Record<BlogLang, string[]> = {
  hu: ["január", "február", "március", "április", "május", "június", "július", "augusztus", "szeptember", "október", "november", "december"],
  ro: ["ianuarie", "februarie", "martie", "aprilie", "mai", "iunie", "iulie", "august", "septembrie", "octombrie", "noiembrie", "decembrie"],
};

/** "2026-07-31" → „2026. július 31." (hu) / „31 iulie 2026" (ro). */
export function formatDate(iso: string, lang: BlogLang): string {
  const [y, m, d] = iso.split("-").map(Number);
  if (!y || !m || !d) return iso;
  return lang === "ro" ? `${d} ${MONTHS.ro[m - 1]} ${y}` : `${y}. ${MONTHS.hu[m - 1]} ${d}.`;
}

/** A cikkek témái (az eyebrow mező), első előfordulás sorrendjében, darabszámmal. */
export function getCategories(posts: Pick<PostSummary, "eyebrow">[]): { name: string; count: number }[] {
  const map = new Map<string, number>();
  for (const p of posts) map.set(p.eyebrow, (map.get(p.eyebrow) ?? 0) + 1);
  return [...map].map(([name, count]) => ({ name, count }));
}
