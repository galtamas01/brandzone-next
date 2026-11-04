import { ArticlePage } from "@/components/blog/ArticlePage";
import { getPost, getPosts } from "@/lib/blog";
import { postMetadata } from "@/lib/metadata";

/** Csak a content/blog/hu/ alatti cikkek léteznek, minden más 404. */
export const dynamicParams = false;

export function generateStaticParams() {
  return getPosts("hu").map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return postMetadata(getPost("hu", slug));
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <ArticlePage post={getPost("hu", slug)} />;
}
