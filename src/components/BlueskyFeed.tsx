
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
          <p className="text-red-400 text-sm mb-2">Error loading Bluesky posts:</p>
          <p className="text-red-300 text-xs font-mono mb-3">{feedData.error}</p>
          <p className="text-gray-400 text-xs mb-3">Please try refreshing the page.</p>
          
          {/* Enhanced debug information */}
          <details className="mt-3">
            <summary className="text-xs text-gray-500 cursor-pointer hover:text-gray-400">
              🔍 Debug Information (Click to expand)
            </summary>
            <div className="mt-2 p-2 bg-gray-900 rounded text-xs">
              <div className="mb-2">
                <strong className="text-gray-300">Timestamp:</strong> {debugInfo?.timestamp || 'N/A'}
              </div>
              <div className="mb-2">
                <strong className="text-gray-300">Error Type:</strong> {debugInfo?.type || 'Unknown'}
              </div>
              <div className="mb-2">
                <strong className="text-gray-300">Attempts Made:</strong> {debugInfo?.attempt || debugInfo?.totalAttempts || 'N/A'}
              </div>
              <div className="mb-2">
                <strong className="text-gray-300">Error Details:</strong>
                <pre className="text-gray-400 mt-1 overflow-auto whitespace-pre-wrap">
                  {JSON.stringify(debugInfo, null, 2)}
                </pre>
              </div>
              <div className="mt-2 pt-2 border-t border-gray-700">
                <strong className="text-gray-300">Function URL:</strong> 
                <span className="text-blue-400 ml-1">https://jfsvlaaposslmeneovtp.supabase.co/functions/v1/bluesky-feed</span>
              </div>
            </div>
          </details>
        </div>
      </div>
    );
  }

  if (!feedData.posts || feedData.posts.length === 0) {
    return (
      <div className="space-y-4">
        <div className="p-4 border border-gray-800 rounded-lg">
          <p className="text-gray-300 text-sm">No recent posts found.</p>
          {debugInfo && (
            <details className="mt-3">
              <summary className="text-xs text-gray-500 cursor-pointer">Debug Info</summary>
              <pre className="text-xs text-gray-600 mt-2 overflow-auto">
                {JSON.stringify(debugInfo, null, 2)}
              </pre>
            </details>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Debug info for development */}
      {debugInfo && debugInfo.type === 'success' && (
        <div className="text-xs text-gray-500 mb-2">
          ✅ Last updated: {debugInfo.debug?.timestamp && new Date(debugInfo.debug.timestamp).toLocaleTimeString()}
          {debugInfo.postsCount && ` • ${debugInfo.postsCount} posts loaded`}
          {debugInfo.attempt && ` • Succeeded on attempt ${debugInfo.attempt}`}
        </div>
      )}
      
      {/* Visible debug info to verify component is rendering */}
      <div className="text-xs text-green-400 mb-2">
        🔍 BlueskyFeed component rendered at {new Date().toLocaleTimeString()}
      </div>
      
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
