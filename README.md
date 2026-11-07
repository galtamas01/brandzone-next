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
4. A blog (`/blog/`, `/blog-ro/`) a régi URL-eken itt van, így a domain átállítható (ld. „Blog" lent).

## Mappaszerkezet

```
app/
  (ro)/  (hu)/  (en)/        nyelvenként külön root layout (<html lang>), a régi URL-ekkel:
                             /  /hu  /en  /policy/…  /form-submit/…
  global-not-found.tsx       saját 404-oldal
  globals.css                tokenek (színek, betűk, easing), alapstílusok, segédosztályok
components/                  minden szekció egy komponens + saját .module.css
  ui/                        újrahasznosított elemek: RollButton, SectionHead, PowerSwitch, Rail
  blog/                      a blog komponensei (címlap, cikkoldal, kártya, borító, folyamatvonal)
content/
  copy.ts                    AZ ÖSSZES SZÖVEG nyelvenként (menü, hero, szolgáltatások, űrlap…)
  data.json                  partnerek, referenciavideók, GYIK, számlálók (Controller-kompatibilis)
  data.ts                    a data.json beolvasása, útvonalak egységesítése
  team.ts                    csapattagok
  policy/<nyelv>.html        adatvédelmi tájékoztatók szövege
  blog/<hu|ro>/<slug>/       a blogcikkek: meta.json + body.html (a mappa neve a slug)
  blog-copy.ts               a blog felületi szövegei (szűrő, gombok, alapértelmezett CTA)
lib/
  site.ts                    domain, médiahosting, hero-videó, mérőkódok
  i18n.ts                    nyelvek, URL-ek, űrlapnevek
  metadata.ts                title, description, canonical, hreflang, OG, JSON-LD
  blog.ts / blog-shared.ts   a cikkek beolvasása és ellenőrzése (build közben) / közös típusok, URL-ek
scripts/postbuild.mjs        build után: blog címlapok a /blog/ címre, blog URL-ek a sitemapbe
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
| Új blogcikk | új mappa a `content/blog/hu/` vagy `ro/` alatt (ld. „Blog" lent), mást nem kell szerkeszteni |
| Új csapattag | kép `public/img/team/` alá (640×768 webp) + sor a `content/team.ts`-be |
| Videó-hosting vagy hero-videó cseréje | `lib/site.ts` (`MEDIA_BASE`, `HERO_VIDEO`) |
| Mérőkód (GA, GTM, Meta, TikTok, OpenAI) | `lib/site.ts` → `TRACKING` |
| Színek, betűk, easing | `app/globals.css` → `:root` |

## Média

- **Referenciavideók:** továbbra is a régi repó GitHub Pages-éről töltenek
  (`https://brandzone759.github.io/Brandzone-v2teszt/videos/<id>.mp4`), kattintásra.
  A posztereket ez a repó tartalmazza, így az oldal betöltésekor egyetlen videó sem töltődik.
- **Hero-videó:** a repóban van, `public/video/hero-1080.mp4` (nagy kijelzőre, ~9 MB) és `hero-720.mp4`
  (900 px alatti kijelzőre, ~4,5 MB), hang nélkül. A `components/HeroVideo.tsx` tölti be, némítva és ismétlődve,
  enyhe sötétítéssel. A hero feketéből indul: a videó csak akkor úszik be, ha ténylegesen lejátszódik; ha nem (hiba, tiltott
  automatikus indítás pl. energiatakarékos módban, csökkentett mozgás, adatspórolás, vagy 6 mp-ig nem indul el; az egyértelmű eseteknél nincs várakozás, a vonalak azonnal beúsznak),
  a szintvonalas háttér a tartalék, az is a feketéből úszik be. JS nélkül a vonalak azonnal látszanak. Csere esetén (a forrás 4K) így készült a két fájl, a fájlnevek maradhatnak:
  ```
  ffmpeg -i forras.mp4 -an -vf "scale=1920:1080:flags=lanczos" -c:v libx264 -profile:v high -preset slow \
         -crf 30 -maxrate 3M -bufsize 6M -pix_fmt yuv420p -movflags +faststart public/video/hero-1080.mp4
  ffmpeg -i forras.mp4 -an -vf "scale=1280:720:flags=lanczos" -c:v libx264 -profile:v main -preset slow \
         -crf 31 -maxrate 1.5M -bufsize 3M -pix_fmt yuv420p -movflags +faststart public/video/hero-720.mp4
  ```
  A fájlnév nem tartalmaz hash-t, ezért a Netlify egy hétig gyorsítótárazza (`netlify.toml`).
- **Build közben** a referenciavideók helye felülírható: `NEXT_PUBLIC_MEDIA_BASE=…/ npm run build`.

## Controller-kompatibilitás

A `content/data.json` szerkezete **szándékosan azonos** a régi repó `data.json`-jával
(`shared.counters`, `languages.<nyelv>.partners/videos/faq/counterTexts`). Amikor a Controller
erre a repóra vált, a célútvonalat kell átírni benne `content/data.json`-ra és
`public/partner-logos/`, `public/video-posters/`-re. Minden commit után a Netlify újrabuildel.

## Blog

A cikkek a `content/blog/<hu|ro>/<slug>/` mappákban vannak, a mappa neve a slug (az URL).
Mappánként két fájl kell:

- `meta.json`: `title`, `description`, `ogDescription`, `eyebrow` (a téma, ez adja a szűrőgombokat),
  `datePublished` (ÉÉÉÉ-HH-NN), `readingTime`, `excerpt`, `highlights` (3 db `{value,label}`),
  `faq` (`{q,a}` lista), `ctaTitle`, `ctaText`; opcionális: `order` (azonos napon belüli sorrend, kisebb = feljebb).
- `cover.svg` (opcionális): a cikk egyedi borítógrafikája (400×225 vagy hasonló viewBox, `preserveAspectRatio="xMidYMid slice"`). Ha nincs, a slugból generált szintvonal-borító kerül a helyére. Hoverra a borító minden vonalán (`path`, `line`, `circle`, `rect` stb.) végigfut egy zöld vonal; ehhez a `cover.svg`-ben nem kell semmit csinálni, a `Cover.tsx` automatikusan zöld másolatot készít a vonalas alakzatokról.
- `body.html`: csak a cikk törzse (`<p class="art-lead">`, `<h2>`, `<h3>`, `<ul>`, `<ol>`, `<div class="art-note">`).
  A cím, a kiemelések, a GYIK és a CTA a `meta.json`-ból épül.

Ami maguktól megvan: a címlap kártyája és témaszűrője, a legfrissebb cikk nagy kártyája, a tartalomjegyzék
(a `<h2>`-kből), a borító (a `cover.svg`, ennek hiányában generált), a kapcsolódó cikkek, a JSON-LD, a canonical
és a sitemap-bejegyzés. A `npm run build` minden hibát egyszerre kiír (hiányzó mező, törött belső
`/blog/…` link), ezért rossz slug nem kerülhet élesbe.

- **Címlap-URL:** a canonical a régi, záró perjeles alak (`/blog/`, `/blog-ro/`). A Next `blog.html`-t ír,
  a `scripts/postbuild.mjs` ezt `blog/index.html`-be teszi, így a Netlify pont úgy szolgálja ki, mint
  a régi oldalon. A cikkek perjel nélküliek (`/blog/<slug>`).
- **Nyelvek:** a magyar és a román cikkek önálló tartalmak. A nyelvváltó a blogban a másik nyelv
  blogcímlapjára, az EN a főoldalra visz.
- **Videók:** a régi cikkek Bunny.net iframe-jeit kivettük (az előfizetés lejárt). Ha új tárhely lesz,
  a `body.html`-be kell visszatenni a videót.

## Tudnivalók, nyitott pontok

- **GDPR:** a GA, a GTM, a Meta és az OpenAI pixel a régi oldalhoz hasonlóan hozzájárulás nélkül
  is betölt, csak a TikTok pixel vár elfogadásra. Javasolt mindet a süti-hozzájáruláshoz kötni
  (Google Consent Mode v2). Az OpenAI pixel `debug: true` módban fut, ezt élesítés előtt érdemes kikapcsolni.
- **Betűk:** a Poppins és az Archivo Black saját hosztolású (`@fontsource`), nem a Google Fonts-ról jön.
- A süti-döntés kulcsa (`localStorage.cookieConsent`) a régi oldallal azonos, a látogatók korábbi döntése megmarad.
