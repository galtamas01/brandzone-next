import { PolicyPage } from "@/components/PolicyPage";
import { policyMetadata } from "@/lib/metadata";

export const metadata = policyMetadata("ro");

export default function Page() {
  return <PolicyPage locale="ro" />;
}
