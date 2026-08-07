const SITE_URL = 'https://www.trencub.com';

const escapeXml = (value = '') => String(value)
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&apos;');
const cdata = (value = '') => `<![CDATA[${String(value).replace(/]]>/g, ']]]]><![CDATA[>')}]]>`;

async function getPublishedPosts() {
  const url = process.env.VITE_SUPABASE_URL;
  const key = process.env.VITE_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) throw new Error('Supabase public configuration is unavailable.');
  const response = await fetch(`${url}/rest/v1/posts?select=slug,title,excerpt,published_at,updated_at&status=eq.published&order=published_at.desc`, { headers: { apikey: key } });
  if (!response.ok) throw new Error(`Published post query failed: ${response.status}`);
  return response.json();
}

async function sendSitemap(res) {
  const posts = await getPublishedPosts();
  const staticPages = ['', '/categories', '/about', '/contact', '/privacy', '/disclaimer'];
  const urls = [
    ...staticPages.map((page) => ({ loc: `${SITE_URL}${page || '/'}`, lastmod: null })),
    ...posts.map((post) => ({ loc: `${SITE_URL}/posts/${encodeURIComponent(post.slug)}`, lastmod: post.updated_at || post.published_at })),
  ];
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map(({ loc, lastmod }) => `  <url>\n    <loc>${escapeXml(loc)}</loc>${lastmod ? `\n    <lastmod>${new Date(lastmod).toISOString().slice(0, 10)}</lastmod>` : ''}\n  </url>`).join('\n')}\n</urlset>\n`;
  res.setHeader('Content-Type', 'application/xml; charset=utf-8');
  res.setHeader('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=86400');
  res.status(200).send(xml);
}

async function sendRss(res) {
  const posts = await getPublishedPosts();
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<rss version="2.0">\n  <channel>\n    <title>${escapeXml('AI 기획자로 살아남기')}</title>\n    <link>${SITE_URL}</link>\n    <description>${escapeXml('AI로 작은 앱과 콘텐츠를 운영하며, 도구보다 판단의 흔적을 기록하는 1인 운영자 노트입니다.')}</description>\n    <language>ko</language>\n    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>\n${posts.map((post) => { const link = `${SITE_URL}/posts/${encodeURIComponent(post.slug)}`; return `    <item>\n      <title>${cdata(post.title)}</title>\n      <link>${link}</link>\n      <guid isPermaLink="true">${link}</guid>\n      <description>${cdata(post.excerpt || '')}</description>\n      <pubDate>${new Date(post.published_at).toUTCString()}</pubDate>\n    </item>`; }).join('\n')}\n  </channel>\n</rss>\n`;
  res.setHeader('Content-Type', 'application/rss+xml; charset=utf-8');
  res.setHeader('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=86400');
  res.status(200).send(xml);
}

module.exports = { sendRss, sendSitemap };
