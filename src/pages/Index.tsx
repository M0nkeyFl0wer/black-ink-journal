
import { useState } from "react";
import { Link } from "react-router-dom";
import { Moon, Sun, Rss, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useBlogPosts } from "@/hooks/useBlogPosts";
import BlogPreview from "@/components/BlogPreview";

const Index = () => {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const { posts, loading, error } = useBlogPosts();

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  // Get the most recent post for featured display
  const featuredPost = posts[0];
  const otherPosts = posts.slice(1);

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDarkMode ? 'bg-black text-white' : 'bg-white text-black'}`}>
      {/* Header */}
      <header className="flex items-center justify-between p-6 border-b border-gray-800">
        <div className="flex items-center space-x-4">
          <img 
            src="/lovable-uploads/82867a2d-c687-4042-992d-c0841d74606e.png" 
            alt="Ben West" 
            className="w-12 h-12 rounded-full"
          />
          <div>
            <h1 className="text-xl font-bold">Ben West</h1>
            <p className="text-sm text-gray-400">Essays & Commentary</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleTheme}
            className="text-gray-400 hover:text-white"
          >
            {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-gray-400 hover:text-white"
          >
            <Rss className="w-4 h-4 mr-2" />
            RSS
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-12">
        {loading && (
          <div className="text-center text-gray-400">
            <p>Loading posts...</p>
          </div>
        )}

        {error && (
          <div className="text-center text-red-400">
            <p>Error loading posts: {error}</p>
          </div>
        )}

        {!loading && !error && posts.length === 0 && (
          <div className="text-center text-gray-400">
            <p>No posts found.</p>
          </div>
        )}

        {/* Featured Post */}
        {featuredPost && !loading && (
          <BlogPreview post={featuredPost} featured={true} />
        )}

        {/* Additional Blog Posts Section */}
        {otherPosts.length > 0 && (
          <section className="mb-16">
            <h3 className="text-xl font-bold mb-6">More Essays</h3>
            <div className="space-y-6">
              {otherPosts.map((post) => (
                <BlogPreview key={post.id} post={post} />
              ))}
            </div>
          </section>
        )}

        {/* Bluesky Feed Section */}
        <section className="border-t border-gray-800 pt-12">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-bold">Latest from Bluesky</h3>
            <a 
              href="https://bsky.app/profile/benwest.bsky.social"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 transition-colors flex items-center"
            >
              @benwest.bsky.social <ExternalLink className="w-4 h-4 ml-1" />
            </a>
          </div>
          
          <div className="space-y-4">
            <div className="p-4 border border-gray-800 rounded-lg">
              <p className="text-gray-300 mb-2">
                Bluesky feed integration coming soon. Connect your account to display recent posts here.
              </p>
              <span className="text-xs text-gray-500">Placeholder for Bluesky API integration</span>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-800 p-6 text-center text-gray-400">
        <p>&copy; 2025 Ben West. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Index;
