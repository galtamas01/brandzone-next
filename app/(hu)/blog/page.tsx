import { BlogIndexPage } from "@/components/blog/BlogIndexPage";
import { blogIndexMetadata } from "@/lib/metadata";

export const metadata = blogIndexMetadata("hu");

export default function Page() {
  return <BlogIndexPage lang="hu" />;
}
