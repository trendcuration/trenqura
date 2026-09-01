import type { Metadata } from "next";

import { Notice, PageIntro, Shell } from "../../src/components/layout";
import { PostCard } from "../../src/components/post";
import { fetchPublishedContentCached } from "../../src/lib/cms";

const DESCRIPTION = "지금까지 공개한 모든 현장 기록을 최신순으로 모았습니다.";

export const metadata: Metadata = {
  title: "전체 기록",
  description: DESCRIPTION,
  alternates: { canonical: "/posts" },
  openGraph: { title: "전체 기록", description: DESCRIPTION, url: "/posts" },
  twitter: { title: "전체 기록", description: DESCRIPTION },
};

export const revalidate = 300;

export default async function PostsIndexPage() {
  const { posts } = await fetchPublishedContentCached().catch(() => ({ posts: [] }));

  return (
    <Shell>
      <main>
        <PageIntro
          eyebrow="INDEX / ALL NOTES"
          title="전체 기록"
          description={
            posts.length
              ? `지금까지 공개한 ${posts.length}편의 기록을 최신순으로 모았습니다.`
              : DESCRIPTION
          }
        />
        <section className="container-editorial pb-20">
          <div className="space-y-4">
            {posts.length ? (
              posts.map((post) => <PostCard key={post.id} post={post} />)
            ) : (
              <Notice text="아직 공개된 기록이 없습니다." />
            )}
          </div>
        </section>
      </main>
    </Shell>
  );
}
