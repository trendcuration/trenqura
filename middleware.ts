import { next } from "@vercel/edge";

// Search engines, social-preview unfurlers, and AI answer engines that fetch
// raw HTML without executing JavaScript. The SPA only fixes up <head> tags
// client-side (see App.tsx `Meta`), so these agents need the real per-post
// meta tags injected server-side instead.
const BOT_UA_PATTERN =
  /googlebot|bingbot|yandex|baiduspider|duckduckbot|applebot|sogou|exabot|facebot|facebookexternalhit|twitterbot|linkedinbot|slackbot|discordbot|telegrambot|whatsapp|pinterest|redditbot|skypeuripreview|vkshare|kakaotalk|line-poker|gptbot|oai-searchbot|chatgpt-user|claudebot|claude-web|anthropic-ai|perplexitybot|google-extended|ccbot|bytespider|amazonbot|diffbot|cohere-ai|ahrefsbot|semrushbot|mj12bot|dotbot|screaming frog/i;

const SITE_NAME = "AI기획자로 살아남기";
const SITE_URL = "https://www.trencub.com";

function escapeHtml(value: string) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

async function fetchPublishedPost(slug: string) {
  const url = process.env.VITE_SUPABASE_URL;
  const key = process.env.VITE_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) return null;
  const response = await fetch(
    `${url}/rest/v1/posts?select=title,excerpt,cover_image_url&slug=eq.${encodeURIComponent(slug)}&status=eq.published&limit=1`,
    { headers: { apikey: key } },
  );
  if (!response.ok) return null;
  const rows = (await response.json()) as Array<{
    title: string;
    excerpt: string;
    cover_image_url?: string;
  }>;
  return rows[0] ?? null;
}

function injectMeta(
  html: string,
  {
    title,
    description,
    canonicalUrl,
    image,
  }: {
    title: string;
    description: string;
    canonicalUrl: string;
    image?: string;
  },
) {
  const fullTitle = escapeHtml(`${title} | ${SITE_NAME}`);
  const desc = escapeHtml(description);
  const url = escapeHtml(canonicalUrl);
  let output = html
    .replace(/<title>.*?<\/title>/, `<title>${fullTitle}</title>`)
    .replace(
      /<meta name="description" content=".*?"\s*\/?>/,
      `<meta name="description" content="${desc}" />`,
    )
    .replace(
      /<link rel="canonical" href=".*?"\s*\/?>/,
      `<link rel="canonical" href="${url}" />`,
    )
    .replace(
      /<meta property="og:title" content=".*?"\s*\/?>/,
      `<meta property="og:title" content="${fullTitle}" />`,
    )
    .replace(
      /<meta property="og:description" content=".*?"\s*\/?>/,
      `<meta property="og:description" content="${desc}" />`,
    )
    .replace(
      /<meta property="og:url" content=".*?"\s*\/?>/,
      `<meta property="og:url" content="${url}" />`,
    )
    .replace(
      /<meta name="twitter:title" content=".*?"\s*\/?>/,
      `<meta name="twitter:title" content="${fullTitle}" />`,
    )
    .replace(
      /<meta name="twitter:description" content=".*?"\s*\/?>/,
      `<meta name="twitter:description" content="${desc}" />`,
    );
  if (image) {
    const imageUrl = escapeHtml(image);
    output = output.replace(
      "</head>",
      `  <meta property="og:image" content="${imageUrl}" />\n  <meta name="twitter:image" content="${imageUrl}" />\n</head>`,
    );
  }
  return output;
}

export default async function middleware(request: Request) {
  const userAgent = request.headers.get("user-agent") || "";
  if (!BOT_UA_PATTERN.test(userAgent)) return next();

  const url = new URL(request.url);
  const match = url.pathname.match(/^\/posts\/([^/]+)\/?$/);
  if (!match) return next();

  const slug = decodeURIComponent(match[1]);
  const post = await fetchPublishedPost(slug);
  if (!post) return next();

  const shellResponse = await fetch(new URL("/index.html", request.url));
  if (!shellResponse.ok) return next();
  const shellHtml = await shellResponse.text();

  const html = injectMeta(shellHtml, {
    title: post.title,
    description: post.excerpt || "",
    canonicalUrl: `${SITE_URL}${url.pathname}`,
    image: post.cover_image_url,
  });

  return new Response(html, {
    status: 200,
    headers: {
      "content-type": "text/html; charset=utf-8",
      "cache-control": "public, s-maxage=300, stale-while-revalidate=86400",
    },
  });
}

export const config = {
  matcher: ["/posts/:slug"],
};
