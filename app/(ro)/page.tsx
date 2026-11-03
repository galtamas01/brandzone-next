import { HomePage } from "@/components/HomePage";
import { homeMetadata } from "@/lib/metadata";

export const metadata = homeMetadata("ro");

export default function Page() {
  return <HomePage locale="ro" />;
}
