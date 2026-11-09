"use client";

import { useEffect } from "react";

/**
 * Két dolgot old meg, mindkettő a kártyák magasságához kötődik (nincs UI-ja; JS nélkül a kártyák a természetes
 * magasságukkal egymás alatt görgethetők):
 *
 * 1. Egyforma magasság. A kártyák külön listaelemek (sticky), ezért a CSS nem tudja egyformára húzni őket. Itt
 *    megmérjük a legmagasabbat (az aktuális szélességen és nyelven), és a `--card-eq` változóval mindegyiknek ezt
 *    adjuk min-height-ként (ld. Services.module.css). Így a kép is mindegyiken ugyanakkora.
 * 2. Telefonon a kártya magasabb a képernyőnél. Ha a TETEJÉVEL tapadna, az alja sosem látszana, mert a következő
 *    kártya alulról csúszik rá, ezért a CSS az ALJÁVAL rögzíti, ha nem fér ki; ehhez kell a pontos magasság,
 *    amit a `--card-h`-ba írunk.
 *
 * Újramérés: szélességváltozásra (forgatás, ablakátméretezés) és a betűtípusok betöltése után.
 */
export function ServicesStackFit() {
  useEffect(() => {
    const slots = Array.from(document.querySelectorAll<HTMLElement>("[data-stack-slot]"));
    const stack = slots[0]?.parentElement;
    if (!stack) return;
    const cards = slots.map((s) => s.firstElementChild as HTMLElement);

    const fit = () => {
      // Előbb eltávolítjuk az előző értéket, hogy a természetes magasságokat mérjük (különben sosem csökkenne).
      stack.style.removeProperty("--card-eq");
      const h = Math.ceil(Math.max(...cards.map((c) => c.getBoundingClientRect().height)));
      stack.style.setProperty("--card-eq", `${h}px`);
      slots.forEach((s) => s.style.setProperty("--card-h", `${h}px`));
    };

    let raf = 0;
    const schedule = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(fit);
    };

    fit();
    document.fonts?.ready.then(schedule);

    // Csak a szélesség változása számít: a magasságot mi magunk állítjuk, az nem indíthat újramérést.
    let lastW = stack.getBoundingClientRect().width;
    const ro = new ResizeObserver(() => {
      const w = stack.getBoundingClientRect().width;
      if (Math.abs(w - lastW) < 0.5) return;
      lastW = w;
      schedule();
    });
    ro.observe(stack);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, []);

  return null;
}
