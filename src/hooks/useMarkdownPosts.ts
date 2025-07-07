import { useState, useEffect } from 'react';

export interface MarkdownPost {
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
}

export const useMarkdownPosts = () => {
  const [posts, setPosts] = useState<MarkdownPost[]>([]);
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
        const publishedPosts = summary.posts.filter((post: any) => post.published);
        
        // Load the actual markdown content for each post
        const postsWithContent = await Promise.all(
          publishedPosts.map(async (post: any) => {
            try {
              const contentResponse = await fetch(`/content/posts/${post.slug}.md`);
              if (!contentResponse.ok) {
                console.warn(`Could not load content for ${post.slug}`);
                return null;
              }
              
              const raw = await contentResponse.text();
              
              return {
                id: post.slug,
                title: post.title,
                slug: post.slug,
                content: raw,
                excerpt: post.excerpt || '',
                publish_date: post.date,
                author: post.author || 'Ben West',
                tags: post.tags || [],
                is_published: post.published,
                featured_image: post.featured_image
              };
            } catch (err) {
              console.warn(`Error loading post ${post.slug}:`, err);
              return null;
            }
          })
        );
        
        // Filter out null posts and sort by date
        const validPosts = postsWithContent
          .filter((post): post is MarkdownPost => post !== null)
          .sort((a, b) => new Date(b.publish_date).getTime() - new Date(a.publish_date).getTime());
        
        setPosts(validPosts);
        setError(null);
      } catch (err) {
        console.error('Error loading markdown posts:', err);
        setError(err instanceof Error ? err.message : 'Failed to load posts');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const getPostBySlug = (slug: string): MarkdownPost | undefined => {
    return posts.find(post => post.slug === slug);
  };

  return {
    posts,
    loading,
    error,
    getPostBySlug
  };
}; 