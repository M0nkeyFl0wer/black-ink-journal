import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get current directory for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Image mapping from Supabase (we'll map external URLs to local files)
const imageMapping = {
  "still-crowned": "/lovable-uploads/61703bd2-7bd9-4d04-b4af-f6e6d12cc735.png",
  "is-not-having-kids-an-effective-climate-solution": "https://www.ecowatch.com/wp-content/uploads/2021/10/1543172645-origin.jpg",
  "say-please-thank-you-alexa-ok-google": "https://miro.medium.com/v2/resize:fit:720/format:webp/1*GDpWu5sqYXlyYoBypCwGhw.jpeg",
  "how-not-to-be-the-reason-your-company-has-a-data-breach-because-you-are-working-from-home": "https://miro.medium.com/v2/resize:fit:828/format:webp/0*AkWA6NAoGUZEcpgI",
  "blockchain-climate-solutions": "https://www.benwest.blog/wp-content/uploads/2023/12/Roundup-67-1024x532.jpeg",
  "reflecting-year-one-great-climate-race": "https://miro.medium.com/v2/resize:fit:1200/1*E9OKUmFYEyqjklaXMjEOXg.jpeg",
  "rail-vs-pipelines-are-those-really-our-only-choice": "https://i0.wp.com/www.benwest.blog/wp-content/uploads/2019/05/FEA_Trains6_2431.jpg?w=1000&ssl=1",
  "standing-with-chief-rueben-george-indigenous-leadership-against-tar-sands": "https://www.benwest.blog/wp-content/uploads/2019/05/Rueben-George-1024x1024.png"
};

// Map external URLs to local files where we have them
const localImageMapping = {
  "still-crowned": "/images/61703bd2-7bd9-4d04-b4af-f6e6d12cc735.png", // We have this locally
  "is-not-having-kids-an-effective-climate-solution": "/images/1543172645-origin.jpg", // We have this locally
  "say-please-thank-you-alexa-ok-google": "/images/bafkreiclyyecwmvckcjvi2okkb4apnumdb5t3ciu6wheewxa74ygqsqmde.jpeg", // Use a placeholder
  "how-not-to-be-the-reason-your-company-has-a-data-breach-because-you-are-working-from-home": "/images/bafkreidwa6cx4lqpw6ixb277jg4r2iejx353gipigfni2gfqahzgygc7rm.jpeg", // Use a placeholder
  "blockchain-climate-solutions": "/images/bafkreieogcthlsd5i3nycv65gbcekyazbnhrxs7c7vyzummgegtmx73fka.jpeg", // Use a placeholder
  "reflecting-year-one-great-climate-race": "/images/bafkreihyudx3dquxle45teqwsy2g2oxn6hvkbggq3niqdxwucbyqieldxa.jpeg", // Use a placeholder
  "rail-vs-pipelines-are-those-really-our-only-choice": "/images/FEA_Trains6_2431.jpg", // We have this locally
  "standing-with-chief-rueben-george-indigenous-leadership-against-tar-sands": "/images/Rueben-George.png" // We have this locally
};

const contentDir = path.join(__dirname, '..', 'content', 'posts');

async function updateHtmlImages() {
  try {
    console.log('🚀 Updating HTML files with correct local image paths...');
    
    // Read all HTML files
    const files = await fs.readdir(contentDir);
    const htmlFiles = files.filter(file => file.endsWith('.html'));
    
    console.log(`📊 Found ${htmlFiles.length} HTML files to update`);
    
    for (const filename of htmlFiles) {
      const filepath = path.join(contentDir, filename);
      const slug = filename.replace('.html', '');
      
      console.log(`\n📝 Processing: ${filename}`);
      
      // Read the HTML file
      let htmlContent = await fs.readFile(filepath, 'utf8');
      
      // Extract the metadata from the script tag
      const metadataMatch = htmlContent.match(/<script type="application\/json" id="post-metadata">([\s\S]*?)<\/script>/);
      
      if (metadataMatch) {
        const metadata = JSON.parse(metadataMatch[1]);
        
        // Update the featured_image in metadata
        if (localImageMapping[slug]) {
          metadata.featured_image = localImageMapping[slug];
          console.log(`   ✅ Updated featured image: ${localImageMapping[slug]}`);
        } else {
          console.log(`   ⚠️ No local image mapping for: ${slug}`);
        }
        
        // Update the metadata in the HTML
        const newMetadataScript = `<script type="application/json" id="post-metadata">
${JSON.stringify(metadata, null, 2)}
    </script>`;
        
        htmlContent = htmlContent.replace(
          /<script type="application\/json" id="post-metadata">[\s\S]*?<\/script>/,
          newMetadataScript
        );
        
        // Also update any image references in the content
        if (localImageMapping[slug]) {
          // Replace external image URLs with local ones in the content
          const externalUrl = imageMapping[slug];
          if (externalUrl && externalUrl.startsWith('http')) {
            htmlContent = htmlContent.replace(
              new RegExp(externalUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'),
              localImageMapping[slug]
            );
            console.log(`   ✅ Updated content images from external to local`);
          }
        }
        
        // Write the updated HTML back
        await fs.writeFile(filepath, htmlContent, 'utf8');
        console.log(`   ✅ Updated: ${filename}`);
      } else {
        console.log(`   ❌ Could not find metadata in: ${filename}`);
      }
    }
    
    console.log(`\n🎉 Successfully updated ${htmlFiles.length} HTML files with local image paths`);
    
  } catch (error) {
    console.error('❌ Error updating HTML images:', error.message);
    process.exit(1);
  }
}

// Run the update
updateHtmlImages(); 