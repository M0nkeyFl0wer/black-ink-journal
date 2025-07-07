const fs = require('fs');
const path = require('path');

// Path to your SQL export file
const sqlFile = path.join(__dirname, '..', 'blog_posts.sql');
const outputDir = path.join(__dirname, '..', 'content', 'posts');

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
  const filename = post.slug + '.html';
  const filePath = path.join(outputDir, filename);
  // Write a JSON frontmatter comment for metadata
  const frontmatter = `<!--\n${JSON.stringify({
    title: post.title,
    slug: post.slug,
    date: post.publish_date,
    author: post.author,
    excerpt: post.excerpt,
    tags: post.tags,
    published: post.is_published,
    featured_image: post.featured_image,
    id: post.id
  }, null, 2)}\n-->`;
  fs.writeFileSync(filePath, `${frontmatter}\n\n${post.content}`);
  console.log(`Exported: ${filename}`);
} 