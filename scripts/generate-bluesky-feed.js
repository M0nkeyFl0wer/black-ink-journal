import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get current directory for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Bluesky configuration - you'll need to set these as environment variables
const BLUESKY_HANDLE = process.env.BLUESKY_HANDLE || 'benwest.bsky.social';
const BLUESKY_APP_PASSWORD = process.env.BLUESKY_APP_PASSWORD;

// Output directory
const outputDir = path.join(__dirname, '..', 'public', 'data');

async function ensureDirectoryExists(dir) {
  try {
    await fs.access(dir);
  } catch {
    await fs.mkdir(dir, { recursive: true });
    console.log(`📁 Created directory: ${dir}`);
  }
}

// Sanitize text content to prevent XSS
function sanitizeText(text) {
  if (!text) return '';
  return text
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .trim();
}

// Sanitize URLs to prevent open redirects
function sanitizeUrl(url) {
  if (!url) return '';
  try {
    const parsed = new URL(url);
    // Only allow HTTPS URLs
    if (parsed.protocol !== 'https:') {
      return '';
    }
    return url;
  } catch {
    return '';
  }
}

// Extract embed data from Bluesky posts
function extractEmbeds(post) {
  const embeds = {};
  
  const embed = post.embed || post.record?.embed;
  
  if (embed) {
    // Handle images
    if (embed.$type === 'app.bsky.embed.images#view' && embed.images) {
      embeds.images = embed.images.map(img => ({
        url: sanitizeUrl(img.fullsize || img.thumb),
        alt: sanitizeText(img.alt || ''),
        aspectRatio: img.aspectRatio || { width: 1, height: 1 }
      })).filter(img => img.url);
    }
    
    // Handle external links
    if (embed.$type === 'app.bsky.embed.external#view' && embed.external) {
      const sanitizedUrl = sanitizeUrl(embed.external.uri);
      if (sanitizedUrl) {
        embeds.externalLink = {
          url: sanitizedUrl,
          title: sanitizeText(embed.external.title || ''),
          description: sanitizeText(embed.external.description || ''),
          thumb: sanitizeUrl(embed.external.thumb || '')
        };
      }
    }
    
    // Handle quote posts
    if (embed.$type === 'app.bsky.embed.record#view' && embed.record) {
      const quotedRecord = embed.record;
      if (quotedRecord.value && quotedRecord.author) {
        embeds.quotedPost = {
          text: sanitizeText(quotedRecord.value.text || ''),
          author: sanitizeText(quotedRecord.author.displayName || quotedRecord.author.handle),
          handle: sanitizeText(quotedRecord.author.handle)
        };
      }
    }
    
    // Handle record with media
    if (embed.$type === 'app.bsky.embed.recordWithMedia#view') {
      if (embed.record && embed.record.record) {
        const quotedRecord = embed.record.record;
        embeds.quotedPost = {
          text: sanitizeText(quotedRecord.value?.text || ''),
          author: sanitizeText(quotedRecord.author?.displayName || quotedRecord.author?.handle),
          handle: sanitizeText(quotedRecord.author?.handle)
        };
      }
      if (embed.media && embed.media.images) {
        embeds.images = embed.media.images.map(img => ({
          url: sanitizeUrl(img.fullsize || img.thumb),
          alt: sanitizeText(img.alt || ''),
          aspectRatio: img.aspectRatio || { width: 1, height: 1 }
        })).filter(img => img.url);
      }
    }
  }
  
  return embeds;
}

// Generate Bluesky post URL
function generateBlueskyUrl(post) {
  const handle = post.author.handle;
  const rkey = post.uri.split('/').pop();
  return `https://bsky.app/profile/${handle}/post/${rkey}`;
}

async function generateBlueskyFeed() {
  try {
    console.log('🚀 Starting Bluesky feed generation...');
    
    if (!BLUESKY_APP_PASSWORD) {
      throw new Error('BLUESKY_APP_PASSWORD environment variable is required');
    }
    
    // Ensure output directory exists
    await ensureDirectoryExists(outputDir);
    
    console.log('🔐 Authenticating with Bluesky...');
    
    // Create session with Bluesky
    const authResponse = await fetch('https://bsky.social/xrpc/com.atproto.server.createSession', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'BenWestBlog/1.0',
      },
      body: JSON.stringify({
        identifier: BLUESKY_HANDLE,
        password: BLUESKY_APP_PASSWORD,
      }),
    });

    if (!authResponse.ok) {
      const errorText = await authResponse.text();
      throw new Error(`Authentication failed: ${authResponse.status} - ${errorText}`);
    }

    const authData = await authResponse.json();
    const accessJwt = authData.accessJwt;
    const did = authData.did;

    console.log('✅ Successfully authenticated with Bluesky, DID:', did);

    // Fetch author feed
    console.log('📡 Fetching Bluesky feed...');
    const feedResponse = await fetch(`https://bsky.social/xrpc/app.bsky.feed.getAuthorFeed?actor=${did}&limit=20`, {
      headers: {
        'Authorization': `Bearer ${accessJwt}`,
        'Content-Type': 'application/json',
        'User-Agent': 'BenWestBlog/1.0',
      },
    });

    if (!feedResponse.ok) {
      const errorText = await feedResponse.text();
      throw new Error(`Failed to fetch feed: ${feedResponse.status} - ${errorText}`);
    }

    const feedData = await feedResponse.json();
    console.log(`📊 Fetched ${feedData.feed?.length || 0} total feed items`);

    // Filter to only include original posts (no replies or reposts)
    const originalPosts = feedData.feed.filter(item => {
      // Filter out reposts
      if (item.reason) {
        return false;
      }

      // Filter out replies
      if (item.post.record.reply) {
        return false;
      }

      // Only include posts from the authenticated user
      if (item.post.author.did !== did) {
        return false;
      }

      return true;
    });

    console.log(`📝 Found ${originalPosts.length} original posts`);

    // Transform the filtered data - limit to 4 posts
    const posts = originalPosts.slice(0, 4).map(item => {
      const embeds = extractEmbeds(item.post);
      
      return {
        id: item.post.cid,
        text: sanitizeText(item.post.record.text),
        createdAt: item.post.record.createdAt,
        author: {
          displayName: sanitizeText(item.post.author.displayName || item.post.author.handle),
          handle: sanitizeText(item.post.author.handle),
          avatar: sanitizeUrl(item.post.author.avatar || ''),
        },
        engagement: {
          likes: item.post.likeCount || 0,
          reposts: item.post.repostCount || 0,
          replies: item.post.replyCount || 0,
        },
        blueskyUrl: generateBlueskyUrl(item.post),
        ...embeds // Spread the embed data (images, externalLink, quotedPost)
      };
    });

    // Create the output data
    const outputData = {
      posts,
      generatedAt: new Date().toISOString(),
      totalPosts: posts.length,
      author: {
        handle: BLUESKY_HANDLE,
        displayName: posts[0]?.author.displayName || BLUESKY_HANDLE
      }
    };

    // Save to JSON file
    const outputPath = path.join(outputDir, 'bluesky-feed.json');
    await fs.writeFile(outputPath, JSON.stringify(outputData, null, 2), 'utf8');
    
    console.log(`✅ Generated Bluesky feed with ${posts.length} posts`);
    console.log(`📁 Saved to: ${outputPath}`);
    
    // Also save a summary
    const summary = {
      generatedAt: new Date().toISOString(),
      totalPosts: posts.length,
      posts: posts.map(post => ({
        id: post.id,
        text: post.text.substring(0, 100) + '...',
        createdAt: post.createdAt,
        blueskyUrl: post.blueskyUrl,
        hasImages: !!(post.images && post.images.length > 0),
        hasExternalLink: !!post.externalLink,
        engagement: post.engagement
      }))
    };
    
    const summaryPath = path.join(outputDir, 'bluesky-feed-summary.json');
    await fs.writeFile(summaryPath, JSON.stringify(summary, null, 2), 'utf8');
    
    console.log(`📋 Summary saved to: ${summaryPath}`);
    console.log('🎉 Bluesky feed generation complete!');

  } catch (error) {
    console.error('❌ Bluesky feed generation failed:', error.message);
    process.exit(1);
  }
}

// Run the generation
generateBlueskyFeed(); 