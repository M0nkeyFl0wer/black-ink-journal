
import { useState, useEffect } from 'react';
import { ExternalLink, Heart, MessageCircle, Repeat2, Link as LinkIcon } from 'lucide-react';
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
  images?: Array<{
    url: string;
    alt?: string;
    aspectRatio?: { width: number; height: number };
  }>;
  externalLink?: {
    url: string;
    title?: string;
    description?: string;
    thumb?: string;
  };
  quotedPost?: {
    text: string;
    author: string;
    handle: string;
  };
}

interface BlueskyFeedData {
  posts: BlueskyPost[];
  error?: string;
  debug?: any;
}

const ImageGallery = ({ images }: { images: BlueskyPost['images'] }) => {
  if (!images || images.length === 0) return null;

  const getGridClass = (count: number) => {
    if (count === 1) return 'grid-cols-1';
    if (count === 2) return 'grid-cols-2';
    if (count === 3) return 'grid-cols-2';
    return 'grid-cols-2';
  };

  return (
    <div className={`grid gap-2 mt-3 ${getGridClass(images.length)}`}>
      {images.map((image, index) => (
        <div
          key={index}
          className={`relative overflow-hidden rounded-lg ${
            images.length === 3 && index === 0 ? 'col-span-2' : ''
          }`}
        >
          <img
            src={image.url}
            alt={image.alt || 'Post image'}
            className="w-full h-auto object-cover hover:opacity-90 transition-opacity cursor-pointer"
            onClick={() => window.open(image.url, '_blank')}
            loading="lazy"
          />
        </div>
      ))}
    </div>
  );
};

const ExternalLinkPreview = ({ link }: { link: BlueskyPost['externalLink'] }) => {
  if (!link) return null;

  return (
    <a
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      className="block mt-3 border border-gray-700 rounded-lg hover:border-gray-600 transition-colors"
    >
      <div className="flex">
        {link.thumb && (
          <div className="w-20 h-20 flex-shrink-0">
            <img
              src={link.thumb}
              alt=""
              className="w-full h-full object-cover rounded-l-lg"
              loading="lazy"
            />
          </div>
        )}
        <div className="flex-1 p-3 min-w-0">
          <div className="flex items-start space-x-2">
            <LinkIcon className="w-4 h-4 mt-0.5 text-gray-400 flex-shrink-0" />
            <div className="min-w-0">
              {link.title && (
                <p className="text-sm font-medium text-white truncate">
                  {link.title}
                </p>
              )}
              {link.description && (
                <p className="text-xs text-gray-400 line-clamp-2 mt-1">
                  {link.description}
                </p>
              )}
              <p className="text-xs text-gray-500 truncate mt-1">
                {new URL(link.url).hostname}
              </p>
            </div>
          </div>
        </div>
      </div>
    </a>
  );
};

const QuotedPost = ({ quote }: { quote: BlueskyPost['quotedPost'] }) => {
  if (!quote) return null;

  return (
    <div className="mt-3 border border-gray-700 rounded-lg p-3 bg-gray-900/50">
      <div className="flex items-center space-x-2 mb-2">
        <span className="text-sm font-medium text-white">{quote.author}</span>
        <span className="text-xs text-gray-400">@{quote.handle}</span>
      </div>
      <p className="text-sm text-gray-300">{quote.text}</p>
    </div>
  );
};

export const BlueskyFeed = () => {
  const [feedData, setFeedData] = useState<BlueskyFeedData>({ posts: [] });
  const [loading, setLoading] = useState(true);
  const [debugInfo, setDebugInfo] = useState<any>(null);

  useEffect(() => {
    const fetchBlueskyFeed = async () => {
      console.log('🚀 Starting Bluesky feed fetch...');
      
      // Enhanced retry mechanism with exponential backoff
      const maxRetries = 3;
      let lastError: any = null;
      
      for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
          console.log(`📡 Attempt ${attempt}/${maxRetries} - Fetching Bluesky feed...`);
          
          const cacheBust = Date.now();
          const requestBody = { cacheBust };
          
          // Create AbortController for timeout
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout
          
          let data, error;
          
          try {
            // Primary method: Direct fetch with proper authentication
            console.log('🔄 Using direct fetch method...');
            
            const response = await fetch('https://jfsvlaaposslmeneovtp.supabase.co/functions/v1/bluesky-feed', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impmc3ZsYWFwb3NzbG1lbmVvdnRwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg4MTY0MzAsImV4cCI6MjA2NDM5MjQzMH0.RWD9DZgty4WVnHMGx3-MHQjgpTRVH9-mszmPPbEDhh4`,
                'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impmc3ZsYWFwb3NzbG1lbmVvdnRwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg4MTY0MzAsImV4cCI6MjA2NDM5MjQzMH0.RWD9DZgty4WVnHMGx3-MHQjgpTRVH9-mszmPPbEDhh4'
              },
              body: JSON.stringify(requestBody),
              signal: controller.signal
            });
            
            clearTimeout(timeoutId);
            
            console.log(`✅ Direct fetch response status: ${response.status}`);
            
            if (response.ok) {
              data = await response.json();
              error = null;
              console.log('🎉 Direct fetch successful!');
            } else {
              const errorText = await response.text();
              throw new Error(`HTTP ${response.status}: ${errorText}`);
            }
            
          } catch (fetchError: any) {
            clearTimeout(timeoutId);
            console.log(`⚠️ Direct fetch failed (attempt ${attempt}):`, fetchError.message);
            
            // If it's an abort error, don't retry immediately
            if (fetchError.name === 'AbortError') {
              throw new Error('Request timeout - function took too long to respond');
            }
            
            // For other errors, try Supabase client as fallback on final attempt
            if (attempt === maxRetries) {
              console.log('🔄 Trying Supabase client as final fallback...');
              
              try {
                const supabaseResponse = await supabase.functions.invoke('bluesky-feed', {
                  body: requestBody
                });
                
                data = supabaseResponse.data;
                error = supabaseResponse.error;
                
                console.log('✅ Supabase client fallback successful');
                
              } catch (supabaseError: any) {
                console.error('❌ Supabase client fallback also failed:', supabaseError);
                throw fetchError; // Throw the original fetch error
              }
            } else {
              throw fetchError; // Let it retry with direct fetch
            }
          }
          
          // Process successful response
          if (error) {
            console.error('🚨 Function returned error:', error);
            setFeedData({ 
              posts: [], 
              error: `Function error: ${error.message || JSON.stringify(error)}`
            });
            setDebugInfo({ 
              type: 'function_error', 
              error: error.message || JSON.stringify(error),
              attempt,
              timestamp: new Date().toISOString()
            });
          } else if (data && data.error) {
            console.error('🚨 API returned error:', data.error);
            setFeedData({ 
              posts: [], 
              error: `API error: ${data.error}`
            });
            setDebugInfo({ 
              type: 'api_error', 
              error: data.error,
              attempt,
              timestamp: new Date().toISOString()
            });
          } else if (data && data.posts) {
            console.log(`🎉 Success on attempt ${attempt}! Posts loaded:`, data.posts.length);
            setFeedData(data);
            setDebugInfo({ 
              type: 'success', 
              debug: data.debug,
              postsCount: data.posts?.length || 0,
              attempt,
              timestamp: new Date().toISOString()
            });
          } else {
            console.error('🚨 No valid data received');
            setFeedData({ 
              posts: [], 
              error: 'No data received from function'
            });
            setDebugInfo({ 
              type: 'no_data', 
              error: 'No data received',
              attempt,
              timestamp: new Date().toISOString()
            });
          }
          
          // Success! Break out of retry loop
          break;
          
        } catch (error: any) {
          lastError = error;
          console.error(`💥 Attempt ${attempt} failed:`, error.message);
          
          if (attempt < maxRetries) {
            // Exponential backoff: wait longer between retries
            const delay = Math.min(1000 * Math.pow(2, attempt - 1), 5000);
            console.log(`⏳ Waiting ${delay}ms before retry...`);
            await new Promise(resolve => setTimeout(resolve, delay));
          } else {
            // Final attempt failed
            console.error('💥 All retry attempts failed');
            const errorMessage = error.message || 'Unknown error';
            setFeedData({ 
              posts: [], 
              error: `Network error: ${errorMessage}`
            });
            setDebugInfo({ 
              type: 'network_error', 
              error: errorMessage,
              totalAttempts: maxRetries,
              timestamp: new Date().toISOString()
            });
          }
        }
      }
      
      setLoading(false);
    };

    fetchBlueskyFeed();
  }, []);

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
