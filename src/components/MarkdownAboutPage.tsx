import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import SharedHeader from "@/components/SharedHeader";
import MarkdownRenderer from "@/components/MarkdownRenderer";
import matter from 'gray-matter';

const MarkdownAboutPage = () => {
  const { isDarkMode } = useTheme();
  const [content, setContent] = useState<string>('');
  const [frontmatter, setFrontmatter] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAboutContent = async () => {
      try {
        setLoading(true);
        const response = await fetch('/content/about.md');
        if (!response.ok) {
          throw new Error('Failed to load about page content');
        }
        
        const rawMarkdown = await response.text();
        const parsed = matter(rawMarkdown);
        
        setContent(parsed.content);
        setFrontmatter(parsed.data);
        setError(null);
      } catch (err) {
        console.error('Error loading about page:', err);
        setError(err instanceof Error ? err.message : 'Failed to load about page');
      } finally {
        setLoading(false);
      }
    };

    fetchAboutContent();
  }, []);

  if (loading) {
    return (
      <div className={`min-h-screen transition-colors duration-300 ${isDarkMode ? 'bg-black text-white' : 'bg-white text-black'}`}>
        <SharedHeader />
        <main className="max-w-4xl mx-auto px-6 py-8">
          <div className="flex items-center justify-center h-64">
            <div className={`animate-spin rounded-full h-12 w-12 border-b-2 ${isDarkMode ? 'border-white' : 'border-black'}`}></div>
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`min-h-screen transition-colors duration-300 ${isDarkMode ? 'bg-black text-white' : 'bg-white text-black'}`}>
        <SharedHeader />
        <main className="max-w-4xl mx-auto px-6 py-8">
          <div className="flex items-center mb-8">
            <Link
              to="/"
              className={`flex items-center transition-colors mr-4 ${isDarkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-500'}`}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Link>
          </div>
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Error Loading About Page</h1>
            <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{error}</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDarkMode ? 'bg-black text-white' : 'bg-white text-black'}`}>
      <SharedHeader />

      <main className="max-w-4xl mx-auto px-6 py-8">
        <div className="flex items-center mb-8">
          <Link
            to="/"
            className={`flex items-center transition-colors mr-4 ${isDarkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-500'}`}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
        </div>

        <h1 className="text-4xl font-bold mb-8">{frontmatter.title || 'About Me'}</h1>
        
        <MarkdownRenderer content={content} />
      </main>

      <footer className={`border-t p-6 text-center ${isDarkMode ? 'border-gray-800 text-gray-400' : 'border-gray-200 text-gray-900'}`}>
        <p>&copy; 2025 Ben West. This work is licensed under a <a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noopener noreferrer" className={isDarkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-500'}>Creative Commons Attribution 4.0 International License</a>.</p>
      </footer>
    </div>
  );
};

export default MarkdownAboutPage;