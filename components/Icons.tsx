/**
 * Inline SVG ikonok (nincs ikon-könyvtár függőség, nincs emoji-ikon).
 * Mind `currentColor`-t használ, 24-es viewBoxon, 1.75-ös vonallal.
 */
import type { SVGProps } from "react";
import type { IconName } from "@/content/copy";

type Props = SVGProps<SVGSVGElement> & { size?: number };

const base = (size = 20): SVGProps<SVGSVGElement> => ({
  width: size,
  height: size,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.75,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
  focusable: false,
});

export const ArrowRight = ({ size, ...p }: Props) => (
  <svg {...base(size)} {...p}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

export const ArrowDown = ({ size, ...p }: Props) => (
  <svg {...base(size)} {...p}>
    <path d="M12 5v14M6 13l6 6 6-6" />
  </svg>
);

export const ChevronLeft = ({ size, ...p }: Props) => (
  <svg {...base(size)} {...p}>
    <path d="M15 5l-7 7 7 7" />
  </svg>
);

export const ChevronRight = ({ size, ...p }: Props) => (
  <svg {...base(size)} {...p}>
    <path d="M9 5l7 7-7 7" />
  </svg>
);

export const Plus = ({ size, ...p }: Props) => (
  <svg {...base(size)} {...p}>
    <path d="M12 5v14M5 12h14" />
  </svg>
);

export const Play = ({ size = 22, ...p }: Props) => (
  <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden focusable={false} {...p}>
    <path d="M8 5.5v13a1 1 0 0 0 1.5.86l10.6-6.5a1 1 0 0 0 0-1.72L9.5 4.64A1 1 0 0 0 8 5.5Z" fill="currentColor" />
  </svg>
);

export const Mail = ({ size, ...p }: Props) => (
  <svg {...base(size)} {...p}>
    <rect x="3" y="5" width="18" height="14" rx="3" />
    <path d="m4 7 8 6 8-6" />
  </svg>
);

export const Phone = ({ size, ...p }: Props) => (
  <svg {...base(size)} {...p}>
    <path d="M5 4h3.5l1.8 4.4-2.3 1.4a11 11 0 0 0 6.2 6.2l1.4-2.3L20 15.5V19a1.5 1.5 0 0 1-1.6 1.5A16.5 16.5 0 0 1 3.5 5.6 1.5 1.5 0 0 1 5 4Z" />
  </svg>
);

export const LinkedIn = ({ size = 18, ...p }: Props) => (
  <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden focusable={false} {...p}>
    <path
      fill="currentColor"
      d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9.75h4v11H3v-11Zm6.5 0h3.83v1.5h.05c.53-.95 1.84-1.95 3.79-1.95 4.05 0 4.8 2.53 4.8 5.83v5.62h-4v-4.98c0-1.19-.02-2.72-1.76-2.72-1.76 0-2.03 1.3-2.03 2.63v5.07h-4v-11Z"
    />
  </svg>
);

/* ---------- Szolgáltatás-ikonok ---------- */
const SERVICE_PATHS: Record<IconName, React.ReactNode> = {
  check: <path d="m5 12.5 4.5 4.5L19 7.5" />,
  compass: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="m15.5 8.5-2.2 4.8-4.8 2.2 2.2-4.8 4.8-2.2Z" />
    </>
  ),
  rocket: (
    <>
      <path d="M14.5 4.5c2.5-1 4.5-1 5-.5s.5 2.5-.5 5l-6 6-4-4 5.5-6.5Z" />
      <path d="m9 11-3 .5-2 2.5 4 1M13 15l-.5 3-2.5 2-1-4" />
      <circle cx="15.5" cy="8.5" r="1.25" />
    </>
  ),
  clapper: (
    <>
      <rect x="3.5" y="9" width="17" height="11" rx="2" />
      <path d="m3.8 9-.6-3.2 15.8-2.9.6 3.2M7.5 5.6l2.4 2.6M12.4 4.7l2.4 2.6" />
    </>
  ),
  chart: <path d="M4 20h16M7 16v-4M12 16V8M17 16v-7M4.5 10.5 9 7l4 3 6.5-5" />,
  devices: (
    <>
      <rect x="2.5" y="5" width="13" height="10" rx="1.5" />
      <path d="M6 18.5h6" />
      <rect x="16.5" y="8" width="5" height="11" rx="1.25" />
    </>
  ),
  people: (
    <>
      <circle cx="9" cy="8.5" r="3.25" />
      <path d="M3 19.5c.6-3.3 3-5 6-5s5.4 1.7 6 5" />
      <path d="M15.5 5.6a3.25 3.25 0 0 1 0 5.8M18 14.8c1.6.7 2.7 2.3 3 4.7" />
    </>
  ),
  bolt: <path d="M13 3 5 13.5h6L10 21l8-10.5h-6L13 3Z" />,
  globe: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M3.5 12h17M12 3.5c2.4 2.5 3.5 5.3 3.5 8.5s-1.1 6-3.5 8.5c-2.4-2.5-3.5-5.3-3.5-8.5s1.1-6 3.5-8.5Z" />
    </>
  ),
};

export const ServiceIcon = ({ name, size, ...p }: Props & { name: IconName }) => (
  <svg {...base(size)} {...p}>
    {SERVICE_PATHS[name]}
  </svg>
);

/* ---------- Közösségi ikonok (kitöltött) ---------- */
const SOCIAL_PATHS = {
  tiktok:
    "M16.6 3c.3 2.2 1.6 3.7 3.9 3.9v3.2c-1.4.1-2.6-.3-3.9-1.1v5.9c0 3.9-3.2 6.4-6.6 6.1-3.5-.3-5.8-3.5-5.1-6.9.6-2.9 3.6-4.9 6.6-4.3v3.3c-.4-.1-.9-.2-1.4-.1-1.4.2-2.4 1.5-2.1 2.9.2 1.2 1.3 2 2.5 1.9 1.3-.1 2.2-1.1 2.2-2.4V3h3.9Z",
  instagram:
    "M12 3.5c2.3 0 2.6 0 3.5.1 2.4.1 3.5 1.2 3.6 3.6.1.9.1 1.2.1 3.5v2.6c0 2.3 0 2.6-.1 3.5-.1 2.4-1.2 3.5-3.6 3.6-.9.1-1.2.1-3.5.1s-2.6 0-3.5-.1c-2.4-.1-3.5-1.2-3.6-3.6-.1-.9-.1-1.2-.1-3.5v-2.6c0-2.3 0-2.6.1-3.5.1-2.4 1.2-3.5 3.6-3.6.9-.1 1.2-.1 3.5-.1Zm0 4.2a4.3 4.3 0 1 0 0 8.6 4.3 4.3 0 0 0 0-8.6Zm0 7.1a2.8 2.8 0 1 1 0-5.6 2.8 2.8 0 0 1 0 5.6Zm4.5-8.3a1 1 0 1 0 0 2 1 1 0 0 0 0-2Z",
  facebook:
    "M13.4 21v-7.6h2.6l.4-3h-3V8.5c0-.9.3-1.5 1.5-1.5h1.6V4.3c-.3 0-1.2-.1-2.3-.1-2.3 0-3.9 1.4-3.9 4v2.2H7.7v3h2.6V21h3.1Z",
  youtube:
    "M21.2 8.2c-.2-.9-.9-1.6-1.8-1.8C17.8 6 12 6 12 6s-5.8 0-7.4.4c-.9.2-1.6.9-1.8 1.8C2.4 9.8 2.4 12 2.4 12s0 2.2.4 3.8c.2.9.9 1.6 1.8 1.8 1.6.4 7.4.4 7.4.4s5.8 0 7.4-.4c.9-.2 1.6-.9 1.8-1.8.4-1.6.4-3.8.4-3.8s0-2.2-.4-3.8ZM10.1 14.9V9.1l4.9 2.9-4.9 2.9Z",
} as const;

export const SocialIcon = ({
  network,
  size = 20,
  ...p
}: Props & { network: keyof typeof SOCIAL_PATHS }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden focusable={false} {...p}>
    <path fill="currentColor" fillRule="evenodd" d={SOCIAL_PATHS[network]} />
  </svg>
);

export const ChevronDown = ({ size, ...p }: Props) => (
  <svg {...base(size)} {...p}>
    <path d="M5 9l7 7 7-7" />
  </svg>
);
