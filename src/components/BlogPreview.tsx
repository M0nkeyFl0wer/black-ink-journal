
import { Link } from 'react-router-dom';
import { Calendar, Clock, User, Tag } from 'lucide-react';
import { BlogPost } from '@/hooks/useBlogPosts';

interface BlogPreviewProps {
  post: BlogPost;
  isFeatured?: boolean;
}

const BlogPreview = ({ post, isFeatured = false }: BlogPreviewProps) => {
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const target = e.target as HTMLImageElement;
    target.src = '/lovable-uploads/82867a2d-c687-4042-992d-c0841d74606e.png';
  };

  // Function to extract plain text from HTML content for excerpt
  const getTextExcerpt = (htmlContent: string, maxLength: number = 150): string => {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = htmlContent;
    const textContent = tempDiv.textContent || tempDiv.innerText || '';
    return textContent.length > maxLength 
      ? textContent.substring(0, maxLength) + '...'
      : textContent;
  };

  const excerpt = post.excerpt || getTextExcerpt(post.content, isFeatured ? 200 : 120);

  if (isFeatured) {
    return (
      <article className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden group mb-8">
        <Link to={`/post/${post.slug}`} className="block">
          <div className="aspect-[16/9] overflow-hidden bg-gray-100">
            <img
              src={post.featured_image || '/lovable-uploads/82867a2d-c687-4042-992d-c0841d74606e.png'}
              alt={post.title}
              onError={handleImageError}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
          
          <div className="p-6">
            <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-1" />
                {new Date(post.publish_date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </div>
              <div className="flex items-center">
                <User className="w-4 h-4 mr-1" />
                {post.author}
              </div>
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors duration-200 leading-tight">
              {post.title}
            </h2>
            
            <p className="text-gray-600 mb-4 leading-relaxed text-base">
              {excerpt}
            </p>
            
            {post.tags && post.tags.length > 0 && (
              <div className="flex items-center flex-wrap gap-2">
                <Tag className="w-3 h-3 text-gray-400" />
                {post.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium hover:bg-gray-200 transition-colors"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </Link>
      </article>
    );
  }

  return (
    <article className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden group">
      <Link to={`/post/${post.slug}`} className="block">
        <div className="aspect-[16/10] overflow-hidden bg-gray-100">
          <img
            src={post.featured_image || '/lovable-uploads/82867a2d-c687-4042-992d-c0841d74606e.png'}
            alt={post.title}
            onError={handleImageError}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        
        <div className="p-4">
          <div className="flex items-center space-x-3 text-xs text-gray-500 mb-3">
            <div className="flex items-center">
              <Calendar className="w-3 h-3 mr-1" />
              {new Date(post.publish_date).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric'
              })}
            </div>
            <div className="flex items-center">
              <User className="w-3 h-3 mr-1" />
              {post.author}
            </div>
          </div>
          
          <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors duration-200 leading-tight line-clamp-2">
            {post.title}
          </h3>
          
          <p className="text-gray-600 text-sm leading-relaxed line-clamp-2 mb-3">
            {excerpt}
          </p>
          
          {post.tags && post.tags.length > 0 && (
            <div className="flex items-center flex-wrap gap-1">
              <Tag className="w-3 h-3 text-gray-400" />
              {post.tags.slice(0, 2).map((tag, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium hover:bg-gray-200 transition-colors"
                >
                  {tag}
                </span>
              ))}
              {post.tags.length > 2 && (
                <span className="text-xs text-gray-400">+{post.tags.length - 2}</span>
              )}
            </div>
          )}
        </div>
      </Link>
    </article>
  );
};

export default BlogPreview;
