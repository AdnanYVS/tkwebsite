import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
    import { supabase } from '@/lib/supabaseClient';
    import { Button } from '@/components/ui/button';
    import { Input } from '@/components/ui/input';
    import { useToast } from '@/components/ui/use-toast';
    import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
    import { Loader2, Save, AlertTriangle, ImageDown as ImageUp, Trash2, UploadCloud, Image as ImageIcon } from 'lucide-react';
    import { motion } from 'framer-motion';

    const imageManagementConfig = {
      site_logo_header_url: { 
        label: 'Header Logosu', 
        group: 'Temel Site Görselleri',
        description: 'Sitenin üst kısmında (Navbar) görünecek logo.'
      },
      site_logo_footer_url: { 
        label: 'Footer Logosu', 
        group: 'Temel Site Görselleri',
        description: 'Sitenin alt kısmında (Footer) görünecek logo.'
      },
      favicon_url: { 
        label: 'Favicon', 
        group: 'Temel Site Görselleri',
        description: 'Tarayıcı sekmesinde ve yer imlerinde görünecek site ikonu.'
      },
      hero_background_image_url: { 
        label: 'Ana Karşılama Alanı Arka Planı', 
        group: 'Sayfa Bölüm Görselleri',
        description: 'Ana sayfanın en üstündeki karşılama (hero) alanının arka plan görseli.'
      },
      about_section_main_image_url: { 
        label: 'Hakkımızda Bölümü Ana Görseli', 
        group: 'Sayfa Bölüm Görselleri',
        description: 'Hakkımızda bölümünde kullanılacak ana ve dikkat çekici görsel.'
      },
      cta_background_image_url: { 
        label: 'İletişim (CTA) Alanı Arka Planı', 
        group: 'Sayfa Bölüm Görselleri',
        description: 'Harekete geçirici mesaj (Call To Action) alanının arka plan görseli.'
      },
      services_section_banner_image_url: {
        label: 'Hizmetler Bölümü Banner Görseli',
        group: 'Sayfa Bölüm Görselleri',
        description: 'Hizmetler sayfasında veya bölümünde kullanılacak geniş banner görseli.'
      }
    };
    
    const imageKeys = Object.keys(imageManagementConfig);

    const AdminSiteImagesPage = () => {
      const { toast } = useToast();
      
      const [imageSettings, setImageSettings] = useState(() => imageKeys.reduce((acc, key) => ({ ...acc, [key]: '' }), {}));
      const [loading, setLoading] = useState(true);
      const [saving, setSaving] = useState(false);
      const [error, setError] = useState(null);
      
      const [files, setFiles] = useState({});
      const [previews, setPreviews] = useState(() => imageKeys.reduce((acc, key) => ({ ...acc, [key]: null }), {}));

      const fileInputRefs = useRef(
        imageKeys.reduce((acc, key) => {
          acc[key] = React.createRef();
          return acc;
        }, {})
      );
      
      const groupedImageSettings = useMemo(() => {
        return imageKeys.reduce((acc, key) => {
          const config = imageManagementConfig[key];
          if (config) {
            acc[config.group] = acc[config.group] || [];
            acc[config.group].push({ key, ...config });
          }
          return acc;
        }, {});
      }, []);


      const fetchImageSettings = useCallback(async () => {
        setLoading(true);
        setError(null);
        
        const initialImageValues = imageKeys.reduce((acc, key) => ({ ...acc, [key]: '' }), {});
        const initialPreviewsValues = imageKeys.reduce((acc, key) => ({ ...acc, [key]: null }), {});

        try {
          const { data, error: dbError } = await supabase
            .from('site_content')
            .select('content_key, content_value')
            .in('content_key', imageKeys);

          if (dbError) throw dbError;
          
          const fetchedSettings = { ...initialImageValues };
          const fetchedPreviews = { ...initialPreviewsValues };

          if (data) {
            data.forEach(item => {
              if (imageKeys.includes(item.content_key)) { 
                fetchedSettings[item.content_key] = item.content_value || '';
                fetchedPreviews[item.content_key] = item.content_value || null;
              }
            });
          }
          
          setImageSettings(fetchedSettings);
          setPreviews(fetchedPreviews);

        } catch (err) {
          console.error("Error fetching site image settings:", err);
          setError("Site görselleri yüklenirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.");
          setImageSettings(initialImageValues); // Hata durumunda state'leri sıfırla
          setPreviews(initialPreviewsValues); // Hata durumunda state'leri sıfırla
        } finally {
          setLoading(false);
        }
      }, []); // useCallback bağımlılıkları boş olmalı, çünkü içindeki değerler dışarıdan gelmiyor.

      useEffect(() => {
        fetchImageSettings();
      }, [fetchImageSettings]);

      const handleFileChange = (event, key) => {
        const file = event.target.files[0];
        if (file) {
          setFiles(prev => ({ ...prev, [key]: file }));
          const reader = new FileReader();
          reader.onloadend = () => {
            setPreviews(prev => ({ ...prev, [key]: reader.result }));
          };
          reader.readAsDataURL(file);
        } else { 
          setFiles(prev => ({ ...prev, [key]: null }));
          // Dosya seçimi iptal edilirse, mevcut veritabanı değerini (imageSettings) veya null göster
          setPreviews(prev => ({ ...prev, [key]: imageSettings[key] || null }));
        }
      };
      
      const uploadAsset = async (file, currentUrl, assetKeyPrefix) => {
        if (!file) return currentUrl; 

        const uniqueFileName = `${assetKeyPrefix}_${Date.now()}_${file.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
        const filePath = `site-assets/${uniqueFileName}`;

        try {
          const { error: uploadError } = await supabase.storage
            .from('site-assets') 
            .upload(filePath, file, {
              cacheControl: '3600',
              upsert: true, 
            });

          if (uploadError) throw uploadError;

          const { data: publicUrlData } = supabase.storage
            .from('site-assets')
            .getPublicUrl(filePath);
          
          return publicUrlData.publicUrl;
        } catch (uploadError) {
          console.error(`Error uploading ${assetKeyPrefix}:`, uploadError);
          toast({
            title: `${assetKeyPrefix.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())} Yükleme Hatası`,
            description: `Görsel yüklenirken bir sorun oluştu: ${uploadError.message}`,
            variant: 'destructive',
          });
          return currentUrl; 
        }
      };

      const handleSaveImageSettings = async (e) => {
        e.preventDefault();
        setSaving(true); 
        setError(null);
        
        const updatedImageValues = { ...imageSettings }; // Başlangıç olarak mevcut DB değerlerini al
        const uploadPromises = [];

        for (const key of imageKeys) {
          if (previews[key] === null && !files[key]) { // Görsel kaldırılmış ve yeni dosya seçilmemiş
            updatedImageValues[key] = ''; 
          } else if (files[key]) { // Yeni dosya seçilmiş, yükle
            const assetKeyPrefix = key.replace('_url', '');
            uploadPromises.push(
              uploadAsset(files[key], imageSettings[key], assetKeyPrefix).then(newUrl => {
                updatedImageValues[key] = newUrl;
              })
            );
          } else { // Mevcut görsel korunuyor (previews[key] dolu, files[key] boş)
            updatedImageValues[key] = previews[key] || ''; // previews[key] zaten DB'den gelen URL veya yeni yüklenen dosyanın dataURL'i olabilir.
                                                          // Ancak burada DB'ye kaydedeceğimiz için, eğer yeni dosya yoksa ve kaldırılmamışsa, DB'deki URL'yi (imageSettings[key]) korumalıyız.
                                                          // Ya da previews[key] zaten doğru URL'yi tutuyorsa (yeni yükleme yoksa DB'den gelen, varsa dataURL) onu kullanabiliriz.
                                                          // En güvenlisi, eğer dosya yoksa ve preview null değilse, preview'daki URL'yi kullanmak.
            updatedImageValues[key] = previews[key] || '';
          }
        }
        
        await Promise.all(uploadPromises);

        try {
          const dbUpdates = imageKeys.map(key =>
            supabase
              .from('site_content')
              .update({ content_value: updatedImageValues[key], updated_at: new Date().toISOString() })
              .eq('content_key', key)
          );

          const results = await Promise.all(dbUpdates);
          results.forEach(result => {
            if (result.error) throw result.error;
          });

          toast({
            title: "Başarılı!",
            description: "Site görselleri başarıyla güncellendi.",
            variant: "success",
          });
          
          setFiles({}); // Kaydetme sonrası seçili dosyaları temizle
          await fetchImageSettings(); // Ayarları ve önizlemeleri yeniden yükle

        } catch (err) {
          console.error("Error saving site image settings:", err);
          setError(`Görseller kaydedilirken bir hata oluştu: ${err.message}`);
          toast({
            title: "Kaydetme Hatası!",
            description: `Görseller kaydedilirken bir sorun oluştu: ${err.message}`,
            variant: "destructive",
          });
        } finally {
          setSaving(false); 
        }
      };

      const handleRemoveImage = (key) => {
        setFiles(prev => ({ ...prev, [key]: null }));
        setPreviews(prev => ({ ...prev, [key]: null })); // Önizlemeyi null yap
        
        if (fileInputRefs.current[key]?.current) {
            fileInputRefs.current[key].current.value = '';
        }
        toast({ title: "Görsel Seçimi Temizlendi", description: `Değişikliği kaydetmeyi unutmayın.`, variant: "info" });
      };

      const renderImageUploadField = (config) => (
        <motion.div variants={itemVariants} className="flex flex-col space-y-3" key={config.key}>
          <h3 className="text-lg font-medium text-gray-700">{config.label}</h3>
          <p className="text-xs text-gray-500 -mt-2 mb-2">{config.description}</p>
          <div className="w-full h-48 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50 overflow-hidden relative group">
            {previews[config.key] ? (
              <img src={previews[config.key]} alt={`${config.label} Önizleme`} className="max-w-full max-h-full object-contain p-2"/>
            ) : (
              <div className="text-center text-gray-400">
                <UploadCloud size={40} className="mx-auto mb-2"/>
                <p className="text-sm">Görsel Yükle</p>
              </div>
            )}
          </div>
          <Input 
            id={config.key}
            type="file" 
            accept="image/png, image/jpeg, image/webp, image/svg+xml, image/gif, image/x-icon" 
            onChange={(e) => handleFileChange(e, config.key)}
            ref={fileInputRefs.current[config.key]}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 cursor-pointer"
            disabled={saving}
          />
          {previews[config.key] && ( 
              <Button 
                  type="button" 
                  variant="outline" 
                  size="sm" 
                  onClick={() => handleRemoveImage(config.key)} 
                  className="w-full text-red-600 border-red-400 hover:bg-red-50 hover:border-red-500"
                  disabled={saving}
              >
                  <Trash2 size={16} className="mr-2" /> Seçimi Temizle
              </Button>
          )}
        </motion.div>
      );
      
      const pageVariants = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeInOut" } },
        exit: { opacity: 0, y: -20, transition: { duration: 0.3, ease: "easeInOut" } }
      };

      const itemVariants = {
        initial: { opacity: 0, scale: 0.95 },
        animate: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
      };
      
      if (loading) {
        return (
          <motion.div 
            className="flex flex-col justify-center items-center min-h-[calc(100vh-150px)] text-gray-600"
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
            <p className="text-xl">Site Görselleri Yükleniyor...</p>
            <p className="text-sm">Lütfen bekleyin.</p>
          </motion.div>
        );
      }
      
      return (
        <motion.div 
            className="max-w-5xl mx-auto space-y-10"
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
        >
          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b-2 border-gray-200">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-800 flex items-center">
                <ImageUp size={36} className="mr-3 text-primary" /> Site Görselleri Yönetimi
              </h1>
              <p className="text-gray-600 mt-1">Sitenizin çeşitli bölümlerinde kullanılacak ana görselleri buradan yönetin.</p>
            </div>
            <Button 
                type="button" 
                onClick={handleSaveImageSettings}
                disabled={saving || loading} 
                className="bg-gradient-to-r from-green-500 to-primary hover:from-green-600 hover:to-primary/90 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105 min-w-[180px] flex items-center justify-center mt-4 sm:mt-0"
            >
                {saving ? (
                    <>
                        <Loader2 size={20} className="animate-spin mr-2" /> Kaydediliyor...
                    </>
                ) : (
                    <>
                        <Save size={20} className="mr-2" /> Tüm Görselleri Kaydet
                    </>
                )}
            </Button>
          </motion.div>

          {error && (
            <motion.div 
              variants={itemVariants} 
              className="p-4 bg-red-50 border-l-4 border-red-500 text-red-800 rounded-md shadow-md flex items-center space-x-3"
              role="alert"
            >
              <AlertTriangle size={24} className="text-red-600"/> 
              <div>
                <p className="font-semibold">Bir Hata Oluştu!</p>
                <p>{error}</p>
              </div>
            </motion.div>
          )}

          <motion.form onSubmit={handleSaveImageSettings} className="space-y-10">
            {Object.keys(groupedImageSettings).length === 0 && !loading && !error && (
                 <motion.div variants={itemVariants} className="text-center py-10 text-gray-500 bg-gray-50 p-8 rounded-lg">
                    <ImageIcon size={48} className="mx-auto mb-4 text-gray-400"/>
                    <p className="text-xl">Yapılandırılacak görsel bulunmuyor.</p>
                    <p>Lütfen yapılandırma dosyasını kontrol edin veya veritabanı bağlantınızı doğrulayın.</p>
                </motion.div>
            )}
            {Object.entries(groupedImageSettings).map(([groupName, items]) => (
              <motion.div variants={itemVariants} key={groupName}>
                <Card className="overflow-hidden shadow-xl border-gray-200 rounded-xl bg-white">
                  <CardHeader className="bg-gray-50 border-b border-gray-200 p-6">
                      <CardTitle className="text-2xl text-primary flex items-center">
                        <ImageIcon size={28} className="mr-3"/> {groupName}
                      </CardTitle>
                      <CardDescription className="text-gray-500">
                          Bu gruptaki görselleri buradan güncelleyebilirsiniz.
                      </CardDescription>
                  </CardHeader>
                  <CardContent className="p-6 md:p-8">
                      <motion.div 
                          className="grid grid-cols-1 md:grid-cols-2 gap-8"
                          initial="initial"
                          animate="animate"
                          transition={{ staggerChildren: 0.1 }}
                      >
                          {items.map(config => renderImageUploadField(config))}
                      </motion.div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
             <CardFooter className="p-6 flex justify-end sticky bottom-0 bg-white/80 backdrop-blur-sm border-t border-gray-200 rounded-b-xl">
                <Button 
                    type="submit" 
                    disabled={saving || loading || Object.keys(groupedImageSettings).length === 0} 
                    className="bg-gradient-to-r from-green-500 to-primary hover:from-green-600 hover:to-primary/90 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105 min-w-[180px] flex items-center justify-center"
                >
                    {saving ? (
                        <>
                            <Loader2 size={20} className="animate-spin mr-2" /> Kaydediliyor...
                        </>
                    ) : (
                        <>
                            <Save size={20} className="mr-2" /> Tüm Görselleri Kaydet
                        </>
                    )}
                </Button>
            </CardFooter>
          </motion.form>
        </motion.div>
      );
    };

    export default AdminSiteImagesPage;