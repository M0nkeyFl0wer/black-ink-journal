
import { Link } from 'react-router-dom';
import { Calendar, Clock, User, Tag } from 'lucide-react';
import { BlogPost } from '@/hooks/useBlogPosts';

interface BlogPreviewProps {
  post: BlogPost;
}

const BlogPreview = ({ post }: BlogPreviewProps) => {
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const target = e.target as HTMLImageElement;
    target.src = '/lovable-uploads/82867a2d-c687-4042-992d-c0841d74606e.png';
  };

  return (
    <article className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group">
      <Link to={`/post/${post.slug}`} className="block">
        <div className="aspect-[16/9] overflow-hidden bg-gray-100">
          <img
            src={post.featured_image || '/lovable-uploads/82867a2d-c687-4042-992d-c0841d74606e.png'}
            alt={post.title}
            onError={handleImageError}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        
        <div className="p-8">
          <div className="flex items-center space-x-6 text-sm text-gray-500 mb-4">
            <div className="flex items-center">
              <Calendar className="w-4 h-4 mr-2" />
              {new Date(post.publish_date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </div>
            <div className="flex items-center">
              <User className="w-4 h-4 mr-2" />
              {post.author}
            </div>
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors duration-200 leading-tight">
            {post.title}
          </h2>
          
          {post.excerpt && (
            <p className="text-gray-600 mb-6 leading-relaxed line-clamp-3">
              {post.excerpt}
            </p>
          )}
          
          {post.tags && post.tags.length > 0 && (
            <div className="flex items-center flex-wrap gap-2">
              <Tag className="w-4 h-4 text-gray-400" />
              {post.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium hover:bg-gray-200 transition-colors"
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
};

export default BlogPreview;
