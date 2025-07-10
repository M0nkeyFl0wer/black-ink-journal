import { createClient } from '@supabase/supabase-js';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get current directory for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Supabase configuration - using service role key for full access
const supabaseUrl = process.env.SUPABASE_URL || 'https://jfsvlaaposslmeneovtp.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseKey) {
  console.error('❌ SUPABASE_SERVICE_ROLE_KEY environment variable is required');
  console.log('💡 Set this environment variable to run this script');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Create content directory if it doesn't exist
const contentDir = path.join(__dirname, '..', 'content', 'posts');

async function ensureDirectoryExists(dir) {
  try {
    await fs.access(dir);
  } catch {
    await fs.mkdir(dir, { recursive: true });
    console.log(`📁 Created directory: ${dir}`);
  }
}

async function exportFullPosts() {
  try {
    console.log('🚀 Fetching full-length blog posts from Supabase...');
    
    // Fetch all blog posts with complete content
    const { data: posts, error } = await supabase
      .from('blog_posts')
      .select('*')
      .order('publish_date', { ascending: false });

    if (error) {
      throw new Error(`Database error: ${error.message}`);
    }

    console.log(`📊 Found ${posts.length} posts in Supabase`);
    
    // Ensure content directory exists
    await ensureDirectoryExists(contentDir);
    
    let exportedCount = 0;
    
    for (const post of posts) {
      console.log(`\n📝 Processing: ${post.title}`);
      console.log(`   Content length: ${(post.content && post.content.length) || 0} characters`);
      
      // Create frontmatter metadata
      const frontmatter = {
        title: post.title,
        slug: post.slug,
        author: post.author,
        publish_date: post.publish_date,
        excerpt: post.excerpt,
        featured_image: post.featured_image,
        tags: post.tags || [],
        is_published: post.is_published,
        created_at: post.created_at,
        updated_at: post.updated_at
      };
      
      // Create HTML file with frontmatter
      const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${post.title}</title>
    <script type="application/json" id="post-metadata">
${JSON.stringify(frontmatter, null, 2)}
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
        
        ${post.tags && post.tags.length > 0 ? `
        <footer>
            <div class="tags">
                ${post.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
            </div>
        </footer>
        ` : ''}
    </article>
</body>
</html>`;
      
      // Write to file
      const filename = `${post.slug}.html`;
      const filepath = path.join(contentDir, filename);
      
      await fs.writeFile(filepath, htmlContent, 'utf8');
      console.log(`   ✅ Exported: ${filename}`);
      exportedCount++;
    }
    
    console.log(`\n🎉 Successfully exported ${exportedCount} posts to ${contentDir}`);
    
    // Create export summary
    const summary = {
      exported_at: new Date().toISOString(),
      total_posts: posts.length,
      exported_posts: exportedCount,
      posts: posts.map(post => ({
        title: post.title,
        slug: post.slug,
        content_length: (post.content && post.content.length) || 0,
        publish_date: post.publish_date,
        is_published: post.is_published
      }))
    };
    
    const summaryPath = path.join(__dirname, '..', 'content', 'export-summary.json');
    await fs.writeFile(summaryPath, JSON.stringify(summary, null, 2), 'utf8');
    console.log(`📋 Export summary saved to: ${summaryPath}`);
    
  } catch (error) {
    console.error('❌ Error exporting posts:', error.message);
    process.exit(1);
  }
}

// Run the export
exportFullPosts(); 