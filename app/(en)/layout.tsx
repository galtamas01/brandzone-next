import type { ReactNode } from "react";
import { RootShell } from "@/components/RootShell";

export { viewport } from "@/lib/metadata";

export default function Layout({ children }: { children: ReactNode }) {
  return <RootShell locale="en">{children}</RootShell>;
}
