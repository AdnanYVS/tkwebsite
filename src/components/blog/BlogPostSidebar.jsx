import React from 'react';
    import { Link } from 'react-router-dom';
    import { motion } from 'framer-motion';
    import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
    import { Input } from '@/components/ui/input';
    import { Button } from '@/components/ui/button';
    import { TrendingUp, Tag, Mail, Leaf } from 'lucide-react';

    const BlogPostSidebar = ({ popularPosts, categories }) => {
      return (
        <aside className="lg:w-1/3 space-y-8">
          {popularPosts && popularPosts.length > 0 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.3 }}>
              <Card className="shadow-lg rounded-xl bg-white/80 backdrop-blur-sm border-green-100">
                <CardHeader>
                  <CardTitle className="text-xl text-primary flex items-center"><TrendingUp size={24} className="mr-2 text-secondary" />Popüler Yazılar</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {popularPosts.map(post => (
                    <Link key={post.id || post.slug} to={`/blog/${post.slug}`} className="block group">
                      <div className="flex items-start space-x-3">
                        <img  alt={post.image_name || post.title} className="w-16 h-16 object-cover rounded-md flex-shrink-0" src="https://images.unsplash.com/photo-1649617785649-23336a409274" loading="lazy" />
                        <div>
                          <h4 className="font-semibold text-gray-800 group-hover:text-primary transition-colors text-sm leading-tight line-clamp-2">{post.title}</h4>
                          <p className="text-xs text-gray-500">{new Date(post.date).toLocaleDateString('tr-TR')}</p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </CardContent>
              </Card>
            </motion.div>
          )}

          {categories && categories.length > 0 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.4 }}>
              <Card className="shadow-lg rounded-xl bg-white/80 backdrop-blur-sm border-green-100">
                <CardHeader>
                  <CardTitle className="text-xl text-primary flex items-center"><Tag size={24} className="mr-2 text-secondary" />Kategoriler</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {categories.map(category => (
                      <li key={category}>
                        <Link to={`/blog/kategori/${category.toLowerCase().replace(/\s+/g, '-')}`} className="text-gray-700 hover:text-primary transition-colors flex items-center">
                          <Leaf size={16} className="mr-2 text-green-500" />
                          {category}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          )}
          
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.5 }}>
            <Card className="shadow-lg rounded-xl bg-gradient-to-br from-primary to-green-700 text-white p-6 border-0">
              <CardHeader className="p-0 mb-3">
                <CardTitle className="text-xl flex items-center"><Mail size={24} className="mr-2" />E-Bülten Aboneliği</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <p className="text-sm text-green-100 mb-4">En son haberler ve ipuçları için bültenimize abone olun.</p>
                <form className="flex">
                  <Input type="email" placeholder="E-posta adresiniz" className="bg-white text-gray-800 rounded-r-none border-0 focus:ring-2 focus:ring-yellow-400 placeholder:text-gray-500" />
                  <Button type="submit" variant="secondary" className="rounded-l-none bg-amber-500 hover:bg-amber-600 text-amber-950">Abone Ol</Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </aside>
      );
    };

    export default BlogPostSidebar;