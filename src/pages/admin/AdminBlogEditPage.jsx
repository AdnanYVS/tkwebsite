import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabaseClient';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { useToast } from '../../hooks/use-toast';
import { Loader2, Save, ArrowLeft } from 'lucide-react';
import { validateSession, sanitizeInput } from '../../lib/security';

const AdminBlogEditPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [post, setPost] = useState({
    title: '',
    slug: '',
    content: '',
    excerpt: '',
    featured_image: '',
    status: 'draft'
  });

  useEffect(() => {
    if (id !== 'new') {
      fetchPost();
    } else {
      setLoading(false);
    }
  }, [id]);

  const fetchPost = async () => {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;

      setPost(data);
    } catch (error) {
      console.error('Error fetching post:', error);
      toast({
        title: 'Hata',
        description: 'Blog yazısı yüklenirken bir hata oluştu.',
        variant: 'destructive',
      });
      navigate('/admin/blog');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const sanitizedPost = {
        ...post,
        title: sanitizeInput(post.title),
        content: sanitizeInput(post.content),
        excerpt: sanitizeInput(post.excerpt),
        slug: post.slug || post.title.toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '')
      };

      if (id === 'new') {
        const { error } = await supabase
          .from('blog_posts')
          .insert([sanitizedPost]);

        if (error) throw error;

        toast({
          title: 'Başarılı',
          description: 'Blog yazısı başarıyla oluşturuldu.',
        });
      } else {
        const { error } = await supabase
          .from('blog_posts')
          .update(sanitizedPost)
          .eq('id', id);

        if (error) throw error;

        toast({
          title: 'Başarılı',
          description: 'Blog yazısı başarıyla güncellendi.',
        });
      }

      navigate('/admin/blog');
    } catch (error) {
      console.error('Error saving post:', error);
      toast({
        title: 'Hata',
        description: 'Blog yazısı kaydedilirken bir hata oluştu.',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPost(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="ml-4 text-lg text-gray-700">Yükleniyor...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Button
          variant="ghost"
          onClick={() => navigate('/admin/blog')}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Geri
        </Button>
        <h1 className="text-2xl font-bold">
          {id === 'new' ? 'Yeni Blog Yazısı' : 'Blog Yazısını Düzenle'}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
              Başlık
            </label>
            <Input
              id="title"
              name="title"
              value={post.title}
              onChange={handleChange}
              required
              className="mt-1"
            />
          </div>

          <div>
            <label htmlFor="slug" className="block text-sm font-medium text-gray-700">
              URL (Boş bırakılırsa başlıktan otomatik oluşturulur)
            </label>
            <Input
              id="slug"
              name="slug"
              value={post.slug}
              onChange={handleChange}
              className="mt-1"
            />
          </div>

          <div>
            <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700">
              Özet
            </label>
            <Textarea
              id="excerpt"
              name="excerpt"
              value={post.excerpt}
              onChange={handleChange}
              rows={3}
              className="mt-1"
            />
          </div>

          <div>
            <label htmlFor="content" className="block text-sm font-medium text-gray-700">
              İçerik
            </label>
            <Textarea
              id="content"
              name="content"
              value={post.content}
              onChange={handleChange}
              required
              rows={15}
              className="mt-1"
            />
          </div>

          <div>
            <label htmlFor="featured_image" className="block text-sm font-medium text-gray-700">
              Öne Çıkan Görsel URL
            </label>
            <Input
              id="featured_image"
              name="featured_image"
              value={post.featured_image}
              onChange={handleChange}
              className="mt-1"
            />
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/admin/blog')}
          >
            İptal
          </Button>
          <Button
            type="submit"
            disabled={saving}
          >
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Kaydediliyor...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Kaydet
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AdminBlogEditPage; 