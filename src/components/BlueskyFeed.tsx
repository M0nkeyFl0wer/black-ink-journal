
import { ExternalLink } from 'lucide-react';
import { BlueskyErrorBoundary } from './BlueskyErrorBoundary';
import { BlueskyPostCard } from './bluesky/BlueskyPostCard';
import { useBlueskyFeed } from '@/hooks/useBlueskyFeed';

export const BlueskyFeed = () => {
  console.log('🔍 BlueskyFeed component mounting...');
  
  const { feedData, loading, debugInfo } = useBlueskyFeed();

  console.log('🎨 BlueskyFeed render state:', { 
    loading, 
    feedData, 
    postsCount: feedData.posts?.length,
    debugInfo
  });

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
        <div className="text-center text-xs text-gray-500">
          Loading Bluesky posts...
        </div>
      </div>
    );
  }

  if (feedData.error) {
    return (
      <div className="space-y-4">
        <div className="p-4 border border-red-800 rounded-lg">
          <p className="text-red-400 text-sm mb-2">Error loading Bluesky posts</p>
          <p className="text-gray-400 text-xs">Please try refreshing the page.</p>
        </div>
      </div>
    );
  }

  if (!feedData.posts || feedData.posts.length === 0) {
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
        <BlueskyPostCard key={post.id} post={post} />
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

// Wrap the export with error boundary
export default function BlueskyFeedWithErrorBoundary() {
  return (
    <BlueskyErrorBoundary>
      <BlueskyFeed />
    </BlueskyErrorBoundary>
  );
}
