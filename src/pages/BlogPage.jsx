import React, { useState, useEffect } from 'react';
    import { Link } from 'react-router-dom';
    import { supabase } from '@/lib/supabaseClient';
    import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
    import { Button } from '@/components/ui/button';
    import { Input } from '@/components/ui/input';
    import { ArrowRight, Search, Loader2, AlertTriangle, BookOpen } from 'lucide-react';
    import { motion } from 'framer-motion';
    import BlogSearchBar from "../components/BlogSearchBar"; // doğru yolu kullandığından emin ol
import { Helmet } from 'react-helmet';

    const BlogPage = () => {
      const [searchTerm, setSearchTerm] = useState("");
      const [posts, setPosts] = useState([]);
      const [loading, setLoading] = useState(true);
      const [error, setError] = useState(null);
      const [categories, setCategories] = useState([]);
      const [selectedCategory, setSelectedCategory] = useState('');
      
      const defaultImageUrl = (title) => `https://source.unsplash.com/random/800x600/?agriculture,${encodeURIComponent(title)}`;

      const fetchPostsAndCategories = async () => {
        setLoading(true);
        setError(null);
        try {
          // Kategorileri çek
          const { data: categoriesData, error: categoriesError } = await supabase
            .from('blog_posts')
            .select('category')
            .order('category', { ascending: true });

          if (categoriesError) throw categoriesError;
          
          const uniqueCategories = [...new Set(categoriesData.map(item => item.category).filter(Boolean))];
          setCategories(uniqueCategories);

          // Blog yazılarını çek
          let query = supabase
            .from('blog_posts')
            .select('id, slug, title, category, summary, content, image_url, image_alt_text, date')
            .order('date', { ascending: false });

          if (searchTerm) {
            query = query.or(`title.ilike.%${searchTerm}%,content.ilike.%${searchTerm}%,category.ilike.%${searchTerm}%,tags.cs.{${searchTerm}}`);
          }
          if (selectedCategory) {
            query = query.eq('category', selectedCategory);
          }

          const { data: postsData, error: postsError } = await query;
          if (postsError) throw postsError;
          setPosts(postsData || []);

        } catch (err) {
          console.error("Error fetching posts or categories:", err);
          setError("Yazılar veya kategoriler yüklenirken bir hata oluştu.");
          setPosts([]);
          setCategories([]);
        } finally {
          setLoading(false);
        }
      };
      
      useEffect(() => {
        fetchPostsAndCategories();
      }, [searchTerm, selectedCategory]);

      const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: { staggerChildren: 0.1, delayChildren: 0.2 }
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

      return (
    <>
      <Helmet>
        <title>Tarım Kafası - Blog</title>
        <meta name="description" content="Tarım Kafası blog ana sayfası, tarım ve teknoloji üzerine güncel içerikler." />
      </Helmet>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="text-center mb-12 md:mb-16"
          >
            <BookOpen className="h-16 w-16 text-primary mx-auto mb-6" />
            <h1 className="text-4xl md:text-6xl font-heading font-extrabold text-gray-800 mb-4">
              Tarım Kafası Blog
            </h1>
            <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
              Tarım Kafası takipçileri tarafından yazılmış sektörel içerikler.
            </p>
          </motion.div>

          <motion.div 
            className="mb-10 md:mb-12 flex flex-col md:flex-row gap-4 items-center"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
          </motion.div>

          {loading && (
            <div className="flex justify-center items-center py-16">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
              <p className="ml-4 text-xl text-gray-600">Yazılar Yükleniyor...</p>
            </div>
          )}

          {error && !loading && (
            <div className="text-center py-16 text-red-700 bg-red-50 p-8 rounded-lg shadow-lg">
              <AlertTriangle size={48} className="mx-auto mb-4" />
              <p className="text-2xl font-semibold">{error}</p>
              <p className="mt-2">Lütfen daha sonra tekrar deneyin veya internet bağlantınızı kontrol edin.</p>
              <Button onClick={fetchPostsAndCategories} variant="outline" className="mt-6">Tekrar Dene</Button>
            </div>
          )}
            <BlogSearchBar onSearch={(value) => setSearchTerm(value)} />
            {!loading && !error && posts.length === 0 && (searchTerm || selectedCategory) && (
            <div className="text-center py-20">
              <BookOpen size={64} className="mx-auto text-gray-400 mb-6" />
              <p className="text-2xl text-gray-700 font-semibold mb-2">Aradığınız Kriterlere Uygun Yazı Bulunamadı</p>
              <p className="text-gray-500">Farklı bir arama terimi veya kategori deneyebilirsiniz.</p>
               { (searchTerm || selectedCategory) && 
                 <Button variant="link" onClick={() => { setSearchTerm(''); setSelectedCategory(''); }} className="mt-4">Filtreleri Temizle</Button>
               }
            </div>
          )}

          {!loading && !error && posts.length > 0 && (
            <motion.div 
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {posts.map((post) => (
                <motion.div key={post.id} variants={itemVariants}>
                  <Card className="h-full flex flex-col overflow-hidden shadow-xl hover:shadow-2xl transition-shadow duration-300 rounded-xl border-2 border-transparent hover:border-primary transform hover:-translate-y-1">
                    <CardHeader className="p-0 relative">
                      <Link to={`/blog/${post.slug}`}>
                         <img  
                            src={post.image_url || defaultImageUrl(post.title)} 
                            alt={post.image_alt_text || post.title} 
                            className="w-full h-60 object-cover hover:opacity-90 transition-opacity duration-300" 
                          />
                      </Link>
                    </CardHeader>
                    <CardContent className="p-6 flex-grow">
                      <p className="text-xs text-primary font-semibold mb-1.5 uppercase tracking-wider">{post.category}</p>
                      <Link to={`/blog/${post.slug}`}>
                        <CardTitle className="text-xl md:text-2xl font-bold text-gray-800 hover:text-primary transition-colors mb-2.5 line-clamp-2">{post.title}</CardTitle>
                      </Link>
                      <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
                        {post.summary || post.content?.replace(/<[^>]+>/g, '').substring(0, 150) || 'İçerik özeti bulunamadı.'}...
                      </p>
                    </CardContent>
                    <CardFooter className="p-6 pt-0">
                      <Button asChild variant="link" className="text-primary p-0 hover:underline group">
                        <Link to={`/blog/${post.slug}`}>
                          Devamını Oku <ArrowRight className="ml-1.5 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                      </Button>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
  </>
      );
    };

    export default BlogPage;