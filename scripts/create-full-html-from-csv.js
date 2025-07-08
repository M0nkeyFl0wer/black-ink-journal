import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

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

// Simple CSV parser
function parseCSV(csvContent) {
  const lines = csvContent.split('\n');
  const headers = lines[0].split(',').map(h => h.replace(/"/g, ''));
  const records = [];
  
  for (let i = 1; i < lines.length; i++) {
    if (!lines[i].trim()) continue;
    
    const values = [];
    let current = '';
    let inQuotes = false;
    
    for (let j = 0; j < lines[i].length; j++) {
      const char = lines[i][j];
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        values.push(current);
        current = '';
      } else {
        current += char;
      }
    }
    values.push(current);
    
    const record = {};
    headers.forEach((header, index) => {
      record[header] = values[index] ? values[index].replace(/^"|"$/g, '') : '';
    });
    records.push(record);
  }
  
  return records;
}

const csv = fs.readFileSync(csvFile, 'utf8');
const records = parseCSV(csv);

console.log(`Found ${records.length} posts in CSV`);

for (const post of records) {
  const filename = post.slug + '.html';
  const filePath = path.join(outputDir, filename);
  
  // Parse tags if they exist
  let tags = [];
  if (post.tags && post.tags !== 'null') {
    try {
      tags = JSON.parse(post.tags);
    } catch (e) {
      console.log(`Warning: Could not parse tags for ${post.slug}: ${post.tags}`);
    }
  }
  
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

console.log('Done! Full HTML files created successfully from CSV.'); 