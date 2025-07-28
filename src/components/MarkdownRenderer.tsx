import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useTheme } from '@/contexts/ThemeContext';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content, className = '' }) => {
  const { isDarkMode } = useTheme();

  return (
    <div className={`markdown-content prose prose-lg max-w-none ${
      isDarkMode 
        ? 'prose-invert prose-headings:text-white prose-p:text-gray-300 prose-strong:text-white prose-a:text-blue-400 prose-blockquote:text-gray-300 prose-code:text-gray-300' 
        : 'prose-headings:text-black prose-p:text-gray-800 prose-strong:text-black prose-a:text-blue-600 prose-blockquote:text-gray-800 prose-code:text-gray-800'
    } ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          img: ({ src, alt, ...props }) => (
            <img
              src={src}
              alt={alt}
              className="rounded-lg shadow-lg mx-auto my-8 max-w-full"
              onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                const target = e.target as HTMLImageElement;
                target.src = '/images/82867a2d-c687-4042-992d-c0841d74606e.png';
              }}
              {...props}
            />
          ),
          a: ({ href, children, ...props }) => (
            <a
              href={href}
              target={href?.startsWith('http') ? '_blank' : undefined}
              rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
              className={isDarkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-500'}
              {...props}
            >
              {children}
            </a>
          ),
          blockquote: ({ children, ...props }) => (
            <blockquote
              className={`border-l-4 pl-4 my-6 italic ${
                isDarkMode ? 'border-gray-600 text-gray-300' : 'border-gray-300 text-gray-700'
              }`}
              {...props}
            >
              {children}
            </blockquote>
          ),
          code: ({ children, className, ...props }) => {
            const isInline = !className;
            return isInline ? (
              <code
                className={`px-1 py-0.5 rounded text-sm font-mono ${
                  isDarkMode ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 text-gray-800'
                }`}
                {...props}
              >
                {children}
              </code>
            ) : (
              <code
                className={`block p-4 rounded-lg text-sm font-mono overflow-x-auto ${
                  isDarkMode ? 'bg-gray-900 text-gray-300' : 'bg-gray-50 text-gray-800'
                }`}
                {...props}
              >
                {children}
              </code>
            );
          }
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownRenderer;