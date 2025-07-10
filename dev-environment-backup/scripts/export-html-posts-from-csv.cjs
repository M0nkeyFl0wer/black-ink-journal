const fs = require('fs');
const path = require('path');
const parse = require('csv-parse/sync').parse;

// Path to your CSV export file
const csvFile = path.join(__dirname, '..', 'blog_posts.csv');
const outputDir = path.join(__dirname, '..', 'content', 'posts');

if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

if (!fs.existsSync(csvFile)) {
  console.error('CSV file not found:', csvFile);
  process.exit(1);
}

const csv = fs.readFileSync(csvFile, 'utf8');
const records = parse(csv, {
  columns: true,
  skip_empty_lines: true,
});

for (const post of records) {
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

console.log('Done! If you see an error about csv-parse, run: npm install csv-parse'); 