import { useState, useEffect } from 'react';

export interface HtmlPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  publish_date: string;
  author: string;
  tags: string[];
  is_published: boolean;
  featured_image?: string;
  created_at: string;
  updated_at: string;
}

export const useHtmlPosts = () => {
  const [posts, setPosts] = useState<HtmlPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        
        // Read the export summary to get post metadata
        const summaryResponse = await fetch('/content/export-summary.json');
        if (!summaryResponse.ok) {
          throw new Error('Failed to load posts summary');
        }
        
        const summary = await summaryResponse.json();
        
        // Filter to only published posts
        const publishedPosts = summary.posts.filter((post: any) => post.is_published);
        
        // Load the actual HTML content for each post
        const postsWithContent = await Promise.all(
          publishedPosts.map(async (post: any) => {
            try {
              const contentResponse = await fetch(`/content/posts/${post.slug}.html`);
              if (!contentResponse.ok) {
                console.warn(`Could not load content for ${post.slug}`);
                return null;
              }
              
              const htmlContent = await contentResponse.text();
              
              // Extract metadata from the HTML file
              const metadataMatch = htmlContent.match(/<script type="application\/json" id="post-metadata">([\s\S]*?)<\/script>/);
              let metadata: any = {};
              
              if (metadataMatch) {
                try {
                  metadata = JSON.parse(metadataMatch[1]);
                } catch (e) {
                  console.warn(`Could not parse metadata for ${post.slug}`);
                }
              }
              
              // Extract the content from the HTML (everything between <div class="content"> and </div>)
              const contentMatch = htmlContent.match(/<div class="content">([\s\S]*?)<\/div>/);
              const content = contentMatch ? contentMatch[1] : '';
              
              return {
                id: post.slug,
                title: metadata.title || post.title,
                slug: post.slug,
                content: content,
                excerpt: metadata.excerpt || post.excerpt || '',
                publish_date: metadata.publish_date || post.publish_date,
                author: metadata.author || post.author || 'Ben West',
                tags: metadata.tags || post.tags || [],
                is_published: post.is_published,
                featured_image: metadata.featured_image || post.featured_image,
                created_at: metadata.created_at || '',
                updated_at: metadata.updated_at || ''
              };
            } catch (err) {
              console.warn(`Error loading post ${post.slug}:`, err);
              return null;
            }
          })
        );
        
        // Filter out null posts and sort by date
        const validPosts = postsWithContent
          .filter((post): post is HtmlPost => post !== null)
          .sort((a, b) => new Date(b.publish_date).getTime() - new Date(a.publish_date).getTime());
        
        setPosts(validPosts);
        setError(null);
      } catch (err) {
        console.error('Error loading HTML posts:', err);
        setError(err instanceof Error ? err.message : 'Failed to load posts');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const getPostBySlug = (slug: string): HtmlPost | undefined => {
    return posts.find(post => post.slug === slug);
  };

  return {
    posts,
    loading,
    error,
    getPostBySlug
  };
}; 