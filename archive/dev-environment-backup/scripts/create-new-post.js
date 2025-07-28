import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get current directory for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Function to create a new blog post
function createNewPost(title, slug, excerpt = '', tags = [], featuredImage = '') {
  const outputDir = path.join(__dirname, '..', 'public', 'content', 'posts');
  const filename = slug + '.html';
  const filePath = path.join(outputDir, filename);
  
  // Get current date
  const now = new Date();
  const publishDate = now.toISOString();
  
  // Create HTML content
  const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <script type="application/json" id="post-metadata">
{
  "title": "${title}",
  "slug": "${slug}",
  "author": "Ben West",
  "publish_date": "${publishDate}",
  "excerpt": "${excerpt}",
  "featured_image": "${featuredImage}",
  "tags": ${JSON.stringify(tags)},
  "is_published": true,
  "created_at": "${publishDate}",
  "updated_at": "${publishDate}"
}
    </script>
</head>
<body>
    <article class="blog-post">
        <header>
            <h1>${title}</h1>
            <div class="post-meta">
                <span class="author">By Ben West</span>
                <span class="date">${now.toLocaleDateString()}</span>
            </div>
            ${excerpt ? `<div class="excerpt">${excerpt}</div>` : ''}
        </header>
        
        <div class="content">
            <p>Write your blog post content here...</p>
            
            <h2>Your First Section</h2>
            <p>Start writing your article content.</p>
            
            <h3>Adding Images</h3>
            <p>To add images, use the local path format:</p>
            <img src="/images/your-image.jpg" alt="Description of image" />
            
            <h3>Adding Links</h3>
            <p>You can add <a href="https://example.com">links to other websites</a>.</p>
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
  console.log(`✅ Created new blog post: ${filename}`);
  console.log(`📁 Location: ${filePath}`);
  console.log(`📝 Edit the content in the <div class="content"> section`);
}

// Example usage
if (process.argv.length < 4) {
  console.log('Usage: node scripts/create-new-post.js "Post Title" "post-slug" [excerpt] [tags] [featured-image]');
  console.log('');
  console.log('Example:');
  console.log('node scripts/create-new-post.js "My New Blog Post" "my-new-post" "A brief description" "technology,ai" "/images/my-image.jpg"');
  process.exit(1);
}

const title = process.argv[2];
const slug = process.argv[3];
const excerpt = process.argv[4] || '';
const tags = process.argv[5] ? process.argv[5].split(',') : [];
const featuredImage = process.argv[6] || '';

createNewPost(title, slug, excerpt, tags, featuredImage); 