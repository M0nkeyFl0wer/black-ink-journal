import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Correct image mappings from Supabase
const correctImageMappings = {
  'still-crowned': '/images/61703bd2-7bd9-4d04-b4af-f6e6d12cc735.png', // Local image
  'is-not-having-kids-an-effective-climate-solution': '/images/1543172645-origin.jpg', // Local image
  'say-please-thank-you-alexa-ok-google': 'https://miro.medium.com/v2/resize:fit:720/format:webp/1*GDpWu5sqYXlyYoBypCwGhw.jpeg', // External
  'how-not-to-be-the-reason-your-company-has-a-data-breach-because-you-are-working-from-home': 'https://miro.medium.com/v2/resize:fit:828/format:webp/0*AkWA6NAoGUZEcpgI', // External
  'blockchain-climate-solutions': 'https://www.benwest.blog/wp-content/uploads/2023/12/Roundup-67-1024x532.jpeg', // External
  'reflecting-year-one-great-climate-race': 'https://miro.medium.com/v2/resize:fit:1200/1*E9OKUmFYEyqjklaXMjEOXg.jpeg', // External
  'rail-vs-pipelines-are-those-really-our-only-choice': '/images/FEA_Trains6_2431.jpg', // Local image
  'standing-with-chief-rueben-george-indigenous-leadership-against-tar-sands': '/images/Rueben-George.png' // Local image
};

async function fixFeaturedImages() {
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
      const correctImage = correctImageMappings[slug];
      
      if (!correctImage) {
        console.log(`⚠️ No correct image mapped for slug: ${slug}`);
        continue;
      }
      
      // Check if the image is already correct
      if (content.includes(`featured_image: "${correctImage}"`)) {
        console.log(`ℹ️ ${file} already has the correct image`);
        continue;
      }
      
      // Replace the featured_image line
      let updatedContent;
      if (content.includes('featured_image:')) {
        // Replace existing featured_image
        updatedContent = content.replace(
          /featured_image:\s*"[^"]*"/,
          `featured_image: "${correctImage}"`
        );
      } else {
        // Add featured_image after published line
        updatedContent = content.replace(
          /(published:\s*true)/,
          `$1\nfeatured_image: "${correctImage}"`
        );
      }
      
      await fs.writeFile(filePath, updatedContent, 'utf8');
      console.log(`✅ Updated ${file} with correct image: ${correctImage}`);
    }
    
    console.log('🎉 Featured images corrected!');
    
  } catch (error) {
    console.error('❌ Error fixing featured images:', error.message);
    process.exit(1);
  }
}

fixFeaturedImages(); 