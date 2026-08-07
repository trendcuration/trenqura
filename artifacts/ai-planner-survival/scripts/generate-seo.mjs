import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const publicDir = path.join(root, 'public');
const siteUrl = (process.env.SITE_URL || 'https://www.trencub.com').replace(/\/$/, '');

async function loadLocalEnv() {
  try {
    const text = await readFile(path.join(root, '.env.local'), 'utf8');
    for (const line of text.split(/\r?\n/)) {
      const match = line.match(/^([A-Z0-9_]+)=(.*)$/);
      if (match && !process.env[match[1]]) process.env[match[1]] = match[2];
    }
  } catch {
    // Vercel supplies production variables through process.env.
  }
}

const escapeXml = (value = '') => String(value)
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&apos;');

const cdata = (value = '') => `<![CDATA[${String(value).replace(/]]>/g, ']]]]><![CDATA[>')}]]>`;
const iso = (value) => value ? new Date(value).toISOString() : new Date().toISOString();

await loadLocalEnv();
const url = process.env.VITE_SUPABASE_URL;
const key = process.env.VITE_SUPABASE_PUBLISHABLE_KEY;
if (!url || !key) throw new Error('VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY are required to generate SEO files.');

const response = await fetch(`${url}/rest/v1/posts?select=slug,title,excerpt,published_at,updated_at,cover_image_url&status=eq.published&order=published_at.desc`, {
  headers: { apikey: key },
});
if (!response.ok) throw new Error(`Could not load published posts for SEO files: ${response.status}`);
const posts = await response.json();
const staticPages = ['', '/categories', '/about', '/contact', '/privacy', '/disclaimer'];
const urls = [
  ...staticPages.map((page) => ({ loc: `${siteUrl}${page || '/'}`, lastmod: null })),
  ...posts.map((post) => ({ loc: `${siteUrl}/posts/${encodeURIComponent(post.slug)}`, lastmod: post.updated_at || post.published_at })),
];

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map(({ loc, lastmod }) => `  <url>\n    <loc>${escapeXml(loc)}</loc>${lastmod ? `\n    <lastmod>${iso(lastmod).slice(0, 10)}</lastmod>` : ''}\n  </url>`).join('\n')}\n</urlset>\n`;

const rss = `<?xml version="1.0" encoding="UTF-8"?>\n<rss version="2.0">\n  <channel>\n    <title>${escapeXml('AI 기획자로 살아남기')}</title>\n    <link>${escapeXml(siteUrl)}</link>\n    <description>${escapeXml('AI로 작은 앱과 콘텐츠를 만드는 과정에서, 도구보다 판단의 흔적을 남깁니다.')}</description>\n    <language>ko</language>\n    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>\n${posts.map((post) => `    <item>\n      <title>${cdata(post.title)}</title>\n      <link>${escapeXml(`${siteUrl}/posts/${encodeURIComponent(post.slug)}`)}</link>\n      <guid isPermaLink="true">${escapeXml(`${siteUrl}/posts/${encodeURIComponent(post.slug)}`)}</guid>\n      <description>${cdata(post.excerpt || '')}</description>\n      <pubDate>${new Date(post.published_at).toUTCString()}</pubDate>\n    </item>`).join('\n')}\n  </channel>\n</rss>\n`;

const robots = `User-agent: *\nAllow: /\n\nSitemap: ${siteUrl}/sitemap.xml\n`;
await mkdir(publicDir, { recursive: true });
await Promise.all([
  writeFile(path.join(publicDir, 'sitemap.xml'), sitemap),
  writeFile(path.join(publicDir, 'rss.xml'), rss),
  writeFile(path.join(publicDir, 'robots.txt'), robots),
]);
console.log(`Generated sitemap.xml and rss.xml for ${posts.length} published post(s).`);
