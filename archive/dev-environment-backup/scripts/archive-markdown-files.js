import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get current directory for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const contentDir = path.join(__dirname, '..', 'content', 'posts');
const archiveDir = path.join(__dirname, '..', 'content', 'archive', 'markdown-posts');

async function archiveMarkdownFiles() {
  try {
    console.log('🚀 Archiving old markdown files...');
    
    // Create archive directory if it doesn't exist
    await fs.mkdir(archiveDir, { recursive: true });
    console.log(`📁 Created archive directory: ${archiveDir}`);
    
    // Read all files in the posts directory
    const files = await fs.readdir(contentDir);
    const markdownFiles = files.filter(file => file.endsWith('.md'));
    
    console.log(`📊 Found ${markdownFiles.length} markdown files to archive`);
    
    let archivedCount = 0;
    
    for (const filename of markdownFiles) {
      const sourcePath = path.join(contentDir, filename);
      const destPath = path.join(archiveDir, filename);
      
      try {
        // Move the file to archive
        await fs.rename(sourcePath, destPath);
        console.log(`   ✅ Archived: ${filename}`);
        archivedCount++;
      } catch (err) {
        console.error(`   ❌ Failed to archive ${filename}:`, err.message);
      }
    }
    
    console.log(`\n🎉 Successfully archived ${archivedCount} markdown files to ${archiveDir}`);
    console.log('📝 Note: These files are now archived and no longer used by the website.');
    
  } catch (error) {
    console.error('❌ Error archiving markdown files:', error.message);
    process.exit(1);
  }
}

// Run the archive
archiveMarkdownFiles(); 