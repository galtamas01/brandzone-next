"use client";

import { useRef } from "react";
import styles from "./CaseStudy.module.css";

type Video = { src: string; poster: string; title: string };

/**
 * Két álló videó a szöveg végén. Nem töltődnek le előre (preload="none", a poszter látszik), és ha az egyiket
 * elindítják, a másik megáll, hogy ne szóljon egyszerre kettő.
 */
export function CaseStudyVideos({ videos, label, note }: { videos: Video[]; label: string; note?: string }) {
  const refs = useRef<(HTMLVideoElement | null)[]>([]);

  const onPlay = (index: number) => {
    refs.current.forEach((v, i) => {
      if (v && i !== index && !v.paused) v.pause();
    });
  };

  return (
    <section className={styles.videos} aria-label={label} data-reveal>
      <p className={styles.videosLabel}>{label}</p>
      <div className={styles.videoGrid}>
        {videos.map((v, i) => (
          <figure key={v.src} className={styles.video}>
            <video
              ref={(el) => {
                refs.current[i] = el;
              }}
              className={styles.player}
              src={v.src}
              poster={v.poster}
              width={576}
              height={1024}
              controls
              playsInline
              preload="none"
              aria-label={v.title}
              onPlay={() => onPlay(i)}
            />
            <figcaption className={styles.caption}>{v.title}</figcaption>
          </figure>
        ))}
      </div>
      {note ? <p className={styles.note}>{note}</p> : null}
    </section>
  );
}
