import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { marked } from 'marked';

// Get current directory for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
        } catch (e) {}
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
  updatedContent = updatedContent.replace(
    /https:\/\/miro\.medium\.com\/v2\/resize:fit:\d+\/format:webp\/[^"]+/g,
    (match) => {
      const filename = match.split('/').pop();
      return `/images/${filename}`;
    }
  );
  updatedContent = updatedContent.replace(
    /https:\/\/www\.benwest\.blog\/wp-content\/uploads\/[^"]+/g,
    (match) => {
      const filename = match.split('/').pop();
      return `/images/${filename}`;
    }
  );
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
  // Convert markdown content to HTML using marked
  const htmlContent = marked.parse(content);
  const updatedHtmlContent = updateImageUrls(htmlContent);
  const filename = metadata.slug + '.html';
  const filePath = path.join(outputDir, filename);
  const now = new Date();
  const publishDate = metadata.date ? new Date(metadata.date).toISOString() : now.toISOString();
  const fullHtml = `<!DOCTYPE html>\n<html lang=\"en\">\n<head>\n    <meta charset=\"UTF-8\">\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n    <title>${metadata.title}</title>\n    <script type=\"application/json\" id=\"post-metadata\">\n{\n  \"title\": \"${metadata.title}\",\n  \"slug\": \"${metadata.slug}\",\n  \"author\": \"${metadata.author || 'Ben West'}\",\n  \"publish_date\": \"${publishDate}\",\n  \"excerpt\": \"${metadata.excerpt || ''}\",\n  \"featured_image\": \"${metadata.featured_image || ''}\",\n  \"tags\": ${JSON.stringify(metadata.tags || [])},\n  \"is_published\": ${metadata.published !== false},\n  \"created_at\": \"${publishDate}\",\n  \"updated_at\": \"${publishDate}\"\n}\n    </script>\n</head>\n<body>\n    <article class=\"blog-post\">\n        <header>\n            <h1>${metadata.title}</h1>\n            <div class=\"post-meta\">\n                <span class=\"author\">By ${metadata.author || 'Ben West'}</span>\n                <span class=\"date\">${new Date(publishDate).toLocaleDateString()}</span>\n            </div>\n            ${metadata.excerpt ? `<div class=\"excerpt\">${metadata.excerpt}</div>` : ''}\n        </header>\n        \n        <div class=\"content\">\n            ${updatedHtmlContent}\n        </div>\n        \n        ${metadata.tags && metadata.tags.length > 0 ? `\n        <footer>\n            <div class=\"tags\">\n                ${metadata.tags.map(tag => `<span class=\"tag\">${tag}</span>`).join('')}\n            </div>\n        </footer>\n        ` : ''}\n        \n    </article>\n</body>\n</html>`;
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