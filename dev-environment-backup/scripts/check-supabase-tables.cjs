const { createClient } = require('@supabase/supabase-js');

// Supabase configuration
const SUPABASE_URL = "https://jfsvlaaposslmeneovtp.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impmc3ZsYWFwb3NzbG1lbmVvdnRwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg4MTY0MzAsImV4cCI6MjA2NDM5MjQzMH0.RWD9DZgty4WVnHMGx3-MHQjgpTRVH9-mszmPPbEDhh4";

const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

async function checkTables() {
  try {
    console.log('🔍 Checking available tables in Supabase...');
    
    // Try to query each table we know about from the types
    const tables = [
      'blog_posts',
      'blog_drafts', 
      'admin_users',
      'password_recovery_tokens',
      'page_content',
      'pages'
    ];
    
    for (const tableName of tables) {
      try {
        const { data, error } = await supabase
          .from(tableName)
          .select('count')
          .limit(1);
        
        if (error) {
          console.log(`❌ ${tableName}: ${error.message}`);
        } else {
          console.log(`✅ ${tableName}: Available`);
        }
      } catch (err) {
        console.log(`❌ ${tableName}: ${err.message}`);
      }
    }
    
    // Also try to get some sample data from blog_posts to see the structure
    console.log('\n📊 Sample blog_posts data:');
    const { data: samplePosts, error: postsError } = await supabase
      .from('blog_posts')
      .select('*')
      .limit(2);
    
    if (postsError) {
      console.log(`❌ Error fetching sample posts: ${postsError.message}`);
    } else if (samplePosts && samplePosts.length > 0) {
      console.log('Sample post structure:');
      console.log(JSON.stringify(samplePosts[0], null, 2));
    }
    
  } catch (error) {
    console.error('❌ Error checking tables:', error.message);
  }
}

if (require.main === module) {
  checkTables();
}

module.exports = { checkTables }; 