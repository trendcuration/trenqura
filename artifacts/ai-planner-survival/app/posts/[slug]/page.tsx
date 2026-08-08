import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Shell } from "../../../src/components/layout";
import {
  MarkdownToc,
  PostBody,
  PostCard,
  PostMeta,
  SummaryList,
} from "../../../src/components/post";
import {
  fetchPublishedContentCached,
  fetchPublishedPostBySlug,
} from "../../../src/lib/cms";

export const revalidate = 300;

export async function generateStaticParams() {
  const { posts } = await fetchPublishedContentCached().catch(() => ({
    posts: [],
    columns: [],
  }));
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await fetchPublishedPostBySlug(slug).catch(() => null);
  if (!post) return {};
  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `/posts/${slug}` },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url: `/posts/${slug}`,
      type: "article",
      images: post.coverImageUrl ? [{ url: post.coverImageUrl }] : undefined,
    },
    twitter: {
      title: post.title,
      description: post.excerpt,
      images: post.coverImageUrl ? [post.coverImageUrl] : undefined,
    },
  };
}

export default async function PostDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await fetchPublishedPostBySlug(slug).catch(() => null);
  if (!post) notFound();

  const { posts } = await fetchPublishedContentCached().catch(() => ({
    posts: [],
    columns: [],
  }));
  const related = posts.filter((item) => post.related.includes(item.slug));

  return (
    <Shell>
      <main>
        <article className="container-editorial reading-width py-14 md:py-20">
          <PostMeta post={post} />
          <h1 className="article-title font-display mt-5 text-4xl font-bold leading-[1.3] tracking-[-.05em] text-[hsl(var(--primary))] md:text-6xl">
            {post.title}
          </h1>
          <p className="mt-7 text-lg leading-8 text-[hsl(var(--muted-foreground))]">
            {post.excerpt}
          </p>
          {post.coverImageUrl && (
            <img
              src={post.coverImageUrl}
              alt={post.title}
              className="mt-10 aspect-[16/9] w-full rounded-sm object-cover"
            />
          )}
          <MarkdownToc markdown={post.bodyMarkdown} />
          <SummaryList summary={post.summary} />
          <PostBody post={post} />
          {post.checklist.length > 0 && (
            <div className="mt-14 border-t border-[hsl(var(--border))] pt-8">
              <h2 className="font-display text-2xl font-bold text-[hsl(var(--primary))]">
                공개 전 확인
              </h2>
              <ul className="mt-5 space-y-3 text-sm">
                {post.checklist.map((item) => (
                  <li key={item}>□ {item}</li>
                ))}
              </ul>
            </div>
          )}
          {post.mistakes.length > 0 && (
            <aside
              className="mt-14 border-l-4 border-[hsl(var(--accent))] bg-[hsl(var(--muted)/.55)] px-6 py-5"
              aria-label="Know-how"
            >
              <p className="rule-label text-[hsl(var(--accent))]">KNOW-HOW</p>
              <ul className="mt-3 space-y-2 text-sm leading-7 text-[hsl(var(--foreground))]">
                {post.mistakes.map((item) => (
                  <li className="flex gap-3" key={item}>
                    <span aria-hidden="true">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </aside>
          )}
          {related.length > 0 && (
            <div className="mt-14 border-t border-[hsl(var(--border))] pt-8">
              <h2 className="font-display text-2xl font-bold text-[hsl(var(--primary))]">
                관련 기록
              </h2>
              <div className="mt-5 grid gap-4">
                {related.map((item) => (
                  <PostCard key={item.id} post={item} />
                ))}
              </div>
            </div>
          )}
        </article>
      </main>
    </Shell>
  );
}
