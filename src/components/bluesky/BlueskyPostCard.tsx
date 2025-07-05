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

  const handleEngagementClick = (action: 'like' | 'repost' | 'reply') => {
    if (post.blueskyUrl) {
      // Open the post on Bluesky - users can then like/repost/reply there
      window.open(post.blueskyUrl, '_blank', 'noopener,noreferrer');
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
            src="/images/82867a2d-c687-4042-992d-c0841d74606e.png"
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
            <button 
              onClick={() => handleEngagementClick('reply')}
              className="flex items-center space-x-1 hover:text-blue-400 transition-colors cursor-pointer group"
              title="Reply on Bluesky"
            >
              <MessageCircle className="w-4 h-4" />
              <span className="text-xs">{post.engagement.replies}</span>
              <svg className="w-3 h-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
            </button>
            <button 
              onClick={() => handleEngagementClick('repost')}
              className="flex items-center space-x-1 hover:text-green-400 transition-colors cursor-pointer group"
              title="Repost on Bluesky"
            >
              <Repeat2 className="w-4 h-4" />
              <span className="text-xs">{post.engagement.reposts}</span>
              <svg className="w-3 h-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
            </button>
            <button 
              onClick={() => handleEngagementClick('like')}
              className="flex items-center space-x-1 hover:text-red-400 transition-colors cursor-pointer group"
              title="Like on Bluesky"
            >
              <Heart className="w-4 h-4" />
              <span className="text-xs">{post.engagement.likes}</span>
              <svg className="w-3 h-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
