import { useState, useEffect } from 'react';
import matter from 'gray-matter';

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
  created_at?: string;
  updated_at?: string;
}

// List of available markdown posts - this will be dynamically loaded in production
const AVAILABLE_POSTS = [
  'still-crowned',
  'is-not-having-kids-an-effective-climate-solution',
  'say-please-thank-you-alexa-ok-google',
  'how-not-to-be-the-reason-your-company-has-a-data-breach-because-you-are-working-from-home',
  'blockchain-climate-solutions',
  'reflecting-year-one-great-climate-race',
  'rail-vs-pipelines-are-those-really-our-only-choice',
  'standing-with-chief-rueben-george-indigenous-leadership-against-tar-sands'
];

export const useMarkdownPosts = () => {
  const [posts, setPosts] = useState<MarkdownPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        
        const postsWithContent = await Promise.all(
          AVAILABLE_POSTS.map(async (slug) => {
            try {
              const response = await fetch(`/content/posts/${slug}.md`);
              if (!response.ok) {
                console.warn(`Could not load content for ${slug}`);
                return null;
              }
              
              const rawMarkdown = await response.text();
              const parsed = matter(rawMarkdown);
              
              // Extract frontmatter data
              const frontmatter = parsed.data;
              
              // Only include published posts
              if (!frontmatter.is_published) {
                return null;
              }

              return {
                id: slug,
                title: frontmatter.title || slug,
                slug: frontmatter.slug || slug,
                content: parsed.content,
                excerpt: frontmatter.excerpt || '',
                publish_date: frontmatter.publish_date || frontmatter.date || new Date().toISOString(),
                author: frontmatter.author || 'Ben West',
                tags: frontmatter.tags || [],
                is_published: frontmatter.is_published || false,
                featured_image: frontmatter.featured_image,
                created_at: frontmatter.created_at || '',
                updated_at: frontmatter.updated_at || ''
              };
            } catch (err) {
              console.warn(`Error loading post ${slug}:`, err);
              return null;
            }
          })
        );
        
        // Filter out null posts and sort by date
        const validPosts = (
          postsWithContent
            .filter((post) => post !== null) as MarkdownPost[]
        ).sort((a, b) => new Date(b.publish_date).getTime() - new Date(a.publish_date).getTime());
        
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