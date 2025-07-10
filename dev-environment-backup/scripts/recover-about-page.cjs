const { createClient } = require('@supabase/supabase-js');
const fs = require('fs').promises;
const path = require('path');

// Supabase configuration
const SUPABASE_URL = "https://jfsvlaaposslmeneovtp.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impmc3ZsYWFwb3NzbG1lbmVvdnRwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg4MTY0MzAsImV4cCI6MjA2NDM5MjQzMH0.RWD9DZgty4WVnHMGx3-MHQjgpTRVH9-mszmPPbEDhh4";

const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

// Function to convert HTML content to Markdown (same as before)
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

async function recoverAboutPage() {
  try {
    console.log('🚀 Starting about page recovery from Supabase...');
    
    // First, let's see what pages are available
    console.log('📥 Fetching page content from Supabase...');
    const { data: pageContent, error } = await supabase
      .from('page_content')
      .select('*');
    
    if (error) {
      throw new Error(`Supabase error: ${error.message}`);
    }
    
    if (!pageContent || pageContent.length === 0) {
      console.log('❌ No page content found in Supabase');
      return;
    }
    
    console.log(`📊 Found ${pageContent.length} page content entries`);
    
    // Display all available pages
    pageContent.forEach(page => {
      console.log(`  - ${page.page_name} (${page.section_key}) - ${page.content_type}`);
    });
    
    // Look for about page specifically
    const aboutPage = pageContent.find(p => 
      p.page_name.toLowerCase().includes('about') || 
      p.section_key.toLowerCase().includes('about')
    );
    
    if (aboutPage) {
      console.log(`\n🎯 Found about page: ${aboutPage.page_name} (${aboutPage.section_key})`);
      
      // Create output directory
      const outputDir = path.join(__dirname, '..', 'content');
      await fs.mkdir(outputDir, { recursive: true });
      
      // Convert content to markdown
      const markdownContent = htmlToMarkdown(aboutPage.content);
      
      // Create frontmatter
      const frontmatter = `---
title: "About"
page_name: "${aboutPage.page_name}"
section_key: "${aboutPage.section_key}"
content_type: "${aboutPage.content_type}"
updated_at: "${aboutPage.updated_at}"
---

`;
      
      const fullContent = frontmatter + markdownContent;
      const filepath = path.join(outputDir, 'about.md');
      
      await fs.writeFile(filepath, fullContent, 'utf8');
      console.log(`✅ Saved about page to: ${filepath}`);
      console.log(`📝 Content length: ${markdownContent.length} characters`);
      
    } else {
      console.log('\n❓ No about page found. Available pages:');
      pageContent.forEach(page => {
        console.log(`  - ${page.page_name} (${page.section_key})`);
      });
      
      // If no about page, let's save all page content for reference
      const outputDir = path.join(__dirname, '..', 'content', 'recovered-pages');
      await fs.mkdir(outputDir, { recursive: true });
      
      for (const page of pageContent) {
        const markdownContent = htmlToMarkdown(page.content);
        const frontmatter = `---
title: "${page.page_name}"
page_name: "${page.page_name}"
section_key: "${page.section_key}"
content_type: "${page.content_type}"
updated_at: "${page.updated_at}"
---

`;
        
        const fullContent = frontmatter + markdownContent;
        const filename = `${page.page_name}-${page.section_key}.md`;
        const filepath = path.join(outputDir, filename);
        
        await fs.writeFile(filepath, fullContent, 'utf8');
        console.log(`✅ Saved: ${filename}`);
      }
    }
    
    console.log('\n✅ Page recovery completed!');
    
  } catch (error) {
    console.error('❌ Recovery failed:', error.message);
    process.exit(1);
  }
}

// Run the recovery
if (require.main === module) {
  recoverAboutPage();
}

module.exports = { recoverAboutPage }; 