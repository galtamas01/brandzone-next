#!/usr/bin/env python3
"""
A hero szintvonalas hátteréhez generálja a három SVG-t (public/img/).

Bemenet:  scripts/vonal.svg – az eredeti Illustrator-export. A vonalak itt kitöltött
          „szalagok" (class st0 / stg), nem vonalak, ezért a zöld „festéshez" kell
          hozzájuk egy középvonal. Az osztály nélküli (fekete) utak háttérkitöltések,
          ezeket nem használjuk.

Kimenet:  vonal-base.svg    – fehér alap (az eredeti szalagok), statikus
          vonal-anim.svg    – csak a zöld festés (animált), az alap fölé kerül
          vonal-static.svg  – az eredeti kép (fehér + öt zöld vonal), csökkentett mozgásnál ez látszik
          vonal-flash.svg   – minden vonal zölden (a hero kapcsolójának kivétele óta nem használja az oldal)

A zöld „váltófutásban" halad: mindig fut valamelyik vonalon, és ahogy az egyik halványodik,
a következő – térben szomszédos – vonalon fokozatosan megjelenik. Két váltó fut egymástól
függetlenül: az „A" a vonalak azon részén, amely minden kijelzőn látszik (asztali gépen a
kép vízszintes középső sávja), a „B" a többi vonalon (főleg álló telefonon látszik).

Futtatás:  python3 scripts/build-vonal.py     (kell: numpy, scipy, scikit-image, networkx, playwright)
Csak akkor kell újra futtatni, ha a vonal.svg vagy az alábbi beállítások változnak.
"""
import re, sys, pathlib, tempfile
import numpy as np
import networkx as nx
from scipy.ndimage import gaussian_filter1d
from skimage.morphology import skeletonize
from PIL import Image
from playwright.sync_api import sync_playwright

ROOT = pathlib.Path(__file__).resolve().parent.parent
SRC = ROOT / "scripts" / "vonal.svg"
OUT = ROOT / "public" / "img"
W, H, S = 1024, 1983, 2          # viewBox és a rasztermérethez használt szorzó

# --- megjelenés -------------------------------------------------------------
WHITE = "#f5f5f2"                # alapszín = --fg a globals.css-ben
GREEN = "#2fb052"                # festés = --green-hover (a --green sötét háttéren kissé tompa)
ORIG_WHITE, ORIG_GREEN = "#fff", "#47D16A"   # az eredeti kép színei (vonal-static.svg)
STROKE = 7                       # a zöld vonal vastagsága (a szalag ~3 egység, ezt teljesen lefedi)

# --- mozgás -----------------------------------------------------------------
SPEED = 170                      # festési sebesség, egység/másodperc
FADE_IN = 0.7                    # a festés elejének felfényesedése, másodperc
HOLD, FADE = 0.8, 3.4            # megtartás a látható szakasz elhagyása után, majd elhalványulás
OVERLAP = 0.9                    # a következő vonal ennyivel a fejünk kilépése előtt indul
FIRST = 0.8                      # az első festés kezdete az oldalbetöltés után
SPUR = 10                        # ennyi pixelnél rövidebb mellékágakat levágunk

# Az „A" váltó tartománya: asztali gépen (4:3 – 16:9) ez a sáv mindig látszik (21:9-es
# kijelzőn a sáv széle levágódik, ott időnként rövid szünet lehet), álló
# telefonon a vízszintes oldalakból látszik ~90%.
REGION_A = (60, 964, 600, 1160)  # x0, x1, y0, y1
REGION_B = (40, 984, 0, H)       # a „B" váltó: bárhol, ahol az álló kijelző mutat vonalat
MIN_INSIDE_A = 220               # ennél kevesebb vonalszakasz a sávban → a vonal a „B" váltóé

svg = SRC.read_text()
ribbons, classes = [], []
for m in re.finditer(r"<path([^>]*)/?>", svg):
    a = m.group(1)
    c = re.search(r'class="(st0|stg)"', a)
    if not c:
        continue  # fekete háttérkitöltés
    classes.append(c.group(1))
    ribbons.append(re.search(r'\sd="([^"]*)"', a).group(1))


def raster(page, d):
    page.set_content(
        f'<body style="margin:0;background:#000"><svg xmlns="http://www.w3.org/2000/svg" '
        f'width="{W*S}" height="{H*S}" viewBox="0 0 {W} {H}"><path d="{d}" fill="#fff"/></svg></body>'
    )
    with tempfile.NamedTemporaryFile(suffix=".png") as f:
        page.screenshot(path=f.name)
        return np.array(Image.open(f.name).convert("L")) > 127


def to_graph(sk):
    ys, xs = np.nonzero(sk)
    idx = {(y, x) for y, x in zip(ys, xs)}
    g = nx.Graph()
    for y, x in idx:
        for dy, dx in ((0, 1), (1, 0), (1, 1), (1, -1)):
            n = (y + dy, x + dx)
            if n in idx:
                g.add_edge((y, x), n, weight=1.414 if dy and dx else 1.0)
    return g


def prune(g, k):
    for _ in range(k):
        ends = [n for n in g if g.degree(n) == 1]
        g.remove_nodes_from(ends)
    return g


def longest_path(g):
    a = next(iter(g))
    d = nx.single_source_dijkstra_path_length(g, a)
    u = max(d, key=d.get)
    d = nx.single_source_dijkstra_path_length(g, u)
    v = max(d, key=d.get)
    return nx.dijkstra_path(g, u, v)


def centerline(mask):
    g = to_graph(skeletonize(mask))
    comps = sorted(nx.connected_components(g), key=len, reverse=True)
    g = g.subgraph(comps[0]).copy()
    pruned = prune(g.copy(), SPUR)
    closed = False
    if len(pruned) and not any(pruned.degree(n) == 1 for n in pruned):
        # zárt hurok: egy pontot kivéve nyitott útvonallá alakítjuk, majd visszazárjuk
        cut = next(n for n in pruned if pruned.degree(n) == 2)
        pruned.remove_node(cut)
        closed = True
        base = pruned
    else:
        base = g  # nyílt vonal: a hosszú útvonal a mellékágak nélkül is kijön
    comps = sorted(nx.connected_components(base), key=len, reverse=True)
    path = longest_path(base.subgraph(comps[0]))
    pts = np.array([(x, y) for y, x in path], float) / S
    return pts, closed


def smooth(pts, closed, sigma=5.0, step=16.0):
    mode = "wrap" if closed else "nearest"
    pts = np.column_stack([gaussian_filter1d(pts[:, i], sigma, mode=mode) for i in range(2)])
    seg = np.r_[0, np.cumsum(np.hypot(*np.diff(pts, axis=0).T))]
    n = max(int(seg[-1] / step), 4)
    t = np.linspace(0, seg[-1], n)
    pts = np.column_stack([np.interp(t, seg, pts[:, i]) for i in range(2)])
    if closed:
        pts = np.vstack([pts, pts[:1]])
    return pts


def bezier(pts, closed):
    """Catmull-Rom → köbös Bézier, 1 tizedesre kerekítve."""
    p = pts
    if closed:
        q = np.vstack([p[-2], p, p[1]])
    else:
        q = np.vstack([p[0], p, p[-1]])
    f = lambda v: f"{v:.1f}".rstrip("0").rstrip(".")
    out = [f"M{f(p[0][0])} {f(p[0][1])}"]
    for i in range(1, len(q) - 2):
        p0, p1, p2, p3 = q[i - 1], q[i], q[i + 1], q[i + 2]
        c1 = p1 + (p2 - p0) / 6
        c2 = p2 - (p3 - p1) / 6
        out.append(f"C{f(c1[0])} {f(c1[1])} {f(c2[0])} {f(c2[1])} {f(p2[0])} {f(p2[1])}")
    return "".join(out)



def pts_in(pts, r):
    x0, x1, y0, y1 = r
    return (pts[:, 0] >= x0) & (pts[:, 0] <= x1) & (pts[:, 1] >= y0) & (pts[:, 1] <= y1)


lines = []   # minden vonal: bézier-útvonal, hossz, és mikor van a tartományban a festés feje
with sync_playwright() as pw:
    b = pw.chromium.launch()
    page = b.new_page(viewport={"width": W * S, "height": H * S})
    for i, d in enumerate(ribbons):
        mask = raster(page, d)
        pts, closed = centerline(mask)
        pts = smooth(pts, closed)
        if not closed and pts[0, 0] > pts[-1, 0]:
            pts = pts[::-1]   # a nyílt vonalak mindig balról jobbra festődnek (olvasási irány)
        seg = np.hypot(*np.diff(pts, axis=0).T)
        length = float(seg.sum())
        width = mask.sum() / S**2 / length
        frac = np.linspace(0, 1, len(pts))          # a pontok egyenközűek → index ≈ úthossz-arány
        a_in = pts_in(pts, REGION_A)
        lines.append(dict(i=i, d=bezier(pts, closed), length=length, width=width, pts=pts, frac=frac,
                          inside_a=float(seg[a_in[:-1]].sum()) if a_in.any() else 0.0, a_mask=a_in,
                          closed=closed))
        print(f"{i:2d} {'zárt ' if closed else 'nyílt'} hossz {length:6.0f}  szalagvastagság {width:4.1f}  sávban {lines[-1]['inside_a']:5.0f}", file=sys.stderr)
    b.close()


def window(line, region):
    """A festés idejének [belép, kilép] másodperc-intervalluma a tartományban (a vonal elejétől mérve)."""
    m = pts_in(line["pts"], region)
    idx = np.nonzero(m)[0]
    t = lambda k: line["frac"][k] * line["length"] / SPEED
    return (t(idx[0]), t(idx[-1])) if len(idx) else (0.0, line["length"] / SPEED)


def relay(group, region, first=None):
    """
    Váltófutás sorrendje és időzítése. A következő vonalat mindig a térben legközelebbit
    választjuk, és úgy indítjuk, hogy a feje akkor lépjen be a tartományba, amikor az előző
    feje (OVERLAP-pel korábban) kilép belőle. Visszaadja: (kezdési idők, ciklus hossza).
    """
    if not group:
        return {}, 0
    for l in group:
        l["win"] = window(l, region)
        l["c"] = l["pts"][pts_in(l["pts"], region)].mean(axis=0) if pts_in(l["pts"], region).any() else l["pts"].mean(axis=0)
    left = sorted(group, key=lambda l: -l["length"])
    if first is not None:
        left.sort(key=first)
    order = [left.pop(0)]
    while left:
        last = order[-1]["c"]
        left.sort(key=lambda l: np.hypot(*(l["c"] - last)))
        order.append(left.pop(0))
    start = {order[0]["i"]: 0.0}
    for cur, nxt in zip(order, order[1:] + order[:1]):
        start[nxt["i"]] = start[cur["i"]] + cur["win"][1] - nxt["win"][0] - OVERLAP
    # a körbezárás: az utolsó → első lépés adja a ciklus hosszát
    cycle = start[order[-1]["i"]] + order[-1]["win"][1] - order[0]["win"][0] - OVERLAP
    return start, cycle, order


A = [l for l in lines if l["inside_a"] >= MIN_INSIDE_A]
B = [l for l in lines if l["inside_a"] < MIN_INSIDE_A]
schedule = {}
for name, group, region, offset in (("A", A, REGION_A, 0.0), ("B", B, REGION_B, 5.0)):
    if not group:
        continue
    # Az A váltó első vonala olyan nyílt vonal, amely a bal szélről lép a sávba; az oldal betöltésekor
    # a feje már épp ott van, így a zöld az első pillanattól látszik, és a szélről úszik be.
    start, cycle, order = relay(group, region, first=(lambda l: (l["closed"], l["pts"][pts_in(l["pts"], region)][0][0])) if name == "A" else None)
    life = max(max(l["length"] / SPEED, l["win"][1] + HOLD + FADE) for l in group)
    cycle = max(cycle, life + 1)
    lead = -order[0]["win"][0] if name == "A" else FIRST + offset      # A: negatív késleltetés
    for l in group:
        sd = lead + (start[l["i"]] - start[order[0]["i"]]) % cycle
        schedule[l["i"]] = (sd, cycle)
    print(f"váltó {name}: sorrend {[l['i'] for l in order]}, ciklus {cycle:.1f}s", file=sys.stderr)

# --- ellenőrzés: az „A" tartományban mindig fut-e festés? ---------------------
if A:
    cyc = schedule[A[0]["i"]][1]
    ts = np.arange(0, cyc, 0.05)
    gaps = 0.0
    for t in ts:
        moving = False
        for l in A:
            sd, _ = schedule[l["i"]]
            tt = (t - sd) % cyc
            lo_, hi_ = l["win"]
            if lo_ <= tt <= hi_:
                moving = True
                break
        if not moving:
            gaps += 0.05
    print(f"ellenőrzés: az A sávban {gaps:.1f} s olyan idő van a {cyc:.0f} s-ból, amikor egyik fej sem mozog", file=sys.stderr)

# --- SVG-k ------------------------------------------------------------------
pct = lambda t, c: f"{min(max(t / c * 100, 0), 100):.3f}".rstrip("0").rstrip(".")
css = [
    f".p{{fill:none;stroke:{GREEN};stroke-width:{STROKE};stroke-dasharray:1 1;stroke-dashoffset:1;opacity:0}}",
]
kf, paths = [], []
for l in lines:
    i = l["i"]
    sd, cyc = schedule[i]
    P = l["length"] / SPEED
    tout = l["win"][1]
    fade_start, fade_end = tout + HOLD, tout + HOLD + FADE
    life = max(P, fade_end)
    css.append(
        f"#p{i}{{animation:d{i} {cyc:.2f}s linear {sd:.2f}s infinite,f{i} {cyc:.2f}s ease-in-out {sd:.2f}s infinite}}"
    )
    kf.append(
        f"@keyframes d{i}{{0%{{stroke-dashoffset:1}}{pct(P, cyc)}%{{stroke-dashoffset:0}}"
        f"{pct(life, cyc)}%{{stroke-dashoffset:0}}{pct(life + 0.05, cyc)}%,100%{{stroke-dashoffset:1}}}}"
        f"@keyframes f{i}{{0%{{opacity:0}}{pct(FADE_IN, cyc)}%{{opacity:1}}{pct(fade_start, cyc)}%{{opacity:1}}"
        f"{pct(fade_end, cyc)}%,100%{{opacity:0}}}}"
    )
    paths.append(f'<path id="p{i}" class="p" pathLength="1" d="{l["d"]}"/>')

css.append("@media (prefers-reduced-motion:reduce){.p{animation:none}}")
head = f'<svg xmlns="http://www.w3.org/2000/svg" width="{W}" height="{H}" viewBox="0 0 {W} {H}">\n'
note = "<!-- GENERÁLT FÁJL – ne szerkeszd kézzel: python3 scripts/build-vonal.py -->\n"
(OUT / "vonal-anim.svg").write_text(head + note + f"<style>{''.join(css)}{''.join(kf)}</style>\n" + "".join(paths) + "\n</svg>\n")
(OUT / "vonal-base.svg").write_text(
    head + note + f'<g fill="{WHITE}">' + "".join(f'<path d="{d}"/>' for d in ribbons) + "</g>\n</svg>\n"
)
(OUT / "vonal-static.svg").write_text(
    head + note + "".join(f'<path fill="{ORIG_GREEN if c == "stg" else ORIG_WHITE}" d="{d}"/>' for c, d in zip(classes, ribbons)) + "\n</svg>\n"
)
(OUT / "vonal-flash.svg").write_text(
    head + note + f'<g fill="{GREEN}">' + "".join(f'<path d="{d}"/>' for d in ribbons) + "</g>\n</svg>\n"
)
for n in ("anim", "base", "static", "flash"):
    print(f"vonal-{n}.svg", (OUT / f"vonal-{n}.svg").stat().st_size, "bájt", file=sys.stderr)
