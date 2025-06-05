
import { useParams, Link } from 'react-router-dom';
import { useBlogPost } from '@/hooks/useBlogPosts';
import { Calendar, User, ArrowLeft, Tag } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import SharedHeader from '@/components/SharedHeader';
import SocialShare from './SocialShare';

const DynamicBlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const { post, loading, error } = useBlogPost(slug || '');
  const { isDarkMode } = useTheme();

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const target = e.target as HTMLImageElement;
    target.src = '/lovable-uploads/82867a2d-c687-4042-992d-c0841d74606e.png';
  };

  // Enhanced function to convert markdown-style content to HTML
  const convertMarkdownToHtml = (content: string): string => {
    return content
      // Convert **bold** to <strong>
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      // Convert markdown links [text](url) to HTML links
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, `<a href="$2" target="_blank" rel="noopener noreferrer" class="${isDarkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-500'} underline">$1</a>`)
      // Convert ## headings to h2
      .replace(/^## (.+)$/gm, `<h2 class="text-2xl font-bold mt-8 mb-4 ${isDarkMode ? 'text-white' : 'text-black'}">${'$1'}</h2>`)
      // Convert ### headings to h3
      .replace(/^### (.+)$/gm, `<h3 class="text-xl font-bold mt-6 mb-3 ${isDarkMode ? 'text-white' : 'text-black'}">${'$1'}</h3>`)
      // Convert triple dashes to horizontal rules
      .replace(/^---$/gm, `<hr class="${isDarkMode ? 'border-gray-600' : 'border-gray-300'} my-8" />`)
      // Convert single line breaks to <br> and double line breaks to paragraphs
      .split('\n\n')
      .map(paragraph => {
        if (paragraph.trim() === '') return '';
        if (paragraph.includes('<h2>') || paragraph.includes('<h3>') || paragraph.includes('<hr')) return paragraph;
        return `<p class="mb-4 leading-relaxed">${paragraph.replace(/\n/g, '<br>')}</p>`;
      })
      .join('\n');
  };

  // Function to format plain text content with proper paragraph breaks
  const formatContent = (content: string): string => {
    // Split by double line breaks to create paragraphs
    const paragraphs = content.split('\n\n').filter(p => p.trim() !== '');
    return paragraphs.map(paragraph => `<p class="mb-4 leading-relaxed">${paragraph.trim()}</p>`).join('\n\n');
  };

  if (loading) {
    return (
      <div className={`min-h-screen ${isDarkMode ? 'bg-black' : 'bg-white'} flex items-center justify-center`}>
        <div className={`animate-spin rounded-full h-12 w-12 border-b-2 ${isDarkMode ? 'border-white' : 'border-black'}`}></div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className={`min-h-screen ${isDarkMode ? 'bg-black text-white' : 'bg-white text-black'} flex items-center justify-center`}>
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Post Not Found</h1>
          <p className={`mb-8 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            This post has been removed or doesn't exist.
            {slug === 'fewer-kids-climate-emergency' && (
              <span className="block mt-2 text-sm">
                (This article was permanently deleted)
              </span>
            )}
          </p>
          <Link to="/" className={isDarkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-500'}>
            ← Back to Home
          </Link>
        </div>
      </div>
    );
  }

  // Enhanced content detection and formatting
  const isHtml = post.content.includes('<p>') || post.content.includes('<div>') || post.content.includes('<br>');
  const hasMarkdown = post.content.includes('**') || post.content.includes('[') || post.content.includes('##') || post.content.includes('###');
  
  let formattedContent: string;
  if (isHtml) {
    formattedContent = post.content;
  } else if (hasMarkdown) {
    formattedContent = convertMarkdownToHtml(post.content);
  } else {
    formattedContent = formatContent(post.content);
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDarkMode ? 'bg-black text-white' : 'bg-white text-black'}`}>
      <SharedHeader />
      
      <article className="max-w-4xl mx-auto px-6 py-12">
        <Link 
          to="/" 
          className={`inline-flex items-center transition-colors mb-8 ${isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-black'}`}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Essays
        </Link>

        <header className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
            {post.title}
          </h1>
          
          <div className={`flex items-center space-x-6 mb-8 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            <div className="flex items-center">
              <Calendar className="w-4 h-4 mr-2" />
              {new Date(post.publish_date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </div>
            <div className="flex items-center">
              <User className="w-4 h-4 mr-2" />
              {post.author}
            </div>
          </div>

          {post.tags && post.tags.length > 0 && (
            <div className="flex items-center flex-wrap gap-2 mb-8">
              <Tag className={`w-4 h-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} />
              {post.tags.map((tag, index) => (
                <span
                  key={index}
                  className={`px-3 py-1 rounded-full text-sm border ${
                    isDarkMode 
                      ? 'bg-gray-800 text-gray-300 border-gray-700' 
                      : 'bg-gray-100 text-gray-800 border-gray-300'
                  }`}
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {post.featured_image && (
            <div className="aspect-[16/9] rounded-2xl overflow-hidden mb-8 bg-gray-900">
              <img
                src={post.featured_image}
                alt={post.title}
                onError={handleImageError}
                className="w-full h-full object-cover"
              />
            </div>
          )}
        </header>

        <div 
          className={`prose prose-lg max-w-none mb-12 ${isDarkMode ? 'prose-invert' : 'prose-gray text-black'}`}
          dangerouslySetInnerHTML={{ __html: formattedContent }}
        />

        <SocialShare 
          url={window.location.href}
          title={post.title}
        />
      </article>
    </div>
  );
};

export default DynamicBlogPost;
