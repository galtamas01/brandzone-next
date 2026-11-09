import fs from "node:fs";
import path from "node:path";
import type { Locale } from "@/lib/i18n";
import { addHeadingIds } from "@/lib/blog";
import type { TocEntry } from "@/lib/blog-shared";

/**
 * Esettanulmányok adatrétege. Egy esettanulmány: content/case-study/<slug>/<nyelv>/
 *   meta.json  cím (+ a zölden kiemelt szó: titleAccent), leírás, dátum (csak SEO/JSON-LD)
 *   body.html  a törzs (h2 = tartalomjegyzék-szakasz, h3 = alcím); a h2-k id-t kapnak
 * A három nyelv önálló fájl (nem a blog magyar/román logikája, itt egymás fordításai).
 * Csak szerveroldalon (build közben) használható.
 */

export type CaseStudy = {
  lang: Locale;
  slug: string;
  title: string;
  description: string;
  eyebrow: string;
  datePublished: string;
  titleAccent?: string;
  html: string;
  toc: TocEntry[];
};

const DIR = path.join(process.cwd(), "content", "case-study");
const REQUIRED = ["title", "description", "eyebrow", "datePublished"] as const;

export function getCaseStudy(slug: string, lang: Locale): CaseStudy {
  const dir = path.join(DIR, slug, lang);
  const where = `[case-study/${slug}/${lang}]`;
  const metaFile = path.join(dir, "meta.json");
  const bodyFile = path.join(dir, "body.html");
  if (!fs.existsSync(metaFile) || !fs.existsSync(bodyFile)) throw new Error(`${where} hiányzik a meta.json vagy a body.html`);
  const meta = JSON.parse(fs.readFileSync(metaFile, "utf8")) as Record<string, unknown>;
  const missing = REQUIRED.filter((f) => !meta[f]);
  if (missing.length) throw new Error(`${where} hiányzó kötelező mező: ${missing.join(", ")}`);
  const { html, toc } = addHeadingIds(fs.readFileSync(bodyFile, "utf8").trim());
  return {
    lang,
    slug,
    title: String(meta.title),
    description: String(meta.description),
    eyebrow: String(meta.eyebrow),
    datePublished: String(meta.datePublished),
    titleAccent: meta.titleAccent ? String(meta.titleAccent) : undefined,
    html,
    toc,
  };
}
