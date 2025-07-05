import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get current directory for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const siteUrl = 'https://benwest.blog';
const outputDir = path.join(__dirname, '..', 'public');

async function ensureDirectoryExists(dir) {
  try {
    await fs.access(dir);
  } catch {
    await fs.mkdir(dir, { recursive: true });
    console.log(`📁 Created directory: ${dir}`);
  }
}

function escapeXml(text) {
  if (!text) return '';
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function extractTextFromContent(content, maxLength = 200) {
  // Simple text extraction for RSS description
  const textContent = content
    .replace(/<[^>]*>/g, ' ') // Remove HTML tags
    .replace(/\s+/g, ' ') // Normalize whitespace
    .trim();
  
  return textContent.length > maxLength 
    ? textContent.substring(0, maxLength) + '...'
    : textContent;
}

async function generateRSSFeed() {
  try {
    console.log('🚀 Starting RSS feed generation...');
    
    // Ensure output directory exists
    await ensureDirectoryExists(outputDir);
    
    // Read the export summary to get post information
    const summaryPath = path.join(__dirname, '..', 'content', 'export-summary.json');
    let summary;
    
    try {
      const summaryData = await fs.readFile(summaryPath, 'utf8');
      summary = JSON.parse(summaryData);
      console.log(`📊 Found ${summary.posts.length} posts in summary`);
    } catch (error) {
      console.error('❌ Could not read export summary:', error.message);
      console.log('💡 Please run the markdown export script first: npm run export-posts');
      return;
    }
    
    // Filter to only published posts
    const publishedPosts = summary.posts.filter(post => post.published);
    console.log(`📝 Found ${publishedPosts.length} published posts`);
    
    if (publishedPosts.length === 0) {
      console.log('⚠️ No published posts found');
      return;
    }
    
    // Generate RSS items
    const rssItems = publishedPosts.map(post => {
      const pubDate = new Date(post.date).toUTCString();
      
      return `    <item>
      <title>${escapeXml(post.title)}</title>
      <description>${escapeXml(post.excerpt || '')}</description>
      <link>${siteUrl}/post/${post.slug}</link>
      <guid isPermaLink="true">${siteUrl}/post/${post.slug}</guid>
      <pubDate>${pubDate}</pubDate>
      <author>contact@benwest.io (Ben West)</author>
    </item>`;
    }).join('\n');

    const now = new Date().toUTCString();
    const lastBuildDate = publishedPosts.length > 0 ? new Date(publishedPosts[0].date).toUTCString() : now;

    const rssContent = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Ben West - Essays &amp; Commentary</title>
    <description>Essays and commentary by Ben West on climate change, politics, and social justice</description>
    <link>${siteUrl}</link>
    <atom:link href="${siteUrl}/rss.xml" rel="self" type="application/rss+xml"/>
    <language>en-us</language>
    <lastBuildDate>${lastBuildDate}</lastBuildDate>
    <pubDate>${now}</pubDate>
    <ttl>300</ttl>
    <managingEditor>contact@benwest.io (Ben West)</managingEditor>
    <webMaster>contact@benwest.io (Ben West)</webMaster>
    <generator>Static RSS Generator</generator>
${rssItems}
  </channel>
</rss>`;

    // Save RSS feed
    const rssPath = path.join(outputDir, 'rss.xml');
    await fs.writeFile(rssPath, rssContent, 'utf8');
    
    console.log(`✅ Generated RSS feed with ${publishedPosts.length} posts`);
    console.log(`📁 Saved to: ${rssPath}`);
    console.log('🎉 RSS feed generation complete!');
    
    // Also save a JSON version for debugging
    const jsonPath = path.join(outputDir, 'rss-feed.json');
    const rssData = {
      generatedAt: new Date().toISOString(),
      totalPosts: publishedPosts.length,
      posts: publishedPosts.map(post => ({
        title: post.title,
        slug: post.slug,
        date: post.date,
        url: `${siteUrl}/post/${post.slug}`
      }))
    };
    
    await fs.writeFile(jsonPath, JSON.stringify(rssData, null, 2), 'utf8');
    console.log(`📋 JSON summary saved to: ${jsonPath}`);

  } catch (error) {
    console.error('❌ RSS feed generation failed:', error.message);
    process.exit(1);
  }
}

// Run the generation
generateRSSFeed(); 