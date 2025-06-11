import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { supabase } from '@/lib/supabaseClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, Save, ArrowLeft, UploadCloud, AlertTriangle, Image as ImageIcon, Trash2, Plus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { motion } from 'framer-motion';

// Dosya adını güvenli hale getiren fonksiyon
function slugifyFileName(fileName) {
  return fileName
    .toLowerCase()
    .replace(/[ğüşıöç]/g, c => ({
      'ğ': 'g', 'ü': 'u', 'ş': 's', 'ı': 'i', 'ö': 'o', 'ç': 'c'
    }[c]))
    .replace(/[ĞÜŞİÖÇ]/g, c => ({
      'Ğ': 'g', 'Ü': 'u', 'Ş': 's', 'İ': 'i', 'Ö': 'o', 'Ç': 'c'
    }[c]))
    .replace(/[^a-z0-9_.-]/g, '_'); // sadece izin verilen karakterler
}

// Görseli WebP'ye dönüştüren fonksiyon
async function convertToWebP(file) {
  return new Promise((resolve, reject) => {
    const img = new window.Image();
    const reader = new FileReader();
    reader.onload = (e) => {
      img.src = e.target.result;
    };
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);
      canvas.toBlob((blob) => {
        if (blob) {
          const webpFile = new File(
            [blob],
            file.name.replace(/\.[^.]+$/, '.webp'),
            { type: 'image/webp' }
          );
          resolve(webpFile);
        } else {
          reject(new Error('WebP dönüştürme başarısız'));
        }
      }, 'image/webp', 0.85);
    };
    img.onerror = reject;
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

const AdminBlogPostForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isEditing = Boolean(id);
  const fileInputRef = useRef(null);
  const contentImageInputRef = useRef(null);

  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [category, setCategory] = useState('');
  const [author, setAuthor] = useState('Tarım Kafası Admin');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [imageFile, setImageFile] = useState(null);
  const [imageUrl, setImageUrl] = useState('');
  const [imageAltText, setImageAltText] = useState('');
  const [imageName, setImageName] = useState('');
  const [tags, setTags] = useState('');
  const [content, setContent] = useState('');
  const [summary, setSummary] = useState('');
  const [contentImages, setContentImages] = useState([]);
  const [selectedContentImage, setSelectedContentImage] = useState(null);
  
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(isEditing);
  const [formError, setFormError] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  useEffect(() => {
    if (isEditing) {
      const fetchPost = async () => {
        setPageLoading(true);
        setFormError(null);
        try {
          const { data, error } = await supabase
            .from('blog_posts')
            .select('*')
            .eq('id', id)
            .single();
          
          if (error) throw error;
          if (data) {
            setTitle(data.title || '');
            setSlug(data.slug || '');
            setCategory(data.category || '');
            setAuthor(data.author || 'Tarım Kafası Admin');
            setDate(data.date ? new Date(data.date).toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10));
            setImageUrl(data.image_url || '');
            setImagePreview(data.image_url || null);
            setImageAltText(data.image_alt_text || '');
            setImageName(data.image_name || '');
            setTags(Array.isArray(data.tags) ? data.tags.join(', ') : '');
            setContent(data.content || '');
            setSummary(data.summary || '');

            // İçerikteki görselleri analiz et
            const imgRegex = /<img[^>]+src="([^">]+)"/g;
            const matches = [...data.content.matchAll(imgRegex)];
            const extractedImages = matches.map(match => ({
              url: match[1],
              alt: match[0].match(/alt="([^"]*)"/) ? match[0].match(/alt="([^"]*)"/)[1] : '',
              name: match[1].split('/').pop()
            }));
            setContentImages(extractedImages);
          }
        } catch (err) {
          console.error("Error fetching post:", err);
          setFormError("Yazı yüklenirken bir hata oluştu: " + err.message);
          toast({
            title: "Hata",
            description: "Yazı yüklenemedi.",
            variant: "destructive"
          });
        } finally {
          setPageLoading(false);
        }
      };
      fetchPost();
    }
  }, [id, isEditing, navigate, toast]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setFormError(null);

    if (!title || !slug || !content || !summary || !category || !author || !date) {
      setFormError("Lütfen tüm zorunlu alanları doldurun (* ile işaretli).");
      setLoading(false);
      toast({
        title: "Eksik Bilgi",
        description: "Tüm zorunlu alanlar doldurulmalıdır.",
        variant: "destructive"
      });
      return;
    }

    try {
      let finalImageUrl = imageUrl;
      let finalImageName = imageName;

      if (imageFile) {
        const uploadResult = await uploadImage(imageFile);
        finalImageUrl = uploadResult.publicUrl;
        finalImageName = uploadResult.fileName;
      }

      const postData = {
        title,
        slug,
        category,
        author,
        date: new Date(date).toISOString(),
        image_url: finalImageUrl,
        image_name: finalImageName,
        image_alt_text: imageAltText || title,
        tags: tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        content,
        summary,
        updated_at: new Date().toISOString(),
      };

      let response;
      if (isEditing) {
        response = await supabase.from('blog_posts').update(postData).eq('id', id).select().single();
      } else {
        postData.created_at = new Date().toISOString();
        response = await supabase.from('blog_posts').insert(postData).select().single();
      }

      const { error } = response;
      if (error) throw error;

      toast({
        title: `Yazı ${isEditing ? 'Güncellendi' : 'Oluşturuldu'}!`,
        description: `"${title}" başarıyla kaydedildi.`,
        variant: "success",
      });
      navigate('/admin/blog');
    } catch (err) {
      console.error("Error saving post:", err);
      setFormError(`Yazı kaydedilirken bir hata oluştu: ${err.message}`);
      toast({
        title: "Kaydetme Başarısız!",
        description: `Bir sorun oluştu: ${err.message}`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const uploadImage = async (file) => {
    if (!file) return null;
    
    try {
      setUploadingImage(true);
      // Görseli WebP'ye dönüştür
      const webpFile = await convertToWebP(file);
      console.log('WebP file:', webpFile); // debug
      // Dosya adını uzantısız al ve .webp ekle
      const baseName = slugifyFileName(webpFile.name.replace(/\.[^.]+$/, ''));
      const fileName = `${Date.now()}_${baseName}.webp`;
      const filePath = `blog-cover-images/${fileName}`;

      const { data, error: uploadError } = await supabase.storage
        .from('blog-images')
        .upload(filePath, webpFile, {
          cacheControl: '3600',
          upsert: false,
        });

        if (uploadError) {
        console.error("Upload Error:", uploadError);
          throw uploadError;
        }
        
      const { data: { publicUrl } } = supabase.storage
        .from('blog-images')
        .getPublicUrl(filePath);

      console.log("Public URL:", publicUrl); // Debug log
      
      if (!publicUrl) {
        console.error("Görselin public URL'si alınamadı");
        throw new Error("Görselin public URL'si alınamadı.");
      }

      return {
        publicUrl: publicUrl,
        fileName: fileName
      };
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        title: 'Görsel Yükleme Hatası',
        description: `Kapak görseli yüklenirken bir sorun oluştu: ${error.message}`,
        variant: 'destructive',
      });
      return null;
    } finally {
      setUploadingImage(false);
    }
  };

  const uploadContentImage = async (file) => {
    if (!file) return null;
    
    try {
      // Görseli WebP'ye dönüştür
      const webpFile = await convertToWebP(file);
      console.log('WebP file:', webpFile); // debug
      // Dosya adını uzantısız al ve .webp ekle
      const baseName = slugifyFileName(webpFile.name.replace(/\.[^.]+$/, ''));
      const fileName = `${Date.now()}_${baseName}.webp`;
      const filePath = `blog-content-images/${fileName}`;

      const { data, error: uploadError } = await supabase.storage
        .from('blog-images')
        .upload(filePath, webpFile, {
          cacheControl: '3600',
          upsert: false,
        });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
  .from('blog-images')
  .getPublicUrl(filePath);

      console.log("Public URL:", publicUrl); // Debug log

if (!publicUrl) {
        console.error("Görselin public URL'si alınamadı");
  throw new Error("Görselin public URL'si alınamadı.");
}

return {
  publicUrl: publicUrl,
  fileName: fileName
};
    } catch (error) {
      console.error('Error uploading content image:', error);
      toast({
        title: 'Görsel Yükleme Hatası',
        description: `İçerik görseli yüklenirken bir sorun oluştu: ${error.message}`,
        variant: 'destructive',
      });
      return null;
    }
  };

  const handleContentImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const uploadedImage = await uploadContentImage(file);
    if (uploadedImage) {
      setContentImages([...contentImages, uploadedImage]);
      
      // İçeriğe görsel ekle
      const imageHtml = `<img src="${uploadedImage.url}" alt="${uploadedImage.alt}" class="my-4 rounded-lg shadow-md max-w-full" />`;
      setContent(prevContent => prevContent + '\n' + imageHtml + '\n');
      
      // Input'u temizle
      if (contentImageInputRef.current) {
        contentImageInputRef.current.value = '';
      }

      toast({
        title: 'Görsel Yüklendi',
        description: 'İçerik görseli başarıyla yüklendi ve eklendi.',
      });
    }
  };

  const handleRemoveContentImage = (imageUrl) => {
    // İçerikten görseli kaldır
    const newContent = content.replace(new RegExp(`<img[^>]*src=["']${imageUrl}["'][^>]*>`, 'g'), '');
    setContent(newContent);
    
    // Görsel listesinden kaldır
    setContentImages(contentImages.filter(img => img.url !== imageUrl));
    
    toast({
      title: 'Görsel Kaldırıldı',
      description: 'İçerik görseli başarıyla kaldırıldı.',
    });
  };

  const handleImageChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Görsel önizleme
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);

    setImageFile(file);
    setImageName(file.name);
    setImageAltText(title || file.name); // Başlık varsa onu kullan, yoksa dosya adını
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImageUrl('');
    setImagePreview(null);
    setImageName('');
    setImageAltText('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const generateSlug = (title) => {
    return title
      .toLowerCase()
      .replace(/ğ/g, 'g')
      .replace(/ü/g, 'u')
      .replace(/ş/g, 's')
      .replace(/ı/g, 'i')
      .replace(/ö/g, 'o')
      .replace(/ç/g, 'c')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  if (pageLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="ml-2">Yazı yükleniyor...</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="shadow-xl border-gray-200">
        <CardHeader className="border-b">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-2xl font-bold text-primary">
                {isEditing ? 'Blog Yazısını Düzenle' : 'Yeni Blog Yazısı Oluştur'}
              </CardTitle>
              <CardDescription>
                {isEditing ? `"${title || 'Yazı'}" içeriğini güncelleyin.` : 'Aşağıdaki formu doldurarak yeni bir blog yazısı ekleyin.'}
              </CardDescription>
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link to="/admin/blog">
                <ArrowLeft size={16} className="mr-2" /> Geri Dön
              </Link>
            </Button>
          </div>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="p-6 space-y-6">
            {formError && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg flex items-center">
                <AlertTriangle size={20} className="mr-2 flex-shrink-0" />
                <p className="text-sm">{formError}</p>
              </div>
            )}

            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <Label htmlFor="title" className="font-semibold text-gray-700">
                  Başlık <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value);
                    if (!isEditing) {
                      setSlug(generateSlug(e.target.value));
                    }
                  }}
                  placeholder="Yazının başlığı..."
                  required
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="slug" className="font-semibold text-gray-700">
                  URL Slug <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="slug"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="ornek-yazi-basligi"
                  required
                  className="mt-1"
                />
                <p className="text-xs text-gray-500 mt-1">
                  URL'de görünecek benzersiz tanımlayıcı. Başlık girildiğinde otomatik oluşturulur.
                </p>
              </div>

              <div>
                <Label htmlFor="category" className="font-semibold text-gray-700">
                  Kategori <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="Yazının kategorisi..."
                  required
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="author" className="font-semibold text-gray-700">
                  Yazar <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="author"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  placeholder="Yazının yazarı..."
                  required
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="date" className="font-semibold text-gray-700">
                  Tarih <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="date"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="tags" className="font-semibold text-gray-700">
                  Etiketler
                </Label>
                <Input
                  id="tags"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder="Etiketleri virgülle ayırın..."
                  className="mt-1"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Örnek: tarım, teknoloji, inovasyon
                </p>
              </div>
            </div>

            <div>
              <Label htmlFor="summary" className="font-semibold text-gray-700">
                Özet <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="summary"
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                placeholder="Yazının kısa özeti..."
                required
                className="mt-1"
                rows={3}
              />
            </div>

            <div>
              <Label className="font-semibold text-gray-700">
                Kapak Görseli {!isEditing && <span className="text-red-500">*</span>}
              </Label>
              <div className="mt-2 space-y-4">
                <div className="flex items-center gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    className="relative"
                    disabled={uploadingImage}
                  >
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleImageChange}
                      accept="image/*"
                      className="hidden"
                    />
                    <UploadCloud size={20} className="mr-2" />
                    Görsel Seç
                  </Button>
                  {(imagePreview || imageUrl) && (
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      onClick={handleRemoveImage}
                      disabled={uploadingImage}
                    >
                      <Trash2 size={20} />
                    </Button>
                  )}
                </div>

                {(imagePreview || imageUrl) && (
                  <div className="relative w-full max-w-md">
                    <img
                      src={imagePreview || imageUrl}
                      alt="Önizleme"
                      className="rounded-lg shadow-md max-h-48 object-cover"
                    />
                    <Input
                      value={imageAltText}
                      onChange={(e) => setImageAltText(e.target.value)}
                      placeholder="Görsel açıklaması..."
                      className="mt-2"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* İçerik Görselleri Yönetimi */}
            <div className="space-y-2">
              <Label className="font-semibold text-gray-700">İçerik Görselleri</Label>
              <div className="flex flex-wrap gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-center justify-center w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg bg-white hover:bg-gray-50 transition-colors cursor-pointer relative">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleContentImageUpload}
                    ref={contentImageInputRef}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div className="text-center">
                    <Plus size={24} className="mx-auto text-gray-400" />
                    <span className="text-sm text-gray-500 mt-2">Yeni Görsel</span>
                  </div>
                </div>

                {contentImages.map((image, index) => (
                  <div key={index} className="relative w-32 h-32">
                    <img
                      src={image.url}
                      alt={image.alt}
                      className="w-full h-full object-cover rounded-lg shadow-sm"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute -top-2 -right-2 w-6 h-6 rounded-full"
                      onClick={() => handleRemoveContentImage(image.url)}
                    >
                      <Trash2 size={14} />
                    </Button>
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-500">
                Görselleri içeriğe eklemek için yukarıdaki "Yeni Görsel" butonunu kullanın. 
                Yüklenen görseller otomatik olarak içeriğe eklenecektir.
              </p>
            </div>

            <div>
              <Label htmlFor="content" className="font-semibold text-gray-700">
                İçerik (HTML kullanabilirsiniz) <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Yazının tam içeriği..."
                required
                rows={12}
                className="mt-1 font-mono"
              />
              <p className="text-xs text-gray-500 mt-1">
                Görseller otomatik olarak içeriğe eklenir. İsterseniz HTML kodunu düzenleyebilirsiniz.
                Paragraflar için &lt;p&gt;, başlıklar için &lt;h2&gt;, &lt;h3&gt; gibi HTML etiketlerini kullanabilirsiniz.
              </p>
            </div>
          </CardContent>

          <CardFooter className="border-t p-6 flex justify-end space-x-3">
            <Button type="button" variant="outline" onClick={() => navigate('/admin/blog')} disabled={loading || uploadingImage}>
              İptal
            </Button>
            <Button type="submit" disabled={loading || uploadingImage} className="bg-green-600 hover:bg-green-700 text-white">
              {loading || uploadingImage ? (
                <Loader2 size={20} className="animate-spin mr-2" />
              ) : (
                <Save size={20} className="mr-2" />
              )}
              {isEditing ? 'Değişiklikleri Kaydet' : 'Yazıyı Oluştur'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </motion.div>
  );
};

export default AdminBlogPostForm;