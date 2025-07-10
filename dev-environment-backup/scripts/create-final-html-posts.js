import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { parse } from 'csv-parse/sync';

// Get current directory for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to your CSV export file
const csvFile = path.join(__dirname, '..', 'blog_posts.csv');
const outputDir = path.join(__dirname, '..', 'public', 'content', 'posts');

if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

if (!fs.existsSync(csvFile)) {
  console.error('CSV file not found:', csvFile);
  process.exit(1);
}

// Function to update image URLs to use GitHub paths
function updateImageUrls(content) {
  if (!content) return '';
  
  let updatedContent = content;
  
  // Replace Medium URLs with local image paths
  updatedContent = updatedContent.replace(
    /https:\/\/miro\.medium\.com\/v2\/resize:fit:\d+\/format:webp\/[^"]+/g,
    (match) => {
      const filename = match.split('/').pop();
      return `/images/${filename}`;
    }
  );
  
  // Replace other external URLs
  updatedContent = updatedContent.replace(
    /https:\/\/www\.benwest\.blog\/wp-content\/uploads\/[^"]+/g,
    (match) => {
      const filename = match.split('/').pop();
      return `/images/${filename}`;
    }
  );
  
  // Replace lovable-uploads paths
  updatedContent = updatedContent.replace(
    /\/lovable-uploads\//g,
    '/images/'
  );
  
  return updatedContent;
}

try {
  const csv = fs.readFileSync(csvFile, 'utf8');
  const records = parse(csv, {
    columns: true,
    skip_empty_lines: true,
    relax_quotes: true,
    relax_column_count: true
  });

  console.log(`Found ${records.length} posts in CSV`);

  let exportedCount = 0;
  
  for (const post of records) {
    if (!post.slug || !post.title) {
      console.log(`⚠️  Skipping post without slug or title: ${post.title || 'Unknown'}`);
      continue;
    }
    
    const filename = post.slug + '.html';
    const filePath = path.join(outputDir, filename);
    
    // Parse tags if they exist
    let tags = [];
    if (post.tags && post.tags !== 'null') {
      try {
        tags = JSON.parse(post.tags);
      } catch (e) {
        console.log(`⚠️  Warning: Could not parse tags for ${post.slug}: ${post.tags}`);
      }
    }
    
    // Update image URLs in content and featured image
    const updatedContent = updateImageUrls(post.content || '');
    const updatedFeaturedImage = post.featured_image ? updateImageUrls(post.featured_image) : '';
    
    // Create proper HTML structure
    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${post.title}</title>
    <script type="application/json" id="post-metadata">
{
  "title": "${post.title}",
  "slug": "${post.slug}",
  "author": "${post.author || 'Ben West'}",
  "publish_date": "${post.publish_date}",
  "excerpt": "${post.excerpt || ''}",
  "featured_image": "${updatedFeaturedImage}",
  "tags": ${JSON.stringify(tags)},
  "is_published": ${post.is_published === 'true'},
  "created_at": "${post.created_at}",
  "updated_at": "${post.updated_at}"
}
    </script>
</head>
<body>
    <article class="blog-post">
        <header>
            <h1>${post.title}</h1>
            <div class="post-meta">
                <span class="author">By ${post.author || 'Ben West'}</span>
                <span class="date">${new Date(post.publish_date).toLocaleDateString()}</span>
            </div>
            ${post.excerpt ? `<div class="excerpt">${post.excerpt}</div>` : ''}
        </header>
        
        <div class="content">
            ${updatedContent}
        </div>
        
        ${tags.length > 0 ? `
        <footer>
            <div class="tags">
                ${tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
            </div>
        </footer>
        ` : ''}
        
    </article>
</body>
</html>`;
    
    fs.writeFileSync(filePath, htmlContent, 'utf8');
    console.log(`✅ Exported: ${filename} (${Math.round(updatedContent.length / 1024)}KB)`);
    exportedCount++;
  }

  console.log(`\n🎉 Successfully exported ${exportedCount} posts to ${outputDir}`);
  
} catch (error) {
  console.error('❌ Error processing CSV:', error.message);
  process.exit(1);
} 