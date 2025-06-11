import React, { useState, useRef } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, Image as ImageIcon, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const SiteContentEditor = ({ 
  value, 
  onChange, 
  placeholder, 
  type = 'text',
  allowImages = false,
  maxLength,
  className = ''
}) => {
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Hata!",
        description: "Lütfen geçerli bir görsel dosyası seçin.",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Hata!",
        description: "Görsel boyutu 5MB'dan küçük olmalıdır.",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);

    try {
      // Optimize image before converting to WebP
      const optimizedImage = await optimizeImage(file);
      
      // Convert to WebP with dynamic quality based on file size
      const webpFile = await convertToWebP(optimizedImage);
      
      // Upload to Supabase
      const fileName = `content_${Date.now()}_${file.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
      const filePath = `content-images/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('content-images')
        .upload(filePath, webpFile, {
          cacheControl: '3600',
          upsert: true
        });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('content-images')
        .getPublicUrl(filePath);

      // Insert image at cursor position or append to content
      const imageHtml = `<img src="${publicUrl}" alt="${file.name}" class="my-4 rounded-lg shadow-md max-w-full h-auto object-cover" />`;
      
      if (type === 'textarea') {
        const textarea = document.querySelector(`textarea[data-content-editor="${placeholder}"]`);
        if (textarea) {
          const start = textarea.selectionStart;
          const end = textarea.selectionEnd;
          const newValue = value.substring(0, start) + imageHtml + value.substring(end);
          onChange(newValue);
        } else {
          onChange(value + '\n' + imageHtml + '\n');
        }
      } else {
        onChange(publicUrl);
      }

      toast({
        title: "Başarılı!",
        description: "Görsel başarıyla yüklendi ve optimize edildi.",
        variant: "success",
      });
    } catch (err) {
      console.error("Error uploading image:", err);
      toast({
        title: "Hata!",
        description: "Görsel yüklenirken bir sorun oluştu: " + err.message,
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const optimizeImage = async (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          
          // Calculate new dimensions while maintaining aspect ratio
          const MAX_WIDTH = 1920;
          const MAX_HEIGHT = 1080;
          
          if (width > height) {
            if (width > MAX_WIDTH) {
              height = Math.round((height * MAX_WIDTH) / width);
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width = Math.round((width * MAX_HEIGHT) / height);
              height = MAX_HEIGHT;
            }
          }
          
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          
          canvas.toBlob((blob) => {
            resolve(new File([blob], file.name, {
              type: file.type
            }));
          }, file.type, 0.9);
        };
        img.onerror = reject;
        img.src = e.target.result;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const convertToWebP = async (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0);
          
          // Dynamic quality based on file size
          const quality = file.size > 2 * 1024 * 1024 ? 0.7 : 0.8;
          
          canvas.toBlob((blob) => {
            resolve(new File([blob], file.name.replace(/\.[^/.]+$/, '.webp'), {
              type: 'image/webp'
            }));
          }, 'image/webp', quality);
        };
        img.onerror = reject;
        img.src = e.target.result;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleRemoveImage = () => {
    if (window.confirm('Bu görseli kaldırmak istediğinizden emin misiniz?')) {
      onChange('');
      toast({
        title: "Görsel Kaldırıldı",
        description: "Görsel başarıyla kaldırıldı.",
        variant: "info",
      });
    }
  };

  const renderImagePreview = () => {
    if (!value || !value.startsWith('http')) return null;

    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className="relative mt-4"
      >
        <div className="w-full h-48 rounded-lg overflow-hidden bg-gray-50">
          <img
            src={value}
            alt="Preview"
            className="w-full h-full object-cover"
          />
        </div>
        <Button
          type="button"
          variant="destructive"
          size="icon"
          className="absolute top-2 right-2"
          onClick={handleRemoveImage}
        >
          <X size={16} />
        </Button>
      </motion.div>
    );
  };

  if (type === 'textarea') {
    return (
      <div className={`space-y-4 ${className}`}>
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full min-h-[100px] p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
          data-content-editor={placeholder}
          maxLength={maxLength}
        />
        {allowImages && (
          <div className="flex items-center gap-2">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              ref={fileInputRef}
              className="hidden"
              id={`image-upload-${placeholder}`}
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="flex items-center gap-2"
            >
              {isUploading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Yükleniyor...
                </>
              ) : (
                <>
                  <ImageIcon size={16} />
                  Görsel Ekle
                </>
              )}
            </Button>
          </div>
        )}
      </div>
    );
  }

  if (allowImages) {
    return (
      <div className={`space-y-4 ${className}`}>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                ref={fileInputRef}
                className="hidden"
                id={`image-upload-${placeholder}`}
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="flex items-center gap-2"
              >
                {isUploading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Yükleniyor...
                  </>
                ) : (
                  <>
                    <ImageIcon size={16} />
                    Görsel Seç
                  </>
                )}
              </Button>
              <input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className="flex-1 p-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                maxLength={maxLength}
              />
            </div>
          </CardContent>
        </Card>
        <AnimatePresence>
          {renderImagePreview()}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary ${className}`}
      maxLength={maxLength}
    />
  );
};

export default SiteContentEditor; 