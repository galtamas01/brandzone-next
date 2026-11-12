/**
 * A content/data.json beolvasása és egységesítése.
 *
 * A data.json szerkezete szándékosan azonos a régi repóéval
 * (shared.counters + languages.<nyelv>.partners/videos/faq/counterTexts + reviews),
 * így a brandzone-controller később változtatás nélkül írhatja.
 * Az itt lévő függvények csak build közben futnak (statikus export).
 */
import raw from "./data.json";
import type { Locale } from "@/lib/i18n";
import type { ReviewItem } from "@/content/copy";

export type Partner = { url: string; img: string; alt: string };
export type ReferenceVideo = { id: string; title: string; logo: string };
export type FaqItem = { question: string; answer: string };
export type Counter = { id: "videos" | "views" | "followers"; count: number };

type RawLanguage = {
  partners: { url: string; img: string; alt?: string }[];
  videos: { videoId?: string; bunnyVideoId?: string; title: string; logo: string }[];
  faq: { question: string; answer: string }[];
  reviews?: {
    name: string;
    /** "ÉÉÉÉ-HH" – a relatív időt („5 hónapja") buildkor számoljuk belőle */
    date: string;
    rating: number;
    text: string;
    note?: string;
    avatar: ReviewItem["avatar"];
  }[];
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

/** Hány teljes hónap telt el: a "2026-06" és a mostani hónap között (a jövőbeli dátum 0). */
export function monthsSince(date: string, now: Date = new Date()): number {
  const [y, m] = date.split("-").map(Number);
  return Math.max(0, now.getUTCFullYear() * 12 + now.getUTCMonth() - (y * 12 + (m - 1)));
}

/** Google-stílusú relatív idő: "acum 5 luni" / "5 hónapja" / "5 months ago". */
export function relativeTime(date: string, locale: Locale, now: Date = new Date()): string {
  const months = monthsSince(date, now);
  const years = Math.floor(months / 12);
  if (locale === "hu") {
    if (months < 1) return "ebben a hónapban";
    return years >= 1 ? `${years} éve` : `${months} hónapja`;
  }
  if (locale === "en") {
    if (months < 1) return "this month";
    if (years >= 1) return years === 1 ? "a year ago" : `${years} years ago`;
    return months === 1 ? "a month ago" : `${months} months ago`;
  }
  // ro
  if (months < 1) return "luna aceasta";
  if (years >= 1) return years === 1 ? "acum un an" : `acum ${years} ${years >= 20 ? "de ani" : "ani"}`;
  return months === 1 ? "acum o lună" : `acum ${months} luni`;
}

export function getReviews(locale: Locale, now: Date = new Date()): ReviewItem[] {
  return (data.languages[locale].reviews ?? []).map((r) => ({
    name: r.name,
    time: relativeTime(r.date, locale, now),
    rating: r.rating as ReviewItem["rating"],
    text: r.text,
    ...(r.note ? { note: r.note } : {}),
    avatar: r.avatar,
  }));
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
