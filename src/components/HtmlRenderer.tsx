import React from 'react';
import DOMPurify from 'dompurify';

interface HtmlRendererProps {
  content: string;
  className?: string;
}

const HtmlRenderer: React.FC<HtmlRendererProps> = ({ content, className = '' }) => {
  // Function to sanitize HTML content using DOMPurify
  const sanitizeHtml = (html: string): string => {
    return DOMPurify.sanitize(html, {
      ALLOWED_TAGS: [
        'p', 'br', 'strong', 'em', 'b', 'i', 'u', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
        'ul', 'ol', 'li', 'blockquote', 'pre', 'code', 'a', 'img', 'div', 'span',
        'table', 'thead', 'tbody', 'tr', 'th', 'td', 'hr',
        // Add common semantic HTML tags
        'section', 'article', 'header', 'footer', 'nav', 'aside', 'main',
        'figure', 'figcaption', 'caption'
      ],
      ALLOWED_ATTR: [
        'href', 'src', 'alt', 'title', 'class', 'id', 'target', 'rel',
        'width', 'height', 'style'
      ],
      ALLOWED_URI_REGEXP: /^(?:(?:(?:f|ht)tps?|mailto|tel|callto|cid|xmpp):|[^a-z]|[a-z+\.\-]+(?:[^a-z+\.\-:]|$))/i,
      FORBID_TAGS: ['script', 'iframe', 'object', 'embed', 'form', 'input', 'button'],
      FORBID_ATTR: ['onerror', 'onload', 'onclick', 'onmouseover', 'onfocus', 'onblur']
    });
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