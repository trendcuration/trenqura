import type { Metadata } from "next";
import Link from "next/link";

import { Notice, PageIntro, Shell, Tag } from "../../src/components/layout";
import { fetchPublishedContentCached } from "../../src/lib/cms";

export const metadata: Metadata = {
  title: "칼럼",
  alternates: { canonical: "/columns" },
};

export const revalidate = 300;

export default async function ColumnsPage() {
  const { columns } = await fetchPublishedContentCached().catch(() => ({
    posts: [],
    columns: [],
  }));

  return (
    <Shell>
      <main>
        <PageIntro
          eyebrow="SERIES / COLUMNS"
          title="한 번의 기록보다 오래 이어지는 생각."
        />
        <section className="container-editorial pb-20">
          <div className="space-y-4">
            {columns.length ? (
              columns.map((column) => (
                <Link
                  href={`/columns/${column.slug}`}
                  key={column.id}
                  className="editorial-card block p-6"
                >
                  <Tag>{column.issue}</Tag>
                  <h2 className="font-display mt-4 text-2xl font-bold text-[hsl(var(--primary))]">
                    {column.title}
                  </h2>
                  <p className="mt-3 text-sm leading-7 text-[hsl(var(--muted-foreground))]">
                    {column.description}
                  </p>
                </Link>
              ))
            ) : (
              <Notice text="아직 공개된 칼럼이 없습니다." />
            )}
          </div>
        </section>
      </main>
    </Shell>
  );
}
