import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

// Restrict CORS to only your domain
const corsHeaders = {
  'Access-Control-Allow-Origin': 'https://benwest.blog',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Cache-Control': 'public, max-age=300', // Cache for 5 minutes
  'Pragma': 'no-cache',
  'Expires': '0',
};

// Simple rate limiting (in production, use Redis or similar)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const windowMs = 60000; // 1 minute window
  const maxRequests = 10; // Max 10 requests per minute
  
  const record = rateLimitMap.get(ip);
  
  if (!record || now > record.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + windowMs });
    return true;
  }
  
  if (record.count >= maxRequests) {
    return false;
  }
  
  record.count++;
  return true;
}

// Sanitize text content to prevent XSS
function sanitizeText(text: string): string {
  return text
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .trim();
}

// Sanitize URLs to prevent open redirects
function sanitizeUrl(url: string): string {
  try {
    const parsed = new URL(url);
    // Only allow HTTPS URLs from trusted domains
    if (parsed.protocol !== 'https:') {
      return '';
    }
    // Add more domain restrictions if needed
    return url;
  } catch {
    return '';
  }
}

interface BlueskyPost {
  uri: string;
  cid: string;
  author: {
    did: string;
    handle: string;
    displayName?: string;
    avatar?: string;
  };
  record: {
    text: string;
    createdAt: string;
  };
  indexedAt: string;
  replyCount: number;
  repostCount: number;
  likeCount: number;
}

serve(async (req) => {
  console.log('🚀 Bluesky feed function invoked');
  console.log('Request method:', req.method);
  console.log('Request URL:', req.url);

  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    console.log('Handling CORS preflight request');
    return new Response(null, { headers: corsHeaders });
  }

  // Rate limiting
  const clientIP = req.headers.get('x-forwarded-for') || 'unknown';
  if (!checkRateLimit(clientIP)) {
    console.log(`Rate limit exceeded for IP: ${clientIP}`);
    return new Response(JSON.stringify({ 
      error: 'Rate limit exceeded. Please try again later.',
      posts: []
    }), {
      status: 429,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  try {
    console.log('Starting Bluesky feed fetch...');
    
    const blueskyHandle = Deno.env.get('BLUESKY_HANDLE');
    const blueskyPassword = Deno.env.get('BLUESKY_APP_PASSWORD');

    console.log('Environment check:', {
      hasHandle: !!blueskyHandle,
      hasPassword: !!blueskyPassword,
      handleValue: blueskyHandle ? `${blueskyHandle.substring(0, 5)}...` : 'missing',
      envKeys: Object.keys(Deno.env.toObject()).filter(key => key.includes('BLUESKY'))
    });

    if (!blueskyHandle || !blueskyPassword) {
      console.error('❌ Missing Bluesky credentials');
      const availableEnvVars = Object.keys(Deno.env.toObject());
      console.log('Available environment variables:', availableEnvVars);
      
      return new Response(JSON.stringify({ 
        error: 'Bluesky credentials not configured',
        posts: [],
        debug: {
          hasHandle: !!blueskyHandle,
          hasPassword: !!blueskyPassword,
          availableEnvVars: availableEnvVars,
          timestamp: new Date().toISOString()
        }
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log('✅ Credentials found, authenticating with Bluesky...');

    // Create session with Bluesky
    const authResponse = await fetch('https://bsky.social/xrpc/com.atproto.server.createSession', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'BenWestBlog/1.0',
      },
      body: JSON.stringify({
        identifier: blueskyHandle,
        password: blueskyPassword,
      }),
    });

    console.log('Auth response status:', authResponse.status);

    if (!authResponse.ok) {
      const errorText = await authResponse.text();
      console.error('❌ Authentication failed:', authResponse.status, errorText);
      return new Response(JSON.stringify({ 
        error: `Authentication failed: ${authResponse.status} - ${errorText}`,
        posts: [],
        debug: {
          authStatus: authResponse.status,
          authError: errorText,
          timestamp: new Date().toISOString()
        }
      }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const authData = await authResponse.json();
    const accessJwt = authData.accessJwt;
    const did = authData.did;

    console.log('✅ Successfully authenticated with Bluesky, DID:', did);

    // Fetch author feed with a higher limit to account for filtering
    const feedResponse = await fetch(`https://bsky.social/xrpc/app.bsky.feed.getAuthorFeed?actor=${did}&limit=20`, {
      headers: {
        'Authorization': `Bearer ${accessJwt}`,
        'Content-Type': 'application/json',
        'User-Agent': 'BenWestBlog/1.0',
      },
    });

    console.log('Feed response status:', feedResponse.status);

    if (!feedResponse.ok) {
      const errorText = await feedResponse.text();
      console.error('Failed to fetch feed:', feedResponse.status, errorText);
      return new Response(JSON.stringify({ 
        error: `Failed to fetch feed: ${feedResponse.status} - ${errorText}`,
        posts: [],
        debug: {
          feedStatus: feedResponse.status,
          feedError: errorText
        }
      }), {
        status: feedResponse.status,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const feedData = await feedResponse.json();
    console.log('Successfully fetched feed data, total items:', feedData.feed?.length || 0);

    // Filter to only include original posts (no replies or reposts)
    const originalPosts = feedData.feed.filter((item: any) => {
      // Filter out reposts (when reason field exists)
      if (item.reason) {
        console.log('Filtering out repost:', item.reason);
        return false;
      }

      // Filter out replies (when reply field exists)
      if (item.post.record.reply) {
        console.log('Filtering out reply to:', item.post.record.reply.parent.uri);
        return false;
      }

      // Only include posts where the author is the authenticated user
      if (item.post.author.did !== did) {
        console.log('Filtering out post from different author:', item.post.author.handle);
        return false;
      }

      console.log('Including original post:', item.post.record.text.substring(0, 50) + '...');
      return true;
    });

    // Helper function to extract embed data with sanitization
    const extractEmbeds = (post: any) => {
      const embeds: any = {};
      
      // Check for embeds in both post.embed and post.record.embed
      const embed = post.embed || post.record.embed;
      
      if (embed) {
        console.log('Found embed data:', JSON.stringify(embed, null, 2));
        
        // Handle images
        if (embed.$type === 'app.bsky.embed.images#view' && embed.images) {
          embeds.images = embed.images.map((img: any) => ({
            url: sanitizeUrl(img.fullsize || img.thumb),
            alt: sanitizeText(img.alt || ''),
            aspectRatio: img.aspectRatio || { width: 1, height: 1 }
          })).filter(img => img.url); // Remove invalid URLs
          console.log('Extracted images:', embeds.images);
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
            console.log('Extracted external link:', embeds.externalLink);
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
            console.log('Extracted quoted post:', embeds.quotedPost);
          }
        }
        
        // Handle record with media (quote post with images)
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
            embeds.images = embed.media.images.map((img: any) => ({
              url: sanitizeUrl(img.fullsize || img.thumb),
              alt: sanitizeText(img.alt || ''),
              aspectRatio: img.aspectRatio || { width: 1, height: 1 }
            })).filter(img => img.url); // Remove invalid URLs
          }
        }
      }
      
      return embeds;
    };

    // Transform the filtered data to match our interface - limit to 3 posts
    const posts = originalPosts.slice(0, 3).map((item: any) => {
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
        ...embeds // Spread the embed data (images, externalLink, quotedPost)
      };
    });

    console.log(`Returning ${posts.length} original posts out of ${feedData.feed.length} total feed items`);

    return new Response(JSON.stringify({ 
      posts,
      debug: {
        totalFeedItems: feedData.feed.length,
        originalPostsFound: originalPosts.length,
        postsReturned: posts.length,
        timestamp: new Date().toISOString(),
        functionStatus: 'success'
      }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('💥 Error in bluesky-feed function:', error);
    console.error('Error stack:', error.stack);
    
    return new Response(JSON.stringify({ 
      error: error.message,
      posts: [],
      debug: {
        errorType: error.constructor.name,
        errorMessage: error.message,
        errorStack: error.stack,
        timestamp: new Date().toISOString(),
        functionStatus: 'error'
      }
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

// Export config to disable authentication (since we're using rate limiting)
export const config = {
  auth: false,
};
