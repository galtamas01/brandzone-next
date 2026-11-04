"use client";

import { useEffect, useRef, useState } from "react";
import type { Dictionary } from "@/content/copy";
import { TRACKING } from "@/lib/site";
import styles from "./CookieBanner.module.css";

const KEY = "cookieConsent"; // a régi oldallal azonos kulcs: a meglévő döntések megmaradnak

type Consent = "accepted" | "rejected";

function readConsent(): Consent | null {
  try {
    const v = localStorage.getItem(KEY);
    return v === "accepted" || v === "rejected" ? v : null;
  } catch {
    return null; // privát mód / tiltott tárhely
  }
}

function saveConsent(v: Consent) {
  try {
    localStorage.setItem(KEY, v);
  } catch {
    /* nem tudjuk elmenteni – a döntés csak erre a látogatásra él */
  }
}

/** Marketing-pixelek, csak hozzájárulás után (a régi scripts/cookies.js logikája). */
function loadMarketingPixels() {
  const w = window as unknown as { ttq?: unknown; TiktokAnalyticsObject?: string };
  if (w.ttq) return;
  /* eslint-disable */
  // TikTok Pixel – hivatalos beágyazókód, változatlanul
  (function (w: any, d: Document, t: string) {
    w.TiktokAnalyticsObject = t;
    var ttq = (w[t] = w[t] || []);
    ttq.methods = ["page", "track", "identify", "instances", "debug", "on", "off", "once", "ready", "alias", "group", "enableCookie", "disableCookie", "holdConsent", "revokeConsent", "grantConsent"];
    ttq.setAndDefer = function (t: any, e: string) {
      t[e] = function () {
        t.push([e].concat(Array.prototype.slice.call(arguments, 0)));
      };
    };
    for (var i = 0; i < ttq.methods.length; i++) ttq.setAndDefer(ttq, ttq.methods[i]);
    ttq.instance = function (t: string) {
      for (var e = ttq._i[t] || [], n = 0; n < ttq.methods.length; n++) ttq.setAndDefer(e, ttq.methods[n]);
      return e;
    };
    ttq.load = function (e: string, n?: any) {
      var r = "https://analytics.tiktok.com/i18n/pixel/events.js",
        o = n && n.partner;
      ttq._i = ttq._i || {};
      ttq._i[e] = [];
      ttq._i[e]._u = r;
      ttq._t = ttq._t || {};
      ttq._t[e] = +new Date();
      ttq._o = ttq._o || {};
      ttq._o[e] = n || {};
      var s = d.createElement("script");
      s.type = "text/javascript";
      s.async = true;
      s.src = r + "?sdkid=" + e + "&lib=" + t;
      d.head.appendChild(s);
      void o;
    };
    ttq.load(TRACKING.tiktokPixelId);
    ttq.page();
  })(window, document, "ttq");
  /* eslint-enable */
}

export function CookieBanner({ dict, policyHref }: { dict: Dictionary; policyHref: string }) {
  const [visible, setVisible] = useState(false);
  const decided = useRef(false); // ha a látogató már döntött, a görgetés-figyelő ne hozza vissza a sávot

  useEffect(() => {
    const consent = readConsent();
    if (consent === "accepted") {
      loadMarketingPixels();
      return;
    }
    if (consent === null) {
      // Az első benyomás (hero) maradjon tiszta: a sáv az első görgetéskor
      // vagy legkésőbb 6 mp után jelenik meg. A TikTok pixel addig úgysem tölt be.
      const show = () => {
        if (!decided.current) setVisible(true);
      };
      const t = window.setTimeout(show, 6000);
      window.addEventListener("scroll", show, { once: true, passive: true });
      return () => {
        window.clearTimeout(t);
        window.removeEventListener("scroll", show);
      };
    }
  }, []);

  const decide = (v: Consent) => {
    decided.current = true;
    saveConsent(v);
    setVisible(false);
    if (v === "accepted") loadMarketingPixels();
  };

  return (
    <div
      className={styles.banner}
      data-visible={visible || undefined}
      role="region"
      aria-label={dict.cookie.title}
      aria-hidden={!visible}
      inert={!visible}
    >
      <p className={styles.title}>{dict.cookie.title}</p>
      <p className={styles.text}>
        {dict.cookie.textBefore}
        <a href={policyHref} target="_blank" rel="noopener">
          {dict.cookie.textLink}
        </a>
        {dict.cookie.textAfter}
      </p>
      <div className={styles.actions}>
        <button type="button" className={styles.accept} onClick={() => decide("accepted")}>
          {dict.cookie.accept}
        </button>
        <button type="button" className={styles.reject} onClick={() => decide("rejected")}>
          {dict.cookie.reject}
        </button>
      </div>
    </div>
  );
}
