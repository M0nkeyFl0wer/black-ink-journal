
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Content-Type': 'application/rss+xml; charset=utf-8',
  'Cache-Control': 'public, max-age=300', // Cache for 5 minutes
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('🚀 Starting RSS feed generation...');
    
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '', // Use service role for better access
    );

    console.log('📡 Fetching published posts...');

    // Fetch published blog posts with better error handling
    const { data: posts, error } = await supabase
      .from('blog_posts')
      .select('id, title, content, excerpt, slug, publish_date, author, tags, is_published')
      .eq('is_published', true)
      .order('publish_date', { ascending: false })
      .limit(50); // Limit to recent posts

    console.log('📊 Database query result:', {
      postsCount: posts?.length || 0,
      error: error?.message || null,
      hasData: !!posts
    });

    if (error) {
      console.error('❌ Database error:', error);
      return new Response(`RSS feed error: ${error.message}`, { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'text/plain' }
      });
    }

    // Get the site URL from the request origin or environment
    const url = new URL(req.url);
    const siteUrl = `${url.protocol}//${url.host}`.replace('/functions/v1/rss-feed', '');
    console.log('🌐 Site URL:', siteUrl);
    
    const rssItems = (posts || []).map(post => {
      const excerpt = post.excerpt || extractTextFromContent(post.content, 200);
      const pubDate = new Date(post.publish_date).toUTCString();
      
      return `    <item>
      <title>${escapeXml(post.title)}</title>
      <description>${escapeXml(excerpt)}</description>
      <link>${siteUrl}/post/${post.slug}</link>
      <guid isPermaLink="true">${siteUrl}/post/${post.slug}</guid>
      <pubDate>${pubDate}</pubDate>
      <author>contact@benwest.io (${escapeXml(post.author || 'Ben West')})</author>
      ${post.tags?.map(tag => `<category>${escapeXml(tag)}</category>`).join('\n      ') || ''}
    </item>`;
    }).join('\n');

    const now = new Date().toUTCString();
    const lastBuildDate = posts && posts.length > 0 ? new Date(posts[0].publish_date).toUTCString() : now;

    const rssContent = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Ben West - Essays &amp; Commentary</title>
    <description>Essays and commentary by Ben West on climate change, politics, and social justice</description>
    <link>${siteUrl}</link>
    <atom:link href="${siteUrl}/functions/v1/rss-feed" rel="self" type="application/rss+xml"/>
    <language>en-us</language>
    <lastBuildDate>${lastBuildDate}</lastBuildDate>
    <pubDate>${now}</pubDate>
    <ttl>300</ttl>
    <managingEditor>contact@benwest.io (Ben West)</managingEditor>
    <webMaster>contact@benwest.io (Ben West)</webMaster>
    <generator>Supabase Edge Functions</generator>
${rssItems}
  </channel>
</rss>`;

    console.log('✅ RSS feed generated successfully:', {
      postsIncluded: posts?.length || 0,
      contentLength: rssContent.length
    });

    return new Response(rssContent, { 
      headers: corsHeaders,
      status: 200 
    });

  } catch (error) {
    console.error('💥 RSS feed generation error:', error);
    return new Response(`RSS feed generation failed: ${error.message}`, { 
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'text/plain' }
    });
  }
});

function escapeXml(text: string): string {
  if (!text) return '';
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function extractTextFromContent(htmlContent: string, maxLength: number = 200): string {
  // Simple HTML tag removal for RSS description
  const textContent = htmlContent
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  
  return textContent.length > maxLength 
    ? textContent.substring(0, maxLength) + '...'
    : textContent;
}
// ✅ Add this here
export const config = {
  auth: false,
};
