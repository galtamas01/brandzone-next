# BrandZone · „Brands ON." — build spec (redesign v3)

## 0. Brief
Többoldalas, háromnyelvű (RO alapértelmezett, HU, EN) bemutatkozó oldal a **BrandZone** székelyudvarhelyi videós tartalomgyártó ügynökségnek. A látogató: romániai (erdélyi) cégvezető vagy marketinges, aki short-form videót (TikTok, Reels), reklámfilmet vagy UGC-t keres.
Hangulat: **magabiztos, filmszerű, letisztult**.
Aláírás (amire emlékezni fognak): **a kapcsoló.** A logó „ZONE" szavában az O egy félig kitöltött kapcsoló. A hero „BRANDS ON." címében az „ON" O-betűje egy valódi kapcsoló, amely betöltéskor zöldre, BE állásba kattan. A köszönőoldalon és a 404-en ugyanez a kapcsoló visszatér.
Hűség: a régi oldal minden tartalmi blokkja megmarad (menü, hero, együttműködések, csapat, referenciák + számlálók, szolgáltatások, GYIK, ajánlatkérő űrlap, lábléc, süti-sáv), új sorrendben és új formában. Új szekció nincs.

## 1. Stack
Next.js 16 (App Router, `output: "export"`, statikus HTML), React 19, TypeScript, CSS Modules + egy globális token-fájl. Külső UI-könyvtár nincs; minden mozgás CSS + egy kis IntersectionObserver. Ikonok: inline SVG. Hosting: Netlify (statikus `out/` mappa, Netlify Forms).

## 2. Betűk
| Szerep | Család | Súly | Hol |
|---|---|---|---|
| Display | Archivo Black | 400 | H1, H2, számok, nevek, szóvédjegy |
| Body/UI | Poppins | 400 / 500 / 600 | szöveg, menü, gombok, címkék |
Betöltés: `@fontsource` csomagokból, saját hosztolással (nincs Google Fonts kérés, nincs GDPR-gond, nincs FOUT-ugrás). `font-display: swap`.

## 3. Színek
```css
:root{
  --bg:#0a0a0a; --bg-2:#121212; --bg-3:#1a1a1a;
  --fg:#f5f5f2; --fg-80:rgb(245 245 242/.8); --fg-60:rgb(245 245 242/.62); --fg-40:rgb(245 245 242/.4);
  --line:rgb(255 255 255/.1); --line-strong:rgb(255 255 255/.18);
  --paper:#f2f2ee; --ink:#0a0a0a; --ink-60:rgb(10 10 10/.62); --ink-line:rgb(10 10 10/.12);
  --green:#289945;             /* a régi --brandzone-green; 5.4:1 a --bg-n */
  --green-hover:#2fb052;
}
html,body{background:var(--bg);color:var(--fg)}
```
A zöld csak három elemtípuson: a kapcsoló BE állapota, a CTA-k nyíl-chipje / fő gombja, és a hangsúlyos szavak (szolgáltatáscímek kiemelése, számlálók „+" jele). Kijelölés: `rgb(40 153 69/.35)`.

## 4. Közös elemek
- **Szemcse:** fix, oldalszintű SVG fractal noise, effektív ~3% (`opacity .35`, rect `.08`), `pointer-events:none`.
- **Üveg anyag (egyetlen):** `background:rgb(10 10 10/.55); backdrop-filter:blur(16px) saturate(140%); border:1px solid var(--line)`. Menü, nyelvváltó, sütisáv, lejátszógomb.
- **Gombok:** pirula. Elsődleges: fehér háttér, fekete 14px/500 szöveg, `8px 8px 8px 22px` padding, jobb oldalt 32px zöld chip nyíllal; hoverre a felirat felgördül (500ms), a nyíl −45°-ot fordul; `:active scale(.97)`.
- **Szekciócímke:** sima szöveg (pl. `Referințe`), Poppins 500 12px, uppercase, +.18em, fg-60; sorszám és kötővonal nélkül.
- **Belépő reveal:** `[data-reveal]` → `opacity 0, translateY(28px)` → alap, .8s `cubic-bezier(.16,1,.3,1)`, késleltetés `var(--i)*80ms`, 15% láthatóságnál, egyszer. JS nélkül minden látszik (a rejtés csak `html.js` alatt él).

## 5. Média
| Hely | Forrás | Viselkedés |
|---|---|---|
| hero háttér | `https://brandzone-pullzone.b-cdn.net/hero_video.mp4` (a mostani hosting) | `muted autoplay loop playsinline`, `loadeddata`-ra 1.8s alatt beúszik (opacity 0→1, scale 1.05→1); képernyőn kívül szünetel; hiba esetén rejtve marad |
| hero alap | a referencia-poszterek döntött falként (6 oszlop desktop, 3 mobil), `grayscale(1) brightness(.42)` | azonnal látszik, ez a fallback és a videó alatti réteg is |
| referenciák | `MEDIA_BASE/<id>.mp4` (a régi repó GitHub Pages-e), poszter: `/video-posters/<id>.jpg` | kattintásra tölt be (`preload="none"`), egyszerre csak egy szól |
| szolgáltatások | `banner_phone`, `macbook1`, `ugc-2` (átlátszó PNG, átméretezve) | statikus |
| csapat | `team.png` + 7 portré | statikus, hoverre szürkéből színesbe |

Takarás a hero-n: függőleges scrim `rgb(10 10 10/.55) 0% → /.08 32% → /.2 58% → /.94 100%`.

## 6. Szerkezet és sorrend
Nav (fix) → Hero → 01 Együttműködések (logó-marquee) → 02 Referenciák (számlálók + videósín) → 03 Szolgáltatások (fehér „papír" lap, egymásra csúszó kártyák) → 04 Csapat (szöveg + fotó + portrésín) → 05 GYIK (két hasáb) → 06 Ajánlatkérés (űrlap-kártya) → Lábléc → Sütisáv.
A régi horgonyok megmaradnak: `#rolunk`, `#referenciak`, `#szolgaltatasok`, `#faq-title`, `#arajanlat`.

## 7. Nav
Fix, `top:16px`, `inset-inline:16px` (mobil 10px), magasság 56px. Bal: fehér logó (28px magas). Közép (≥1024px): linkek az üveg pirulában, 14px/500, fg-80 → fg hover, alatta balról növő 1px vonal. Jobb: nyelvváltó (RO · HU · EN szövegchipek, az aktív fehér háttérrel) + elsődleges gomb („Ofertă" / „Árajánlat" / „Offer"). 1024px alatt: logó + kis CTA + 44px kerek burger → teljes képernyős üveg-overlay, a linkek 32–40px Archivo Black, `100 + i×70ms` lépcsőzéssel; Esc, linkkattintás és desktopra méretezés bezárja; nyitva a body nem görget.

## 8. Hero
Gyökér: `height:100svh; min-height:620px`, belső keret `padding:12px` (mobil 8px), `border-radius:28px` (mobil 22px), `overflow:hidden`.
Tartalom alulra igazítva, 12 hasábos rács, `padding: 0 clamp(20px,4vw,56px) clamp(28px,5vw,64px)`.
| Elem | Szöveg | Stílus | Mozgás |
|---|---|---|---|
| Szemöldök | ● Created by BRANDZONE | Poppins 500 13px, uppercase +.2em, zöld pont 8px | .25s, fade + y 12px |
| H1 | BRANDS / ON. (az O = kapcsoló) | Archivo Black, `clamp(4.25rem,14.2vw,14.5rem)`, lh .84, tracking −.035em, uppercase; 1–8. hasáb | maszkolt sorfelemelkedés `0.3 + i×0.12s`, 1.1s expo |
| Kapcsoló | — | pirula `1.32em × .74em`, keret `.09em` fehér; gomb `.5em` kör | 1.15s-nál BE: gomb `translateX`, háttér zöld, 520ms `cubic-bezier(.34,1.56,.64,1)`; kattintható játék, `role="switch"` |
| Al-szöveg | a régi #content-2 mondat | Poppins 400 `clamp(16px,1.35vw,19px)`/1.5, fg-80, max 30rem; 9–12. hasáb, alulra | .75s |
| CTA | Cere ofertă → | elsődleges gomb | .9s |
| Másodlagos | Vezi referințele ↓ | szöveglink 14px fg-80 | .95s |
Mobil: egy hasáb, H1 `clamp(4.25rem,22vw,7rem)`, az al-szöveg és a gombok a cím alatt, gombok egymás alatt teljes szélességben ≤560px.

## 9. Szekciók
- **Együttműködések:** két ellentétes irányú marquee-sor (40 px/s, élein maszkolt elhalványulás), 84px-es lekerekített (22px) logócsempék, alapból `grayscale(.85) opacity .7`, hoverre színes. Alatta „Mind" gomb: rácsba vált (6/4/3 hasáb), a marquee megáll.
- **Referenciák:** 3 számláló egy sorban, 1px függőleges elválasztókkal; szám Archivo Black `clamp(2.6rem,6.2vw,5.75rem)`, `tabular-nums`, zöld „+"; számlálás 1.8s easeOutExpo, egyszer. Alatta vízszintes scroll-snap sín: kártya `clamp(232px,23vw,300px)` széles, 9:16, 24px sarok, poszter + alsó scrim, bal felső partnerchip (24px logó + név), középen 68px üveg lejátszógomb; kattintásra a kártya videóra vált (vezérlőkkel), a többi megáll. Desktopon 48px-es előre/hátra gombok.
- **Szolgáltatások:** papír lap (`--paper`), felső sarok 40px, `margin-top:-40px`. Három fekete kártya, desktopon `position:sticky; top:calc(96px + i×18px)`, egymásra csúsznak; kártyán belül 7/5 rács: bal oldalt `01 / 03`, cím Archivo Black `clamp(2rem,4.2vw,3.75rem)` zöld kiemeléssel, leírás 16px fg-60, három pont ikonokkal; jobb oldalt a termékkép.
- **Csapat:** 5/7 rács: bal címke + H2 + három bekezdés; jobb a csoportkép. Alatta portrésín (4:5, 20px sarok), név 15px Archivo Black, szerep 13px fg-60, LinkedIn ikon, ha van link.
- **GYIK:** desktopon 5/7, a cím sticky. `details/summary`, 22px kérdés Poppins 500, + ikon 45°-ot fordul, a válasz `interpolate-size` animációval nyílik (ahol nincs támogatás, azonnal).
- **Ajánlatkérés:** `--bg-2` kártya, 32px sarok, 1px keret, 6/6 rács. Bal: H2, al-szöveg, e-mail- és telefonsorok nyelvcímkével (RO/HU chip a zászló-emoji helyett). Jobb: Netlify-űrlap, 52px-es mezők, 14px sarok, zöld fókuszgyűrű, egyedi jelölőnégyzet, zöld küldés gomb teljes szélességben. A mezőnevek a régiek (name, company, email, phone, note, cb-policy), az űrlapnevek is (form-ro, form-hu, form-en), így a Netlify-beküldések folytonosak.
- **Lábléc:** nagy szóvédjegy nélkül, csak: © sor várossal, közösségi ikonok, e-mail, adatvédelmi link, nyelvlinkek.
- **Sütisáv:** bal alsó üvegkártya, max 440px, két gomb; logika változatlan (`localStorage.cookieConsent`, elfogadásra TikTok pixel).

## 10. Nem animált
Háttérrétegek, poszterfal, szemcse, marquee-n kívüli logók; nincs pulzálás, nincs lebegő folt, nincs videó-transition. `prefers-reduced-motion`: minden végállapotban, a marquee kézzel görgethető, a hero-videó nem indul el.

## 11. Elfogadás (első képernyő)
Teljes magas, lekerekített keretű hero, a mozgó háttérvideó (vagy szürke poszterfal) felett lent balra hatalmas fehér „BRANDS / ON." felirat, amelyben az O kapcsoló zöldre vált; jobbra lent rövid mondat és fehér „Cere ofertă" gomb zöld nyílchippel; fent lebegő üvegmenü logóval és nyelvváltóval. Mobilon (390px) semmi nem lóg ki, a cím két sorban marad.

## 12. Blog (/blog/, /blog-ro/)
Ugyanaz a menü, lábléc és sütisáv, mint a főoldalon; a menüben új „Blog" link (HU, RO), a nyelvváltó a másik nyelv blogcímlapjára visz.
- **Fejléc (címlap és cikk):** a hero szintvonalai (`vonal-base`/`vonal-anim`, csökkentett mozgásnál `vonal-static`) 50%-os átlátszósággal, alul elfúvó maszkkal. Címlap H1: „BLOG", Archivo Black `clamp(5rem,22vw,16rem)`, lead jobbra (≥900px).
- **Címlap:** témaszűrő pirulák (az `eyebrow` értékekből, darabszámmal; JS nélkül rejtve, minden cikk látszik; telefonon egy sorban húzható), a legfrissebb cikk nagy, kétoszlopos kártyán, a többi 1/2/3 oszlopos rácsban, alul kapcsolatfelvételi kártya.
- **Kártya:** `--bg-2`, 28px sarok, 16:10 borító. A borító a cikk saját, régi oldalról átvett `cover.svg`-je (változatlanul; ha egy cikknek nincs, a slugból generált fehér szintvonal-minta lép a helyére); hoverra (csak egérrel; billentyűzetes fókuszra is) a borító minden vonalán végigfut egy zöld vonal (a `Cover.tsx` minden vonalas alakzat mögé zöld másolatot tesz, a hover a `stroke-dashoffset`-et viszi nullára, 900ms), a nyíl 4px-et elmozdul. Lenyomáskor `scale(.985)`.
- **Cikkoldal:** nagy Archivo Black cím, három kiemelés-csempe (zöld érték), a bal oldalon (≥1100px) sticky tartalomjegyzék. A tartalomjegyzék egy függőleges vonal, a szakaszok pontok rajta: olvasás közben a zöld vonal a pontok között haladva festődik végig (a már olvasott pontok zöldek, az aktuális gyűrűs). 1100px alatt a képernyő tetején 3px-es zöld sáv mutatja a haladást. Törzs: 17px/1.75, szélesség 46rem, H2 Poppins 600, listák zöld jelzéssel, `art-note` doboz zöld bal sávval.
- **Cikk alja:** GYIK (a főoldali `details` stílussal), zöld CTA-gomb kártyán, „Olvass tovább" 3 kapcsolódó cikkel (azonos téma előre).

