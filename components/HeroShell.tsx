"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { PowerSwitch } from "@/components/ui/PowerSwitch";

/**
 * A hero „BRANDS ON." kapcsolójának állapota.
 *  - boot: az oldal betöltése, a kapcsoló még KI állásban, a hero a megszokott képet mutatja
 *  - on:   bekapcsolva (alap)
 *  - off:  a látogató kikapcsolta → „BRANDS OFF." (a megjelenést a CSS váltja a section[data-power] alapján)
 * KI állásban a hero teljesen fekete, csak a cím és a lead marad (a menüsor és a sütisáv is eltűnik).
 * Ha a látogató kikapcsolja, majd görget, a kapcsoló magától visszakapcsol, így az oldal nem ragad KI állásban.
 */
type Power = "boot" | "on" | "off";
const Ctx = createContext<{ power: Power; toggle: () => void } | null>(null);

export function HeroShell({
  children,
  className,
  labelledBy,
}: {
  children: ReactNode;
  className?: string;
  labelledBy: string;
}) {
  const [power, setPower] = useState<Power>("boot");
  const [flash, setFlash] = useState(false);
  const [touched, setTouched] = useState(false);
  const ref = useRef<HTMLElement>(null);
  const flashTimer = useRef<number | undefined>(undefined);

  // Betöltéskor a kapcsoló magától BE kattan (mint eddig).
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const t = window.setTimeout(() => setPower((p) => (p === "boot" ? "on" : p)), reduce ? 0 : 1150);
    return () => window.clearTimeout(t);
  }, []);

  // Ha a hero kikerül a képből, KI állásból visszakapcsol (hang és felvillanás nélkül).
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) setPower((p) => (p === "off" ? "on" : p));
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => () => window.clearTimeout(flashTimer.current), []);

  // KI állásban az egész oldal elsötétül: a hero a <html>-en jelzi, hogy a menüsor és a sütisáv is eltűnjön.
  useEffect(() => {
    const root = document.documentElement;
    root.toggleAttribute("data-hero-off", power === "off");
    return () => root.removeAttribute("data-hero-off");
  }, [power]);

  // KI állásban már egy kis görgetés is visszakapcsol: a látogató sosem ragad a fekete képernyőn.
  useEffect(() => {
    if (power !== "off") return;
    const onScroll = () => {
      if (window.scrollY > 24) setPower("on");
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [power]);

  const toggle = useCallback(() => {
    setTouched(true);
    setPower((p) => {
      const next: Power = p === "off" ? "on" : "off";
      if (next === "on") {
        // visszakapcsoláskor minden vonal egy pillanatra felvillan zölden
        setFlash(true);
        window.clearTimeout(flashTimer.current);
        flashTimer.current = window.setTimeout(() => setFlash(false), 1200);
      }
      return next;
    });
  }, []);

  return (
    <Ctx.Provider value={{ power, toggle }}>
      <section
        ref={ref}
        className={className}
        aria-labelledby={labelledBy}
        data-power={power}
        data-flash={flash || undefined}
      >
        {children}
        {/* Képernyőolvasónak: csak a felhasználói kapcsolgatás után jelez, a betöltéskori automatikus BE-t nem. */}
        <p className="sr-only" role="status" aria-live="polite">
          {touched ? (power === "off" ? "BRANDS OFF." : "BRANDS ON.") : ""}
        </p>
      </section>
    </Ctx.Provider>
  );
}

export function HeroSwitch({ label }: { label: string }) {
  const ctx = useContext(Ctx);
  if (!ctx) return null;
  return <PowerSwitch on={ctx.power === "on"} onToggle={ctx.toggle} label={label} />;
}
