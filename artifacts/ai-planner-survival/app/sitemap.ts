import type { MetadataRoute } from "next";

import { fetchPublishedContentCached } from "../src/lib/cms";

const SITE_URL = "https://www.trencub.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { posts } = await fetchPublishedContentCached().catch(() => ({
    posts: [],
  }));

  const staticPages = [
    "",
    "/categories",
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
  ];
}
