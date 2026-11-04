import { BLOG_COPY } from "@/content/blog-copy";
import { absolute, getPosts, indexPath, summarize, type BlogLang } from "@/lib/blog";
import { BlogShell } from "./BlogShell";
import { BlogCta } from "./BlogCta";
import { ContourBackdrop } from "./ContourBackdrop";
import { PostGrid } from "./PostGrid";
import styles from "./Blog.module.css";

/** A blog címlapja (/blog/ és /blog-ro/): szintvonalas fejléc, témaszűrő, kártyák. */
export function BlogIndexPage({ lang }: { lang: BlogLang }) {
  const copy = BLOG_COPY[lang];
  const posts = getPosts(lang);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "BrandZone Blog",
    url: absolute(indexPath(lang)),
    inLanguage: lang,
    description: copy.ogDescription,
    publisher: {
      "@type": "Organization",
      name: "BrandZone",
      logo: { "@type": "ImageObject", url: absolute("/brandzone-logo.jpg") },
    },
  };

  return (
    <BlogShell lang={lang} jsonLd={[jsonLd]}>
      <section className={styles.hero} aria-labelledby="blog-title">
        <ContourBackdrop />
        <div className={`container ${styles.heroInner}`}>
          <p className={styles.label}>{copy.label}</p>
          <h1 id="blog-title" className={styles.title}>
            {copy.title}
          </h1>
          <p className={styles.lead}>{copy.lead}</p>
        </div>
      </section>

      <section className={styles.list}>
        <div className="container">
          <PostGrid posts={posts.map(summarize)} lang={lang} />
        </div>
      </section>

      <section className={styles.cta}>
        <div className="container">
          <BlogCta locale={lang} title={copy.indexCtaTitle} text={copy.indexCtaText} button={copy.indexCtaButton} />
        </div>
      </section>
    </BlogShell>
  );
}
