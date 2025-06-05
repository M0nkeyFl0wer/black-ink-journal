
import { ExternalLink } from 'lucide-react';

interface BlueskyPost {
  id: string;
  text: string;
  createdAt: string;
  author: {
    displayName: string;
    handle: string;
  };
}

// Placeholder component for Bluesky integration
export const BlueskyFeed = () => {
  // This would connect to Bluesky API in the future
  const placeholderPosts: BlueskyPost[] = [
    {
      id: '1',
      text: 'Just published a new essay about monarchy and democracy in Canada. The Speech from the Throne hits different when you realize what we\'re actually asking our ministers to pledge allegiance to.',
      createdAt: '2025-05-16T10:00:00Z',
      author: {
        displayName: 'Ben West',
        handle: 'benwest.bsky.social'
      }
    }
  ];

  return (
    <div className="space-y-4">
      {placeholderPosts.map((post) => (
        <div key={post.id} className="p-4 border border-gray-800 rounded-lg">
          <div className="flex items-start space-x-3">
            <img 
              src="/lovable-uploads/82867a2d-c687-4042-992d-c0841d74606e.png"
              alt={post.author.displayName}
              className="w-8 h-8 rounded-full"
            />
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <span className="font-semibold text-sm">{post.author.displayName}</span>
                <span className="text-gray-400 text-xs">@{post.author.handle}</span>
                <span className="text-gray-500 text-xs">·</span>
                <span className="text-gray-400 text-xs">
                  {new Date(post.createdAt).toLocaleDateString()}
                </span>
              </div>
              <p className="text-gray-300 text-sm leading-relaxed">{post.text}</p>
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
