import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Map of post slugs to featured images
const featuredImages = {
  'still-crowned': '/images/82867a2d-c687-4042-992d-c0841d74606e.png',
  'is-not-having-kids-an-effective-climate-solution': '/images/6def8f02-867c-4f10-ae29-87a5c29c4322.png',
  'say-please-thank-you-alexa-ok-google': '/images/61703bd2-7bd9-4d04-b4af-f6e6d12cc735.png',
  'how-not-to-be-the-reason-your-company-has-a-data-breach-because-you-are-working-from-home': '/images/453c6f64-8fa5-42fe-acd7-12058b4862ac.png',
  'blockchain-climate-solutions': '/images/58592d84-6d39-4136-afd9-c9d9421724fa.png',
  'reflecting-year-one-great-climate-race': '/images/0d6b2dba-6fa3-4f5b-9d6a-c7a03f4d5aa7.png',
  'rail-vs-pipelines-are-those-really-our-only-choice': '/images/FEA_Trains6_2431.jpg',
  'standing-with-chief-rueben-george-indigenous-leadership-against-tar-sands': '/images/Rueben-George.png'
};

async function addFeaturedImages() {
  const postsDir = path.join(__dirname, '..', 'content', 'posts');
  
  try {
    const files = await fs.readdir(postsDir);
    
    for (const file of files) {
      if (!file.endsWith('.md')) continue;
      
      const filePath = path.join(postsDir, file);
      const content = await fs.readFile(filePath, 'utf8');
      
      // Extract slug from frontmatter
      const slugMatch = content.match(/slug:\s*"([^"]+)"/);
      if (!slugMatch) {
        console.log(`⚠️ No slug found in ${file}`);
        continue;
      }
      
      const slug = slugMatch[1];
      const featuredImage = featuredImages[slug];
      
      if (!featuredImage) {
        console.log(`⚠️ No featured image mapped for slug: ${slug}`);
        continue;
      }
      
      // Check if featured_image already exists
      if (content.includes('featured_image:')) {
        console.log(`ℹ️ ${file} already has a featured image`);
        continue;
      }
      
      // Add featured_image to frontmatter
      const updatedContent = content.replace(
        /(published:\s*true)/,
        `$1\nfeatured_image: "${featuredImage}"`
      );
      
      await fs.writeFile(filePath, updatedContent, 'utf8');
      console.log(`✅ Added featured image to ${file}: ${featuredImage}`);
    }
    
    console.log('🎉 Featured images added to all posts!');
    
  } catch (error) {
    console.error('❌ Error adding featured images:', error.message);
    process.exit(1);
  }
}

addFeaturedImages(); 