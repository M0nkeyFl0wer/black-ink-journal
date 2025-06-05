
import { Link } from "react-router-dom";
import { ExternalLink, Calendar, Tag } from "lucide-react";
import { BlogPost } from "@/hooks/useBlogPosts";

interface BlogPreviewProps {
  post: BlogPost;
  featured?: boolean;
}

const BlogPreview = ({ post, featured = false }: BlogPreviewProps) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Debug logging for image issues
  console.log('BlogPreview render:', {
    postTitle: post.title,
    featuredImage: post.featured_image,
    featured: featured
  });

  if (featured) {
    return (
      <article className="mb-16">
        <Link to={`/post/${post.slug}`} className="group">
          <div className="relative overflow-hidden rounded-lg mb-6">
            <img 
              src={post.featured_image || "/lovable-uploads/61703bd2-7bd9-4d04-b4af-f6e6d12cc735.png"}
              alt={post.title}
              className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
              onLoad={() => console.log('Image loaded successfully:', post.featured_image)}
              onError={(e) => {
                console.error('Image failed to load:', post.featured_image);
                console.error('Error details:', e);
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4">
              <span className="inline-block px-2 py-1 text-xs bg-red-600 text-white rounded mb-2">
                <Tag className="w-3 h-3 inline mr-1" />
                {post.tags?.[0]?.toUpperCase() || 'ESSAYS'}
              </span>
              <h2 className="text-2xl font-bold text-white mb-2 group-hover:text-red-400 transition-colors">
                {post.title}
              </h2>
              <p className="text-gray-200 text-sm">
                {post.excerpt}
              </p>
            </div>
          </div>
        </Link>
      </article>
    );
  }

  
  return (
    <article className="border-b border-gray-800 pb-6 mb-6 last:border-b-0">
      <Link to={`/post/${post.slug}`} className="group">
        <div className="flex gap-4">
          {post.featured_image && (
            <img 
              src={post.featured_image}
              alt={post.title}
              className="w-24 h-24 object-cover rounded-lg flex-shrink-0"
            />
          )}
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs text-gray-500">
                <Calendar className="w-3 h-3 inline mr-1" />
                {formatDate(post.publish_date)}
              </span>
              {post.tags && post.tags.length > 0 && (
                <span className="text-xs bg-gray-800 text-gray-300 px-2 py-1 rounded">
                  {post.tags[0]}
                </span>
              )}
            </div>
            <h3 className="text-lg font-bold text-white mb-2 group-hover:text-red-400 transition-colors">
              {post.title}
            </h3>
            <p className="text-gray-400 text-sm line-clamp-2">
              {post.excerpt}
            </p>
          </div>
        </div>
      </Link>
    </article>
  );
};

export default BlogPreview;
