"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Háttérvideó, amely csak akkor jelenik meg, ha ténylegesen lejátszható.
 * - mindig némítva, autoplay + playsinline (iOS-hez mind a négy kell)
 * - képernyőn kívül szünetel (akku, CPU)
 * - csökkentett mozgásnál nem indul el, ilyenkor a poszterfal látszik
 * - ha a forrás nem érhető el, rejtve marad (a poszterfal a fallback)
 */
export function HeroVideo({ src, className }: { src: string; className?: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    video.muted = true;
    video.playsInline = true;
    video.src = src;

    const onReady = () => setReady(true);
    const onError = () => setFailed(true);
    video.addEventListener("loadeddata", onReady, { once: true });
    video.addEventListener("error", onError, { once: true });
    video.play().catch(() => {
      /* autoplay letiltva (pl. energiatakarékos mód): a poszterfal marad */
    });

    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) video.play().catch(() => {});
      else video.pause();
    });
    io.observe(video);

    return () => {
      io.disconnect();
      video.removeEventListener("loadeddata", onReady);
      video.removeEventListener("error", onError);
    };
  }, [src]);

  if (failed) return null;

  return (
    <video
      ref={ref}
      className={className}
      data-ready={ready || undefined}
      muted
      loop
      playsInline
      autoPlay
      preload="auto"
      aria-hidden="true"
      tabIndex={-1}
    />
  );
}
