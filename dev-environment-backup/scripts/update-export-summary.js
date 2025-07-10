import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get current directory for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Function to extract metadata from HTML file
function extractMetadataFromHtml(htmlContent) {
  const metadataMatch = htmlContent.match(/<script type="application\/json" id="post-metadata">([\s\S]*?)<\/script>/);
  if (!metadataMatch) return null;
  
  try {
    return JSON.parse(metadataMatch[1]);
  } catch (e) {
    console.warn('Could not parse metadata from HTML file');
    return null;
  }
}

// Function to update export summary
function updateExportSummary() {
  const postsDir = path.join(__dirname, '..', 'public', 'content', 'posts');
  const summaryPath = path.join(__dirname, '..', 'public', 'content', 'export-summary.json');
  
  if (!fs.existsSync(postsDir)) {
    console.error('Posts directory not found:', postsDir);
    return;
  }
  
  const htmlFiles = fs.readdirSync(postsDir).filter(file => file.endsWith('.html'));
  console.log(`Found ${htmlFiles.length} HTML files`);
  
  const posts = [];
  
  for (const file of htmlFiles) {
    const filePath = path.join(postsDir, file);
    const htmlContent = fs.readFileSync(filePath, 'utf8');
    const metadata = extractMetadataFromHtml(htmlContent);
    
    if (metadata) {
      posts.push({
        title: metadata.title,
        slug: metadata.slug,
        content_length: htmlContent.length,
        publish_date: metadata.publish_date,
        is_published: metadata.is_published,
        author: metadata.author,
        excerpt: metadata.excerpt,
        tags: metadata.tags,
        featured_image: metadata.featured_image,
        created_at: metadata.created_at,
        updated_at: metadata.updated_at
      });
      console.log(`✅ Added: ${metadata.title}`);
    } else {
      console.warn(`⚠️ Could not extract metadata from: ${file}`);
    }
  }
  
  // Sort posts by publish date (newest first)
  posts.sort((a, b) => new Date(b.publish_date).getTime() - new Date(a.publish_date).getTime());
  
  const summary = {
    exported_at: new Date().toISOString(),
    total_posts: posts.length,
    exported_posts: posts.length,
    posts: posts
  };
  
  fs.writeFileSync(summaryPath, JSON.stringify(summary, null, 2), 'utf8');
  console.log(`\n🎉 Updated export summary with ${posts.length} posts`);
  console.log(`📁 Saved to: ${summaryPath}`);
}

updateExportSummary(); 