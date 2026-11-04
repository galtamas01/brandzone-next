import { ArticlePage } from "@/components/blog/ArticlePage";
import { getPost, getPosts } from "@/lib/blog";
import { postMetadata } from "@/lib/metadata";

/** Csak a content/blog/ro/ alatti cikkek léteznek, minden más 404. */
export const dynamicParams = false;

export function generateStaticParams() {
  return getPosts("ro").map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return postMetadata(getPost("ro", slug));
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <ArticlePage post={getPost("ro", slug)} />;
}
