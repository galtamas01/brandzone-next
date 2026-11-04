#!/usr/bin/env node
/**
 * Build utáni lépés (az `npm run build` automatikusan lefuttatja).
 *
 * 1. A blog címlapja a régi, záró perjeles URL-en marad (/blog/ és /blog-ro/):
 *    a Next `out/blog.html`-t ír, ezt `out/blog/index.html`-be mozgatjuk. A Netlify így pont úgy
 *    szolgálja ki, mint a régi oldalon (a Google-ben ez az indexelt, canonical cím), és nincs
 *    átirányítási hurok a perjeles és perjel nélküli alak között.
 * 2. A blog URL-jei bekerülnek az out/sitemap.xml-be a content/blog/ mappák alapján.
 */
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const OUT = path.join(ROOT, "out");
const SITE = "https://brandzone.ro";
const BASES = { hu: "blog", ro: "blog-ro" };

// 1. címlapok mozgatása
for (const base of Object.values(BASES)) {
  const from = path.join(OUT, `${base}.html`);
  const to = path.join(OUT, base, "index.html");
  if (!fs.existsSync(from)) throw new Error(`Hiányzik a ${from}, a blog címlap nem készült el.`);
  fs.mkdirSync(path.dirname(to), { recursive: true });
  fs.renameSync(from, to);
}

// 2. sitemap
const articles = (lang) => {
  const dir = path.join(ROOT, "content", "blog", lang);
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => {
      const meta = JSON.parse(fs.readFileSync(path.join(dir, d.name, "meta.json"), "utf8"));
      return { slug: d.name, date: meta.datePublished, order: typeof meta.order === "number" ? meta.order : Infinity };
    })
    .sort((a, b) => b.date.localeCompare(a.date) || a.order - b.order || a.slug.localeCompare(b.slug));
};

const today = new Date().toISOString().slice(0, 10);
const blocks = [];
for (const [lang, base] of Object.entries(BASES)) {
  const list = articles(lang);
  blocks.push(`  <url>\n    <loc>${SITE}/${base}/</loc>\n    <lastmod>${list[0]?.date ?? today}</lastmod>\n    <priority>0.8</priority>\n  </url>`);
  for (const a of list) {
    blocks.push(`  <url>\n    <loc>${SITE}/${base}/${a.slug}</loc>\n    <lastmod>${a.date}</lastmod>\n    <priority>0.6</priority>\n  </url>`);
  }
}

const sitemapPath = path.join(OUT, "sitemap.xml");
const xml = fs.readFileSync(sitemapPath, "utf8");
if (!xml.includes("<!-- BLOG-URLS -->")) throw new Error("A public/sitemap.xml-ből hiányzik a BLOG-URLS jelölő.");
fs.writeFileSync(sitemapPath, xml.replace("<!-- BLOG-URLS -->", blocks.join("\n")));

console.log(`postbuild: blog címlapok áthelyezve, ${blocks.length} blog URL a sitemapben.`);
