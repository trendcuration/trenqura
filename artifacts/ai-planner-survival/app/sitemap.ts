import type { MetadataRoute } from "next";

import { fetchPublishedContentCached } from "../src/lib/cms";

const SITE_URL = "https://www.trencub.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { posts, columns } = await fetchPublishedContentCached().catch(() => ({
    posts: [],
    columns: [],
  }));

  const staticPages = [
    "",
    "/categories",
    "/columns",
    "/about",
    "/contact",
    "/privacy",
    "/disclaimer",
  ];

  return [
    ...staticPages.map((page) => ({ url: `${SITE_URL}${page || "/"}` })),
    ...posts.map((post) => ({
      url: `${SITE_URL}/posts/${encodeURIComponent(post.slug)}`,
      lastModified: post.updatedAtIso || post.publishedAtIso || undefined,
    })),
    ...columns.map((column) => ({
      url: `${SITE_URL}/columns/${encodeURIComponent(column.slug)}`,
    })),
  ];
}
