import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get current directory for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to your SQL export file
const sqlFile = path.join(__dirname, '..', 'blog_posts.sql');
const outputDir = path.join(__dirname, '..', 'public', 'content', 'posts');

if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

const sql = fs.readFileSync(sqlFile, 'utf8');

// Regex to extract each row of the INSERT statement
const rowRegex = /\(([^;]+?)\)(?=,\s*\(|;)/gs;
const rows = [...sql.matchAll(rowRegex)];

// Helper to parse a single row (very basic, assumes no commas in fields except inside quotes)
function parseRow(rowStr) {
  // Split on ',' not inside quotes
  const fields = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < rowStr.length; i++) {
    const char = rowStr[i];
    if (char === "'" && rowStr[i - 1] !== "\\") inQuotes = !inQuotes;
    if (char === ',' && !inQuotes) {
      fields.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  if (current) fields.push(current.trim());
  return fields.map(f => {
    if (f === 'null') return null;
    if (f.startsWith("'")) return f.slice(1, -1).replace(/''/g, "'");
    return f;
  });
}

// Column order from your SQL
const columns = [
  'id', 'title', 'slug', 'excerpt', 'content', 'featured_image', 'author', 'publish_date', 'tags', 'is_published', 'created_at', 'updated_at', 'created_by', 'modified_by'
];

for (const match of rows) {
  const row = parseRow(match[1]);
  const post = Object.fromEntries(columns.map((col, i) => [col, row[i]]));
  
  // Parse tags if they exist
  let tags = [];
  if (post.tags && post.tags !== 'null') {
    try {
      tags = JSON.parse(post.tags.replace(/{/g, '[').replace(/}/g, ']'));
    } catch (e) {
      console.log(`Warning: Could not parse tags for ${post.slug}: ${post.tags}`);
    }
  }
  
  const filename = post.slug + '.html';
  const filePath = path.join(outputDir, filename);
  
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
  "author": "${post.author}",
  "publish_date": "${post.publish_date}",
  "excerpt": "${post.excerpt || ''}",
  "featured_image": "${post.featured_image || ''}",
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
                <span class="author">By ${post.author}</span>
                <span class="date">${new Date(post.publish_date).toLocaleDateString()}</span>
            </div>
            ${post.excerpt ? `<div class="excerpt">${post.excerpt}</div>` : ''}
        </header>
        
        <div class="content">
            ${post.content}
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
  console.log(`Exported: ${filename}`);
}

console.log('Done! Full HTML files created successfully.'); 