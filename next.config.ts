import type { NextConfig } from "next";

/**
 * Statikus export: a `next build` a teljes oldalt sima HTML/CSS/JS fájlokká
 * generálja az `out/` mappába, ezt szolgálja ki a Netlify. Szerveroldali
 * futtatás nincs, így a Netlify Forms a kész HTML-ből ismeri fel az űrlapokat.
 */
const nextConfig: NextConfig = {
  output: "export",
  // `/hu` → out/hu.html, `/policy/x` → out/policy/x.html (a mostani URL-ek maradnak)
  trailingSlash: false,
  images: { unoptimized: true },
  reactStrictMode: true,
  poweredByHeader: false,
  // Több root layout (nyelvenként) mellett ez adja a saját 404-oldalt (out/404.html).
  experimental: { globalNotFound: true },
};

export default nextConfig;
