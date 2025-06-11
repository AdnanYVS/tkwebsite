import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, UploadCloud, Save, Image as ImageIcon } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const IMAGE_KEYS = [
  { key: 'hero_image_url', label: 'Hero Bölümü Görseli' },
  { key: 'about_image_url', label: 'Hakkımızda Bölümü Görseli' },
  { key: 'mission_image_url', label: 'Misyon Bölümü Görseli' },
  { key: 'services_image_url', label: 'Hizmetler Bölümü Görseli' },
];

const BUCKET = 'homepage-images';

// Add this helper to extract the storage path from a public URL
function getStoragePathFromUrl(url) {
  if (!url) return null;
  // Supabase public URL format: https://<project>.supabase.co/storage/v1/object/public/<bucket>/<path>
  const match = url.match(/\/([^/]+)\/(.+)$/);
  if (match) {
    return match[2]; // path after bucket name
  }
  return null;
}

// Add WebP conversion helper
async function convertToWebP(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new window.Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error('WebP conversion failed'));
              return;
            }
            resolve(new File([blob], file.name.replace(/\.[^/.]+$/, '.webp'), { type: 'image/webp' }));
          },
          'image/webp',
          0.85
        );
      };
      img.onerror = reject;
      img.src = e.target.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

const AdminHomepageImages = () => {
  const { toast } = useToast();
  const [images, setImages] = useState({});
  const [previews, setPreviews] = useState({});
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const fileInputs = useRef({});

  // İlk açılışta mevcut görselleri çek
  useEffect(() => {
    const fetchImages = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('site_settings')
          .select('key, value')
          .in('key', IMAGE_KEYS.map(i => i.key));
        if (error) throw error;
        const imgObj = {};
        (data || []).forEach(row => {
          imgObj[row.key] = row.value;
        });
        setImages(imgObj);
        setPreviews(imgObj);
      } catch (err) {
        toast({
          title: 'Hata',
          description: 'Görseller yüklenirken bir hata oluştu: ' + err.message,
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };
    fetchImages();
  }, [toast]);

  // Görsel seçildiğinde önizleme
  const handleFileChange = async (key, file) => {
    if (!file) return;
    const oldUrl = images[key];
    let deleteOld = false;
    if (oldUrl && oldUrl.startsWith('http')) {
      deleteOld = window.confirm("Eski görseli Supabase Storage'dan da silmek ister misiniz? (Evet derseniz dosya tamamen silinir)");
    }
    if (deleteOld && oldUrl) {
      const path = getStoragePathFromUrl(oldUrl);
      if (path) {
        await supabase.storage.from(BUCKET).remove([path]);
      }
    }
    // Convert to WebP before preview and upload
    let webpFile;
    try {
      webpFile = await convertToWebP(file);
    } catch (err) {
      toast({
        title: 'Hata',
        description: 'WebP formatına dönüştürülürken hata oluştu: ' + err.message,
        variant: 'destructive',
      });
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviews(prev => ({ ...prev, [key]: reader.result }));
    };
    reader.readAsDataURL(webpFile);
    setImages(prev => ({ ...prev, [key]: webpFile }));
  };

  // Görselleri kaydet
  const handleSave = async () => {
    setSaving(true);
    try {
      for (const { key } of IMAGE_KEYS) {
        const file = images[key];
        if (file && file instanceof File) {
          const fileName = `${key}_${Date.now()}_${file.name.replace(/\s+/g, '_')}`;
          const filePath = `${fileName}`;
          const { data, error: uploadError } = await supabase.storage
            .from(BUCKET)
            .upload(filePath, file, { upsert: true });
          if (uploadError) throw uploadError;
          const { data: { publicUrl } } = supabase.storage.from(BUCKET).getPublicUrl(filePath);
          // site_settings tablosuna doğru key ile kaydet
          const { error: dbError } = await supabase
            .from('site_settings')
            .upsert({ key, value: publicUrl }, { onConflict: 'key' });
          if (dbError) throw dbError;
        }
      }
      toast({
        title: 'Başarılı',
        description: 'Görseller başarıyla kaydedildi.',
        variant: 'success',
      });
    } catch (err) {
      toast({
        title: 'Hata',
        description: 'Görseller kaydedilirken bir hata oluştu: ' + err.message,
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (key) => {
    const currentUrl = images[key];
    if (!currentUrl) return;
    const confirmDb = window.confirm('Bu görseli veritabanından silmek istediğinize emin misiniz?');
    if (!confirmDb) return;

    let alsoDeleteStorage = false;
    if (currentUrl && currentUrl.startsWith('http')) {
      alsoDeleteStorage = window.confirm("Görseli Supabase Storage'dan da silmek ister misiniz? (Evet derseniz dosya tamamen silinir)");
    }

    setLoading(true);
    try {
      // Veritabanından sil
      const { error: dbError } = await supabase
        .from('site_settings')
        .upsert({ key, value: '' }, { onConflict: 'key' });
      if (dbError) throw dbError;
      // Storage'dan sil
      if (alsoDeleteStorage) {
        const path = getStoragePathFromUrl(currentUrl);
        if (path) {
          const { error: storageError } = await supabase.storage.from(BUCKET).remove([path]);
          if (storageError) throw storageError;
        }
      }
      setImages(prev => ({ ...prev, [key]: '' }));
      setPreviews(prev => ({ ...prev, [key]: '' }));
      toast({
        title: 'Başarılı',
        description: 'Görsel silindi.',
        variant: 'success',
      });
    } catch (err) {
      toast({
        title: 'Hata',
        description: 'Görsel silinirken bir hata oluştu: ' + err.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-10">
      <Card className="shadow-xl border-gray-200">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-primary">Ana Sayfa Görselleri</CardTitle>
          <p className="text-gray-600 mt-2">Buradan ana sayfanın öne çıkan görsellerini güncelleyebilirsiniz.</p>
        </CardHeader>
        <CardContent className="space-y-8">
          {IMAGE_KEYS.map(({ key, label }) => (
            <div key={key} className="space-y-2">
              <label className="font-semibold text-gray-700 block mb-1">{label}</label>
              <div className="flex items-center gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputs.current[key]?.click()}
                  className="relative"
                  disabled={saving}
                >
                  <input
                    type="file"
                    accept="image/*"
                    ref={el => (fileInputs.current[key] = el)}
                    onChange={e => handleFileChange(key, e.target.files[0])}
                    className="hidden"
                  />
                  <UploadCloud size={20} className="mr-2" />
                  Görsel Seç
                </Button>
                {previews[key] && (
                  <>
                    <img
                      src={previews[key]}
                      alt={label}
                      className="rounded-lg shadow-md max-h-32 object-cover border"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(key)}
                      disabled={saving || loading}
                      className="ml-2"
                    >
                      Sil
                    </Button>
                  </>
                )}
              </div>
            </div>
          ))}
        </CardContent>
        <CardFooter className="border-t p-6 flex justify-end">
          <Button onClick={handleSave} disabled={saving || loading} className="bg-green-600 hover:bg-green-700 text-white">
            {saving ? <Loader2 size={20} className="animate-spin mr-2" /> : <Save size={20} className="mr-2" />}
            Kaydet
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default AdminHomepageImages; 