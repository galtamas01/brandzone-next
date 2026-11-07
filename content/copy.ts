/**
 * Az oldal összes szövege nyelvenként.
 * A szövegek a régi oldalról (Brandzone-v2teszt) jönnek; ahol új UI-felirat
 * kellett (pl. „Mind" gomb, lejátszás), az külön jelölve: // új
 *
 * A partnerek, referenciavideók és a GYIK a content/data.json-ban vannak
 * (ugyanaz a szerkezet, mint a régi repóban, hogy a Controller később ide írhasson).
 */
import type { Locale } from "@/lib/i18n";

export type IconName =
  | "check"
  | "compass"
  | "rocket"
  | "clapper"
  | "chart"
  | "devices"
  | "people"
  | "bolt"
  | "globe";

export type TitlePart = { text: string; accent?: boolean };

export type Service = {
  id: string;
  title: TitlePart[];
  body: string;
  bullets: { icon: IconName; text: string }[];
  /** bleed: a kép alja le van vágva (pl. telefon), ezért a doboz aljára igazítjuk */
  image: { src: string; alt: string; width: number; height: number; bleed?: boolean };
};

export type Social = { network: "tiktok" | "instagram" | "facebook" | "youtube"; href: string };
export type Contact = { tag?: string; value: string; href: string };

export type Dictionary = {
  meta: { title: string; description: string; ogTitle: string; ogDescription: string };
  nav: {
    about: string;
    references: string;
    services: string;
    faq: string;
    cta: string;
    openMenu: string; // új
    closeMenu: string; // új
    language: string; // új
    home: string;
    skip: string; // új
  };
  hero: {
    eyebrow: string;
    lead: string;
    leadRest?: string;
    cta: string;
    secondary: string; // új
  };
  clients: { label: string; title: string; showAll: string; showLess: string };
  references: {
    label: string;
    title: string;
    counters: { videos: string; views: string; followers: string };
    play: string; // új
    prev: string; // új
    next: string; // új
  };
  services: { label: string; title: string; items: Service[] };
  team: {
    label: string;
    title: string;
    paragraphs: string[];
    groupAlt: string;
    linkedin: string; // új
    prev: string;
    next: string;
  };
  faq: { label: string; title: string };
  contact: {
    label: string;
    title: string;
    lead: string;
    emailLabel: string;
    phoneLabel: string;
    emails: Contact[];
    phones: Contact[];
    form: {
      name: string;
      namePh: string;
      company: string;
      companyPh: string;
      email: string;
      emailPh: string;
      phone: string;
      phonePh: string;
      note: string;
      notePh: string; // új
      consentBefore: string;
      consentLink: string;
      consentAfter: string;
      submit: string;
      required: string; // új
    };
  };
  footer: { location: string; email: string; policy: string; socials: Social[]; backToTop: string };
  cookie: {
    title: string;
    textBefore: string;
    textLink: string;
    textAfter: string;
    accept: string;
    reject: string;
  };
  thanks: { metaTitle: string; title: string; lead: string; back: string };
  policy: { metaTitle: string; back: string };
  jsonLd: { description: string; sameAs: string[]; telephone: string; email: string };
};

const SOCIAL_RO: Social[] = [
  { network: "tiktok", href: "https://www.tiktok.com/@brandzone.romania" },
  { network: "instagram", href: "https://www.instagram.com/brandzone_romania" },
  { network: "facebook", href: "https://www.facebook.com/profile.php?id=61582787137798" },
  { network: "youtube", href: "https://youtube.com/@brandzone_romania" },
];

const SOCIAL_HU: Social[] = [
  { network: "tiktok", href: "https://www.tiktok.com/@brandzone_" },
  { network: "instagram", href: "https://www.instagram.com/brandzone.cc/" },
  { network: "facebook", href: "https://www.facebook.com/profile.php?id=61565849556737" },
  { network: "youtube", href: "https://www.youtube.com/@BrandZone.0" },
];

const mail = (value: string, tag?: string): Contact => ({ tag, value, href: `mailto:${value}` });
const tel = (value: string, tag?: string): Contact => ({
  tag,
  value,
  href: `tel:${value.replace(/\s+/g, "")}`,
});

const IMG = {
  tiktok: { src: "/img/services/tiktok-reels.webp", width: 1000, height: 880, bleed: true },
  commercial: { src: "/img/services/commercial.webp", width: 1000, height: 800 },
  ugc: { src: "/img/services/ugc.webp", width: 1000, height: 800 },
};

const ro: Dictionary = {
  meta: {
    title: "BRANDZONE – Producție video și conținut pentru social media",
    description:
      "BrandZone, producție video și creare de conținut în România. Videoclipuri TikTok, Reels, reclame și conținut UGC pentru afacere. Echipă tânără și creativă.",
    ogTitle: "BrandZone - Romania",
    ogDescription: "Agenție de producție video și creare conținut social media în România.",
  },
  nav: {
    about: "Despre noi",
    references: "Referințe",
    services: "Servicii",
    faq: "Întrebări frecvente",
    cta: "Ofertă",
    openMenu: "Deschide meniul",
    closeMenu: "Închide meniul",
    language: "Limba",
    home: "Pagina principală",
    skip: "Sari la conținut",
  },
  hero: {
    eyebrow: "Created by BRANDZONE",
    lead: "Construim conexiuni reale între branduri și oameni",
    leadRest: "– prin conținut video.",
    cta: "Cere ofertă",
    secondary: "Vezi referințele",
  },
  clients: {
    label: "Parteneri",
    title: "Colabo\u00adrările noastre",
    showAll: "Vezi toate",
    showLess: "Arată mai puțin",
  },
  references: {
    label: "Portofoliu",
    title: "Referințe",
    counters: { videos: "Videoclipuri", views: "Vizualizări", followers: "Urmăritori" },
    play: "Redă videoclipul",
    prev: "Înapoi",
    next: "Înainte",
  },
  services: {
    label: "Ce facem",
    title: "Servicii",
    items: [
      {
        id: "tiktok-reels",
        title: [{ text: "Creare conținut TikTok, " }, { text: "Reels", accent: true }],
        body: "Pentru noi, conținutul short form nu înseamnă videoclipuri separate, ci un proces organic de construire a brandului pe termen lung. O comunicare care funcționează la nivelul brandurilor de top și la care oamenii se conectează.",
        bullets: [
          { icon: "check", text: "Conținut specific brandului" },
          { icon: "compass", text: "Gândire strategică" },
          { icon: "rocket", text: "Project management complet" },
        ],
        image: { ...IMG.tiktok, alt: "Smartphone care afișează pagina TikTok a lanțului Perfekt" },
      },
      {
        id: "commercial",
        title: [{ text: "Producție video " }, { text: "publicitară", accent: true }],
        body: "De la idee la filmare și până la montaj – ne ocupăm de tot: storyboard, locație și echipă, iluminare–sunet, motion graphics, subtitrări. De asemenea, oferim gestionarea completă a campaniilor de promovare, pentru ca materialul realizat să ajungă la publicul țintă.",
        bullets: [
          { icon: "clapper", text: "Concepte creative puternice și execuție profesională." },
          { icon: "chart", text: "Videoclipuri care atrag atenția și aduc rezultate." },
          { icon: "devices", text: "Conținut optimizat pentru mai multe platforme." },
        ],
        image: { ...IMG.commercial, alt: "Ecran de laptop care arată procesul de editare" },
      },
      {
        id: "ugc",
        title: [{ text: "Creare conținut " }, { text: "UGC", accent: true }],
        body: "Lucrăm cu o bază vastă de creatori, astfel încât găsim mereu fața potrivită pentru brandul tău, indiferent de industrie sau public țintă. Oferim creatori cu care publicul tău se poate identifica cu adevărat.",
        bullets: [
          { icon: "people", text: "Oameni autentici, reali – conținut care inspiră încredere." },
          { icon: "bolt", text: "Producție de conținut rapidă și flexibilă." },
          { icon: "globe", text: "Videoclipuri multilingve: pentru public român, maghiar și englez." },
        ],
        image: { ...IMG.ugc, alt: "Cameră care surprinde o femeie zâmbitoare ținând un telefon" },
      },
    ],
  },
  team: {
    label: "Despre noi",
    title: "Echipa",
    paragraphs: [
      "Accentul nostru este pus pe conținutul video de tip short-form, care ajută la evidențierea în zgomotul din social media și aduce rezultate reale.",
      "Suntem o echipă tânără și creativă, care se adaptează rapid și aduce mereu idei noi pentru a impulsiona proiectele. Pe lângă acestea, realizăm și alte tipuri de conținut, fie că este vorba despre clipuri publicitare sau videoclipuri de campanie.",
      "Cu sediul în Odorheiu Secuiesc, filmăm regulat în Cluj-Napoca și acceptăm proiecte pe întreg teritoriul României.",
    ],
    groupAlt: "Echipa BrandZone",
    linkedin: "Profil LinkedIn",
    prev: "Înapoi",
    next: "Înainte",
  },
  faq: { label: "Ai întrebări?", title: "Întrebări frecvente" },
  contact: {
    label: "Contact",
    title: "Cerere ofertă",
    lead: "Contactează-ne și îți vom răspunde în maxim 24 de ore!",
    emailLabel: "Adresa noastră de e-mail",
    phoneLabel: "Număr de telefon",
    emails: [mail("contact@brandzone.ro", "RO"), mail("info@brandzone.ro", "HU")],
    phones: [tel("+40 775 150 152", "RO"), tel("+40 743 877 295", "HU")],
    form: {
      name: "Nume și Prenume",
      namePh: "Nume și prenume",
      company: "Nume companie",
      companyPh: "Nume companie",
      email: "Adresă e-mail",
      emailPh: "Adresă e-mail",
      phone: "Număr de telefon",
      phonePh: "Număr de telefon",
      note: "Detaliază cum te putem ajuta",
      notePh: "Spune-ne pe scurt despre brand și ce ți-ai dori…",
      consentBefore: "Accept ",
      consentLink: "Politica de Confidențialitate",
      consentAfter: " și sunt de acord cu prelucrarea datelor mele.",
      submit: "Solicită ofertă",
      required: "obligatoriu",
    },
  },
  footer: {
    location: "Romania – Odorheiu Secuiesc",
    email: "contact@brandzone.ro",
    policy: "Politica de Confidențialitate",
    socials: SOCIAL_RO,
    backToTop: "Înapoi sus",
  },
  cookie: {
    title: "Notificare privind utilizarea cookie-urilor",
    textBefore:
      "Acest site utilizează cookie-uri pentru a asigura funcționarea corectă și pentru a analiza traficul. Prin apăsarea butonului „Acceptă toate”, sunteți de acord cu utilizarea tehnologiilor de marketing. Mai multe detalii găsiți în ",
    textLink: "Politica de Confidențialitate",
    textAfter: ".",
    accept: "Acceptă toate",
    reject: "Doar cele necesare",
  },
  thanks: {
    metaTitle: "Mulțumim | BRANDZONE",
    title: "Mulțumim!",
    lead: "Am primit formularul tău. Revenim cu un răspuns în cel mult 24 de ore.",
    back: "Înapoi la pagina principală",
  },
  policy: { metaTitle: "Politica de Confidențialitate | BRANDZONE", back: "Înapoi la pagina principală" },
  jsonLd: {
    description: "Agenție de producție video și creare conținut social media în România.",
    sameAs: SOCIAL_RO.map((s) => s.href),
    telephone: "+40 775 150 152",
    email: "contact@brandzone.ro",
  },
};

const hu: Dictionary = {
  meta: {
    title: "BRANDZONE – Videós tartalomgyártás Erdélyben",
    description:
      "A BrandZone székelyudvarhelyi, erdélyi tartalomgyártó csapat. A teljes kampánytervezéstől és kreatív stratégiától kezdve a gyártáson át egészen a terjesztésig mindent egy kézben tartunk. Magyar, román és angol nyelven vállalunk gyártást.",
    ogTitle: "BrandZone - Romania",
    ogDescription: "Teljeskörű videós tartalomgyártás Székelyudvarhelyen és egész Romániában.",
  },
  nav: {
    about: "Rólunk",
    references: "Referenciák",
    services: "Szolgáltatások",
    faq: "GYIK",
    cta: "Árajánlat",
    openMenu: "Menü megnyitása",
    closeMenu: "Menü bezárása",
    language: "Nyelv",
    home: "Főoldal",
    skip: "Ugrás a tartalomhoz",
  },
  hero: {
    eyebrow: "Created by BRANDZONE",
    lead: "Valódi kapcsolatot építünk márkák és emberek között",
    leadRest: "– videós tartalmakkal.",
    cta: "Árajánlatot kérek",
    secondary: "Referenciák",
  },
  clients: {
    label: "Partnerek",
    title: "Együtt\u00adműködéseink",
    showAll: "Mind",
    showLess: "Kevesebb",
  },
  references: {
    label: "Munkáink",
    title: "Referen\u00adciák",
    counters: { videos: "Videó", views: "Nézettség", followers: "Követő" },
    play: "Videó lejátszása",
    prev: "Előző",
    next: "Következő",
  },
  services: {
    label: "Amit csinálunk",
    title: "Szolgál\u00adtatások",
    items: [
      {
        id: "tiktok-reels",
        title: [{ text: "TikTok, " }, { text: "Reels", accent: true }, { text: " tartalom\u00adgyártás" }],
        body: "A short form tartalom nálunk nem különálló videókat jelent, hanem egy organikusan felépített, hosszú távú márkaépítést. Olyan kommunikációt, amely a vezető márkák szintjén működik, és amelyhez az emberek kapcsolódnak.",
        bullets: [
          { icon: "check", text: "Márkaazonos tartalmak" },
          { icon: "compass", text: "Stratégiai gondolkodás" },
          { icon: "rocket", text: "Teljes körű projektmenedzsment" },
        ],
        image: { ...IMG.tiktok, alt: "Okostelefon a Perfekt üzletlánc TikTok oldalával" },
      },
      {
        id: "commercial",
        title: [{ text: "Reklám\u00advideó", accent: true }, { text: " készítés" }],
        body: "Az ötlettől a forgatáson át a vágásig mindent megoldunk: storyboard, helyszín és stáb, világítás–hang, motion graphics, feliratok. A videókhoz teljes körű hirdetéskezelést is biztosítunk, hogy az elkészült tartalom a megfelelő célközönséghez jusson el.",
        bullets: [
          { icon: "clapper", text: "Erős kreatív koncepció és profi kivitelezés." },
          { icon: "chart", text: "Videó, ami figyelmet kelt és eredményt hoz." },
          { icon: "devices", text: "Több platformra optimalizált tartalom." },
        ],
        image: { ...IMG.commercial, alt: "Laptop képernyő rajta a vágási munkafolyamatokkal" },
      },
      {
        id: "ugc",
        title: [{ text: "UGC", accent: true }, { text: " tartalom\u00adgyártás" }],
        body: "Hatalmas szereplőbázissal dolgozunk, így bármely iparágra és célcsoportra megtaláljuk a márkához passzoló arcot, olyan szereplőt biztosítunk, akivel a közönséged azonosulni tud.",
        bullets: [
          { icon: "people", text: "Hiteles, valós emberek – bizalomépítő tartalom." },
          { icon: "bolt", text: "Gyors és rugalmas tartalomgyártás." },
          { icon: "globe", text: "Többnyelvű videók: magyar, román és angol közönségnek." },
        ],
        image: { ...IMG.ugc, alt: "Kamera benne egy mosolygó nővel, aki telefont tart a kezében" },
      },
    ],
  },
  team: {
    label: "Rólunk",
    title: "A csapat",
    paragraphs: [
      "Nálunk a fókusz a short form videós tartalmakon van, amelyek segítenek kitűnni a social media zajából és valódi eredményeket hoznak.",
      "Egy fiatal, kreatív csapatként dolgozunk, akik gyorsan alkalmazkodnak és mindig új ötletekkel viszik előre a projekteket. Emellett egyéb tartalmakat is készítünk, legyen szó reklámfilmekről vagy kampányvideókról.",
      "Székelyudvarhelyről indulva dolgozunk, rendszeresen forgatunk Kolozsváron, és Románia egész területén vállalunk projekteket.",
    ],
    groupAlt: "A BrandZone csapata",
    linkedin: "LinkedIn-profil",
    prev: "Előző",
    next: "Következő",
  },
  faq: { label: "Kérdések", title: "GYIK" },
  contact: {
    label: "Kapcsolat",
    title: "Árajánlat kérése",
    lead: "Vedd fel velünk a kapcsolatot, és 24 órán belül visszajelzünk!",
    emailLabel: "E-mail cím elérhetőségünk",
    phoneLabel: "Telefonszám elérhetőségünk",
    emails: [mail("info@brandzone.ro", "HU"), mail("contact@brandzone.ro", "RO")],
    phones: [tel("+40 743 877 295", "HU"), tel("+40 775 150 152", "RO")],
    form: {
      name: "Vezetéknév és keresztnév",
      namePh: "Vezetéknév és keresztnév",
      company: "Cégnév",
      companyPh: "Cégnév",
      email: "Email cím",
      emailPh: "Email cím",
      phone: "Telefonszám",
      phonePh: "Telefonszám",
      note: "Fejtsd ki, hogy miben segíthetünk",
      notePh: "Írj pár mondatot a márkádról és arról, mit szeretnél…",
      consentBefore: "Elfogadom az ",
      consentLink: "Adatvédelmi Tájékoztatót",
      consentAfter: " és hozzájárulok az adataim kezeléséhez.",
      submit: "Árajánlatot kérek",
      required: "kötelező",
    },
  },
  footer: {
    location: "Romania – Székelyudvarhely",
    email: "info@brandzone.ro",
    policy: "Adatvédelmi tájékoztató",
    socials: SOCIAL_HU,
    backToTop: "Vissza a tetejére",
  },
  cookie: {
    title: "Tájékoztatás a cookie-k használatáról",
    textBefore:
      "A weboldal a megfelelő működés és a látogatottság elemzése érdekében sütiket használ. A „Minden süti elfogadása” gombra kattintva hozzájárul a marketing célú technológiák működéséhez. További információt az ",
    textLink: "Adatvédelmi tájékoztatóban",
    textAfter: " talál.",
    accept: "Minden süti elfogadása",
    reject: "Kizárólag a szükségesek",
  },
  thanks: {
    metaTitle: "Köszönjük | BRANDZONE",
    title: "Köszönjük!",
    lead: "Megkaptuk a kitöltött űrlapot. 24 órán belül jelentkezünk.",
    back: "Vissza a főoldalra",
  },
  policy: { metaTitle: "Adatvédelmi tájékoztató | BRANDZONE", back: "Vissza a főoldalra" },
  jsonLd: {
    description: "Valódi kapcsolatot építünk márkák és emberek között - videós tartalmakkal.",
    sameAs: SOCIAL_HU.slice(0, 3).map((s) => s.href),
    telephone: "+40 743 433 182",
    email: "info@brandzone.ro",
  },
};

const en: Dictionary = {
  meta: {
    title: "BRANDZONE – Video production & social media content",
    description:
      "At BrandZone video production is our passion. From full campaign planning and creative strategy to production and distribution, we handle everything under one roof. We offer production in Hungarian, Romanian, and English.",
    ogTitle: "BrandZone - English",
    ogDescription: "BrandZone official site - English",
  },
  nav: {
    about: "About Us",
    references: "References",
    services: "Services",
    faq: "FAQ",
    cta: "Get a quote",
    openMenu: "Open menu",
    closeMenu: "Close menu",
    language: "Language",
    home: "Home",
    skip: "Skip to content",
  },
  hero: {
    eyebrow: "Created by BRANDZONE",
    lead: "Helping brands build real connections with people",
    leadRest: "through video content.",
    cta: "Get a quote",
    secondary: "See our work",
  },
  clients: {
    label: "Partners",
    title: "Our Collabo\u00adrations",
    showAll: "View all",
    showLess: "Show less",
  },
  references: {
    label: "Work",
    title: "References",
    counters: { videos: "Videos", views: "Views", followers: "Followers" },
    play: "Play video",
    prev: "Previous",
    next: "Next",
  },
  services: {
    label: "What we do",
    title: "Services",
    items: [
      {
        id: "tiktok-reels",
        title: [{ text: "TikTok, " }, { text: "Reels", accent: true }, { text: " content creation" }],
        body: "For us, short-form content is not about standalone videos, but about building a brand organically over the long term. A type of communication that works at the level of leading brands and that people genuinely connect with.",
        bullets: [
          { icon: "check", text: "Brand-aligned content" },
          { icon: "compass", text: "Strategic thinking" },
          { icon: "rocket", text: "End-to-end project management" },
        ],
        image: { ...IMG.tiktok, alt: "Smartphone showing the Perfekt retail chain TikTok page" },
      },
      {
        id: "commercial",
        title: [{ text: "Commercial", accent: true }, { text: " video production" }],
        body: "From idea to shooting to editing – we take care of everything: storyboard, location and crew, lighting–sound, motion graphics, subtitles. We also provide full ad campaign management to ensure your content reaches the right audience.",
        bullets: [
          { icon: "clapper", text: "Strong creative concepts and professional execution." },
          { icon: "chart", text: "Videos that grab attention and deliver results." },
          { icon: "devices", text: "Content optimized for multiple platforms." },
        ],
        image: { ...IMG.commercial, alt: "Laptop screen showing the editing process" },
      },
      {
        id: "ugc",
        title: [{ text: "UGC", accent: true }, { text: " content creation" }],
        body: "We work with a vast talent pool, so we can always find the right face for your brand in any industry or target group. We provide creators your audience can genuinely relate to.",
        bullets: [
          { icon: "people", text: "Authentic, real people – trust-building content." },
          { icon: "bolt", text: "Fast and flexible content production." },
          { icon: "globe", text: "Multilingual videos: English, Hungarian and Romanian audiences." },
        ],
        image: { ...IMG.ugc, alt: "Camera showing a smiling woman holding a phone" },
      },
    ],
  },
  team: {
    label: "About us",
    title: "The Team",
    paragraphs: [
      "Our focus is on short-form video content that helps you stand out from the social media noise and delivers real results.",
      "We work as a young, creative team that adapts quickly and always pushes projects forward with fresh ideas. In addition, we produce other types of content, ranging from commercials to campaign videos.",
      "Based in Odorheiu Secuiesc, we film regularly in Cluj-Napoca and take on projects all across Romania.",
    ],
    groupAlt: "The BrandZone team",
    linkedin: "LinkedIn profile",
    prev: "Previous",
    next: "Next",
  },
  faq: { label: "Questions", title: "FAQ" },
  contact: {
    label: "Contact",
    title: "Offer request",
    lead: "Contact us and we’ll get back to you within 24 hours!",
    emailLabel: "Our email address",
    phoneLabel: "Our phone number",
    emails: [mail("info@brandzone.ro")],
    phones: [tel("+40 743 433 182")],
    form: {
      name: "Full Name",
      namePh: "Full Name",
      company: "Company Name",
      companyPh: "Company Name",
      email: "Email Address",
      emailPh: "Email Address",
      phone: "Phone Number",
      phonePh: "Phone Number",
      note: "Explain how we can help",
      notePh: "A few lines about your brand and what you have in mind…",
      consentBefore: "I accept the ",
      consentLink: "Privacy Policy",
      consentAfter: " and consent to the processing of my data.",
      submit: "Request Quote",
      required: "required",
    },
  },
  footer: {
    location: "Romania – Odorheiu Secuiesc",
    email: "info@brandzone.ro",
    policy: "Privacy Policy",
    socials: SOCIAL_RO,
    backToTop: "Back to top",
  },
  cookie: {
    title: "Cookie Usage Notice",
    textBefore:
      "This website uses cookies to ensure proper functionality and to analyze traffic. By clicking “Accept All”, you consent to the use of marketing technologies. For more information, please read our ",
    textLink: "Privacy Policy",
    textAfter: ".",
    accept: "Accept All",
    reject: "Necessary Only",
  },
  thanks: {
    metaTitle: "Thank you | BRANDZONE",
    title: "Thank you!",
    lead: "We received your form. We will get back to you within 24 hours.",
    back: "Back to the homepage",
  },
  policy: { metaTitle: "Privacy Notice | BRANDZONE", back: "Back to the homepage" },
  jsonLd: {
    description: "Video production and social media agency in Romania.",
    sameAs: SOCIAL_RO.map((s) => s.href),
    telephone: "+40 743 433 182",
    email: "info@brandzone.ro",
  },
};

export const DICTIONARIES: Record<Locale, Dictionary> = { ro, hu, en };
export const getDictionary = (locale: Locale) => DICTIONARIES[locale];
