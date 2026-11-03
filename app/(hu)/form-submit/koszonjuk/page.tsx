import { ThanksPage } from "@/components/ThanksPage";
import { thanksMetadata } from "@/lib/metadata";

export const metadata = thanksMetadata("hu");

export default function Page() {
  return <ThanksPage locale="hu" />;
}
