import { PolicyPage } from "@/components/PolicyPage";
import { policyMetadata } from "@/lib/metadata";

export const metadata = policyMetadata("hu");

export default function Page() {
  return <PolicyPage locale="hu" />;
}
