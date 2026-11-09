/**
 * Az esettanulmány-oldalak felületi szövegei (nem a törzsé). A törzs és a meta adatok a
 * content/case-study/<slug>/<nyelv>/ mappában vannak (meta.json + body.html), ugyanúgy, mint a blogcikkeknél.
 */
import type { Locale } from "@/lib/i18n";

export type CaseStudyCopy = {
  back: string;
  toc: string;
  /** A szöveg végén lévő videók felirata. */
  videosLabel: string;
  /** Csak akkor van, ha a videók nyelve eltér az oldalétól. */
  videosNote?: string;
  /** Az oldal <title> utótagja. */
  titleSuffix: string;
};

export const CASE_STUDY_COPY: Record<Locale, CaseStudyCopy> = {
  hu: {
    back: "Vissza a referenciákhoz",
    toc: "Ebben az esettanulmányban",
    videosLabel: "Két videó a kampányból",
    titleSuffix: "BrandZone",
  },
  ro: {
    back: "Înapoi la referințe",
    toc: "În acest studiu de caz",
    videosLabel: "Două videoclipuri din campanie",
    videosNote: "Videoclipurile sunt în limba maghiară.",
    titleSuffix: "BrandZone",
  },
  en: {
    back: "Back to references",
    toc: "In this case study",
    videosLabel: "Two videos from the campaign",
    videosNote: "The videos are in Hungarian.",
    titleSuffix: "BrandZone",
  },
};

/** A tömörített videók és posztereik (public/video/perfekt/). A címek az eredeti, magyar videócímek. */
export const CASE_STUDY_VIDEOS: Record<string, { src: string; poster: string; title: string }[]> = {
  perfekt: [
    {
      src: "/video/perfekt/nyeremenybicikli.mp4",
      poster: "/video/perfekt/nyeremenybicikli-poster.webp",
      title: "Ellopták a nyereménybiciklit",
    },
    {
      src: "/video/perfekt/ki-tetszik-fizetni.mp4",
      poster: "/video/perfekt/ki-tetszik-fizetni-poster.webp",
      title: "Ki tetszik fizetni?",
    },
  ],
};
