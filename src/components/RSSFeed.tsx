import { useBlogPosts } from '@/hooks/useBlogPosts';

export const generateRSSFeed = () => {
  const siteUrl = window.location.origin;
  const { posts } = useBlogPosts();
  
  const rssItems = posts.map(post => `
    <item>
      <title>${escapeXml(post.title)}</title>
      <description>${escapeXml(post.excerpt || '')}</description>
      <link>${siteUrl}/post/${post.slug}</link>
      <guid>${siteUrl}/post/${post.slug}</guid>
      <pubDate>${new Date(post.publish_date).toUTCString()}</pubDate>
      <category>${post.tags?.[0] || 'Essays'}</category>
    </item>`).join('');

  const rssContent = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Ben West - Essays &amp; Commentary</title>
    <description>Essays and commentary by Ben West</description>
    <link>${siteUrl}</link>
    <atom:link href="${siteUrl}/rss.xml" rel="self" type="application/rss+xml"/>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <pubDate>${new Date().toUTCString()}</pubDate>
    <ttl>60</ttl>
    ${rssItems}
  </channel>
</rss>`;

  return rssContent;
};

const escapeXml = (text: string) => {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
};

export const downloadRSSFeed = () => {
  const rssContent = generateRSSFeed();
  const blob = new Blob([rssContent], { type: 'application/rss+xml' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'rss.xml';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};
