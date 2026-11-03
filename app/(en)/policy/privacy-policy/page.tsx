import { PolicyPage } from "@/components/PolicyPage";
import { policyMetadata } from "@/lib/metadata";

export const metadata = policyMetadata("en");

export default function Page() {
  return <PolicyPage locale="en" />;
}
