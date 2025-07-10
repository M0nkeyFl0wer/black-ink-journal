const { createClient } = require('@supabase/supabase-js');

// Supabase configuration
const SUPABASE_URL = "https://jfsvlaaposslmeneovtp.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impmc3ZsYWFwb3NzbG1lbmVvdnRwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg4MTY0MzAsImV4cCI6MjA2NDM5MjQzMH0.RWD9DZgty4WVnHMGx3-MHQjgpTRVH9-mszmPPbEDhh4";

const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

async function checkAllPosts() {
  try {
    console.log('🔍 Checking all posts in Supabase...');
    
    // Fetch ALL posts (both published and unpublished)
    const { data: posts, error } = await supabase
      .from('blog_posts')
      .select('*')
      .order('publish_date', { ascending: false });
    
    if (error) {
      throw new Error(`Supabase error: ${error.message}`);
    }
    
    if (!posts || posts.length === 0) {
      console.log('❌ No posts found in Supabase');
      return;
    }
    
    console.log(`📊 Found ${posts.length} total posts in Supabase`);
    
    const published = posts.filter(p => p.is_published);
    const unpublished = posts.filter(p => !p.is_published);
    
    console.log(`\n📄 Published posts (${published.length}):`);
    published.forEach(post => {
      console.log(`  ✅ ${post.title} (${post.slug})`);
    });
    
    console.log(`\n📝 Unpublished posts (${unpublished.length}):`);
    unpublished.forEach(post => {
      console.log(`  ⏳ ${post.title} (${post.slug})`);
    });
    
    // Check for the RCMP letter specifically
    const rcmpPost = posts.find(p => p.slug.includes('rcmp') || p.title.toLowerCase().includes('rcmp'));
    if (rcmpPost) {
      console.log(`\n🎯 Found RCMP post: ${rcmpPost.title} (published: ${rcmpPost.is_published})`);
    } else {
      console.log('\n❓ RCMP post not found in Supabase');
    }
    
  } catch (error) {
    console.error('❌ Error checking posts:', error.message);
  }
}

if (require.main === module) {
  checkAllPosts();
}

module.exports = { checkAllPosts }; 