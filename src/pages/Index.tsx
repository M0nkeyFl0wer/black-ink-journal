
import { Link } from "react-router-dom";
import { ExternalLink } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { useHtmlPosts } from "@/hooks/useHtmlPosts";
import BlogPreview from "@/components/BlogPreview";
import SharedHeader from "@/components/SharedHeader";
import BlueskyFeedWithErrorBoundary from "@/components/BlueskyFeed";

const Index = () => {
  const { isDarkMode } = useTheme();
  const { posts, loading, error } = useHtmlPosts();

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDarkMode ? 'bg-black text-white' : 'bg-white text-black'}`}>
      <SharedHeader />

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-8">
        {loading && (
          <div className={`text-center ${isDarkMode ? 'text-gray-400' : 'text-gray-900'}`}>
            <p>Loading posts...</p>
          </div>
        )}

        {error && (
          <div className={`text-center ${isDarkMode ? 'text-red-400' : 'text-red-600'}`}>
            <p>Error loading posts: {error}</p>
          </div>
        )}

        {!loading && !error && posts.length === 0 && (
          <div className={`text-center ${isDarkMode ? 'text-gray-400' : 'text-gray-900'}`}>
            <p>No posts found. Check the database connection and RLS policies.</p>
          </div>
        )}

        {/* Single Column Layout */}
        {!loading && posts.length > 0 && (
          <div className="space-y-6">
            {posts.map((post, index) => (
              <BlogPreview key={post.id} post={post} isFeatured={index === 0} />
            ))}
          </div>
        )}

        {/* Bluesky Feed Section with Error Boundary */}
        <section className={`border-t pt-12 mt-12 ${isDarkMode ? 'border-gray-800' : 'border-gray-200'}`}>
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-bold">Let's Hang Out Where the Sky is Blue</h3>
            <a 
              href="https://bsky.app/profile/benwest.bsky.social"
              target="_blank"
              rel="noopener noreferrer"
              className={`transition-colors flex items-center ${isDarkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-500'}`}
            >
              @benwest.bsky.social <ExternalLink className="w-4 h-4 ml-1" />
            </a>
          </div>
          
          <div className="bluesky-feed-container">
            <BlueskyFeedWithErrorBoundary />
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className={`border-t p-6 text-center ${isDarkMode ? 'border-gray-800 text-gray-400' : 'border-gray-200 text-gray-900'}`}>
        <p>&copy; 2025 Ben West. This work is licensed under a <a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noopener noreferrer" className={isDarkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-500'}>Creative Commons Attribution 4.0 International License</a>.</p>
      </footer>
    </div>
  );
};

export default Index;
