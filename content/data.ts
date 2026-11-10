/**
 * A content/data.json beolvasása és egységesítése.
 *
 * A data.json szerkezete szándékosan azonos a régi repóéval
 * (shared.counters + languages.<nyelv>.partners/videos/faq/counterTexts),
 * így a brandzone-controller később változtatás nélkül írhatja.
 * Az itt lévő függvények csak build közben futnak (statikus export).
 */
import raw from "./data.json";
import type { Locale } from "@/lib/i18n";

export type Partner = { url: string; img: string; alt: string };
export type ReferenceVideo = { id: string; title: string; logo: string };
export type FaqItem = { question: string; answer: string };
export type Counter = { id: "videos" | "views" | "followers"; count: number };

type RawLanguage = {
  partners: { url: string; img: string; alt?: string }[];
  videos: { videoId?: string; bunnyVideoId?: string; title: string; logo: string }[];
  faq: { question: string; answer: string }[];
};

type RawData = {
  shared: { counters: { id: string; count: number }[] };
  languages: Record<Locale, RawLanguage>;
};

const data = raw as unknown as RawData;

/** "./partner-logos/x.jpg" és "partner-logos/x.jpg" → "/partner-logos/x.jpg" */
const toPublicPath = (p: string) => "/" + p.replace(/^\.?\//, "");

/** A régi data.json-ban az alt többnyire csak "Partner"; a fájlnévből adunk jobbat, ha lehet. */
function partnerAlt(p: { url: string; alt?: string }) {
  if (p.alt && p.alt !== "Partner") return p.alt;
  const handle = p.url.match(/@([\w.]+)|instagram\.com\/([\w.]+)|facebook\.com\/([\w.]+)/i);
  const name = handle?.slice(1).find(Boolean)?.replace(/[._]/g, " ");
  return name ? `${name} logo` : "Partner logo";
}

export function getPartners(locale: Locale): Partner[] {
  return data.languages[locale].partners.map((p) => ({
    url: p.url,
    img: toPublicPath(p.img),
    alt: partnerAlt(p),
  }));
}

export function getVideos(locale: Locale): ReferenceVideo[] {
  return data.languages[locale].videos
    .map((v) => ({ id: v.videoId || v.bunnyVideoId || "", title: v.title, logo: v.logo ? toPublicPath(v.logo) : "" }))
    .filter((v) => v.id); // üres hely a Control Panelben → kihagyjuk
}

export function getFaq(locale: Locale): FaqItem[] {
  return data.languages[locale].faq;
}

export function getCounters(): Counter[] {
  return data.shared.counters.map((c) => ({ id: c.id as Counter["id"], count: c.count }));
}

/** Az összes nyelv videóazonosítója (a hero poszterfalához). */
export function getAllVideoIds(): string[] {
  const ids = Object.values(data.languages).flatMap((l) =>
    l.videos.map((v) => v.videoId || v.bunnyVideoId || ""),
  );
  return [...new Set(ids.filter(Boolean))];
}
