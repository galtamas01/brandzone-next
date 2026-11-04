import { BLOG_COPY } from "@/content/blog-copy";
import { formatDate, postPath, type PostSummary } from "@/lib/blog-shared";
import { ArrowRight } from "@/components/Icons";
import { Cover } from "./Cover";
import styles from "./PostCard.module.css";

type Props = {
  post: PostSummary;
  /** A legfrissebb cikk nagy, kétoszlopos kártyán. */
  featured?: boolean;
  /** A kártya címének szintje (a címlapon h2, a „Olvass tovább" blokkban h3). */
  as?: "h2" | "h3";
};

/** Cikkkártya: a cikk egyedi borítója, téma, cím, kivonat. Hoverra a borító vonalain végigfut egy zöld vonal. */
export function PostCard({ post, featured = false, as: Heading = "h2" }: Props) {
  const copy = BLOG_COPY[post.lang];
  return (
    <a
      href={postPath(post.lang, post.slug)}
      className={`${styles.card} ${featured ? styles.featured : ""}`}
    >
      <div className={styles.media}>
        <Cover seed={post.slug} svg={post.cover} />
        <span className={styles.chip}>{post.eyebrow}</span>
      </div>
      <div className={styles.body}>
        <p className={styles.meta}>
          <time dateTime={post.datePublished}>{formatDate(post.datePublished, post.lang)}</time>
          <span aria-hidden="true">·</span>
          <span>{post.readingTime}</span>
        </p>
        <Heading className={styles.title}>{post.title}</Heading>
        <p className={styles.excerpt}>{post.excerpt}</p>
        <span className={styles.more}>
          {copy.read}
          <ArrowRight size={16} />
        </span>
      </div>
    </a>
  );
}
