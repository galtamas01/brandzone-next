"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./HeroVideo.module.css";

type Props = {
  /** Nagy kijelzőre (1080p). */
  src: string;
  /** Keskeny kijelzőre (720p), hogy telefonon ne töltsön fölöslegesen sokat. */
  srcSmall: string;
};

type Connection = { saveData?: boolean; effectiveType?: string };

/**
 * A hero háttérvideója: némítva, ismétlődve, enyhe sötétítéssel. A hero feketéből indul, és onnan úszik be vagy a
 * videó (a `playing` esemény után), vagy ha az nem indul el, a szintvonalas háttér. A vonalak tehát a tartalék, ha
 *  - a videó nem töltődik be (hiba, lassú hálózat),
 *  - a böngésző nem engedi az automatikus indítást (pl. energiatakarékos mód iOS-en),
 *  - a látogató csökkentett mozgást vagy adatspórolást kér (ilyenkor a videót le sem töltjük).
 * Képernyőn kívül szünetel (akku, CPU). A `data-hero-bg` jelzés (init → video | lines) alapján a Hero.module.css
 * dönti el, mikor látszanak a vonalak.
 */

type Bg = "init" | "video" | "lines";

/**
 * Ennyi ideig várunk a videó indulására, ha nincs egyértelmű hiba (lassú hálózat). Az egyértelmű esetekben (hiba,
 * tiltott automatikus indítás, csökkentett mozgás, adatspórolás) nem várunk: a vonalak azonnal beúsznak. A vonalak
 * tehát csak akkor jelennek meg, ha a videó tényleg nem tud elindulni; ha később mégis elindul, beúszik fölé.
 */
const VIDEO_WAIT_MS = 6000;

export function HeroVideo({ src, srcSmall }: Props) {
  const ref = useRef<HTMLVideoElement>(null);
  const [bg, setBg] = useState<Bg>("init");

  useEffect(() => {
    const video = ref.current;
    if (!video) return;

    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const conn = (navigator as Navigator & { connection?: Connection })
      .connection;
    const saveData =
      Boolean(conn?.saveData) || /(^|-)2g$/.test(conn?.effectiveType ?? "");
    if (reduce || saveData) {
      setBg("lines");
      return;
    }

    // A némítás attribútumként is kell, különben az iOS nem indítja el automatikusan.
    video.defaultMuted = true;
    video.muted = true;
    video.setAttribute("muted", "");
    video.setAttribute("playsinline", "");

    let pausedByUs = false; // a képernyőn kívüli szünet nem számít hibának
    // Safari számít felhasználói gesztusnak: click, mouseup, touchend, keydown (a pointerdown nem biztos).
    const unlockEvents = [
      "pointerdown",
      "pointerup",
      "mouseup",
      "click",
      "touchend",
      "keydown",
    ] as const;

    const tryPlay = () => {
      if (pausedByUs) return;
      video.play().catch((err: unknown) => {
        // AbortError: csak újraindítás/forrásváltás közben jön, nem tiltás (pl. fejlesztői módban a dupla effekt).
        if (err instanceof DOMException && err.name === "AbortError") return;
        /* az automatikus indítás tiltott: a vonalak úsznak be, az első gesztusnál újra próbáljuk */
        setBg((b) => (b === "init" ? "lines" : b));
      });
    };
    const removeUnlock = () =>
      unlockEvents.forEach((e) => window.removeEventListener(e, tryPlay));

    const onPlaying = () => {
      window.clearTimeout(waitTimer);
      setBg("video");
      removeUnlock();
    };
    // Ha a rendszer állítja le (nem mi), a vonalak visszakerülnek a videó helyére.
    const onPause = () => {
      if (!pausedByUs) setBg((b) => (b === "video" ? "lines" : b));
    };
    const onError = () => {
      window.clearTimeout(waitTimer);
      setBg("lines");
      removeUnlock();
    };

    video.addEventListener("playing", onPlaying);
    video.addEventListener("pause", onPause);
    video.addEventListener("error", onError);
    video.addEventListener("canplay", tryPlay); // Safari néha csak adat érkezése után indul
    unlockEvents.forEach((e) =>
      window.addEventListener(e, tryPlay, { passive: true }),
    );

    const waitTimer = window.setTimeout(
      () => setBg((b) => (b === "init" ? "lines" : b)),
      VIDEO_WAIT_MS,
    );

    video.src = window.matchMedia("(max-width: 899px)").matches
      ? srcSmall
      : src;
    tryPlay();

    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        pausedByUs = false;
        tryPlay();
      } else {
        pausedByUs = true;
        video.pause();
      }
    });
    io.observe(video);

    return () => {
      window.clearTimeout(waitTimer);
      io.disconnect();
      removeUnlock();
      video.removeEventListener("playing", onPlaying);
      video.removeEventListener("pause", onPause);
      video.removeEventListener("error", onError);
      video.removeEventListener("canplay", tryPlay);
      video.pause();
      video.removeAttribute("src");
      video.load();
    };
  }, [src, srcSmall]);

  return (
    <div className={styles.root} data-hero-bg={bg} aria-hidden="true">
      <video
        ref={ref}
        className={styles.video}
        muted
        loop
        playsInline
        preload="none"
        disablePictureInPicture
        tabIndex={-1}
      />
    </div>
  );
}
