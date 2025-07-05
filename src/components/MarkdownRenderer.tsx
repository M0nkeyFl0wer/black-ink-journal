import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useTheme } from '@/contexts/ThemeContext';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

const MarkdownRenderer = ({ content, className = '' }: MarkdownRendererProps) => {
  const { isDarkMode } = useTheme();

  return (
    <div className={`prose prose-lg max-w-none ${isDarkMode ? 'prose-invert' : 'prose-gray'} ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          // Custom styling for different elements
          h1: ({ children }) => (
            <h1 className={`text-3xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-black'}`}>
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className={`text-2xl font-bold mb-4 mt-8 ${isDarkMode ? 'text-white' : 'text-black'}`}>
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className={`text-xl font-bold mb-3 mt-6 ${isDarkMode ? 'text-white' : 'text-black'}`}>
              {children}
            </h3>
          ),
          p: ({ children }) => (
            <p className={`mb-4 leading-relaxed ${isDarkMode ? 'text-gray-300' : 'text-gray-800'}`}>
              {children}
            </p>
          ),
          a: ({ href, children }) => (
            <a 
              href={href} 
              target="_blank" 
              rel="noopener noreferrer"
              className={`underline ${isDarkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-500'}`}
            >
              {children}
            </a>
          ),
          strong: ({ children }) => (
            <strong className="font-bold">{children}</strong>
          ),
          em: ({ children }) => (
            <em className="italic">{children}</em>
          ),
          blockquote: ({ children }) => (
            <blockquote className={`border-l-4 pl-4 italic my-6 ${isDarkMode ? 'border-gray-600 text-gray-300' : 'border-gray-300 text-gray-700'}`}>
              {children}
            </blockquote>
          ),
          ul: ({ children }) => (
            <ul className={`list-disc list-inside mb-4 space-y-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-800'}`}>
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className={`list-decimal list-inside mb-4 space-y-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-800'}`}>
              {children}
            </ol>
          ),
          li: ({ children }) => (
            <li className="leading-relaxed">{children}</li>
          ),
          code: ({ children, className }) => {
            const isInline = !className;
            if (isInline) {
              return (
                <code className={`px-1 py-0.5 rounded text-sm ${isDarkMode ? 'bg-gray-800 text-gray-200' : 'bg-gray-100 text-gray-800'}`}>
                  {children}
                </code>
              );
            }
            return (
              <code className={className}>{children}</code>
            );
          },
          pre: ({ children }) => (
            <pre className={`p-4 rounded-lg overflow-x-auto mb-4 ${isDarkMode ? 'bg-gray-800 text-gray-200' : 'bg-gray-100 text-gray-800'}`}>
              {children}
            </pre>
          ),
          hr: () => (
            <hr className={`my-8 ${isDarkMode ? 'border-gray-600' : 'border-gray-300'}`} />
          ),
          img: ({ src, alt }) => (
            <img 
              src={src} 
              alt={alt} 
              className="max-w-full h-auto rounded-lg my-6"
            />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownRenderer; 