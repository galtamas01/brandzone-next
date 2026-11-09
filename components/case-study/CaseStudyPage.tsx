import { CASE_STUDY_COPY, CASE_STUDY_VIDEOS } from "@/content/case-study/copy";
import { absolute } from "@/lib/blog-shared";
import type { CaseStudy } from "@/lib/case-study";
import { ROUTES } from "@/lib/i18n";
import { ArticleRail } from "@/components/blog/ArticleRail";
import { BlogShell } from "@/components/blog/BlogShell";
import { ContourBackdrop } from "@/components/blog/ContourBackdrop";
import styles from "@/components/blog/Article.module.css";
import { CaseStudyVideos } from "./CaseStudyVideos";

/** A cím kiemelt szava (pl. a márkanév) zölden jelenik meg. */
function renderTitle(title: string, accent?: string) {
  const i = accent ? title.indexOf(accent) : -1;
  if (!accent || i < 0) return title;
  return (
    <>
      {title.slice(0, i)}
      <span style={{ color: "var(--green)" }}>{accent}</span>
      {title.slice(i + accent.length)}
    </>
  );
}

/**
 * Esettanulmány-oldal: a blogcikkek dizájnja (szintvonalas fejléc, zöld folyamatvonalas
 * tartalomjegyzék, törzs), de GYIK, árajánlat-kártya és kapcsolódó cikkek nélkül. A törzs végén a videók.
 */
export function CaseStudyPage({ study }: { study: CaseStudy }) {
  const { lang } = study;
  const copy = CASE_STUDY_COPY[lang];
  const url = absolute(ROUTES[lang].caseStudy);
  const logo = absolute("/brandzone-logo.jpg");
  const videos = CASE_STUDY_VIDEOS[study.slug] ?? [];

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: study.title,
      description: study.description,
      inLanguage: lang,
      datePublished: study.datePublished,
      dateModified: study.datePublished,
      image: logo,
      mainEntityOfPage: url,
      author: { "@type": "Organization", name: "BrandZone", url: absolute("/") },
      publisher: { "@type": "Organization", name: "BrandZone", logo: { "@type": "ImageObject", url: logo } },
    },
  ];

  return (
    <BlogShell
      lang={lang}
      jsonLd={jsonLd}
      current={null}
      langHrefs={{ ro: ROUTES.ro.caseStudy, hu: ROUTES.hu.caseStudy, en: ROUTES.en.caseStudy }}
    >
      <header className={styles.hero}>
        <ContourBackdrop />
        <div className={`container ${styles.heroInner}`}>
          <a href={`${ROUTES[lang].home}#referenciak`} className={styles.back}>
            <span aria-hidden="true">←</span> {copy.back}
          </a>
          <p className={styles.eyebrow}>{study.eyebrow}</p>
          <h1 className={styles.title}>{renderTitle(study.title, study.titleAccent)}</h1>
        </div>
      </header>


      <div className={`container ${styles.layout}`} style={{ paddingBottom: "clamp(72px, 10vw, 140px)" }}>
        <ArticleRail toc={study.toc} bodyId="post-body" label={copy.toc} />

        <article id="post-body" className={styles.article}>
          <div className={styles.prose} dangerouslySetInnerHTML={{ __html: study.html }} />
          {videos.length ? <CaseStudyVideos videos={videos} label={copy.videosLabel} note={copy.videosNote} /> : null}
        </article>
      </div>
    </BlogShell>
  );
}
