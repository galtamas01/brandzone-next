# BrandZone – weboldal (Next.js)

A brandzone.ro új frontendje. Next.js 16 (App Router) + React 19 + TypeScript, CSS Modules.
A build **statikus HTML-t** generál az `out/` mappába, ezt szolgálja ki a Netlify. Szerver nincs.

> A régi oldal (`Brandzone759/Brandzone-v2teszt`) érintetlen marad, ez a projekt egy új repóba kerül.

## Indítás

```bash
npm install
npm run dev      # fejlesztői szerver: http://localhost:3000
npm run build    # statikus export az out/ mappába
npm run lint     # típusellenőrzés (tsc)
```

Node 20+ kell (a Netlify a `netlify.toml` szerint Node 22-vel buildel).

## Deploy (Netlify)

1. Új repó a GitHubon, a projekt feltöltése.
2. Netlify → *Add new site → Import an existing project* → a repó kiválasztása.
   A beállításokat a `netlify.toml` adja (`npm run build`, publish: `out`), mást nem kell megadni.
3. **Forms:** Netlify → *Site configuration → Forms* → *Enable form detection*.
   Az űrlapnevek (`form-ro`, `form-hu`, `form-en`) és a mezők ugyanazok, mint a régi oldalon,
   így az e-mail-értesítéseket ugyanúgy kell beállítani.
4. Domain átállítása csak akkor, ha a blog is átkerült (ld. lent).

## Mappaszerkezet

```
app/
  (ro)/  (hu)/  (en)/        nyelvenként külön root layout (<html lang>), a régi URL-ekkel:
                             /  /hu  /en  /policy/…  /form-submit/…
  global-not-found.tsx       saját 404-oldal
  globals.css                tokenek (színek, betűk, easing), alapstílusok, segédosztályok
components/                  minden szekció egy komponens + saját .module.css
  ui/                        újrahasznosított elemek: RollButton, SectionHead, PowerSwitch, Rail
content/
  copy.ts                    AZ ÖSSZES SZÖVEG nyelvenként (menü, hero, szolgáltatások, űrlap…)
  data.json                  partnerek, referenciavideók, GYIK, számlálók (Controller-kompatibilis)
  data.ts                    a data.json beolvasása, útvonalak egységesítése
  team.ts                    csapattagok
  policy/<nyelv>.html        adatvédelmi tájékoztatók szövege
lib/
  site.ts                    domain, médiahosting, hero-videó, mérőkódok
  i18n.ts                    nyelvek, URL-ek, űrlapnevek
  metadata.ts                title, description, canonical, hreflang, OG, JSON-LD
public/                      képek, logók, poszterek, robots.txt, sitemap.xml, llms.txt
docs/DESIGN-SPEC.md          a dizájn specifikációja (színek, méretek, mozgás)
```

## Gyakori teendők

| Feladat | Hol |
|---|---|
| Szöveg javítása | `content/copy.ts` – a megfelelő nyelv blokkja |
| Új partner / referenciavideó / GYIK | `content/data.json` (ugyanaz a szerkezet, mint a régi repóban) |
| Partnerlogó | `public/partner-logos/` + útvonal a `data.json`-ban |
| Referenciavideó posztere | `public/video-posters/<videoId>.jpg` (576×1024) |
| Új csapattag | kép `public/img/team/` alá (640×768 webp) + sor a `content/team.ts`-be |
| Videó-hosting vagy hero-videó cseréje | `lib/site.ts` (`MEDIA_BASE`, `HERO_VIDEO`) |
| Mérőkód (GA, GTM, Meta, TikTok, OpenAI) | `lib/site.ts` → `TRACKING` |
| Színek, betűk, easing | `app/globals.css` → `:root` |

## Média

- **Referenciavideók:** továbbra is a régi repó GitHub Pages-éről töltenek
  (`https://brandzone759.github.io/Brandzone-v2teszt/videos/<id>.mp4`), kattintásra.
  A posztereket ez a repó tartalmazza, így az oldal betöltésekor egyetlen videó sem töltődik.
- **Hero-videó:** `https://brandzone-pullzone.b-cdn.net/hero_video.mp4` (a mostani hosting).
  Ha nem érhető el, a hero a referencia-poszterekből álló szürke falat mutatja, nem marad üres.
- Build közben mindkettő felülírható környezeti változóval:
  `NEXT_PUBLIC_MEDIA_BASE=…/ NEXT_PUBLIC_HERO_VIDEO=… npm run build`.

## Controller-kompatibilitás

A `content/data.json` szerkezete **szándékosan azonos** a régi repó `data.json`-jával
(`shared.counters`, `languages.<nyelv>.partners/videos/faq/counterTexts`). Amikor a Controller
erre a repóra vált, a célútvonalat kell átírni benne `content/data.json`-ra és
`public/partner-logos/`, `public/video-posters/`-re. Minden commit után a Netlify újrabuildel.

## Tudnivalók, nyitott pontok

- **Blog:** most nincs benne. A régi blog-URL-ek (`/blog/…`, `/blog-ro/…`) az új oldalon 404-et
  adnának, ezért a brandzone.ro domaint csak a blog átköltöztetése után érdemes átállítani,
  vagy addig átirányítást kell tenni a régi deployra. A `sitemap.xml`-ből a blog kimaradt.
- **GDPR:** a GA, a GTM, a Meta és az OpenAI pixel a régi oldalhoz hasonlóan hozzájárulás nélkül
  is betölt, csak a TikTok pixel vár elfogadásra. Javasolt mindet a süti-hozzájáruláshoz kötni
  (Google Consent Mode v2). Az OpenAI pixel `debug: true` módban fut, ezt élesítés előtt érdemes kikapcsolni.
- **Betűk:** a Poppins és az Archivo Black saját hosztolású (`@fontsource`), nem a Google Fonts-ról jön.
- A süti-döntés kulcsa (`localStorage.cookieConsent`) a régi oldallal azonos, a látogatók korábbi döntése megmarad.
