import React from 'react';
    import { motion } from 'framer-motion';

    const BlogPostContent = ({ content }) => {
      const processContent = (htmlContent) => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlContent, 'text/html');
        
        doc.querySelectorAll('img-replace').forEach((imgReplace, index) => {
          const altText = imgReplace.getAttribute('alt') || `Blog image ${index + 1}`;
          const img = document.createElement('img');
          img.setAttribute('src', `https://source.unsplash.com/random/800x450/?agriculture,farm,nature&sig=content${index}${altText.substring(0,10)}`);
          img.setAttribute('alt', altText);
          img.setAttribute('class', 'my-6 rounded-lg shadow-md w-full h-auto object-cover');
          imgReplace.parentNode.replaceChild(img, imgReplace);
        });
        
        return doc.body.innerHTML;
      };

      const processedContent = processContent(content);

      return (
        <motion.div 
          className="prose prose-lg max-w-none text-gray-700 leading-relaxed blog-content"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          dangerouslySetInnerHTML={{ __html: processedContent }}
        />
      );
    };

    export default BlogPostContent;