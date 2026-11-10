"use client";

import { useState } from "react";
import type { ReferenceVideo } from "@/content/data";
import { posterUrl, videoUrl } from "@/lib/site";
import { Play } from "@/components/Icons";
import styles from "./References.module.css";

/**
 * Egy referenciavideó. Alapból csak a poszter töltődik be (semmi videó-adat),
 * kattintásra a kártya natív <video controls>-ra vált és elindul.
 */
export function ReelCard({ video, playLabel }: { video: ReferenceVideo; playLabel: string }) {
  const [active, setActive] = useState(false);

  return (
    <article className={styles.card} data-active={active || undefined}>
      {active ? (
        <video
          className={styles.media}
          src={videoUrl(video.id)}
          poster={posterUrl(video.id)}
          controls
          autoPlay
          playsInline
          preload="metadata"
          aria-label={video.title}
        />
      ) : (
        <button type="button" className={styles.poster} onClick={() => setActive(true)}>
          <img
            className={styles.media}
            src={posterUrl(video.id)}
            alt=""
            width={576}
            height={1024}
            loading="lazy"
            decoding="async"
          />
          <span className={styles.scrim} aria-hidden="true" />
          <span className={styles.play} aria-hidden="true">
            <Play size={22} />
          </span>
          <span className="sr-only">
            {playLabel}: {video.title}
          </span>
        </button>
      )}

      <div className={styles.chip}>
        {video.logo && <img src={video.logo} alt="" width={28} height={28} loading="lazy" />}
        <span>{video.title}</span>
      </div>
    </article>
  );
}
