import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get current directory for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const siteUrl = 'https://benwest.blog';
const outputDir = path.join(__dirname, '..', 'public');
const postsDir = path.join(__dirname, '..', 'public', 'content', 'posts');

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

function parsePostMetadata(htmlContent) {
  try {
    // Extract the JSON metadata from the script tag
    const metadataMatch = htmlContent.match(/<script type="application\/json" id="post-metadata">([\s\S]*?)<\/script>/);
    if (!metadataMatch) {
      console.warn('⚠️ No metadata found in post');
      return null;
    }
    
    const metadata = JSON.parse(metadataMatch[1]);
    return metadata;
  } catch (error) {
    console.error('❌ Error parsing post metadata:', error.message);
    return null;
  }
}

async function generateRSSFeed() {
  try {
    console.log('🚀 Starting RSS feed generation...');
    
    // Ensure output directory exists
    await ensureDirectoryExists(outputDir);
    
    // Read all HTML files from the posts directory
    const files = await fs.readdir(postsDir);
    const htmlFiles = files.filter(file => file.endsWith('.html'));
    
    console.log(`📁 Found ${htmlFiles.length} HTML files in posts directory`);
    
    const posts = [];
    
    // Process each HTML file
    for (const file of htmlFiles) {
      const filePath = path.join(postsDir, file);
      const htmlContent = await fs.readFile(filePath, 'utf8');
      
      const metadata = parsePostMetadata(htmlContent);
      if (!metadata) {
        console.warn(`⚠️ Skipping ${file} - no valid metadata`);
        continue;
      }
      
      // Only include published posts
      if (metadata.is_published) {
        posts.push({
          title: metadata.title,
          slug: metadata.slug,
          excerpt: metadata.excerpt,
          publish_date: metadata.publish_date,
          author: metadata.author,
          tags: metadata.tags || []
        });
      }
    }
    
    // Sort posts by publish date (newest first)
    posts.sort((a, b) => new Date(b.publish_date) - new Date(a.publish_date));
    
    console.log(`📝 Found ${posts.length} published posts`);
    
    if (posts.length === 0) {
      console.log('⚠️ No published posts found');
      return;
    }
    
    // Generate RSS items
    const rssItems = posts.map(post => {
      const pubDate = new Date(post.publish_date).toUTCString();
      
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
    const lastBuildDate = posts.length > 0 ? new Date(posts[0].publish_date).toUTCString() : now;

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
    
    console.log(`✅ Generated RSS feed with ${posts.length} posts`);
    console.log(`📁 Saved to: ${rssPath}`);
    console.log('🎉 RSS feed generation complete!');
    
    // Also save a JSON version for debugging
    const jsonPath = path.join(outputDir, 'rss-feed.json');
    const rssData = {
      generatedAt: new Date().toISOString(),
      totalPosts: posts.length,
      posts: posts.map(post => ({
        title: post.title,
        slug: post.slug,
        date: post.publish_date,
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