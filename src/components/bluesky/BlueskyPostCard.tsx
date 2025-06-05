
import { Heart, MessageCircle, Repeat2 } from 'lucide-react';
import { BlueskyPost } from './types';
import { ImageGallery, ExternalLinkPreview, QuotedPost } from './BlueskyPostMedia';

interface BlueskyPostCardProps {
  post: BlueskyPost;
}

export const BlueskyPostCard = ({ post }: BlueskyPostCardProps) => {
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
      
      if (diffInHours < 24) {
        return `${diffInHours}h`;
      } else {
        const diffInDays = Math.floor(diffInHours / 24);
        return `${diffInDays}d`;
      }
    } catch (error) {
      console.error('Error formatting date:', error);
      return '';
    }
  };

  return (
    <div className="p-4 border border-gray-800 rounded-lg hover:border-gray-700 transition-colors">
      <div className="flex items-start space-x-3">
        {post.author.avatar ? (
          <img 
            src={post.author.avatar}
            alt={post.author.displayName}
            className="w-8 h-8 rounded-full"
          />
        ) : (
          <img 
            src="/lovable-uploads/82867a2d-c687-4042-992d-c0841d74606e.png"
            alt={post.author.displayName}
            className="w-8 h-8 rounded-full"
          />
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 mb-2">
            <span className="font-semibold text-sm text-white">{post.author.displayName}</span>
            <span className="text-gray-400 text-xs">@{post.author.handle}</span>
            <span className="text-gray-500 text-xs">·</span>
            <span className="text-gray-400 text-xs">
              {formatDate(post.createdAt)}
            </span>
          </div>
          
          <p className="text-gray-300 text-sm leading-relaxed mb-3">{post.text}</p>
          
          <ImageGallery images={post.images} />
          <ExternalLinkPreview link={post.externalLink} />
          <QuotedPost quote={post.quotedPost} />
          
          <div className="flex items-center space-x-4 text-gray-500 mt-3">
            <div className="flex items-center space-x-1 hover:text-blue-400 transition-colors">
              <MessageCircle className="w-4 h-4" />
              <span className="text-xs">{post.engagement.replies}</span>
            </div>
            <div className="flex items-center space-x-1 hover:text-green-400 transition-colors">
              <Repeat2 className="w-4 h-4" />
              <span className="text-xs">{post.engagement.reposts}</span>
            </div>
            <div className="flex items-center space-x-1 hover:text-red-400 transition-colors">
              <Heart className="w-4 h-4" />
              <span className="text-xs">{post.engagement.likes}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
