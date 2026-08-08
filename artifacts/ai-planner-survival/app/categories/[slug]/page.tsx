import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { categories, getCategory } from "../../../src/data";
import { Notice, PageIntro, Shell } from "../../../src/components/layout";
import { PostCard } from "../../../src/components/post";
import { fetchPublishedContentCached } from "../../../src/lib/cms";

export const revalidate = 300;

export function generateStaticParams() {
  return categories.map((category) => ({ slug: category.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const category = getCategory(slug);
  if (!category) return {};
  return {
    title: category.name,
    description: category.description,
    alternates: { canonical: `/categories/${slug}` },
    openGraph: {
      title: category.name,
      description: category.description,
      url: `/categories/${slug}`,
    },
    twitter: { title: category.name, description: category.description },
  };
}

export default async function CategoryDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const category = getCategory(slug);
  if (!category) notFound();

  const { posts } = await fetchPublishedContentCached().catch(() => ({
    posts: [],
    columns: [],
  }));
  const list = posts.filter((post) => post.category === slug);

  return (
    <Shell>
      <main>
        <PageIntro
          eyebrow={category.eyebrow}
          title={category.name}
          description={category.description}
        />
        <section className="container-editorial pb-20">
          <div className="space-y-4">
            {list.length ? (
              list.map((post) => <PostCard key={post.id} post={post} />)
            ) : (
              <Notice text="아직 공개된 기록이 없습니다." />
            )}
          </div>
        </section>
      </main>
    </Shell>
  );
}
