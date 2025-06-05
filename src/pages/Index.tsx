
import { useState } from "react";
import { Link } from "react-router-dom";
import { Moon, Sun, Rss, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

const Index = () => {
  const [isDarkMode, setIsDarkMode] = useState(true);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

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
        {/* Featured Post */}
        <article className="mb-16">
          <Link to="/post/still-crowned" className="group">
            <div className="relative overflow-hidden rounded-lg mb-6">
              <img 
                src="/lovable-uploads/82867a2d-c687-4042-992d-c0841d74606e.png"
                alt="Still Crowned"
                className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4">
                <span className="inline-block px-2 py-1 text-xs bg-red-600 text-white rounded mb-2">
                  ESSAYS
                </span>
                <h2 className="text-2xl font-bold text-white mb-2 group-hover:text-red-400 transition-colors">
                  Still Crowned
                </h2>
                <p className="text-gray-200 text-sm">
                  A country that talks like a democracy but still curtsies like a colony
                </p>
              </div>
            </div>
          </Link>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-300 leading-relaxed">
              At the recent swearing-in ceremony for Canada's newest ministers, one detail stood out. 
              Not the cabinet picks, but the words they were made to say: a solemn pledge of allegiance 
              to "His Majesty King Charles the Third, his heirs and successors." In 2025. In a modern democracy...
            </p>
            <Link 
              to="/post/still-crowned" 
              className="inline-flex items-center text-red-400 hover:text-red-300 transition-colors mt-4"
            >
              Read more <ExternalLink className="w-4 h-4 ml-1" />
            </Link>
          </div>
        </article>

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
