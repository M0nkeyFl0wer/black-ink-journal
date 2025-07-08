import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get current directory for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Function to convert markdown to HTML
function markdownToHtml(markdown) {
  let html = markdown;
  
  // Convert headers
  html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
  html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
  html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');
  
  // Convert links [text](url)
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
  
  // Convert paragraphs (lines that aren't headers or links)
  html = html.replace(/^(?!<[h|a])(.+)$/gm, '<p>$1</p>');
  
  // Clean up empty paragraphs
  html = html.replace(/<p><\/p>/g, '');
  html = html.replace(/<p>\s*<\/p>/g, '');
  
  // Convert line breaks to <br>
  html = html.replace(/\n/g, '<br>');
  
  return html;
}

// Function to parse frontmatter
function parseFrontmatter(content) {
  const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!frontmatterMatch) return { metadata: {}, content: content };
  
  const frontmatter = frontmatterMatch[1];
  const markdownContent = frontmatterMatch[2];
  
  const metadata = {};
  frontmatter.split('\n').forEach(line => {
    const [key, ...valueParts] = line.split(':');
    if (key && valueParts.length > 0) {
      let value = valueParts.join(':').trim();
      
      // Remove quotes
      if (value.startsWith('"') && value.endsWith('"')) {
        value = value.slice(1, -1);
      }
      
      // Parse arrays
      if (value.startsWith('[') && value.endsWith(']')) {
        try {
          value = JSON.parse(value);
        } catch (e) {
          // Keep as string if parsing fails
        }
      }
      
      // Parse booleans
      if (value === 'true') value = true;
      if (value === 'false') value = false;
      
      metadata[key.trim()] = value;
    }
  });
  
  return { metadata, content: markdownContent };
}

// Function to update image URLs
function updateImageUrls(content) {
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

// Main conversion function
function convertMarkdownFile(markdownPath, outputDir) {
  const markdown = fs.readFileSync(markdownPath, 'utf8');
  const { metadata, content } = parseFrontmatter(markdown);
  
  // Convert markdown content to HTML
  const htmlContent = markdownToHtml(content);
  const updatedHtmlContent = updateImageUrls(htmlContent);
  
  // Create HTML file
  const filename = metadata.slug + '.html';
  const filePath = path.join(outputDir, filename);
  
  // Get current date for metadata
  const now = new Date();
  const publishDate = metadata.date ? new Date(metadata.date).toISOString() : now.toISOString();
  
  // Create full HTML structure
  const fullHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${metadata.title}</title>
    <script type="application/json" id="post-metadata">
{
  "title": "${metadata.title}",
  "slug": "${metadata.slug}",
  "author": "${metadata.author || 'Ben West'}",
  "publish_date": "${publishDate}",
  "excerpt": "${metadata.excerpt || ''}",
  "featured_image": "${metadata.featured_image || ''}",
  "tags": ${JSON.stringify(metadata.tags || [])},
  "is_published": ${metadata.published !== false},
  "created_at": "${publishDate}",
  "updated_at": "${publishDate}"
}
    </script>
</head>
<body>
    <article class="blog-post">
        <header>
            <h1>${metadata.title}</h1>
            <div class="post-meta">
                <span class="author">By ${metadata.author || 'Ben West'}</span>
                <span class="date">${new Date(publishDate).toLocaleDateString()}</span>
            </div>
            ${metadata.excerpt ? `<div class="excerpt">${metadata.excerpt}</div>` : ''}
        </header>
        
        <div class="content">
            ${updatedHtmlContent}
        </div>
        
        ${metadata.tags && metadata.tags.length > 0 ? `
        <footer>
            <div class="tags">
                ${metadata.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
            </div>
        </footer>
        ` : ''}
        
    </article>
</body>
</html>`;
  
  fs.writeFileSync(filePath, fullHtml, 'utf8');
  console.log(`✅ Converted: ${filename} (${Math.round(updatedHtmlContent.length / 1024)}KB)`);
  
  return filename;
}

// Main execution
const markdownDir = path.join(__dirname, '..', 'content', 'archive', 'markdown-posts');
const outputDir = path.join(__dirname, '..', 'public', 'content', 'posts');

if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

const markdownFiles = fs.readdirSync(markdownDir).filter(file => file.endsWith('.md'));

console.log(`Found ${markdownFiles.length} markdown files to convert`);

let convertedCount = 0;
for (const file of markdownFiles) {
  const markdownPath = path.join(markdownDir, file);
  try {
    convertMarkdownFile(markdownPath, outputDir);
    convertedCount++;
  } catch (error) {
    console.error(`❌ Error converting ${file}:`, error.message);
  }
}

console.log(`\n🎉 Successfully converted ${convertedCount} markdown files to HTML`);
console.log(`📁 Files saved to: ${outputDir}`); 