/**
 * Az oldal összes szövege nyelvenként.
 * A szövegek a régi oldalról (Brandzone-v2teszt) jönnek; ahol új UI-felirat
 * kellett (pl. „Mind" gomb, lejátszás), az külön jelölve: // új
 *
 * A partnerek, referenciavideók és a GYIK a content/data.json-ban vannak
 * (ugyanaz a szerkezet, mint a régi repóban, hogy a Controller később ide írhasson).
 */
import { ROUTES, type Locale } from "@/lib/i18n";

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

/** Egy Google-értékelés. Az avatar vagy kép (src), vagy színes kör a név kezdőbetűjével. */
export type ReviewItem = {
  name: string;
  time: string;
  rating: 1 | 2 | 3 | 4 | 5;
  text: string;
  /** Pl. „Románból fordítva" – a szöveg alatt, halványan. */
  note?: string;
  avatar: { src: string } | { color: string; letter: string };
};

export type ReviewsCopy = {
  /** Nem látszik: a kártyasáv képernyőolvasós neve. */
  title: string;
  more: string;
  less: string;
  items: ReviewItem[];
};

export type Service = {
  id: string;
  title: TitlePart[];
  body: string;
  bullets: { icon: IconName; text: string }[];
  /** Opcionális: kép nélkül a kártya csak szöveges. bleed: a kép alja le van vágva (pl. telefon), ezért a doboz aljára igazítjuk. photo: teljes méretű fotó, a doboz egészét kitölti */
  /** Kép helyett animált panel (jelenleg csak az AI-kártya). */
  panel?: "ai";
  image?: { src: string; alt: string; width: number; height: number; bleed?: boolean; photo?: boolean };
};

/** Az AI-kártya animációjának (components/ai-panel) szövegei. */
export type AiPanelCopy = {
  prompt: string;
  btn: { idle: string; scan: string; load: string; done: string };
  chip: { orig: string; load: string; done: string };
  tagCar: string;
  tagOutfit: string;
  status: string;
  loading: string;
  altBefore: string;
  altVideo: string;
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
    /** A számláló melletti díj-logó: a Perfekt esettanulmányra mutat (nyelvenként a saját változatára). */
    award: { label: string; href: string };
    play: string; // új
    prev: string; // új
    next: string; // új
    reviews: ReviewsCopy;
  };
  services: { label: string; title: string; items: Service[]; aiPanel: AiPanelCopy };
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
  reels: { src: "/img/services/reels.webp", width: 1286, height: 1200, photo: true },
  commercial: { src: "/img/services/brandfilm-forgatas.webp", width: 1286, height: 1200, photo: true },
  ads: { src: "/img/services/kampany-elemzes.webp", width: 1286, height: 1200, photo: true },
  ugc: { src: "/img/services/ugc-forgatas.webp", width: 1286, height: 1200, photo: true },
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
    award: { label: "Marketing Diamond Awards: studiu de caz Perfekt", href: ROUTES.ro.caseStudy },
    play: "Redă videoclipul",
    prev: "Înapoi",
    next: "Înainte",
    reviews: {
      title: "Recenzii",
      more: "Citește mai mult",
      less: "Mai puțin",
      items: [
        {
          name: "Melinda Impex Instal SA",
          time: "acum 5 luni",
          rating: 5,
          text: "BrandZone nu a fost doar un executant în proiectele noastre, ci un partener adevărat. Au înțeles repede ce ne dorim și ne-au ajutat cu idei proactive. Colaborarea a fost mereu fluidă, profesionistă și flexibilă. Recomandăm cu încredere echipa BrandZone oricărei afaceri care caută videoclipuri de calitate și un partener de încredere.",
          note: "Tradus din maghiară",
          avatar: { src: "/img/reviews/melinda-instal.webp" },
        },
        {
          name: "Emese Cseke",
          time: "acum 5 luni",
          rating: 5,
          text: "Recomand echipa BrandZone tuturor! Creativi, punctuali, flexibili!",
          note: "Tradus din maghiară",
          avatar: { color: "#5C6BC0", letter: "E" },
        },
        {
          name: "Paul Sebastian Popa",
          time: "acum 4 luni",
          rating: 5,
          text: "O echipă profesionistă, alături de care am filmat și filmez materiale video de promovare excelente!",
          avatar: { color: "#00897B", letter: "P" },
        },
      ],
    },
  },
  services: {
    label: "Ce facem",
    title: "Servicii",
    items: [
      {
        id: "tiktok-reels",
        title: [{ text: "Prezență completă pe TikTok și " }, { text: "Reels", accent: true }],
        body: "Nu facem doar videoclipuri: dacă vrei, ne ocupăm de întreaga prezență a brandului tău pe canalele de short form. Gândim strategia și formatele recurente, aducem noi actorul potrivit sau îți pregătim echipa să apară în fața camerei. Scriem, filmăm și montăm videoclipurile, le postăm, gestionăm comunitatea și în fiecare lună analizăm ce funcționează. Tu doar aprobi.",
        bullets: [
          { icon: "compass", text: "Strategie, format și actori" },
          { icon: "clapper", text: "Producție de la scenariu la montaj" },
          { icon: "rocket", text: "Postare, comunitate, raport lunar" },
        ],
        image: { ...IMG.reels, alt: "Spatele unei camere Sony, cu imaginea filmată pe ecran" },
      },
      {
        id: "ai",
        panel: "ai",
        title: [{ text: "Videoclipuri cu " }, { text: "AI", accent: true }],
        body: "Atât AI cât e nevoie. La noi, AI-ul nu ține locul filmărilor, ci vine în completarea lor: e o unealtă bună, pe care o folosim atunci când chiar aduce un plus videoclipului. De exemplu, pentru o scenă care nu se poate filma, un fundal sau pentru a arăta cum funcționează un produs pe dinăuntru. Iar dacă proiectul o cere, realizăm întregul videoclip cu AI, dar ideea și direcția creativă vin mereu de la noi.",
        bullets: [
          { icon: "clapper", text: "De la o singură scenă, chiar până la un videoclip întreg." },
          { icon: "bolt", text: "Mai multe idei vizuale, mai puține limite." },
          { icon: "check", text: "Soluții originale, nu șabloane generate." },
        ],
      },
      {
        id: "commercial",
        title: [{ text: "Spoturi publicitare", accent: true }, { text: " și filme de brand" }],
        body: "Pentru atunci când un videoclip trebuie să reprezinte brandul pe termen lung. De la idee la filmare și montaj, ne ocupăm de tot: storyboard, locație și echipă, lumini, sunet, motion graphics, subtitrări. La cerere, din aceeași filmare scoatem și variantele short form, ca să ai material și pentru campanie.",
        bullets: [
          { icon: "check", text: "Concept puternic, execuție profesională" },
          { icon: "clapper", text: "De la storyboard la montajul final" },
          { icon: "devices", text: "Variante short form din aceeași filmare" },
        ],
        image: { ...IMG.commercial, alt: "Filmare într-un apartament: operator, prezentatoare și actor" },
      },
      {
        id: "ads",
        title: [{ text: "Videoclipuri publicitare", accent: true }, { text: " și gestionarea campaniilor" }],
        body: "Cele mai multe reclame nu eșuează din cauza setărilor, ci din cauza videoclipului. De aceea facem videoclipuri care atrag atenția din prima secundă și le spun oamenilor clar de ce să cumpere de la tine. Apoi tot noi setăm și optimizăm reclamele, așa că nu mai ai nevoie de o echipă pentru videoclipuri și de alta pentru reclame.",
        bullets: [
          { icon: "clapper", text: "Scenarii scrise ca să vândă" },
          { icon: "people", text: "Videoclip și campanie de la aceeași echipă" },
          { icon: "chart", text: "Rezultate măsurabile, raport lunar" },
        ],
        image: { ...IMG.ads, alt: "Panou de analiză cu vizionările TikTok și Reels" },
      },
      {
        id: "ugc",
        title: [{ text: "Creare conținut " }, { text: "UGC", accent: true }],
        body: "Oameni reali, care vorbesc despre produsul tău așa cum l-ar recomanda un prieten. Din baza noastră de peste 100 de creatori găsim o față autentică pentru orice public țintă. Suntem prezenți și la filmare, așa că nu primești filmări brute, ci videoclipuri gata montate.",
        bullets: [
          { icon: "people", text: "Peste 100 de creatori, pentru orice profil" },
          { icon: "clapper", text: "Filmare și montaj, tot la noi" },
          { icon: "globe", text: "În română, maghiară și engleză" },
        ],
        image: { ...IMG.ugc, alt: "Filmare UGC: o femeie prezintă un produs, filmată cu telefonul" },
      },
    ],
    aiPanel: {
      prompt: "Înlocuiește mașina cu un Porsche 911 argintiu, iar hanoracul cu un costum bleumarin.",
      btn: { idle: "Generează", scan: "Analizăm", load: "Generăm", done: "Gata" },
      chip: { orig: "Filmare originală", load: "Generare AI", done: "Videoclip AI" },
      tagCar: "MAȘINĂ → PORSCHE 911",
      tagOutfit: "ȚINUTĂ → COSTUM",
      status: "Analizăm scena",
      loading: "Generăm scena nouă",
      altBefore: "Filmarea originală: tânăr în hanorac lângă o mașină",
      altVideo: "Videoclip generat cu AI: aceeași scenă, cu costum și mașină sport",
    },
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
    award: { label: "Marketing Diamond Awards: Perfekt esettanulmány", href: ROUTES.hu.caseStudy },
    play: "Videó lejátszása",
    prev: "Előző",
    next: "Következő",
    reviews: {
      title: "Értékelések",
      more: "Olvass tovább",
      less: "Kevesebb",
      items: [
        {
          name: "Melinda Impex Instal SA",
          time: "5 hónapja",
          rating: 5,
          text: "A BrandZone nem csupán kivitelezőként vett részt projektjeinkben, hanem valódi partnerként. Gyorsan megértették a céljainkat, és proaktív ötletekkel segítették a munkát. Az együttműködés mindig gördülékeny, professzionális és rugalmas volt. Bátran ajánljuk a BrandZone csapatát minden olyan vállalkozásnak, amely minőségi videós tartalmakat és megbízható partnert keres.",
          avatar: { src: "/img/reviews/melinda-instal.webp" },
        },
        {
          name: "Cseke Emese",
          time: "5 hónapja",
          rating: 5,
          text: "Ajánlom mindenkinek a BrandZone csapatát! Kreatívak, pontosak, rugalmasak!",
          avatar: { color: "#5C6BC0", letter: "E" },
        },
        {
          name: "Paul Sebastian Popa",
          time: "4 hónapja",
          rating: 5,
          text: "Profi csapat, akikkel kiváló promóciós videókat forgattam, és forgatok ma is!",
          note: "Románból fordítva",
          avatar: { color: "#00897B", letter: "P" },
        },
      ],
    },
  },
  services: {
    label: "Amit csinálunk",
    title: "Szolgál\u00adtatások",
    items: [
      {
        id: "tiktok-reels",
        title: [{ text: "Teljes körű TikTok és " }, { text: "Reels", accent: true }, { text: " jelenlét" }],
        body: "Nem csak videókat gyártunk: ha szeretnéd, a márkád teljes short form jelenlétét is mi visszük. Kitaláljuk a stratégiát és a visszatérő formátumokat, és a szereplőt is mi hozzuk, vagy felkészítjük a saját csapatodat a kamera elé. Megírjuk, leforgatjuk és megvágjuk a videókat, kiposztoljuk őket, kezeljük a közösséget, és havonta megnézzük, mi működik. Neked annyi a dolgod, hogy jóváhagyd.",
        bullets: [
          { icon: "compass", text: "Stratégia, formátum és szereplő" },
          { icon: "clapper", text: "Gyártás a forgatókönyvtől a vágásig" },
          { icon: "rocket", text: "Posztolás, közösség, havi riport" },
        ],
        image: { ...IMG.reels, alt: "Sony kamera hátulja, a kijelzőn a forgatott képpel" },
      },
      {
        id: "ai",
        panel: "ai",
        title: [{ text: "AI", accent: true }, { text: "-támogatott videó" }],
        body: "Annyi AI, amennyi kell. Nálunk az AI nem a forgatás helyett van, hanem mellette: egy jó eszköz, amit akkor veszünk elő, amikor tényleg hozzátesz a videóhoz. Például egy jelenetnél, amit nem lehet leforgatni, egy háttérnél vagy egy termék belső működésénél. Ha pedig a projekt azt kívánja, a teljes videót is AI-jal rakjuk össze, de az ötletet és a kreatív irányt mindig mi adjuk.",
        bullets: [
          { icon: "clapper", text: "Egy jelenettől akár a teljes videóig." },
          { icon: "bolt", text: "Több vizuális ötlet, kevesebb korlát." },
          { icon: "check", text: "Egyedi megoldások, nem generált sablonok." },
        ],
      },
      {
        id: "commercial",
        title: [{ text: "Reklám­film", accent: true }, { text: " és márkafilm" }],
        body: "Amikor egy videónak hosszú távon kell képviselnie a márkát. Az ötlettől a forgatáson át a vágásig mindent megoldunk: storyboard, helyszín és stáb, világítás, hang, motion graphics, feliratok. Igény szerint ugyanabból a forgatásból a short form vágásokat is elkészítjük, így a kampányhoz is lesz anyag.",
        bullets: [
          { icon: "check", text: "Erős koncepció, profi kivitelezés" },
          { icon: "clapper", text: "Storyboardtól a végső vágásig" },
          { icon: "devices", text: "Short form verziók ugyanabból a forgatásból" },
        ],
        image: { ...IMG.commercial, alt: "Forgatás egy lakásban: operatőr, műsorvezető és szereplő" },
      },
      {
        id: "ads",
        title: [{ text: "Hirdetési videók", accent: true }, { text: " és kampány­kezelés" }],
        body: "A legtöbb hirdetés nem a beállításokon bukik el, hanem a videón. Ezért olyan videókat készítünk, amik az első másodpercben megfognak, és azt is elmondják, miért tőled vegyenek. Utána a hirdetéseket is mi állítjuk be és optimalizáljuk, így nem kell külön videóst és külön hirdetéskezelőt keresned.",
        bullets: [
          { icon: "clapper", text: "Eladásra írt forgatókönyvek" },
          { icon: "people", text: "Videó és kampány ugyanattól a csapattól" },
          { icon: "chart", text: "Mérhető eredmények, havi riport" },
        ],
        image: { ...IMG.ads, alt: "Elemzői felület a TikTok és Reels megtekintések alakulásáról" },
      },
      {
        id: "ugc",
        title: [{ text: "UGC", accent: true }, { text: " tartalom­gyártás" }],
        body: "Valós emberek, akik úgy beszélnek a termékedről, ahogy egy ismerős ajánlaná. A 100+ fős szereplőbázisunkból bármilyen célcsoporthoz megtaláljuk a hiteles arcot. A forgatáson is ott vagyunk, így nem nyers felvételt kapsz, hanem kész, vágott videót.",
        bullets: [
          { icon: "people", text: "100+ szereplő bármilyen profilhoz" },
          { icon: "clapper", text: "Forgatás és vágás is nálunk" },
          { icon: "globe", text: "Magyar, román és angol nyelven" },
        ],
        image: { ...IMG.ugc, alt: "UGC forgatás: egy nő terméket mutat, telefonnal rögzítve" },
      },
    ],
    aiPanel: {
      prompt: "Cseréld le a kocsit egy ezüst Porsche 911-re, a pulóvert pedig egy sötétkék öltönyre.",
      btn: { idle: "Generálás", scan: "Elemzés", load: "Generálás", done: "Kész" },
      chip: { orig: "Eredeti felvétel", load: "AI generálás", done: "AI videó" },
      tagCar: "AUTÓ → PORSCHE 911",
      tagOutfit: "RUHA → ÖLTÖNY",
      status: "Jelenet elemzése",
      loading: "Új jelenet generálása",
      altBefore: "Az eredeti felvétel: fiatal férfi kapucnis pulóverben egy autó mellett",
      altVideo: "AI-jal generált videó: ugyanaz a jelenet öltönnyel és sportautóval",
    },
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
    award: { label: "Marketing Diamond Awards: Perfekt case study", href: ROUTES.en.caseStudy },
    play: "Play video",
    prev: "Previous",
    next: "Next",
    reviews: {
      title: "Reviews",
      more: "Read more",
      less: "Show less",
      items: [
        {
          name: "Melinda Impex Instal SA",
          time: "5 months ago",
          rating: 5,
          text: "BrandZone wasn’t just a contractor on our projects, they were a true partner. They quickly understood our goals and supported the work with proactive ideas. Working together was always smooth, professional and flexible. We confidently recommend the BrandZone team to any business looking for quality video content and a reliable partner.",
          note: "Translated from Hungarian",
          avatar: { src: "/img/reviews/melinda-instal.webp" },
        },
        {
          name: "Emese Cseke",
          time: "5 months ago",
          rating: 5,
          text: "I recommend the BrandZone team to everyone! Creative, precise and flexible!",
          note: "Translated from Hungarian",
          avatar: { color: "#5C6BC0", letter: "E" },
        },
        {
          name: "Paul Sebastian Popa",
          time: "4 months ago",
          rating: 5,
          text: "A professional team I’ve shot excellent promotional videos with, and I still do!",
          note: "Translated from Romanian",
          avatar: { color: "#00897B", letter: "P" },
        },
      ],
    },
  },
  services: {
    label: "What we do",
    title: "Services",
    items: [
      {
        id: "tiktok-reels",
        title: [{ text: "Complete TikTok and " }, { text: "Reels", accent: true }, { text: " presence" }],
        body: "We don't just make videos: if you want, we run your brand's entire short-form presence. We build the strategy and the recurring formats, and we bring the right talent or get your own team ready for the camera. We write, shoot and edit the videos, post them, manage the community, and check what's working every month. All you have to do is approve.",
        bullets: [
          { icon: "compass", text: "Strategy, format and talent" },
          { icon: "clapper", text: "Production from script to final cut" },
          { icon: "rocket", text: "Posting, community, monthly report" },
        ],
        image: { ...IMG.reels, alt: "Back of a Sony camera showing the shot on its screen" },
      },
      {
        id: "ai",
        panel: "ai",
        title: [{ text: "AI", accent: true }, { text: "-assisted video" }],
        body: "As much AI as it takes. For us, AI doesn't replace filming, it works alongside it: a great tool we reach for when it truly adds something to the video. Think of a scene that can't be filmed, a background, or how a product works on the inside. And if the project calls for it, we can create the entire video with AI, but the idea and the creative direction always come from us.",
        bullets: [
          { icon: "clapper", text: "From a single scene to a full video." },
          { icon: "bolt", text: "More visual ideas, fewer limits." },
          { icon: "check", text: "Custom solutions, not generated templates." },
        ],
      },
      {
        id: "commercial",
        title: [{ text: "Commercials", accent: true }, { text: " and brand films" }],
        body: "For when a video needs to represent your brand for the long run. From idea to shoot to edit, we handle everything: storyboard, location and crew, lighting, sound, motion graphics, subtitles. On request, we also cut short-form versions from the same shoot, so you have material for your campaign too.",
        bullets: [
          { icon: "check", text: "Strong concept, professional execution" },
          { icon: "clapper", text: "From storyboard to final cut" },
          { icon: "devices", text: "Short-form versions from the same shoot" },
        ],
        image: { ...IMG.commercial, alt: "On set in an apartment: camera operator, presenter and actor" },
      },
      {
        id: "ads",
        title: [{ text: "Ad videos", accent: true }, { text: " and campaign management" }],
        body: "Most ads don't fail because of the settings, they fail because of the video. That's why we make videos that grab attention in the first second and tell people exactly why they should buy from you. Then we set up and optimize the ads ourselves, so you don't need one team for video and another for ads.",
        bullets: [
          { icon: "clapper", text: "Scripts written to sell" },
          { icon: "people", text: "Video and campaign from the same team" },
          { icon: "chart", text: "Measurable results, monthly report" },
        ],
        image: { ...IMG.ads, alt: "Analytics dashboard showing TikTok and Reels views" },
      },
      {
        id: "ugc",
        title: [{ text: "UGC", accent: true }, { text: " content creation" }],
        body: "Real people talking about your product the way a friend would recommend it. From our pool of 100+ creators, we find an authentic face for any target audience. We're on set too, so you don't get raw footage, you get finished, edited videos.",
        bullets: [
          { icon: "people", text: "100+ creators for any profile" },
          { icon: "clapper", text: "Filming and editing in-house" },
          { icon: "globe", text: "In English, Hungarian and Romanian" },
        ],
        image: { ...IMG.ugc, alt: "UGC shoot: a woman presenting a product, filmed on a phone" },
      },
    ],
    aiPanel: {
      prompt: "Swap the car for a silver Porsche 911 and the hoodie for a navy suit.",
      btn: { idle: "Generate", scan: "Analyzing", load: "Generating", done: "Done" },
      chip: { orig: "Original footage", load: "AI generating", done: "AI video" },
      tagCar: "CAR → PORSCHE 911",
      tagOutfit: "OUTFIT → SUIT",
      status: "Analyzing scene",
      loading: "Generating new scene",
      altBefore: "Original footage: young man in a hoodie next to a car",
      altVideo: "AI-generated video: the same scene with a suit and a sports car",
    },
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
