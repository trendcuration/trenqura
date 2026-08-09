import type { Metadata } from "next";
import Link from "next/link";

import { categories } from "../../src/data";
import { PageIntro, Shell, Tag } from "../../src/components/layout";
import { fetchPublishedContentCached } from "../../src/lib/cms";

export const metadata: Metadata = {
  title: "카테고리",
  alternates: { canonical: "/categories" },
};

export const revalidate = 300;

export default async function CategoriesPage() {
  const { posts } = await fetchPublishedContentCached().catch(() => ({ posts: [] }));

  return (
    <Shell>
      <main>
        <PageIntro
          eyebrow="INDEX / CATEGORIES"
          title="두 가지 관점으로 읽습니다."
        />
        <section className="container-editorial grid gap-5 pb-20 md:grid-cols-2">
          {categories.map((category) => (
            <Link
              href={`/categories/${category.slug}`}
              key={category.slug}
              className="editorial-card p-7"
            >
              <Tag>{category.eyebrow}</Tag>
              <h2 className="font-display mt-7 text-3xl font-bold text-[hsl(var(--primary))]">
                {category.name}
              </h2>
              <p className="mt-4 text-sm leading-8 text-[hsl(var(--muted-foreground))]">
                {category.description}
              </p>
              <p className="mt-5 text-xs text-[hsl(var(--accent))]">
                공개 기록{" "}
                {posts.filter((post) => post.category === category.slug).length}
                편
              </p>
            </Link>
          ))}
        </section>
      </main>
    </Shell>
  );
}
