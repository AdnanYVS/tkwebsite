import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { ArrowRight, BookOpen, Loader2, AlertTriangle } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2, delayChildren: 0.3 }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 100 }
  }
};

const FeaturedBlogSection = () => {
  const [featuredPosts, setFeaturedPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFeaturedPosts = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data, error: dbError } = await supabase
          .from('blog_posts')
          .select('id, slug, title, category, summary, content, image_url, image_alt_text, date')
          .order('date', { ascending: false })
          .limit(3);

        if (dbError) throw dbError;
        setFeaturedPosts(data || []);
      } catch (err) {
        console.error("Error fetching featured posts:", err);
        setError("Öne çıkan yazılar yüklenirken bir hata oluştu.");
        setFeaturedPosts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedPosts();
  }, []);
  
  const defaultImageUrl = (title) => `https://source.unsplash.com/random/800x600/?agriculture,farm,${encodeURIComponent(title)}`;

  return (
    <section id="featured-blog" className="py-16 md:py-24 bg-gray-100">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 md:mb-16"
        >
          <BookOpen className="h-12 w-12 text-primary mx-auto mb-4" />
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-gray-800 mb-3">
            Blog Kafası
          </h2>
        </motion.div>

        {loading && (
          <div className="flex justify-center items-center py-10">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
            <p className="ml-3 text-lg text-gray-600">Yazılar Yükleniyor...</p>
          </div>
        )}

        {error && !loading && (
          <div className="text-center py-10 text-red-600 bg-red-50 p-6 rounded-lg shadow-md">
            <AlertTriangle size={40} className="mx-auto mb-3" />
            <p className="text-xl font-semibold">{error}</p>
            <p>Lütfen daha sonra tekrar deneyin.</p>
          </div>
        )}

        {!loading && !error && featuredPosts.length === 0 && (
           <div className="text-center py-10">
            <BookOpen size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-xl text-gray-600">Henüz öne çıkan blog yazısı bulunmuyor.</p>
          </div>
        )}

        {!loading && !error && featuredPosts.length > 0 && (
          <motion.div 
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
          >
            {featuredPosts.map((post) => (
              <motion.div key={post.id || post.slug} variants={itemVariants}>
                <Card className="h-full flex flex-col overflow-hidden shadow-xl hover:shadow-2xl transition-shadow duration-300 rounded-xl border-2 border-transparent hover:border-primary">
                  <CardHeader className="p-0 relative">
                    <Link to={`/blog/${post.slug}`}>
                      <img  
                        src={post.image_url || defaultImageUrl(post.title)} 
                        alt={post.image_alt_text || post.title} 
                        className="w-full h-56 object-cover hover:opacity-90 transition-opacity" 
                      />
                    </Link>
                  </CardHeader>
                  <CardContent className="p-6 flex-grow">
                    <p className="text-xs text-primary font-semibold mb-1 uppercase tracking-wider">{post.category}</p>
                    <Link to={`/blog/${post.slug}`}>
                      <CardTitle className="text-xl font-bold text-gray-800 hover:text-primary transition-colors mb-2 line-clamp-2">{post.title}</CardTitle>
                    </Link>
                    <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
                      {post.summary || post.content?.replace(/<[^>]+>/g, '').substring(0, 150) || 'İçerik özeti bulunamadı.'}...
                    </p>
                  </CardContent>
                  <CardFooter className="p-6 pt-0">
                    <Button asChild variant="link" className="text-primary p-0 hover:underline">
                      <Link to={`/blog/${post.slug}`}>
                        Devamını Oku <ArrowRight className="ml-1 h-4 w-4" />
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}
        
        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 group">
            <Link to="/blog">
              Tüm Yazıları Gör <BookOpen className="ml-2 h-5 w-5 group-hover:animate-pulse transition-transform" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturedBlogSection;