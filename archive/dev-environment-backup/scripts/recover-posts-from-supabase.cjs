const { createClient } = require('@supabase/supabase-js');
const fs = require('fs').promises;
const path = require('path');

// Supabase configuration
const SUPABASE_URL = "https://jfsvlaaposslmeneovtp.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impmc3ZsYWFwb3NzbG1lbmVvdnRwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg4MTY0MzAsImV4cCI6MjA2NDM5MjQzMH0.RWD9DZgty4WVnHMGx3-MHQjgpTRVH9-mszmPPbEDhh4";

const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

// Function to convert HTML content to Markdown
function htmlToMarkdown(html) {
  if (!html) return '';
  
  let markdown = html;
  
  // Convert HTML tags to Markdown
  markdown = markdown
    // Headers
    .replace(/<h1[^>]*>(.*?)<\/h1>/gi, '# $1\n\n')
    .replace(/<h2[^>]*>(.*?)<\/h2>/gi, '## $1\n\n')
    .replace(/<h3[^>]*>(.*?)<\/h3>/gi, '### $1\n\n')
    .replace(/<h4[^>]*>(.*?)<\/h4>/gi, '#### $1\n\n')
    .replace(/<h5[^>]*>(.*?)<\/h5>/gi, '##### $1\n\n')
    .replace(/<h6[^>]*>(.*?)<\/h6>/gi, '###### $1\n\n')
    
    // Paragraphs
    .replace(/<p[^>]*>(.*?)<\/p>/gi, '$1\n\n')
    
    // Bold and italic
    .replace(/<strong[^>]*>(.*?)<\/strong>/gi, '**$1**')
    .replace(/<b[^>]*>(.*?)<\/b>/gi, '**$1**')
    .replace(/<em[^>]*>(.*?)<\/em>/gi, '*$1*')
    .replace(/<i[^>]*>(.*?)<\/i>/gi, '*$1*')
    
    // Links
    .replace(/<a[^>]*href=["']([^"']*)["'][^>]*>(.*?)<\/a>/gi, '[$2]($1)')
    
    // Images
    .replace(/<img[^>]*src=["']([^"']*)["'][^>]*alt=["']([^"']*)["'][^>]*>/gi, '![$2]($1)')
    .replace(/<img[^>]*src=["']([^"']*)["'][^>]*>/gi, '![]($1)')
    
    // Lists
    .replace(/<ul[^>]*>(.*?)<\/ul>/gis, (match, content) => {
      return content.replace(/<li[^>]*>(.*?)<\/li>/gi, '- $1\n') + '\n';
    })
    .replace(/<ol[^>]*>(.*?)<\/ol>/gis, (match, content) => {
      let counter = 1;
      return content.replace(/<li[^>]*>(.*?)<\/li>/gi, () => `${counter++}. $1\n`) + '\n';
    })
    
    // Blockquotes
    .replace(/<blockquote[^>]*>(.*?)<\/blockquote>/gis, '> $1\n\n')
    
    // Code blocks
    .replace(/<pre[^>]*><code[^>]*>(.*?)<\/code><\/pre>/gis, '```\n$1\n```\n\n')
    .replace(/<code[^>]*>(.*?)<\/code>/gi, '`$1`')
    
    // Line breaks
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/div>/gi, '\n')
    
    // Remove remaining HTML tags
    .replace(/<[^>]*>/g, '')
    
    // Clean up extra whitespace
    .replace(/\n\s*\n\s*\n/g, '\n\n')
    .trim();
  
  return markdown;
}

// Function to create frontmatter
function createFrontmatter(post) {
  const frontmatter = {
    title: post.title,
    date: post.publish_date,
    author: post.author || 'Ben West',
    excerpt: post.excerpt || '',
    featured_image: post.featured_image || '',
    tags: post.tags || [],
    slug: post.slug,
    is_published: post.is_published
  };
  
  return `---
title: "${frontmatter.title.replace(/"/g, '\\"')}"
date: "${frontmatter.date}"
author: "${frontmatter.author}"
excerpt: "${(frontmatter.excerpt || '').replace(/"/g, '\\"')}"
featured_image: "${frontmatter.featured_image || ''}"
tags: ${JSON.stringify(frontmatter.tags)}
slug: "${frontmatter.slug}"
is_published: ${frontmatter.is_published}
---

`;
}

// Function to save post as markdown
async function savePostAsMarkdown(post, outputDir) {
  try {
    const frontmatter = createFrontmatter(post);
    const markdownContent = htmlToMarkdown(post.content);
    const fullContent = frontmatter + markdownContent;
    
    const filename = `${post.slug}.md`;
    const filepath = path.join(outputDir, filename);
    
    await fs.writeFile(filepath, fullContent, 'utf8');
    console.log(`✅ Saved: ${filename}`);
    
    return {
      filename,
      title: post.title,
      slug: post.slug,
      hasFeaturedImage: !!post.featured_image,
      contentLength: markdownContent.length
    };
  } catch (error) {
    console.error(`❌ Error saving ${post.slug}:`, error.message);
    return null;
  }
}

// Main function to recover all posts
async function recoverPostsFromSupabase() {
  try {
    console.log('🚀 Starting post recovery from Supabase...');
    
    // Create output directory
    const outputDir = path.join(__dirname, '..', 'content', 'recovered-posts');
    await fs.mkdir(outputDir, { recursive: true });
    
    // Fetch all published posts from Supabase
    console.log('📥 Fetching posts from Supabase...');
    const { data: posts, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('is_published', true)
      .order('publish_date', { ascending: false });
    
    if (error) {
      throw new Error(`Supabase error: ${error.message}`);
    }
    
    if (!posts || posts.length === 0) {
      console.log('❌ No published posts found in Supabase');
      return;
    }
    
    console.log(`📊 Found ${posts.length} published posts`);
    
    // Process each post
    const results = [];
    for (const post of posts) {
      console.log(`\n📝 Processing: ${post.title}`);
      const result = await savePostAsMarkdown(post, outputDir);
      if (result) {
        results.push(result);
      }
    }
    
    // Generate summary
    console.log('\n📋 Recovery Summary:');
    console.log(`Total posts processed: ${results.length}`);
    console.log(`Output directory: ${outputDir}`);
    
    const postsWithImages = results.filter(r => r.hasFeaturedImage).length;
    console.log(`Posts with featured images: ${postsWithImages}`);
    
    console.log('\n📄 Recovered posts:');
    results.forEach(result => {
      console.log(`  - ${result.title} (${result.slug}.md)`);
    });
    
    // Save summary to file
    const summaryPath = path.join(outputDir, 'recovery-summary.json');
    await fs.writeFile(summaryPath, JSON.stringify({
      recoveredAt: new Date().toISOString(),
      totalPosts: results.length,
      posts: results
    }, null, 2));
    
    console.log(`\n💾 Summary saved to: ${summaryPath}`);
    console.log('\n✅ Post recovery completed!');
    
  } catch (error) {
    console.error('❌ Recovery failed:', error.message);
    process.exit(1);
  }
}

// Run the recovery
if (require.main === module) {
  recoverPostsFromSupabase();
}

module.exports = { recoverPostsFromSupabase }; 