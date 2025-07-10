import { createClient } from '@supabase/supabase-js';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get current directory for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Supabase configuration
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

function sanitizeFilename(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .trim();
}

function generateFrontmatter(post) {
  const frontmatter = {
    title: post.title,
    slug: post.slug,
    date: new Date(post.publish_date).toISOString().split('T')[0],
    author: post.author || 'Ben West',
    excerpt: post.excerpt || '',
    tags: post.tags || [],
    published: post.is_published,
    id: post.id
  };

  // Convert to YAML frontmatter
  const yaml = `---
title: "${frontmatter.title.replace(/"/g, '\\"')}"
slug: "${frontmatter.slug}"
date: "${frontmatter.date}"
author: "${frontmatter.author}"
excerpt: "${(frontmatter.excerpt || '').replace(/"/g, '\\"')}"
tags: [${frontmatter.tags.map(tag => `"${tag}"`).join(', ')}]
published: ${frontmatter.published}
id: ${frontmatter.id}
---

`;

  return yaml;
}

function cleanContent(content) {
  // Remove any HTML tags and clean up the content
  // This is a simple approach - you might want to use a proper HTML-to-markdown converter
  return content
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/\s+/g, ' ') // Normalize whitespace
    .trim();
}

async function exportPosts() {
  try {
    console.log('🚀 Starting blog post export...');
    
    // Ensure content directory exists
    await ensureDirectoryExists(contentDir);
    
    // Fetch all published posts from Supabase
    console.log('📡 Fetching posts from Supabase...');
    const { data: posts, error } = await supabase
      .from('blog_posts')
      .select('*')
      .order('publish_date', { ascending: false });

    if (error) {
      throw new Error(`Database error: ${error.message}`);
    }

    console.log(`📊 Found ${posts.length} posts to export`);

    // Export each post to a markdown file
    for (const post of posts) {
      const filename = sanitizeFilename(post.title);
      const filepath = path.join(contentDir, `${filename}.md`);
      
      const frontmatter = generateFrontmatter(post);
      const postContent = cleanContent(post.content);
      
      const markdownContent = frontmatter + postContent;
      
      await fs.writeFile(filepath, markdownContent, 'utf8');
      console.log(`✅ Exported: ${post.title} -> ${filename}.md`);
    }

    console.log(`\n🎉 Export complete! ${posts.length} posts exported to ${contentDir}`);
    
    // Create a summary file
    const summary = {
      totalPosts: posts.length,
      exportedAt: new Date().toISOString(),
      posts: posts.map(post => ({
        title: post.title,
        slug: post.slug,
        filename: `${sanitizeFilename(post.title)}.md`,
        published: post.is_published,
        date: post.publish_date
      }))
    };
    
    await fs.writeFile(
      path.join(__dirname, '..', 'content', 'export-summary.json'),
      JSON.stringify(summary, null, 2)
    );
    
    console.log('📋 Export summary saved to content/export-summary.json');

  } catch (error) {
    console.error('❌ Export failed:', error.message);
    process.exit(1);
  }
}

// Run the export
exportPosts(); 