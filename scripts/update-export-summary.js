import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function updateExportSummary() {
  const postsDir = path.join(__dirname, '..', 'content', 'posts');
  const summaryPath = path.join(__dirname, '..', 'content', 'export-summary.json');
  
  try {
    const files = await fs.readdir(postsDir);
    const posts = [];
    
    for (const file of files) {
      if (!file.endsWith('.md')) continue;
      
      const filePath = path.join(postsDir, file);
      const content = await fs.readFile(filePath, 'utf8');
      
      // Extract frontmatter
      const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
      if (!frontmatterMatch) {
        console.log(`⚠️ No frontmatter found in ${file}`);
        continue;
      }
      
      const frontmatter = frontmatterMatch[1];
      
      // Extract fields from frontmatter
      const title = frontmatter.match(/title:\s*"([^"]+)"/)?.[1] || '';
      const slug = frontmatter.match(/slug:\s*"([^"]+)"/)?.[1] || '';
      const date = frontmatter.match(/date:\s*"([^"]+)"/)?.[1] || '';
      const author = frontmatter.match(/author:\s*"([^"]+)"/)?.[1] || 'Ben West';
      const excerpt = frontmatter.match(/excerpt:\s*"([^"]+)"/)?.[1] || '';
      const published = frontmatter.match(/published:\s*(true|false)/)?.[1] === 'true';
      const featuredImage = frontmatter.match(/featured_image:\s*"([^"]+)"/)?.[1] || '';
      
      // Extract tags
      const tagsMatch = frontmatter.match(/tags:\s*\[(.*?)\]/);
      let tags = [];
      if (tagsMatch) {
        tags = tagsMatch[1]
          .split(',')
          .map(tag => tag.trim().replace(/"/g, ''))
          .filter(tag => tag.length > 0);
      }
      
      posts.push({
        title,
        slug,
        filename: file,
        published,
        date: date ? new Date(date).toISOString() : new Date().toISOString(),
        author,
        excerpt,
        tags,
        featured_image: featuredImage
      });
    }
    
    // Sort by date (newest first)
    posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    const summary = {
      totalPosts: posts.length,
      exportedAt: new Date().toISOString(),
      posts
    };
    
    await fs.writeFile(summaryPath, JSON.stringify(summary, null, 2), 'utf8');
    console.log(`✅ Updated export summary with ${posts.length} posts`);
    console.log(`📁 Saved to: ${summaryPath}`);
    
  } catch (error) {
    console.error('❌ Error updating export summary:', error.message);
    process.exit(1);
  }
}

updateExportSummary(); 