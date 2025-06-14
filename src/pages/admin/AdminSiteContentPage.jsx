import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, Save, Users, Globe, Briefcase, MessageSquare } from 'lucide-react';
import { motion } from 'framer-motion';
import { Editor } from '@tinymce/tinymce-react';

const contentManagementConfig = {
  // Ana Karşılama Alanı
  hero_main_title: {
    label: 'Ana Karşılama Başlığı',
    group: 'Ana Karşılama Alanı',
    description: 'Ana sayfadaki karşılama bölümünün başlığı.',
    type: 'text',
    maxLength: 100
  },
  hero_subtitle: {
    label: 'Ana Karşılama Alt Başlığı',
    group: 'Ana Karşılama Alanı',
    description: 'Ana sayfadaki karşılama bölümünün alt başlığı.',
    type: 'text',
    maxLength: 200
  },
  hero_youtube_button_text: {
    label: 'YouTube Buton Metni',
    group: 'Ana Karşılama Alanı',
    description: 'Ana sayfadaki YouTube butonunun metni.',
    type: 'text',
    maxLength: 100
  },
  hero_section_description: {
    label: 'Ana Karşılama Açıklaması',
    group: 'Ana Karşılama Alanı',
    description: 'Ana sayfadaki karşılama bölümünün açıklama metni.',
    type: 'html',
    maxLength: 500
  },

  // Hakkımızda Bölümü
  about_section_title: {
    label: 'Hakkımızda Başlığı',
    group: 'Hakkımızda Bölümü',
    description: 'Hakkımızda bölümünün ana başlığı.',
    type: 'text',
    maxLength: 100
  },
  about_section_intro: {
    label: 'Hakkımızda Giriş Metni',
    group: 'Hakkımızda Bölümü',
    description: 'Hakkımızda bölümünün giriş paragrafı.',
    type: 'html',
    maxLength: 500
  },
  about_card1_title: {
    label: '1. Kart Başlığı',
    group: 'Hakkımızda Bölümü',
    description: 'Hakkımızda bölümündeki ilk kartın başlığı.',
    type: 'text',
    maxLength: 50
  },
  about_card1_text: {
    label: '1. Kart İçeriği',
    group: 'Hakkımızda Bölümü',
    description: 'Hakkımızda bölümündeki ilk kartın içeriği.',
    type: 'html',
    maxLength: 200
  },
  about_card2_title: {
    label: '2. Kart Başlığı',
    group: 'Hakkımızda Bölümü',
    description: 'Hakkımızda bölümündeki ikinci kartın başlığı.',
    type: 'text',
    maxLength: 50
  },
  about_card2_text: {
    label: '2. Kart İçeriği',
    group: 'Hakkımızda Bölümü',
    description: 'Hakkımızda bölümündeki ikinci kartın içeriği.',
    type: 'html',
    maxLength: 200
  },
  about_card_3_title: {
    label: '3. Kart Başlığı',
    group: 'Hakkımızda Bölümü',
    description: 'Hakkımızda bölümündeki üçüncü kartın başlığı.',
    type: 'text',
    maxLength: 50
  },
  about_card_3_content: {
    label: '3. Kart İçeriği',
    group: 'Hakkımızda Bölümü',
    description: 'Hakkımızda bölümündeki üçüncü kartın içeriği.',
    type: 'html',
    maxLength: 200
  },

  // Misyon Bölümü
  mission_section_title: {
    label: 'Misyon Başlığı',
    group: 'Misyon Bölümü',
    description: 'Misyon bölümünün ana başlığı.',
    type: 'text',
    maxLength: 100
  },
  mission_section_intro: {
    label: 'Misyon Giriş Metni',
    group: 'Misyon Bölümü',
    description: 'Misyon bölümünün giriş paragrafı.',
    type: 'html',
    maxLength: 500
  },
  mission_item1_title: {
    label: '1. Misyon Maddesi Başlığı',
    group: 'Misyon Bölümü',
    description: 'Misyon bölümündeki ilk maddenin başlığı.',
    type: 'text',
    maxLength: 100
  },
  mission_item1_text: {
    label: '1. Misyon Maddesi İçeriği',
    group: 'Misyon Bölümü',
    description: 'Misyon bölümündeki ilk maddenin içeriği.',
    type: 'html',
    maxLength: 200
  },
  mission_item2_title: {
    label: '2. Misyon Maddesi Başlığı',
    group: 'Misyon Bölümü',
    description: 'Misyon bölümündeki ikinci maddenin başlığı.',
    type: 'text',
    maxLength: 100
  },
  mission_item2_text: {
    label: '2. Misyon Maddesi İçeriği',
    group: 'Misyon Bölümü',
    description: 'Misyon bölümündeki ikinci maddenin içeriği.',
    type: 'html',
    maxLength: 200
  },
  mission_item3_title: {
    label: '3. Misyon Maddesi Başlığı',
    group: 'Misyon Bölümü',
    description: 'Misyon bölümündeki üçüncü maddenin başlığı.',
    type: 'text',
    maxLength: 100
  },
  mission_item3_text: {
    label: '3. Misyon Maddesi İçeriği',
    group: 'Misyon Bölümü',
    description: 'Misyon bölümündeki üçüncü maddenin içeriği.',
    type: 'html',
    maxLength: 200
  },

  // Hizmetler Bölümü
  services_section_title: {
    label: 'Hizmetler Başlığı',
    group: 'Hizmetler Bölümü',
    description: 'Hizmetler bölümünün ana başlığı.',
    type: 'text',
    maxLength: 100
  },
  services_section_intro: {
    label: 'Hizmetler Giriş Metni',
    group: 'Hizmetler Bölümü',
    description: 'Hizmetler bölümünün giriş paragrafı.',
    type: 'html',
    maxLength: 500
  },
  service_1_title: {
    label: '1. Hizmet Başlığı',
    group: 'Hizmetler Bölümü',
    description: 'İlk hizmetin başlığı.',
    type: 'text',
    maxLength: 50
  },
  service_1_description: {
    label: '1. Hizmet Açıklaması',
    group: 'Hizmetler Bölümü',
    description: 'İlk hizmetin açıklaması.',
    type: 'html',
    maxLength: 200
  },
  service_2_title: {
    label: '2. Hizmet Başlığı',
    group: 'Hizmetler Bölümü',
    description: 'İkinci hizmetin başlığı.',
    type: 'text',
    maxLength: 50
  },
  service_2_description: {
    label: '2. Hizmet Açıklaması',
    group: 'Hizmetler Bölümü',
    description: 'İkinci hizmetin açıklaması.',
    type: 'html',
    maxLength: 200
  },
  service_3_title: {
    label: '3. Hizmet Başlığı',
    group: 'Hizmetler Bölümü',
    description: 'Üçüncü hizmetin başlığı.',
    type: 'text',
    maxLength: 50
  },
  service_3_description: {
    label: '3. Hizmet Açıklaması',
    group: 'Hizmetler Bölümü',
    description: 'Üçüncü hizmetin açıklaması.',
    type: 'html',
    maxLength: 200
  },
  service_4_title: {
    label: '4. Hizmet Başlığı',
    group: 'Hizmetler Bölümü',
    description: 'Dördüncü hizmetin başlığı.',
    type: 'text',
    maxLength: 50
  },
  service_4_description: {
    label: '4. Hizmet Açıklaması',
    group: 'Hizmetler Bölümü',
    description: 'Dördüncü hizmetin açıklaması.',
    type: 'html',
    maxLength: 200
  },

  // İletişim Bölümü
  cta_section_title: {
    label: 'İletişim Başlığı',
    group: 'İletişim Bölümü',
    description: 'İletişim bölümünün ana başlığı.',
    type: 'text',
    maxLength: 100
  },
  cta_section_intro: {
    label: 'İletişim Giriş Metni',
    group: 'İletişim Bölümü',
    description: 'İletişim bölümünün giriş paragrafı.',
    type: 'html',
    maxLength: 500
  }
};

const AdminSiteContentPage = () => {
  const { toast } = useToast();
  const [content, setContent] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const contentKeys = Object.keys(contentManagementConfig);

  const initializeServicesContent = async () => {
    try {
      const defaultServicesContent = [
        { content_key: 'service_1_title', content_value: 'Stratejik Pazarlama' },
        { content_key: 'service_1_description', content_value: 'Ürünlerinizi doğru kitlelere ulaştırmak için veri odaklı pazarlama stratejileri geliştiriyoruz. Dijital pazarlama, sosyal medya yönetimi ve pazar analizi konularında yanınızdayız.' },
        { content_key: 'service_2_title', content_value: 'Markalaşma ve Kimlik' },
        { content_key: 'service_2_description', content_value: 'Tarım işletmeniz için güçlü bir marka kimliği oluşturuyoruz. Logo tasarımından ambalajlamaya, hikaye anlatımından kurumsal kimliğe kadar tüm süreçlerde size özel çözümler sunuyoruz.' },
        { content_key: 'service_3_title', content_value: 'Eğitim ve Danışmanlık' },
        { content_key: 'service_3_description', content_value: 'Modern tarım teknikleri, sürdürülebilir uygulamalar ve iş geliştirme konularında kapsamlı eğitim programları ve birebir danışmanlık hizmetleri sunuyoruz.' },
        { content_key: 'service_4_title', content_value: 'Proje Geliştirme' },
        { content_key: 'service_4_description', content_value: 'Tarım projelerinizin fikir aşamasından uygulamaya geçirilmesine kadar tüm süreçlerde yanınızdayız. Fizibilite çalışmaları, fon bulma ve proje yönetimi konularında destek sağlıyoruz.' },
        { content_key: 'services_section_title', content_value: 'Hizmetlerimizle Tarımda Fark Yaratın' },
        { content_key: 'services_section_intro', content_value: 'Tarım işletmenizin potansiyelini en üst düzeye çıkarmak için kapsamlı ve yenilikçi hizmetler sunuyoruz.' }
      ];

      const { error } = await supabase
        .from('site_content')
        .upsert(defaultServicesContent, { onConflict: 'content_key' });

      if (error) throw error;

      toast({
        title: 'Başarılı!',
        description: 'Hizmetler bölümü içeriği başarıyla oluşturuldu.',
        variant: 'success'
      });

      // Refresh content after initialization
      fetchContent();
    } catch (error) {
      console.error('Error initializing services content:', error);
      toast({
        title: 'Hata!',
        description: 'Hizmetler bölümü içeriği oluşturulurken bir hata oluştu.',
        variant: 'destructive'
      });
    }
  };

  const fetchContent = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('site_content')
        .select('content_key, content_value')
        .in('content_key', contentKeys);

      if (error) throw error;

      console.log('Fetched content from database:', data);

      const contentData = {};
      data.forEach(item => {
        contentData[item.content_key] = item.content_value || '';
      });

      console.log('Processed content data:', contentData);
      setContent(contentData);

      // Check if services content exists
      const servicesKeys = contentKeys.filter(key => key.startsWith('service'));
      const hasServicesContent = servicesKeys.every(key => contentData[key]);
      
      if (!hasServicesContent) {
        await initializeServicesContent();
      }
    } catch (error) {
      console.error('Error fetching content:', error);
      toast({
        title: 'Hata!',
        description: 'İçerikler yüklenirken bir hata oluştu.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchContent();
  }, [fetchContent]);

  const handleContentChange = (key, value) => {
    setContent(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const updates = contentKeys.map(key => ({
        content_key: key,
        content_value: content[key] || ''
      }));

      const { error } = await supabase
        .from('site_content')
        .upsert(updates, { onConflict: 'content_key' });

      if (error) throw error;

      toast({
        title: 'Başarılı!',
        description: 'Tüm içerikler başarıyla kaydedildi.',
        variant: 'success'
      });
    } catch (error) {
      console.error('Error saving content:', error);
      toast({
        title: 'Hata!',
        description: 'İçerikler kaydedilirken bir hata oluştu.',
        variant: 'destructive'
      });
    } finally {
      setSaving(false);
    }
  };

  const renderContentField = (key, config) => {
    if (config.type === 'html') {
      return (
        <Editor
          apiKey="m1vynncsiiul2a8dyhgykpf7ab6g58kp9yvnkfrznzekfqrt"
          value={content[key] || ''}
          onEditorChange={(content) => handleContentChange(key, content)}
          init={{
            height: 300,
            menubar: false,
            plugins: [
              'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
              'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
              'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
            ],
            toolbar: 'undo redo | blocks | ' +
              'bold italic forecolor | alignleft aligncenter ' +
              'alignright alignjustify | bullist numlist outdent indent | ' +
              'removeformat | help',
            content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
          }}
        />
      );
    }

    return (
      <input
        type="text"
        value={content[key] || ''}
        onChange={(e) => handleContentChange(key, e.target.value)}
        placeholder={config.description}
        maxLength={config.maxLength}
        className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
      />
    );
  };

  const groupedContent = contentKeys.reduce((acc, key) => {
    const config = contentManagementConfig[key];
    if (!acc[config.group]) {
      acc[config.group] = [];
    }
    acc[config.group].push({ key, ...config });
    return acc;
  }, {});

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Site İçerikleri</h1>
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 focus:ring-2 focus:ring-green-300 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {saving ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              Kaydediliyor...
            </>
          ) : (
            <>
              <Save className="h-5 w-5" />
              Kaydet
            </>
          )}
        </button>
      </div>

      <div className="space-y-8">
        {Object.entries(groupedContent).map(([group, items]) => (
          <Card key={group}>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">{group}</h2>
              <div className="space-y-6">
                {items.map(({ key, label, description, type }) => (
                  <div key={key} className="space-y-3">
                    <label className="block text-sm font-medium text-gray-700">
                      {label}
                    </label>
                    <p className="text-sm text-gray-500">{description}</p>
                    {renderContentField(key, { type, maxLength: contentManagementConfig[key].maxLength })}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AdminSiteContentPage;