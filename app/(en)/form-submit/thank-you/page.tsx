import { ThanksPage } from "@/components/ThanksPage";
import { thanksMetadata } from "@/lib/metadata";

export const metadata = thanksMetadata("en");

export default function Page() {
  return <ThanksPage locale="en" />;
}
