/**
 * A blog felületi szövegei (nem a cikkeké). A cikkek a content/blog/<nyelv>/<slug>/ mappában vannak.
 * A blog csak magyarul és románul létezik, ezért nem a főoldali Dictionary része.
 */
import type { BlogLang } from "@/lib/blog-shared";

export type BlogCopy = {
  nav: string;
  metaTitle: string;
  metaDescription: string;
  ogDescription: string;
  label: string;
  title: string;
  lead: string;
  filterLabel: string;
  filterAll: string;
  count: (n: number) => string;
  read: string;
  back: string;
  toc: string;
  published: string;
  by: string;
  faqTitle: string;
  related: string;
  defaultCtaTitle: string;
  defaultCtaText: string;
  ctaButton: string;
  indexCtaTitle: string;
  indexCtaText: string;
  indexCtaButton: string;
  empty: string;
};

export const BLOG_COPY: Record<BlogLang, BlogCopy> = {
  hu: {
    nav: "Blog",
    metaTitle: "Blog - videós tartalomgyártás erdélyi cégeknek | BrandZone",
    metaDescription:
      "Gyakorlati cikkek erdélyi cégeknek a videós tartalomgyártásról: árak, esettanulmányok, kétnyelvű tartalom és iparági útmutatók.",
    ogDescription: "Gyakorlati cikkek erdélyi cégeknek a videós tartalomgyártásról.",
    label: "BrandZone blog",
    title: "Blog",
    lead: "Gyakorlati cikkek arról, hogyan működik a videós tartalomgyártás egy erdélyi cég mindennapjaiban. Árak, számok, esettanulmányok, tévedések.",
    filterLabel: "Témák szerint szűrés",
    filterAll: "Mind",
    count: (n) => `${n} cikk`,
    read: "Olvasom",
    back: "Vissza a bloghoz",
    toc: "Ebben a cikkben",
    published: "Megjelent",
    by: "BrandZone",
    faqTitle: "Gyakori kérdések",
    related: "Olvass tovább",
    defaultCtaTitle: "Nézzük meg együtt, hol tart nálatok",
    defaultCtaText:
      "Írj nekünk, és átbeszéljük. Nem árajánlattal kezdünk, hanem azzal, hogy megnézzük, van-e egyáltalán értelme.",
    ctaButton: "Árajánlatot kérek",
    indexCtaTitle: "Van olyan téma, amiről szívesen olvasnál?",
    indexCtaText:
      "Írj nekünk, és megírjuk. Ha pedig konkrét kérdésed van a saját cégedről, azt is szívesen átbeszéljük.",
    indexCtaButton: "Kapcsolatfelvétel",
    empty: "Ebben a témában még nincs cikk.",
  },
  ro: {
    nav: "Blog",
    metaTitle: "Blog - producție video pentru companii | BrandZone",
    metaDescription:
      "Articole practice despre producția video pentru companii: prețuri, studii de caz și ghiduri din industrie.",
    ogDescription: "Articole practice despre producția video pentru companii.",
    label: "Blogul BrandZone",
    title: "Blog",
    lead: "Articole practice despre cum funcționează producția video în viața de zi cu zi a unei companii. Prețuri, cifre, studii de caz și greșeli frecvente.",
    filterLabel: "Filtrare după temă",
    filterAll: "Toate",
    count: (n) => `${n} articole`,
    read: "Citesc",
    back: "Înapoi la blog",
    toc: "În acest articol",
    published: "Publicat",
    by: "BrandZone",
    faqTitle: "Întrebări frecvente",
    related: "Citește mai departe",
    defaultCtaTitle: "Hai să vedem împreună unde sunteți acum",
    defaultCtaText:
      "Scrie-ne și discutăm. Nu începem cu o ofertă, ci cu o privire asupra situației tale, ca să vedem dacă are sens.",
    ctaButton: "Cere o ofertă",
    indexCtaTitle: "Există un subiect despre care ai dori să citești?",
    indexCtaText:
      "Scrie-ne și îl vom aborda. Dacă ai o întrebare specifică despre propria afacere, cu plăcere o putem discuta.",
    indexCtaButton: "Contactează-ne",
    empty: "Încă nu există articole pe această temă.",
  },
};
