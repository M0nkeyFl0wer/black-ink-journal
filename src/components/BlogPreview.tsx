
import { Link } from 'react-router-dom';
import { Calendar, User, Tag } from 'lucide-react';
import { BlogPost } from '@/hooks/useBlogPosts';
import { useTheme } from '@/contexts/ThemeContext';

interface BlogPreviewProps {
  post: BlogPost;
  isFeatured?: boolean;
}

const BlogPreview = ({ post, isFeatured }: BlogPreviewProps) => {
  const { isDarkMode } = useTheme();
  
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const target = e.target as HTMLImageElement;
    target.src = '/lovable-uploads/82867a2d-c687-4042-992d-c0841d74606e.png';
  };

  return (
    <article className={`group ${isFeatured ? 'mb-12' : 'mb-8'}`}>
      <Link to={`/post/${post.slug}`} className="block">
        <div className={`flex ${isFeatured ? 'flex-col' : 'flex-row'} gap-6`}>
          {/* Image */}
          <div className={`${
            isFeatured 
              ? 'w-full aspect-[16/9]' 
              : 'w-48 h-32'
          } rounded-xl overflow-hidden bg-gray-900 flex-shrink-0`}>
            <img
              src={post.featured_image || '/lovable-uploads/82867a2d-c687-4042-992d-c0841d74606e.png'}
              alt={post.title}
              onError={handleImageError}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className={`flex items-center space-x-4 mb-3 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
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

            <h2 className={`font-bold mb-3 group-hover:${isDarkMode ? 'text-gray-300' : 'text-gray-700'} transition-colors ${
              isFeatured ? 'text-2xl md:text-3xl' : 'text-xl'
            } ${isDarkMode ? 'text-white' : 'text-black'}`}>
              {post.title}
            </h2>

            {post.excerpt && (
              <p className={`mb-4 line-clamp-3 ${
                isFeatured ? 'text-lg' : 'text-base'
              } ${isDarkMode ? 'text-gray-300' : 'text-gray-800'}`}>
                {post.excerpt}
              </p>
            )}

            {post.tags && post.tags.length > 0 && (
              <div className="flex items-center flex-wrap gap-2">
                <Tag className={`w-4 h-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} />
                {post.tags.slice(0, 3).map((tag, index) => (
                  <span
                    key={index}
                    className={`px-2 py-1 rounded text-xs border ${
                      isDarkMode 
                        ? 'bg-gray-800 text-gray-300 border-gray-700' 
                        : 'bg-gray-100 text-gray-800 border-gray-300'
                    }`}
                  >
                    {tag}
                  </span>
                ))}
                {post.tags.length > 3 && (
                  <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    +{post.tags.length - 3} more
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </Link>
    </article>
  );
};

export default BlogPreview;
