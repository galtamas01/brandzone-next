"use client";

import { useState } from "react";
import { BLOG_COPY } from "@/content/blog-copy";
import { getCategories, type BlogLang, type PostSummary } from "@/lib/blog-shared";
import { PostCard } from "./PostCard";
import styles from "./PostGrid.module.css";

/**
 * A blog címlap kártyái témaszűrővel. A legfrissebb (a szűrés után első) cikk nagy kártyán áll,
 * a többi rácsban. JS nélkül a szűrősáv rejtve marad és minden cikk látszik.
 */
export function PostGrid({ posts, lang }: { posts: PostSummary[]; lang: BlogLang }) {
  const copy = BLOG_COPY[lang];
  const [cat, setCat] = useState<string | null>(null);
  const [touched, setTouched] = useState(false);

  const categories = getCategories(posts);
  const visible = cat ? posts.filter((p) => p.eyebrow === cat) : posts;
  const [first, ...rest] = visible;

  const pick = (next: string | null) => {
    setCat(next);
    setTouched(true);
  };

  return (
    <div>
      <div className={styles.bar}>
        <div className={styles.filters} role="group" aria-label={copy.filterLabel}>
          <button type="button" className={styles.chip} aria-pressed={cat === null} onClick={() => pick(null)}>
            {copy.filterAll}
            <span className={styles.n}>{posts.length}</span>
          </button>
          {categories.map((c) => (
            <button
              key={c.name}
              type="button"
              className={styles.chip}
              aria-pressed={cat === c.name}
              onClick={() => pick(c.name)}
            >
              {c.name}
              <span className={styles.n}>{c.count}</span>
            </button>
          ))}
        </div>
        <p className={styles.count} aria-live="polite">
          {touched ? copy.count(visible.length) : null}
        </p>
      </div>

      <div key={cat ?? "all"} className={styles.list} data-touched={touched || undefined}>
        {first ? (
          <div className={styles.lead}>
            <PostCard post={first} featured />
          </div>
        ) : (
          <p className={styles.empty}>{copy.empty}</p>
        )}
        {rest.length ? (
          <div className={styles.grid}>
            {rest.map((p) => (
              <PostCard key={p.slug} post={p} />
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}
