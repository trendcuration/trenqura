import { siteConfig } from "../../src/data";
import { fetchPublishedContentCached } from "../../src/lib/cms";

const SITE_URL = "https://www.trencub.com";

const escapeXml = (value = "") =>
  String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");

const cdata = (value = "") =>
  `<![CDATA[${String(value).replace(/]]>/g, "]]]]><![CDATA[>")}]]>`;

export const revalidate = 300;

export async function GET() {
  const { posts } = await fetchPublishedContentCached().catch(() => ({
    posts: [],
    columns: [],
  }));

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>${escapeXml(siteConfig.name)}</title>
    <link>${SITE_URL}</link>
    <description>${escapeXml(siteConfig.description)}</description>
    <language>ko</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
${posts
  .map((post) => {
    const link = `${SITE_URL}/posts/${encodeURIComponent(post.slug)}`;
    return `    <item>
      <title>${cdata(post.title)}</title>
      <link>${link}</link>
      <guid isPermaLink="true">${link}</guid>
      <description>${cdata(post.excerpt || "")}</description>
      <pubDate>${post.publishedAtIso ? new Date(post.publishedAtIso).toUTCString() : new Date().toUTCString()}</pubDate>
    </item>`;
  })
  .join("\n")}
  </channel>
</rss>
`;

  return new Response(xml, {
    headers: {
      "content-type": "application/rss+xml; charset=utf-8",
      "cache-control": "public, s-maxage=300, stale-while-revalidate=86400",
    },
  });
}
