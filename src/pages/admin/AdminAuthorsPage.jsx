import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Plus, Edit, Trash2, Save, ArrowLeft, Upload } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useDropzone } from 'react-dropzone';

const AdminAuthorsPage = () => {
  const { toast } = useToast();
  const [authors, setAuthors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingAuthor, setEditingAuthor] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    title: '',
    bio: '',
    education: '',
    image_url: '',
    email: '',
    linkedin: '',
    twitter: ''
  });

  const onDrop = useCallback(async (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (!file) return;

    try {
      setUploadingImage(true);
      
      // Dosya adını güvenli hale getir
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `author-images/${fileName}`;

      // Supabase Storage'a yükle
      const { error: uploadError } = await supabase.storage
        .from('public')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Dosyanın public URL'ini al
      const { data: { publicUrl } } = supabase.storage
        .from('public')
        .getPublicUrl(filePath);

      // Form verilerini güncelle
      setFormData(prev => ({
        ...prev,
        image_url: publicUrl
      }));

      toast({
        title: 'Başarılı',
        description: 'Yazar resmi yüklendi.',
      });
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        title: 'Hata',
        description: 'Resim yüklenirken bir hata oluştu.',
        variant: 'destructive',
      });
    } finally {
      setUploadingImage(false);
    }
  }, [toast]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif']
    },
    maxFiles: 1,
    maxSize: 5242880 // 5MB
  });

  useEffect(() => {
    fetchAuthors();
  }, []);

  const fetchAuthors = async () => {
    try {
      const { data, error } = await supabase
        .from('authors')
        .select('*')
        .order('name');

      if (error) throw error;
      setAuthors(data || []);
    } catch (error) {
      console.error('Error fetching authors:', error);
      toast({
        title: 'Hata',
        description: 'Yazarlar yüklenirken bir hata oluştu.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingAuthor) {
        const { error } = await supabase
          .from('authors')
          .update(formData)
          .eq('id', editingAuthor.id);

        if (error) throw error;
        toast({
          title: 'Başarılı',
          description: 'Yazar bilgileri güncellendi.',
        });
      } else {
        const { error } = await supabase
          .from('authors')
          .insert([formData]);

        if (error) throw error;
        toast({
          title: 'Başarılı',
          description: 'Yeni yazar eklendi.',
        });
      }
      setEditingAuthor(null);
      setFormData({
        name: '',
        title: '',
        bio: '',
        education: '',
        image_url: '',
        email: '',
        linkedin: '',
        twitter: ''
      });
      fetchAuthors();
    } catch (error) {
      console.error('Error saving author:', error);
      toast({
        title: 'Hata',
        description: 'Yazar kaydedilirken bir hata oluştu.',
        variant: 'destructive',
      });
    }
  };

  const handleEdit = (author) => {
    setEditingAuthor(author);
    setFormData(author);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Bu yazarı silmek istediğinizden emin misiniz?')) return;

    try {
      const { error } = await supabase
        .from('authors')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast({
        title: 'Başarılı',
        description: 'Yazar silindi.',
      });
      fetchAuthors();
    } catch (error) {
      console.error('Error deleting author:', error);
      toast({
        title: 'Hata',
        description: 'Yazar silinirken bir hata oluştu.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Yazar Yönetimi</h1>
        <Button
          onClick={() => {
            setEditingAuthor(null);
            setFormData({
              name: '',
              title: '',
              bio: '',
              education: '',
              image_url: '',
              email: '',
              linkedin: '',
              twitter: ''
            });
          }}
          className="bg-primary hover:bg-primary/90"
        >
          <Plus className="w-4 h-4 mr-2" />
          Yeni Yazar Ekle
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">İsim Soyisim</label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ünvan</label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">E-posta</label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Profil Resmi</label>
              <div
                {...getRootProps()}
                className={`mt-1 border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors
                  ${isDragActive ? 'border-primary bg-primary/5' : 'border-gray-300 hover:border-primary/50'}`}
              >
                <input {...getInputProps()} />
                {formData.image_url ? (
                  <div className="space-y-2">
                    <img
                      src={formData.image_url}
                      alt="Yazar resmi"
                      className="w-32 h-32 object-cover rounded-full mx-auto"
                    />
                    <p className="text-sm text-gray-500">Resmi değiştirmek için tıklayın veya sürükleyin</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Upload className="w-8 h-8 mx-auto text-gray-400" />
                    <p className="text-sm text-gray-500">
                      {isDragActive
                        ? 'Resmi buraya bırakın'
                        : 'Resmi sürükleyin veya seçmek için tıklayın'}
                    </p>
                    <p className="text-xs text-gray-400">PNG, JPG, GIF (max. 5MB)</p>
                  </div>
                )}
              </div>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Biyografi</label>
              <Textarea
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                rows={4}
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Eğitim</label>
              <Textarea
                value={formData.education}
                onChange={(e) => setFormData({ ...formData, education: e.target.value })}
                rows={2}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">LinkedIn</label>
              <Input
                value={formData.linkedin}
                onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Twitter</label>
              <Input
                value={formData.twitter}
                onChange={(e) => setFormData({ ...formData, twitter: e.target.value })}
              />
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            {editingAuthor && (
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setEditingAuthor(null);
                  setFormData({
                    name: '',
                    title: '',
                    bio: '',
                    education: '',
                    image_url: '',
                    email: '',
                    linkedin: '',
                    twitter: ''
                  });
                }}
              >
                İptal
              </Button>
            )}
            <Button type="submit" className="bg-primary hover:bg-primary/90">
              <Save className="w-4 h-4 mr-2" />
              {editingAuthor ? 'Güncelle' : 'Kaydet'}
            </Button>
          </div>
        </form>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Yazar</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ünvan</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">E-posta</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">İşlemler</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {authors.map((author) => (
                <tr key={author.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 flex-shrink-0">
                        <img
                          className="h-10 w-10 rounded-full object-cover"
                          src={author.image_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(author.name)}`}
                          alt={author.name}
                        />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{author.name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{author.title}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{author.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(author)}
                      className="text-primary hover:text-primary/80"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(author.id)}
                      className="text-red-600 hover:text-red-800 ml-2"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminAuthorsPage; 