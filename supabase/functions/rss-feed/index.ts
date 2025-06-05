
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Content-Type': 'application/rss+xml; charset=utf-8',
  'Cache-Control': 'no-cache, no-store, must-revalidate',
  'Pragma': 'no-cache',
  'Expires': '0',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Starting RSS feed generation...');
    
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    );

    console.log('Supabase client created, fetching published posts...');

    // Fetch published blog posts
    const { data: posts, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('is_published', true)
      .order('publish_date', { ascending: false });

    console.log('Database query result:', {
      postsCount: posts?.length || 0,
      error: error?.message || null,
      hasData: !!posts
    });

    if (error) {
      console.error('Error fetching posts:', error);
      return new Response(`Error generating RSS feed: ${error.message}`, { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'text/plain' }
      });
    }

    if (!posts || posts.length === 0) {
      console.log('No published posts found, generating empty RSS feed');
    }

    const siteUrl = req.url.split('/functions')[0];
    console.log('Site URL:', siteUrl);
    
    const rssItems = (posts || []).map(post => {
      const excerpt = post.excerpt || extractTextFromContent(post.content, 200);
      
      return `
    <item>
      <title>${escapeXml(post.title)}</title>
      <description>${escapeXml(excerpt)}</description>
      <link>${siteUrl}/post/${post.slug}</link>
      <guid isPermaLink="true">${siteUrl}/post/${post.slug}</guid>
      <pubDate>${new Date(post.publish_date).toUTCString()}</pubDate>
      <author>contact@benwest.io (${escapeXml(post.author)})</author>
      ${post.tags?.map(tag => `<category>${escapeXml(tag)}</category>`).join('') || ''}
    </item>`;
    }).join('');

    const rssContent = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Ben West - Essays &amp; Commentary</title>
    <description>Essays and commentary by Ben West on climate change, politics, and social justice</description>
    <link>${siteUrl}</link>
    <atom:link href="${siteUrl}/functions/v1/rss-feed" rel="self" type="application/rss+xml"/>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <pubDate>${posts && posts.length > 0 ? new Date(posts[0].publish_date).toUTCString() : new Date().toUTCString()}</pubDate>
    <ttl>60</ttl>
    <managingEditor>contact@benwest.io (Ben West)</managingEditor>
    <webMaster>contact@benwest.io (Ben West)</webMaster>
    ${rssItems}
  </channel>
</rss>`;

    console.log('RSS feed generated successfully, length:', rssContent.length);

    return new Response(rssContent, { 
      headers: corsHeaders,
      status: 200 
    });

  } catch (error) {
    console.error('RSS feed error:', error);
    return new Response(`Error generating RSS feed: ${error.message}`, { 
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
