const fs = require('fs').promises;
const path = require('path');

async function cleanFrontmatter() {
  try {
    console.log('🧹 Cleaning up frontmatter in recovered posts...');
    
    const postsDir = path.join(__dirname, '..', 'content', 'posts');
    const files = await fs.readdir(postsDir);
    const markdownFiles = files.filter(f => f.endsWith('.md'));
    
    for (const file of markdownFiles) {
      const filepath = path.join(postsDir, file);
      const content = await fs.readFile(filepath, 'utf8');
      
      // Check if there are multiple frontmatter blocks
      const frontmatterBlocks = content.match(/^---\n[\s\S]*?\n---\n/g);
      
      if (frontmatterBlocks && frontmatterBlocks.length > 1) {
        console.log(`🔧 Fixing duplicate frontmatter in: ${file}`);
        
        // Keep only the first frontmatter block and everything after the second ---
        const firstFrontmatterEnd = content.indexOf('---\n', content.indexOf('---\n') + 4);
        const secondFrontmatterEnd = content.indexOf('---\n', firstFrontmatterEnd + 4);
        
        if (secondFrontmatterEnd !== -1) {
          const cleanedContent = content.substring(0, firstFrontmatterEnd + 4) + 
                               content.substring(secondFrontmatterEnd + 4);
          await fs.writeFile(filepath, cleanedContent, 'utf8');
          console.log(`✅ Fixed: ${file}`);
        }
      }
    }
    
    console.log('✅ Frontmatter cleanup completed!');
    
  } catch (error) {
    console.error('❌ Error cleaning frontmatter:', error.message);
  }
}

if (require.main === module) {
  cleanFrontmatter();
}

module.exports = { cleanFrontmatter }; 