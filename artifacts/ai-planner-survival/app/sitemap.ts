import type { MetadataRoute } from "next";

import { fetchPublishedContentCached } from "../src/lib/cms";

const SITE_URL = "https://www.trencub.com";

// Refresh on the same cadence as every other data-backed route (RSS, home,
// posts, categories). Without this the sitemap is generated once at build time
// and never picks up posts published later through the admin CMS.
export const revalidate = 300;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { posts } = await fetchPublishedContentCached().catch(() => ({
    posts: [],
  }));

  const staticPages = [
    "",
    "/posts",
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
