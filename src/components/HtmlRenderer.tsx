import React from 'react';

interface HtmlRendererProps {
  content: string;
  className?: string;
}

const HtmlRenderer: React.FC<HtmlRendererProps> = ({ content, className = '' }) => {
  // Function to sanitize HTML content (basic sanitization)
  const sanitizeHtml = (html: string): string => {
    // This is a basic sanitization - in production you might want to use a library like DOMPurify
    return html
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove script tags
      .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '') // Remove iframe tags
      .replace(/javascript:/gi, '') // Remove javascript: protocol
      .replace(/on\w+\s*=/gi, ''); // Remove event handlers
  };

  const sanitizedContent = sanitizeHtml(content);

  return (
    <div 
      className={`html-content ${className}`}
      dangerouslySetInnerHTML={{ __html: sanitizedContent }}
    />
  );
};

export default HtmlRenderer; 