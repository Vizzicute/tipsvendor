'use client';

import React, { useEffect, useState } from 'react';

const PageContent = ({ content, className }: { content: string, className?: string }) => {
  const [cleanHtmlContent, setCleanHtmlContent] = useState('');

  useEffect(() => {
    // Import DOMPurify dynamically only on the client side
    import('dompurify').then((DOMPurify) => {
      const purify = DOMPurify.default;
      
      setCleanHtmlContent(purify.sanitize(content || '', {
        ALLOWED_TAGS: ['p', 'br', 'b', 'i', 'em', 'strong', 'a', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ul', 'ol', 'li', 'blockquote', 'img', 'div', 'span'],
        ALLOWED_ATTR: ['href', 'target', 'rel', 'style', 'class', 'src', 'alt', 'title'],
        ADD_TAGS: ['style'],
        ADD_ATTR: ['style']
      }));
    });
  }, [content]);
  
  return (
    <div 
      className={`w-full p-2 gap-2 mt-7 flex flex-wrap prose prose-stone max-w-none [&_a]:text-blue-600 [&_p]:w-full [&_p]:py-2 [&_h5]:text-secondary [&_h5]:text-lg [&_h2]:text-primary [&_h2]:text-center [&_h2]:font-extrabold [&_h2]:text-2xl [&_h2]:mt-4 [&_h2]:w-full ${className}`}
      dangerouslySetInnerHTML={{ __html: cleanHtmlContent }}
    />
  );
};

export default PageContent;
