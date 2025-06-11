import React from 'react';
    import { Link } from 'react-router-dom';
    import { Button } from '@/components/ui/button';
    import { Share2, ThumbsUp } from 'lucide-react';

    const BlogPostFooter = ({ tags }) => {
      return (
        <footer className="mt-12 border-t border-gray-200 pt-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <span className="text-sm font-semibold text-gray-700 mr-2">Etiketler:</span>
              {tags.map(tag => (
                <Link key={tag} to={`/blog/etiket/${tag.toLowerCase().replace(/\s+/g, '-')}`} className="inline-block bg-green-100 text-green-700 text-xs font-medium mr-2 px-2.5 py-0.5 rounded-full hover:bg-green-200 transition-colors">
                  #{tag}
                </Link>
              ))}
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="ghost" size="icon" aria-label="Beğen" className="text-gray-500 hover:text-primary">
                <ThumbsUp size={20} />
              </Button>
              <Button variant="ghost" size="icon" aria-label="Paylaş" className="text-gray-500 hover:text-primary">
                <Share2 size={20} />
              </Button>
            </div>
          </div>
        </footer>
      );
    };

    export default BlogPostFooter;