import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { siteConfig } from "../src/data";
import { Notice, Shell } from "../src/components/layout";
import { PostCard } from "../src/components/post";
import { fetchPublishedContentCached } from "../src/lib/cms";

async function getContent() {
  try {
    const content = await fetchPublishedContentCached();
    return { ...content, error: "" };
  } catch {
    return {
      posts: [],
      error: "공개 콘텐츠를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.",
    };
  }
}

export const revalidate = 300;

export default async function HomePage() {
  const { posts, error } = await getContent();
  const featured = posts.find((post) => post.featured) ?? posts[0];

  return (
    <Shell>
      <main>
        <section className="paper-grid border-b border-[hsl(var(--border))]">
          <div className="container-editorial grid min-h-[470px] items-center gap-12 py-20 md:grid-cols-[1.15fr_.85fr] md:py-28">
            <div>
              <p className="rule-label">FIELD NOTE / 2026</p>
              <h1 className="font-display mt-7 max-w-3xl text-5xl font-bold leading-[1.18] tracking-[-.06em] text-[hsl(var(--primary))] md:text-7xl">
                AI를 쓰는 사람의{" "}
                <span className="text-[hsl(var(--accent))]">
                  판단을 기록합니다.
                </span>
              </h1>
              <p className="mt-7 max-w-xl text-base leading-8 text-[hsl(var(--muted-foreground))] md:text-lg">
                {siteConfig.description} 성공담보다, 결정이 바뀐 순간과 다시
                확인한 방법을 남깁니다.
              </p>
              <div className="mt-9 flex gap-3">
                {featured ? (
                  <Link
                    href={`/posts/${featured.slug}`}
                    className="button-primary inline-flex items-center gap-2 rounded-sm px-5 py-3 text-sm font-semibold"
                  >
                    최근 기록 읽기 <ArrowRight size={16} />
                  </Link>
                ) : (
                  <Link
                    href="/about"
                    className="button-primary inline-flex items-center gap-2 rounded-sm px-5 py-3 text-sm font-semibold"
                  >
                    운영 목적 <ArrowRight size={16} />
                  </Link>
                )}
              </div>
            </div>
            <div className="border-l border-[hsl(var(--accent)/.5)] pl-7 md:pl-10">
              <div className="font-mono text-xs leading-7 text-[hsl(var(--muted-foreground))]">
                NOTE 000 / 시작하며
              </div>
              <p className="font-display mt-5 max-w-sm text-2xl font-semibold leading-[1.55] text-[hsl(var(--primary))]">
                &ldquo;AI가 해준 일&rdquo;보다 &ldquo;왜 그렇게 하기로
                했는지&rdquo;가 다음 사람에게 오래 남습니다.
              </p>
            </div>
          </div>
        </section>
        <section className="container-editorial py-20">
          <p className="rule-label">LATEST / PUBLISHED</p>
          <h2 className="font-display mt-3 text-3xl font-bold text-[hsl(var(--primary))]">
            최근 공개한 기록
          </h2>
          {error ? (
            <div className="mt-7">
              <Notice text={error} />
            </div>
          ) : posts.length === 0 || !featured ? (
            <div className="mt-7">
              <Notice text="아직 공개된 기록이 없습니다." />
            </div>
          ) : (
            <div className="mt-7 grid gap-5 md:grid-cols-[1.18fr_.82fr]">
              <PostCard post={featured} featured />
              <div className="grid gap-5">
                {posts
                  .filter((post) => post.id !== featured.id)
                  .slice(0, 2)
                  .map((post) => (
                    <PostCard key={post.id} post={post} />
                  ))}
              </div>
            </div>
          )}
        </section>
      </main>
    </Shell>
  );
}
