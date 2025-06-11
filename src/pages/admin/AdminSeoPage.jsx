import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';

const AdminSeoPage = () => {
  const [slug, setSlug] = useState('');
  const [seoData, setSeoData] = useState({
    title: '',
    description: '',
    keywords: '',
    canonical_url: '',
  });

  const fetchSeoData = async (slug) => {
    if (!slug) return;
    const { data, error } = await supabase
      .from('seo_meta')
      .select('*')
      .eq('page_slug', slug)
      .single();

    if (error && error.code !== 'PGRST116') {
      toast({ title: 'Hata', description: error.message });
    } else if (data) {
      setSeoData({
        title: data.title || '',
        description: data.description || '',
        keywords: data.keywords || '',
        canonical_url: data.canonical_url || '',
      });
    } else {
      setSeoData({ title: '', description: '', keywords: '', canonical_url: '' });
    }
  };

  useEffect(() => {
    fetchSeoData(slug);
  }, [slug]);

  const handleSave = async () => {
    if (!slug) {
      toast({ title: 'Slug zorunlu', description: 'Lütfen bir slug girin.' });
      return;
    }

    const { error } = await supabase.from('seo_meta').upsert({
      page_slug: slug,
      ...seoData,
    });

    if (error) {
      toast({ title: 'Kayıt Hatası', description: error.message });
    } else {
      toast({ title: 'Başarılı', description: 'SEO verileri kaydedildi.' });
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <Card>
        <CardContent className="space-y-4">
          <h2 className="text-xl font-bold">SEO Bilgileri</h2>

          <Input
            placeholder="/blog/kirsal-tarim"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
          />

          <Input
            placeholder="Başlık"
            value={seoData.title}
            onChange={(e) => setSeoData({ ...seoData, title: e.target.value })}
          />

          <Textarea
            placeholder="Meta açıklaması"
            value={seoData.description}
            onChange={(e) => setSeoData({ ...seoData, description: e.target.value })}
          />

          <Input
            placeholder="Anahtar kelimeler (virgülle ayırın)"
            value={seoData.keywords}
            onChange={(e) => setSeoData({ ...seoData, keywords: e.target.value })}
          />

          <Input
            placeholder="Canonical URL (opsiyonel)"
            value={seoData.canonical_url}
            onChange={(e) => setSeoData({ ...seoData, canonical_url: e.target.value })}
          />

          <Button onClick={handleSave}>Kaydet</Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminSeoPage;
