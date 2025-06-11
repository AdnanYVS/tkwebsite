import React, { useState, useEffect } from 'react';
    import { Link } from 'react-router-dom';
    import { supabase } from '@/lib/supabaseClient';
    import { Button } from '@/components/ui/button';
    import { useToast } from '@/components/ui/use-toast';
    import { PlusCircle, Edit, Trash2, Eye, Loader2, AlertTriangle, Search, Filter, Newspaper } from 'lucide-react';
    import {
      AlertDialog,
      AlertDialogAction,
      AlertDialogCancel,
      AlertDialogContent,
      AlertDialogDescription,
      AlertDialogFooter,
      AlertDialogHeader,
      AlertDialogTitle,
      AlertDialogTrigger,
    } from "@/components/ui/alert-dialog";
    import { Input } from "@/components/ui/input";
    import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
    import { motion } from 'framer-motion';

    const AdminBlogPage = () => {
      const [posts, setPosts] = useState([]);
      const [loading, setLoading] = useState(true);
      const [error, setError] = useState(null);
      const [searchTerm, setSearchTerm] = useState("");
      const { toast } = useToast();

      const fetchPosts = async () => {
        setLoading(true);
        setError(null);
        try {
          let query = supabase.from('blog_posts').select('*').order('created_at', { ascending: false });
          if (searchTerm) {
            query = query.or(`title.ilike.%${searchTerm}%,content.ilike.%${searchTerm}%,category.ilike.%${searchTerm}%`);
          }
          const { data, error: dbError } = await query;
          if (dbError) throw dbError;
          setPosts(data || []);
        } catch (err) {
          console.error("Error fetching posts:", err);
          setError("Blog yazıları yüklenirken bir hata oluştu.");
          setPosts([]);
        } finally {
          setLoading(false);
        }
      };

      useEffect(() => {
        fetchPosts();
      }, [searchTerm]);

      const handleDeletePost = async (postId) => {
        try {
          const { error: deleteError } = await supabase.from('blog_posts').delete().eq('id', postId);
          if (deleteError) throw deleteError;
          
          setPosts(posts.filter(post => post.id !== postId));
          toast({
            title: "Yazı Silindi",
            description: "Blog yazısı başarıyla silindi.",
            variant: "success",
          });
        } catch (err) {
          console.error("Error deleting post:", err);
          toast({
            title: "Hata!",
            description: "Yazı silinirken bir sorun oluştu: " + err.message,
            variant: "destructive",
          });
        }
      };
      
      const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.05 } }
      };

      const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 }
      };


      return (
        <motion.div 
          className="space-y-6"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row justify-between items-center gap-4 pb-4 border-b">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Blog Yazıları Yönetimi</h1>
              <p className="text-gray-600">Mevcut blog yazılarını görüntüleyin, düzenleyin veya yenilerini ekleyin.</p>
            </div>
            <Button asChild className="bg-green-600 hover:bg-green-700 text-white shadow-md hover:shadow-lg transition-all transform hover:scale-105">
              <Link to="/admin/blog/new">
                <PlusCircle size={20} className="mr-2" /> Yeni Yazı Ekle
              </Link>
            </Button>
          </motion.div>

          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-grow">
              <Input
                type="text"
                placeholder="Yazılarda ara (başlık, içerik, kategori)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            </div>
            {/* <Button variant="outline">
              <Filter size={18} className="mr-2" /> Filtrele (Yakında)
            </Button> */}
          </motion.div>

          {loading && (
            <motion.div variants={itemVariants} className="flex justify-center items-center py-10">
              <Loader2 className="h-10 w-10 animate-spin text-primary" />
              <p className="ml-3 text-lg text-gray-600">Yazılar Yükleniyor...</p>
            </motion.div>
          )}

          {error && !loading && (
            <motion.div variants={itemVariants} className="text-center py-10 text-red-600 bg-red-50 p-6 rounded-lg shadow-md">
              <AlertTriangle size={40} className="mx-auto mb-3" />
              <p className="text-xl font-semibold">{error}</p>
              <Button onClick={fetchPosts} variant="outline" className="mt-4">Tekrar Dene</Button>
            </motion.div>
          )}

          {!loading && !error && posts.length === 0 && (
            <motion.div variants={itemVariants} className="text-center py-16 bg-gray-50 rounded-lg">
              <Newspaper size={64} className="mx-auto text-gray-400 mb-6" />
              <h2 className="text-2xl font-semibold text-gray-700 mb-2">Henüz Blog Yazısı Yok</h2>
              <p className="text-gray-500 mb-6">İlk blog yazınızı ekleyerek başlayın.</p>
              <Button asChild size="lg" className="bg-green-600 hover:bg-green-700 text-white">
                <Link to="/admin/blog/new">
                  <PlusCircle size={20} className="mr-2" /> İlk Yazıyı Ekle
                </Link>
              </Button>
            </motion.div>
          )}

          {!loading && !error && posts.length > 0 && (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Başlık</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kategori</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Yazar</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tarih</th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">İşlemler</th>
                  </tr>
                </thead>
                <motion.tbody className="divide-y divide-gray-200" variants={containerVariants} initial="hidden" animate="visible">
                  {posts.map(post => (
                    <motion.tr key={post.id} variants={itemVariants} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-semibold text-gray-900">{post.title}</div>
                        <div className="text-xs text-gray-500 line-clamp-1">{post.summary || post.slug}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{post.category}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{post.author}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{new Date(post.date || post.created_at).toLocaleDateString('tr-TR')}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                        <div className="flex items-center justify-center space-x-2">
                          <Button variant="outline" size="sm" asChild className="text-blue-600 border-blue-600 hover:bg-blue-50 hover:text-blue-700">
                            <Link to={`/blog/${post.slug}`} target="_blank" rel="noopener noreferrer">
                              <Eye size={16} />
                            </Link>
                          </Button>
                          <Button variant="outline" size="sm" asChild className="text-yellow-600 border-yellow-600 hover:bg-yellow-50 hover:text-yellow-700">
                            <Link to={`/admin/blog/edit/${post.id}`}>
                              <Edit size={16} />
                            </Link>
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="destructiveOutline" size="sm" className="text-red-600 border-red-600 hover:bg-red-50 hover:text-red-700">
                                <Trash2 size={16} />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Emin misiniz?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Bu işlem geri alınamaz. "{post.title}" başlıklı blog yazısı kalıcı olarak silinecektir.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>İptal</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDeletePost(post.id)} className="bg-red-600 hover:bg-red-700">Sil</AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </motion.tbody>
              </table>
            </div>
          )}
        </motion.div>
      );
    };

    export default AdminBlogPage;