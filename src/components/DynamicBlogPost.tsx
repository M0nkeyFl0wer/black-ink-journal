
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Calendar, Tag, Share2, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useBlogPost } from "@/hooks/useBlogPosts";

const DynamicBlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const [isDarkMode, setIsDarkMode] = useState(true);
  const { post, loading, error } = useBlogPost(slug || '');

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Function to determine if content is HTML or plain text
  const isHtmlContent = (content: string) => {
    return /<[a-z][\s\S]*>/i.test(content);
  };

  // Function to format plain text content for display
  const formatPlainTextContent = (content: string) => {
    return content.split('\n\n').map((paragraph, index) => (
      <p key={index} className="text-lg leading-relaxed mb-6">
        {paragraph}
      </p>
    ));
  };

  if (loading) {
    return (
      <div className={`min-h-screen transition-colors duration-300 ${isDarkMode ? 'bg-black text-white' : 'bg-white text-black'}`}>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-gray-400">Loading...</div>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className={`min-h-screen transition-colors duration-300 ${isDarkMode ? 'bg-black text-white' : 'bg-white text-black'}`}>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Post Not Found</h1>
            <p className="text-gray-400 mb-6">The blog post you're looking for doesn't exist.</p>
            <Link to="/" className="text-red-400 hover:text-red-300">
              Return to home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDarkMode ? 'bg-black text-white' : 'bg-white text-black'}`}>
      {/* Header */}
      <header className="flex items-center justify-between p-6 border-b border-gray-800">
        <Link to="/" className="flex items-center space-x-4">
          <img 
            src="/lovable-uploads/82867a2d-c687-4042-992d-c0841d74606e.png" 
            alt="Ben West" 
            className="w-12 h-12 rounded-full"
          />
          <div>
            <h1 className="text-xl font-bold">Ben West</h1>
            <p className="text-sm text-gray-400">Essays & Commentary</p>
          </div>
        </Link>
        
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
            <Share2 className="w-4 h-4" />
          </Button>
        </div>
      </header>

      {/* Article */}
      <article className="max-w-4xl mx-auto px-6 py-12">
        {/* Back link */}
        <Link 
          to="/" 
          className="inline-flex items-center text-gray-400 hover:text-white transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to home
        </Link>

        {/* Article Header */}
        <header className="mb-12">
          <div className="flex items-center space-x-4 mb-6">
            <span className="inline-block px-3 py-1 text-sm bg-red-600 text-white rounded">
              <Tag className="w-3 h-3 inline mr-1" />
              {post.tags?.[0]?.toUpperCase() || 'ESSAYS'}
            </span>
            <span className="flex items-center text-gray-400 text-sm">
              <Calendar className="w-4 h-4 mr-1" />
              {formatDate(post.publish_date)}
            </span>
          </div>
          
          <h1 className="text-5xl font-bold leading-tight mb-6">
            {post.title}
          </h1>
          
          {post.excerpt && (
            <p className="text-xl text-gray-300 leading-relaxed mb-8">
              {post.excerpt}
            </p>
          )}
          
          <div className="flex items-center">
            <img 
              src="/lovable-uploads/82867a2d-c687-4042-992d-c0841d74606e.png" 
              alt="Ben West" 
              className="w-8 h-8 rounded-full mr-3"
            />
            <span className="text-gray-400">By {post.author}</span>
          </div>
        </header>

        {/* Hero Image */}
        {post.featured_image && (
          <div className="mb-12">
            <img 
              src={post.featured_image}
              alt={post.title}
              className="w-full h-96 object-cover rounded-lg"
            />
          </div>
        )}

        {/* Article Content */}
        <div className="prose prose-lg prose-invert max-w-none">
          {isHtmlContent(post.content) ? (
            <div dangerouslySetInnerHTML={{ __html: post.content }} />
          ) : (
            formatPlainTextContent(post.content)
          )}
        </div>

        {/* Article Footer */}
        <footer className="border-t border-gray-800 pt-8 mt-12">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <img 
                src="/lovable-uploads/82867a2d-c687-4042-992d-c0841d74606e.png" 
                alt="Ben West" 
                className="w-12 h-12 rounded-full"
              />
              <div>
                <p className="font-bold">{post.author}</p>
                <p className="text-gray-400 text-sm">Essays & Commentary</p>
              </div>
            </div>
            <Button variant="outline" size="sm">
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
          </div>
        </footer>
      </article>
    </div>
  );
};

export default DynamicBlogPost;
