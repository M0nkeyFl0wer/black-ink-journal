
import { useState, useEffect } from 'react';
import { ExternalLink, Heart, MessageCircle, Repeat2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface BlueskyPost {
  id: string;
  text: string;
  createdAt: string;
  author: {
    displayName: string;
    handle: string;
    avatar?: string;
  };
  engagement: {
    likes: number;
    reposts: number;
    replies: number;
  };
}

interface BlueskyFeedData {
  posts: BlueskyPost[];
  error?: string;
}

export const BlueskyFeed = () => {
  const [feedData, setFeedData] = useState<BlueskyFeedData>({ posts: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlueskyFeed = async () => {
      try {
        console.log('Fetching Bluesky feed...');
        const { data, error } = await supabase.functions.invoke('bluesky-feed');
        
        if (error) {
          console.error('Supabase function error:', error);
          setFeedData({ posts: [], error: error.message });
        } else {
          console.log('Successfully fetched Bluesky data:', data);
          setFeedData(data);
        }
      } catch (error) {
        console.error('Error fetching Bluesky feed:', error);
        setFeedData({ posts: [], error: 'Failed to load Bluesky posts' });
      } finally {
        setLoading(false);
      }
    };

    fetchBlueskyFeed();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 24) {
      return `${diffInHours}h`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays}d`;
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse">
          <div className="p-4 border border-gray-800 rounded-lg">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-gray-700 rounded-full"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-700 rounded w-1/3 mb-2"></div>
                <div className="h-3 bg-gray-700 rounded w-full mb-1"></div>
                <div className="h-3 bg-gray-700 rounded w-2/3"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (feedData.error) {
    return (
      <div className="space-y-4">
        <div className="p-4 border border-red-800 rounded-lg">
          <p className="text-red-400 text-sm">Error loading Bluesky posts: {feedData.error}</p>
          <p className="text-gray-400 text-xs mt-2">Please try refreshing the page.</p>
        </div>
      </div>
    );
  }

  if (feedData.posts.length === 0) {
    return (
      <div className="space-y-4">
        <div className="p-4 border border-gray-800 rounded-lg">
          <p className="text-gray-300 text-sm">No recent posts found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {feedData.posts.map((post) => (
        <div key={post.id} className="p-4 border border-gray-800 rounded-lg hover:border-gray-700 transition-colors">
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
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <span className="font-semibold text-sm text-white">{post.author.displayName}</span>
                <span className="text-gray-400 text-xs">@{post.author.handle}</span>
                <span className="text-gray-500 text-xs">·</span>
                <span className="text-gray-400 text-xs">
                  {formatDate(post.createdAt)}
                </span>
              </div>
              <p className="text-gray-300 text-sm leading-relaxed mb-3">{post.text}</p>
              
              {/* Engagement metrics */}
              <div className="flex items-center space-x-4 text-gray-500">
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
      ))}
      
      <div className="text-center">
        <a 
          href="https://bsky.app/profile/benwest.bsky.social"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center text-blue-400 hover:text-blue-300 transition-colors"
        >
          View all posts <ExternalLink className="w-4 h-4 ml-1" />
        </a>
      </div>
    </div>
  );
};
