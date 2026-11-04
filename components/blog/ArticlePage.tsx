import { BLOG_COPY } from "@/content/blog-copy";
import { absolute, formatDate, getRelated, indexPath, postPath, summarize, type Post } from "@/lib/blog";
import { Plus } from "@/components/Icons";
import faq from "@/components/Faq.module.css";
import { ArticleRail } from "./ArticleRail";
import { BlogCta } from "./BlogCta";
import { BlogShell } from "./BlogShell";
import { ContourBackdrop } from "./ContourBackdrop";
import { PostCard } from "./PostCard";
import styles from "./Article.module.css";

const stripTags = (html: string) => html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();

/** Egy cikk oldala: szintvonalas fejléc, kiemelések, zöld folyamatvonalas tartalomjegyzék, törzs, GYIK, CTA, kapcsolódó cikkek. */
export function ArticlePage({ post }: { post: Post }) {
  const copy = BLOG_COPY[post.lang];
  const related = getRelated(post, 3);
  const url = absolute(postPath(post.lang, post.slug));
  const logo = absolute("/brandzone-logo.jpg");

  const jsonLd: object[] = [
    {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      headline: post.title,
      description: post.description,
      inLanguage: post.lang,
      datePublished: post.datePublished,
      dateModified: post.datePublished,
      image: logo,
      mainEntityOfPage: url,
      author: { "@type": "Organization", name: "BrandZone", url: absolute("/") },
      publisher: { "@type": "Organization", name: "BrandZone", logo: { "@type": "ImageObject", url: logo } },
    },
  ];
  if (post.faq.length) {
    jsonLd.push({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: post.faq.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: stripTags(f.a) },
      })),
    });
  }

  return (
    <BlogShell lang={post.lang} jsonLd={jsonLd}>
      <header className={styles.hero}>
        <ContourBackdrop />
        <div className={`container ${styles.heroInner}`}>
          <a href={indexPath(post.lang)} className={styles.back}>
            <span aria-hidden="true">←</span> {copy.back}
          </a>
          <p className={styles.eyebrow}>{post.eyebrow}</p>
          <h1 className={styles.title}>{post.title}</h1>
          <p className={styles.meta}>
            <time dateTime={post.datePublished}>{formatDate(post.datePublished, post.lang)}</time>
            <span aria-hidden="true">·</span>
            <span>{post.readingTime}</span>
            <span aria-hidden="true">·</span>
            <span>{copy.by}</span>
          </p>
        </div>
      </header>

      {post.highlights.length ? (
        <section className="container" aria-label={post.title}>
          <ul className={styles.highlights}>
            {post.highlights.map((h, i) => (
              <li key={i} className={styles.highlight} data-reveal style={{ "--i": i } as React.CSSProperties}>
                <span className={styles.value}>{h.value}</span>
                <span className={styles.hlabel}>{h.label}</span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <div className={`container ${styles.layout}`}>
        <ArticleRail toc={post.toc} bodyId="post-body" label={copy.toc} />

        <article id="post-body" className={styles.article}>
          <div className={styles.prose} dangerouslySetInnerHTML={{ __html: post.html }} />

          {post.faq.length ? (
            <section className={styles.faq} aria-labelledby="post-faq">
              <h2 id="post-faq" className={styles.faqTitle}>
                {copy.faqTitle}
              </h2>
              <div className={faq.list}>
                {post.faq.map((f, i) => (
                  <details key={i} className={faq.item}>
                    <summary className={faq.question}>
                      <span>{f.q}</span>
                      <span className={faq.icon} aria-hidden="true">
                        <Plus size={18} />
                      </span>
                    </summary>
                    <div className={faq.answer}>
                      <p dangerouslySetInnerHTML={{ __html: f.a }} />
                    </div>
                  </details>
                ))}
              </div>
            </section>
          ) : null}
        </article>
      </div>

      <section className={styles.after}>
        <div className="container">
          <BlogCta locale={post.lang} title={post.ctaTitle} text={post.ctaText} button={copy.ctaButton} />
        </div>
      </section>

      {related.length ? (
        <section className={styles.related} aria-labelledby="related-title">
          <div className="container">
            <h2 id="related-title" className={styles.relatedTitle}>
              {copy.related}
            </h2>
            <div className={styles.relatedGrid}>
              {related.map((p) => (
                <PostCard key={p.slug} post={summarize(p)} as="h3" />
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </BlogShell>
  );
}
