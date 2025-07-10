import { createClient } from '@supabase/supabase-js';

// Supabase configuration
const supabaseUrl = 'https://jfsvlaaposslmeneovtp.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impmc3ZsYWFwb3NzbG1lbmVvdnRwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0ODgxNjQzMCwiZXhwIjoyMDY0MzkyNDMwfQ.GwLR3PAQBkXtqjWZQtXZeB5KIixgTx8bMPvvzkNnfOc';

const supabase = createClient(supabaseUrl, supabaseKey);

async function getSupabaseImages() {
  try {
    console.log('🚀 Fetching posts with featured images from Supabase...');
    
    const { data: posts, error } = await supabase
      .from('blog_posts')
      .select('title, slug, featured_image')
      .order('publish_date', { ascending: false });

    if (error) {
      throw new Error(`Database error: ${error.message}`);
    }

    console.log(`📊 Found ${posts.length} posts in Supabase`);
    
    // Create a mapping of slug to featured_image
    const imageMapping = {};
    
    posts.forEach(post => {
      if (post.featured_image) {
        imageMapping[post.slug] = post.featured_image;
        console.log(`✅ ${post.title} -> ${post.featured_image}`);
      } else {
        console.log(`⚠️ ${post.title} -> No featured image`);
      }
    });
    
    console.log('\n📋 Image Mapping:');
    console.log(JSON.stringify(imageMapping, null, 2));
    
    return imageMapping;
    
  } catch (error) {
    console.error('❌ Error fetching images:', error.message);
    return {};
  }
}

getSupabaseImages(); 