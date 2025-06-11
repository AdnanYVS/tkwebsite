import React from 'react';
import { Tag, CalendarDays, UserCircle } from 'lucide-react';

const BlogPostHeader = ({ post }) => {
  return (
    <header className="mb-8">
      <div className="flex items-center text-sm text-gray-500 mb-3 space-x-3">
        <Tag size={16} className="text-secondary" />
        <span>{post.category}</span>
        <CalendarDays size={16} className="text-secondary" />
        <span>{post.date}</span>
        <UserCircle size={16} className="text-secondary" />
        <span>{post.author}</span>
      </div>
      <h1 className="text-3xl md:text-4xl font-heading font-bold text-primary mb-4">{post.title}</h1>
      <img  alt={post.imageName} className="w-full h-auto max-h-[500px] object-cover rounded-lg shadow-md mb-6" src={`https://source.unsplash.com/random/1200x600/?${post.category.toLowerCase().replace(/\s+/g, '-')},agriculture,nature&sig=${post.slug}`} loading="lazy" />
    </header>
  );
};

export default BlogPostHeader;