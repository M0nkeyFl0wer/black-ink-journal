
import { useEffect } from 'react';

export const generateRSSFeed = () => {
  const siteUrl = window.location.origin;
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
    
    <item>
      <title>Still Crowned</title>
      <description>A country that talks like a democracy but still curtsies like a colony</description>
      <link>${siteUrl}/post/still-crowned</link>
      <guid>${siteUrl}/post/still-crowned</guid>
      <pubDate>Thu, 16 May 2025 00:00:00 GMT</pubDate>
      <category>Essays</category>
    </item>
  </channel>
</rss>`;

  return rssContent;
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
