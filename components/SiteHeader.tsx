"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Dictionary } from "@/content/copy";
import { LOCALES, ROUTES, type Locale } from "@/lib/i18n";
import { BLOG_COPY } from "@/content/blog-copy";
import { indexPath } from "@/lib/blog-shared";
import { RollButton } from "@/components/ui/RollButton";
import styles from "./SiteHeader.module.css";

type Props = {
  locale: Locale;
  dict: Dictionary;
  /** Aloldalon (pl. blog) a horgonylinkek a főoldalra mutatnak, nem az aktuális oldalra. */
  subpage?: boolean;
  /** Az aktuális szekció a menüben (aria-current). */
  current?: "blog";
  /** Nyelvváltó célok felülírása (alapból a főoldalak), pl. a blogban a másik nyelv blogcímlapja. */
  langHrefs?: Partial<Record<Locale, string>>;
};

const LANG_NAMES: Record<Locale, string> = { ro: "Română", hu: "Magyar", en: "English" };

export function SiteHeader({ locale, dict, subpage = false, current, langHrefs }: Props) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const burgerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Aloldalon a főoldal útvonala kerül az horgony elé ("/" + "#rolunk", "/hu" + "#rolunk").
  const anchor = subpage ? ROUTES[locale].home : "";
  const links: { href: string; label: string; current?: boolean }[] = [
    { href: `${anchor}#rolunk`, label: dict.nav.about },
    { href: `${anchor}#referenciak`, label: dict.nav.references },
    { href: `${anchor}#szolgaltatasok`, label: dict.nav.services },
    { href: `${anchor}#faq-title`, label: dict.nav.faq },
  ];
  // A blog magyarul és románul létezik.
  if (locale === "hu" || locale === "ro") {
    links.push({ href: indexPath(locale), label: BLOG_COPY[locale].nav, current: current === "blog" });
  }

  const close = useCallback(() => setOpen(false), []);

  // Görgetés után erősebb üveg a menü mögött
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Mobilmenü: görgetés zárolása, Esc, desktopra méretezés, inert
  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("menu-open", open);
    if (menuRef.current) menuRef.current.inert = !open;

    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        burgerRef.current?.focus();
      }
    };
    const desktop = window.matchMedia("(min-width: 1024px)");
    const onChange = (e: MediaQueryListEvent) => e.matches && setOpen(false);
    window.addEventListener("keydown", onKey);
    desktop.addEventListener("change", onChange);
    menuRef.current?.querySelector<HTMLElement>("a")?.focus({ preventScroll: true });
    return () => {
      window.removeEventListener("keydown", onKey);
      desktop.removeEventListener("change", onChange);
    };
  }, [open]);

  const langSwitch = (variant: "bar" | "menu") => (
    <nav aria-label={dict.nav.language} className={variant === "bar" ? styles.langs : styles.menuLangs}>
      {LOCALES.map((l) => (
        <a
          key={l}
          href={langHrefs?.[l] ?? ROUTES[l].home}
          hrefLang={l}
          lang={l}
          className={styles.lang}
          aria-current={l === locale ? "true" : undefined}
          title={LANG_NAMES[l]}
        >
          {l.toUpperCase()}
        </a>
      ))}
    </nav>
  );

  return (
    <header className={styles.header} data-scrolled={scrolled || undefined} data-open={open || undefined}>
      <div className={styles.bar}>
        <a href={ROUTES[locale].home} className={`${styles.glass} ${styles.logo}`} aria-label="BrandZone">
          <img src="/img/logo-white.png" alt="BrandZone" width={762} height={346} />
        </a>

        <nav aria-label="Main" className={`${styles.glass} ${styles.links}`}>
          {links.map((l) => (
            <a key={l.href} href={l.href} className={styles.link} aria-current={l.current ? "page" : undefined}>
              {l.label}
            </a>
          ))}
        </nav>

        <div className={styles.right}>
          <div className={`${styles.glass} ${styles.langWrap}`}>{langSwitch("bar")}</div>
          <RollButton href={`${anchor}#arajanlat`} size="sm" chip={false} className={styles.cta}>
            {dict.nav.cta}
          </RollButton>
          <button
            ref={burgerRef}
            type="button"
            className={`${styles.glass} ${styles.burger}`}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? dict.nav.closeMenu : dict.nav.openMenu}
            onClick={() => setOpen((v) => !v)}
          >
            <span />
            <span />
          </button>
        </div>
      </div>

      <div
        id="mobile-menu"
        ref={menuRef}
        className={styles.menu}
        onClick={(e) => {
          if ((e.target as HTMLElement).closest("a") || e.target === e.currentTarget) close();
        }}
      >
        <nav aria-label="Mobile" className={styles.menuLinks}>
          {links.map((l, i) => (
            <a key={l.href} href={l.href} style={{ "--i": i } as React.CSSProperties} aria-current={l.current ? "page" : undefined}>
              {l.label}
            </a>
          ))}
        </nav>
        <div className={styles.menuFoot} style={{ "--i": links.length } as React.CSSProperties}>
          {langSwitch("menu")}
          <RollButton href={`${anchor}#arajanlat`} size="lg" chip={false}>
            {dict.hero.cta}
          </RollButton>
        </div>
      </div>
    </header>
  );
}
