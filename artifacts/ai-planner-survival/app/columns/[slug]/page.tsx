import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Shell, Tag } from "../../../src/components/layout";
import { fetchPublishedColumnBySlug } from "../../../src/lib/cms";

export const revalidate = 300;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const column = await fetchPublishedColumnBySlug(slug).catch(() => null);
  if (!column) return {};
  return {
    title: column.title,
    description: column.description,
    alternates: { canonical: `/columns/${slug}` },
    openGraph: {
      title: column.title,
      description: column.description,
      url: `/columns/${slug}`,
    },
    twitter: { title: column.title, description: column.description },
  };
}

export default async function ColumnDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const column = await fetchPublishedColumnBySlug(slug).catch(() => null);
  if (!column) notFound();

  return (
    <Shell>
      <main>
        <article className="container-editorial reading-width py-14">
          <Tag>{column.issue}</Tag>
          <h1 className="font-display mt-5 text-5xl font-bold text-[hsl(var(--primary))]">
            {column.title}
          </h1>
          <p className="mt-6 text-lg leading-8 text-[hsl(var(--muted-foreground))]">
            {column.description}
          </p>
          <div className="mt-12">
            {column.body.map((paragraph) => (
              <p className="mb-7 text-lg leading-9" key={paragraph}>
                {paragraph}
              </p>
            ))}
          </div>
        </article>
      </main>
    </Shell>
  );
}
