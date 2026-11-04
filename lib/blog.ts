import fs from "node:fs";
import path from "node:path";
import { BLOG_COPY } from "@/content/blog-copy";
import {
  BLOG_BASE,
  type BlogLang,
  type FaqEntry,
  type Highlight,
  type PostSummary,
  type TocEntry,
} from "@/lib/blog-shared";

export * from "@/lib/blog-shared";

/**
 * A blog adatrétege. A cikkek a content/blog/<nyelv>/<slug>/ mappában élnek:
 *   meta.json  cím, leírás, dátum, kiemelések, GYIK, CTA
 *   body.html  csak a cikk törzse (cím, GYIK, CTA nélkül)
 *   cover.svg  (opcionális) a cikk egyedi borítógrafikája; ha hiányzik, generált borító lesz
 * A mappa neve maga a slug, így a slug és az URL nem csúszhat el egymástól.
 * Új cikk = új mappa, a címlap, a sitemap és a kapcsolódó cikkek maguktól frissülnek.
 * Build közben minden hibát (hiányzó mező, törött belső link) egyszerre jelzünk.
 * Csak szerveroldalon (build közben) használható, mert fájlokat olvas.
 */

export type Post = {
  lang: BlogLang;
  slug: string;
  title: string;
  description: string;
  ogDescription: string;
  eyebrow: string;
  datePublished: string;
  readingTime: string;
  excerpt: string;
  highlights: Highlight[];
  faq: FaqEntry[];
  ctaTitle: string;
  ctaText: string;
  order: number;
  /** A cikktörzs HTML-je, a h2-k kaptak id-t a tartalomjegyzékhez. */
  html: string;
  toc: TocEntry[];
  /** Egyedi borító-SVG a cover.svg fájlból; ha nincs, a slugból generált szintvonal-borító kerül a helyére. */
  cover: string | null;
};

export const summarize = (p: Post): PostSummary => ({
  lang: p.lang,
  slug: p.slug,
  title: p.title,
  excerpt: p.excerpt,
  eyebrow: p.eyebrow,
  readingTime: p.readingTime,
  datePublished: p.datePublished,
  cover: p.cover,
});

const slugify = (s: string) =>
  s
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48);

const stripTags = (html: string) => html.replace(/<[^>]+>/g, "").replace(/&nbsp;/g, " ").replace(/\s+/g, " ").trim();

/** Minden <h2>-nek id-t ad (ékezetek nélküli, egyedi), és kigyűjti a tartalomjegyzéket. */
function addHeadingIds(html: string): { html: string; toc: TocEntry[] } {
  const toc: TocEntry[] = [];
  const used = new Set<string>();
  const out = html.replace(/<h2>([\s\S]*?)<\/h2>/g, (_m, inner: string) => {
    const text = stripTags(inner);
    let id = slugify(text) || "resz";
    for (let n = 2; used.has(id); n++) id = `${slugify(text) || "resz"}-${n}`;
    used.add(id);
    toc.push({ id, text });
    return `<h2 id="${id}">${inner}</h2>`;
  });
  return { html: out, toc };
}

const CONTENT_DIR = path.join(process.cwd(), "content", "blog");
const REQUIRED = ["title", "description", "eyebrow", "datePublished", "readingTime", "excerpt"] as const;

const cache = new Map<BlogLang, Post[]>();

function load(lang: BlogLang): Post[] {
  const dir = path.join(CONTENT_DIR, lang);
  if (!fs.existsSync(dir)) return [];
  const errors: string[] = [];
  const posts: Post[] = [];
  const copy = BLOG_COPY[lang];

  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const slug = entry.name;
    const where = `[blog/${lang}/${slug}]`;
    const metaFile = path.join(dir, slug, "meta.json");
    const bodyFile = path.join(dir, slug, "body.html");
    const coverFile = path.join(dir, slug, "cover.svg");
    if (!fs.existsSync(metaFile) || !fs.existsSync(bodyFile)) {
      errors.push(`${where} hiányzik a meta.json vagy a body.html`);
      continue;
    }
    let meta: Record<string, unknown>;
    try {
      meta = JSON.parse(fs.readFileSync(metaFile, "utf8"));
    } catch (e) {
      errors.push(`${where} a meta.json nem érvényes JSON: ${(e as Error).message}`);
      continue;
    }
    if (meta.slug && meta.slug !== slug) errors.push(`${where} a meta.json "slug" mezője eltér a mappa nevétől, töröld a mezőt`);
    for (const f of REQUIRED) if (!meta[f]) errors.push(`${where} hiányzó kötelező mező: ${f}`);

    const { html, toc } = addHeadingIds(fs.readFileSync(bodyFile, "utf8").trim());
    posts.push({
      lang,
      slug,
      title: String(meta.title ?? ""),
      description: String(meta.description ?? ""),
      ogDescription: String(meta.ogDescription ?? meta.description ?? ""),
      eyebrow: String(meta.eyebrow ?? ""),
      datePublished: String(meta.datePublished ?? ""),
      readingTime: String(meta.readingTime ?? ""),
      excerpt: String(meta.excerpt ?? meta.description ?? ""),
      highlights: Array.isArray(meta.highlights) ? (meta.highlights as Highlight[]) : [],
      faq: Array.isArray(meta.faq) ? (meta.faq as FaqEntry[]) : [],
      ctaTitle: String(meta.ctaTitle ?? copy.defaultCtaTitle),
      ctaText: String(meta.ctaText ?? copy.defaultCtaText),
      order: typeof meta.order === "number" ? meta.order : Number.POSITIVE_INFINITY,
      html,
      toc,
      cover: fs.existsSync(coverFile) ? fs.readFileSync(coverFile, "utf8").trim() : null,
    });
  }

  // Belső linkek ellenőrzése: a régi hibák (rossz slug → 404) így build közben kiderülnek.
  const known = new Set(posts.map((p) => p.slug));
  const linkRe = new RegExp(`href="${BLOG_BASE[lang]}/([a-z0-9-]+)/?"`, "g");
  for (const p of posts) {
    const text = p.html + p.faq.map((f) => f.a).join(" ") + p.ctaText;
    for (const m of text.matchAll(linkRe)) {
      if (!known.has(m[1])) errors.push(`[blog/${lang}/${p.slug}] törött belső link: ${BLOG_BASE[lang]}/${m[1]}`);
    }
  }

  // Régi, .html végű vagy relatív belső linkek (pl. href="cikk.html", href="/hu.html"): az új oldalon ezek 404-et adnak.
  for (const p of posts) {
    const text = p.html + p.faq.map((f) => f.a).join(" ") + p.ctaText;
    for (const m of text.matchAll(/href="([^"]*)"/g)) {
      const href = m[1];
      if (/^(https?:|mailto:|tel:|#)/.test(href)) continue; // külső vagy oldalon belüli horgony
      if (!href.startsWith("/") || /\.html(?:[#?]|$)/.test(href)) {
        errors.push(`[blog/${lang}/${p.slug}] régi vagy relatív link (használj /blog/<slug> formát): ${href}`);
      }
    }
  }

  if (errors.length) throw new Error(`Blog tartalmi hibák:\n - ${errors.join("\n - ")}`);

  // Legújabb elöl, azonos napon az `order` (kisebb = feljebb), végül slug.
  return posts.sort(
    (a, b) => b.datePublished.localeCompare(a.datePublished) || a.order - b.order || a.slug.localeCompare(b.slug),
  );
}

export function getPosts(lang: BlogLang): Post[] {
  // Fejlesztői szerveren nincs gyorsítótár, így a content/ mappa szerkesztése frissítésre azonnal látszik.
  // (Buildnél a modul egyszer töltődik be, ott a gyorsítótár spórolja a fájlolvasást.)
  if (process.env.NODE_ENV === "development") return load(lang);
  let posts = cache.get(lang);
  if (!posts) {
    posts = load(lang);
    cache.set(lang, posts);
  }
  return posts;
}

export function getPost(lang: BlogLang, slug: string): Post {
  const post = getPosts(lang).find((p) => p.slug === slug);
  if (!post) throw new Error(`Nincs ilyen cikk: ${lang}/${slug}`);
  return post;
}

/** Kapcsolódó cikkek: előbb az azonos témájúak, aztán a legújabbak. */
export function getRelated(post: Post, count = 3): Post[] {
  const others = getPosts(post.lang).filter((p) => p.slug !== post.slug);
  const same = others.filter((p) => p.eyebrow === post.eyebrow);
  const rest = others.filter((p) => p.eyebrow !== post.eyebrow);
  return [...same, ...rest].slice(0, count);
}
