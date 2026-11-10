/**
 * Az egész oldalra érvényes beállítások egy helyen.
 * Ha domain, médiahosting vagy mérőkód változik, csak ezt a fájlt kell átírni.
 */

export const SITE_URL = "https://brandzone.ro";

/**
 * A referenciavideók (mp4) helye, záró perjellel (alapból a repó public/videos/ mappája, a Controller ide tölt fel). A fájlnév a videó azonosítója
 * (content/data.json → videoId). Build közben felülírható:
 *   NEXT_PUBLIC_MEDIA_BASE=/local-videos/ npm run build
 */
export const MEDIA_BASE = process.env.NEXT_PUBLIC_MEDIA_BASE ?? "/videos/";

/** A referenciák poszterképei a repóban vannak: /public/video-posters/<id>.jpg */
export const posterUrl = (id: string) => `/video-posters/${encodeURIComponent(id)}.jpg`;
export const videoUrl = (id: string) => `${MEDIA_BASE}${encodeURIComponent(id)}.mp4`;

export const TRACKING = {
  gaId: "G-C7R83DEHQP",
  gtmId: "GTM-KS7DJBC4",
  metaPixelId: "891606847169072",
  tiktokPixelId: "D5IJKG3C77U2KB72HKSG",
  openAiPixelId: "WJksTaHt1hCmEQMm455ZzT",
} as const;

export const GOOGLE_SITE_VERIFICATION = "KhLXWrxFOmymaKlEhp93y1O-P4IeF9nDOtyoUsev1e8";
