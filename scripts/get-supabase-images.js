import { createClient } from '@supabase/supabase-js';

// Supabase configuration
const supabaseUrl = process.env.SUPABASE_URL || 'https://jfsvlaaposslmeneovtp.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseKey) {
  console.error('❌ SUPABASE_SERVICE_ROLE_KEY environment variable is required');
  console.log('💡 Set this environment variable to run this script');
  process.exit(1);
}

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