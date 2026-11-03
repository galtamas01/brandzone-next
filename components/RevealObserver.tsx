"use client";

import { useEffect } from "react";

/**
 * Egyetlen IntersectionObserver az egész oldalnak: a `data-reveal` attribútumú
 * elemek `is-in` osztályt kapnak, amikor 15%-ban láthatóvá válnak (egyszer).
 * A rejtés a CSS-ben csak `html.js` alatt él, így JS nélkül minden látszik.
 * Biztonsági háló: ha valami 2.5 mp múlva is rejtve maradna a hajtás felett, megjelenik.
 */
export function RevealObserver() {
  useEffect(() => {
    const items = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"));
    if (!("IntersectionObserver" in window)) {
      items.forEach((el) => el.classList.add("is-in"));
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in");
            io.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -6% 0px" },
    );
    items.forEach((el) => io.observe(el));

    const failSafe = window.setTimeout(() => {
      items.forEach((el) => {
        if (el.getBoundingClientRect().top < window.innerHeight) el.classList.add("is-in");
      });
    }, 2500);

    return () => {
      io.disconnect();
      window.clearTimeout(failSafe);
    };
  }, []);

  return null;
}
