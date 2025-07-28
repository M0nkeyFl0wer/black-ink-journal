const { createClient } = require('@supabase/supabase-js');

// Supabase configuration
const SUPABASE_URL = "https://jfsvlaaposslmeneovtp.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impmc3ZsYWFwb3NzbG1lbmVvdnRwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg4MTY0MzAsImV4cCI6MjA2NDM5MjQzMH0.RWD9DZgty4WVnHMGx3-MHQjgpTRVH9-mszmPPbEDhh4";

const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

async function checkDrafts() {
  try {
    console.log('🔍 Checking blog drafts in Supabase...');
    
    const { data: drafts, error } = await supabase
      .from('blog_drafts')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      throw new Error(`Supabase error: ${error.message}`);
    }
    
    if (!drafts || drafts.length === 0) {
      console.log('❌ No drafts found in Supabase');
      return;
    }
    
    console.log(`📊 Found ${drafts.length} drafts`);
    
    drafts.forEach(draft => {
      console.log(`\n📝 Draft: ${draft.title}`);
      console.log(`  Slug: ${draft.slug}`);
      console.log(`  Created: ${draft.created_at}`);
      console.log(`  Updated: ${draft.updated_at}`);
      console.log(`  Published: ${draft.is_published}`);
      console.log(`  Content length: ${draft.content.length} characters`);
      if (draft.excerpt) {
        console.log(`  Excerpt: ${draft.excerpt.substring(0, 100)}...`);
      }
    });
    
  } catch (error) {
    console.error('❌ Error checking drafts:', error.message);
  }
}

if (require.main === module) {
  checkDrafts();
}

module.exports = { checkDrafts }; 