import { CaseStudyPage } from "@/components/case-study/CaseStudyPage";
import { getCaseStudy } from "@/lib/case-study";
import { caseStudyMetadata } from "@/lib/metadata";

export function generateMetadata() {
  return caseStudyMetadata(getCaseStudy("perfekt", "ro"));
}

export default function Page() {
  return <CaseStudyPage study={getCaseStudy("perfekt", "ro")} />;
}
