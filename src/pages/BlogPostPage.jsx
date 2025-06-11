import { Helmet } from 'react-helmet';
import useSeoData from '@/hooks/useSeoData';
import React, { useState, useEffect } from 'react';
    import { useParams, Link } from 'react-router-dom';
    import { supabase } from '@/lib/supabaseClient';
    import { Loader2, AlertTriangle, ArrowLeft, CalendarDays, User, Tag, BookOpen } from 'lucide-react';
    import { Badge } from "@/components/ui/badge";
    import { Button } from "@/components/ui/button";
    import { motion } from 'framer-motion';

    const BlogPostPage = () => {
      const { slug } = useParams();
      const { seo } = useSeoData(`/blog/${slug}`);
      const [post, setPost] = useState(null);
      const [loading, setLoading] = useState(true);
      const [error, setError] = useState(null);
      const [relatedPosts, setRelatedPosts] = useState([]);

      const defaultImageUrl = (title) => `https://source.unsplash.com/random/1200x600/?agriculture,technology,${encodeURIComponent(title)}`;

      useEffect(() => {
    const fetchAndUpdatePost = async () => {
          setLoading(true);
          setError(null);
          setPost(null);
          setRelatedPosts([]);
      try {
        // Önce postu çek
        const { data, error: dbError } = await supabase
          .from('blog_posts')
          .select('*')
          .eq('slug', slug)
                .single();
        console.log('Supabase blog post fetch:', { data, dbError });
        if (dbError || !data) {
          throw dbError || new Error('Yazı bulunamadı.');
        }

        // view_count'u artır
              if (data?.id) {
          const { error: updateError } = await supabase
            .from('blog_posts')
                  .update({ view_count: (data.view_count || 0) + 1 })
            .eq('id', data.id);
          if (updateError) {
            console.error('View count update error:', updateError);
          }
              }
          
        // Güncel postu tekrar çek
        const { data: updatedData, error: updatedError } = await supabase
              .from('blog_posts')
              .select('*')
              .eq('slug', slug)
              .single();
        if (updatedError || !updatedData) {
          throw updatedError || new Error('Yazı güncellenemedi.');
            }
        setPost(updatedData);

            // İlgili yazıları çek (aynı kategoriden, mevcut yazı hariç)
        if (updatedData.category) {
              const { data: relatedData, error: relatedError } = await supabase
                .from('blog_posts')
                .select('id, slug, title, image_url, image_alt_text, category, date')
            .eq('category', updatedData.category)
            .neq('id', updatedData.id)
                .order('date', { ascending: false })
                .limit(3);
          if (relatedError) console.error('Error fetching related posts:', relatedError);
              else setRelatedPosts(relatedData || []);
            }
          } catch (err) {
        console.error('Error fetching post:', err);
            setError(`Blog yazısı yüklenirken bir hata oluştu: ${err.message}`);
          } finally {
            setLoading(false);
          }
        };
        if (slug) {
      fetchAndUpdatePost();
        }
      }, [slug]);

      if (loading) {
        return (
          <div className="flex justify-center items-center min-h-[calc(100vh-200px)]">
            <Loader2 className="h-16 w-16 animate-spin text-primary" />
            <p className="ml-4 text-xl">Yazı yükleniyor...</p>
          </div>
        );
      }

      if (error) {
        return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] text-center">
        <AlertTriangle className="h-10 w-10 text-red-500 mb-4" />
        <p className="text-lg text-red-600 font-semibold mb-2">Bir hata oluştu</p>
        <p className="text-gray-700 mb-4">{error}</p>
        <Link to="/blog" className="text-primary underline">Tüm blog yazılarına dön</Link>
          </div>
        );
      }

      if (!post) {
        return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] text-center">
        <AlertTriangle className="h-10 w-10 text-yellow-500 mb-4" />
        <p className="text-lg text-yellow-600 font-semibold mb-2">Yazı bulunamadı</p>
        <Link to="/blog" className="text-primary underline">Tüm blog yazılarına dön</Link>
          </div>
        );
      }
      
      const postDate = post.date ? new Date(post.date) : new Date(post.created_at);

      return (
        <>
          <Helmet>
            <title>{seo.title || post?.title || 'Tarım Kafası - Blog'}</title>
            <meta
              name="description"
              content={seo.description || post?.description || 'Tarım üzerine güncel içerikler'}
            />
            <meta name="keywords" content={seo.keywords || ''} />
            {seo.canonical_url && <link rel="canonical" href={seo.canonical_url} />}
          </Helmet>
      
          <motion.article 
            className="container mx-auto max-w-4xl px-4 py-12 md:py-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {/* Senin Tüm İçeriğin Aşağıda Olduğu Gibi Kalıyor */}
      
            {/* header */}
            <header className="mb-8 md:mb-12">
              <Button variant="outline" size="sm" asChild className="mb-6 hover:bg-gray-100">
                <Link to="/blog">
                  <ArrowLeft size={16} className="mr-2" /> Tüm Yazılara Dön
                </Link>
              </Button>
      
              <motion.h1
                className="text-3xl md:text-5xl font-heading font-extrabold text-gray-800 mb-4 leading-tight"
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1, duration: 0.5 }}
              >
                {post.title}
              </motion.h1>
      
              <div className="flex flex-wrap items-center text-sm text-gray-500 space-x-4 mb-4">
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="flex items-center">
                  <CalendarDays size={16} className="mr-1.5 text-primary" />
                  <span>{postDate.toLocaleDateString('tr-TR', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                </motion.div>
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="flex items-center">
                  <User size={16} className="mr-1.5 text-primary" />
                  <span>{post.author || 'Tarım Kafası'}</span>
                </motion.div>
                {post.category && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="flex items-center">
                    <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20 text-xs font-medium">
                      {post.category}
                    </Badge>
                  </motion.div>
                )}
              </div>
      
              {(post.image_url || true) && (
                <motion.img
                  src={post.image_url || defaultImageUrl(post.title)}
                  alt={post.image_alt_text || post.title}
                  className="w-full h-auto max-h-[500px] object-cover rounded-xl shadow-lg my-6 md:my-8"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2, duration: 0.6 }}
                />
              )}
            </header>
      
            {/* içerik */}
            <motion.div
              className="prose prose-lg lg:prose-xl max-w-none prose-headings:font-heading prose-headings:text-gray-800 prose-a:text-primary hover:prose-a:text-primary/80 prose-img:rounded-lg prose-img:shadow-md"
              dangerouslySetInnerHTML={{ __html: post.content }}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            />
            {post?.view_count !== undefined && (
             <div className="mt-8 text-sm text-gray-500">
              👁️ Bu yazı {post.view_count} kez görüntülendi.
            </div>
            )}

            {/* etiketler */}
            {post.tags?.length > 0 && (
              <motion.footer
                className="mt-10 pt-8 border-t border-gray-200"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.5 }}
              >
                <div className="flex items-center mb-2">
                  <Tag size={20} className="mr-2 text-gray-500" />
                  <h3 className="text-lg font-semibold text-gray-700">Etiketler:</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {post.tags.map(tag => (
                    <Badge key={tag} variant="outline" className="text-sm">{tag}</Badge>
                  ))}
                </div>
              </motion.footer>
            )}
      
            {/* ilgili yazılar */}
            {relatedPosts.length > 0 && (
              <motion.section
                className="mt-16 pt-10 border-t border-gray-200"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.5 }}
              >
                <h2 className="text-2xl md:text-3xl font-heading font-bold text-gray-800 mb-6">İlgili Yazılar</h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {relatedPosts.map(related => (
                    <Link key={related.id} to={`/blog/${related.slug}`} className="group block">
                      <div className="border rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300 h-full flex flex-col">
                        <img
                          src={related.image_url || defaultImageUrl(related.title)}
                          alt={related.image_alt_text || related.title}
                          className="w-full h-40 object-cover group-hover:opacity-90 transition-opacity"
                        />
                        <div className="p-4 flex-grow flex flex-col">
                          <p className="text-xs text-primary font-medium mb-1">{related.category}</p>
                          <h3 className="text-md font-semibold text-gray-700 group-hover:text-primary transition-colors line-clamp-2 mb-1 flex-grow">{related.title}</h3>
                          <p className="text-xs text-gray-500 mt-auto">
                            {new Date(related.date).toLocaleDateString('tr-TR', { month: 'long', day: 'numeric' })}
                          </p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </motion.section>
                      )}
                      </motion.article>
                    </>
                  );
              };
              
              export default BlogPostPage;
              