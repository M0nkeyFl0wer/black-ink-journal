
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Cache-Control': 'no-cache, no-store, must-revalidate',
  'Pragma': 'no-cache',
  'Expires': '0',
};

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
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Starting Bluesky feed fetch...');
    
    const blueskyHandle = Deno.env.get('BLUESKY_HANDLE');
    const blueskyPassword = Deno.env.get('BLUESKY_APP_PASSWORD');

    console.log('Environment check:', {
      hasHandle: !!blueskyHandle,
      hasPassword: !!blueskyPassword,
      handleValue: blueskyHandle ? `${blueskyHandle.substring(0, 5)}...` : 'missing'
    });

    if (!blueskyHandle || !blueskyPassword) {
      console.error('Missing Bluesky credentials');
      return new Response(JSON.stringify({ 
        error: 'Bluesky credentials not configured',
        posts: [],
        debug: {
          hasHandle: !!blueskyHandle,
          hasPassword: !!blueskyPassword
        }
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log('Authenticating with Bluesky...');

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
      console.error('Authentication failed:', authResponse.status, errorText);
      return new Response(JSON.stringify({ 
        error: `Authentication failed: ${authResponse.status} - ${errorText}`,
        posts: [],
        debug: {
          authStatus: authResponse.status,
          authError: errorText
        }
      }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const authData = await authResponse.json();
    const accessJwt = authData.accessJwt;
    const did = authData.did;

    console.log('Successfully authenticated with Bluesky, DID:', did);

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

    // Helper function to extract embed data
    const extractEmbeds = (post: any) => {
      const embeds: any = {};
      
      // Check for embeds in both post.embed and post.record.embed
      const embed = post.embed || post.record.embed;
      
      if (embed) {
        console.log('Found embed data:', JSON.stringify(embed, null, 2));
        
        // Handle images
        if (embed.$type === 'app.bsky.embed.images#view' && embed.images) {
          embeds.images = embed.images.map((img: any) => ({
            url: img.fullsize || img.thumb,
            alt: img.alt || '',
            aspectRatio: img.aspectRatio || { width: 1, height: 1 }
          }));
          console.log('Extracted images:', embeds.images);
        }
        
        // Handle external links
        if (embed.$type === 'app.bsky.embed.external#view' && embed.external) {
          embeds.externalLink = {
            url: embed.external.uri,
            title: embed.external.title || '',
            description: embed.external.description || '',
            thumb: embed.external.thumb || ''
          };
          console.log('Extracted external link:', embeds.externalLink);
        }
        
        // Handle quote posts
        if (embed.$type === 'app.bsky.embed.record#view' && embed.record) {
          const quotedRecord = embed.record;
          if (quotedRecord.value && quotedRecord.author) {
            embeds.quotedPost = {
              text: quotedRecord.value.text || '',
              author: quotedRecord.author.displayName || quotedRecord.author.handle,
              handle: quotedRecord.author.handle
            };
            console.log('Extracted quoted post:', embeds.quotedPost);
          }
        }
        
        // Handle record with media (quote post with images)
        if (embed.$type === 'app.bsky.embed.recordWithMedia#view') {
          if (embed.record && embed.record.record) {
            const quotedRecord = embed.record.record;
            embeds.quotedPost = {
              text: quotedRecord.value?.text || '',
              author: quotedRecord.author?.displayName || quotedRecord.author?.handle,
              handle: quotedRecord.author?.handle
            };
          }
          if (embed.media && embed.media.images) {
            embeds.images = embed.media.images.map((img: any) => ({
              url: img.fullsize || img.thumb,
              alt: img.alt || '',
              aspectRatio: img.aspectRatio || { width: 1, height: 1 }
            }));
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
        text: item.post.record.text,
        createdAt: item.post.record.createdAt,
        author: {
          displayName: item.post.author.displayName || item.post.author.handle,
          handle: item.post.author.handle,
          avatar: item.post.author.avatar,
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
        timestamp: new Date().toISOString()
      }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in bluesky-feed function:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      posts: [],
      debug: {
        errorType: error.constructor.name,
        errorMessage: error.message,
        timestamp: new Date().toISOString()
      }
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
