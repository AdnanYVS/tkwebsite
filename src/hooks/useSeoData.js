import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function useSeoData(slug) {
  const [seo, setSeo] = useState({
    title: '',
    description: '',
    keywords: '',
    canonical_url: ''
  });

  useEffect(() => {
    if (!slug) return;

    const fetchSeo = async () => {
      const { data, error } = await supabase
        .from('seo_meta')
        .select('*')
        .eq('page_slug', slug)
        .single();

      if (data) {
        setSeo({
          title: data.title || '',
          description: data.description || '',
          keywords: data.keywords || '',
          canonical_url: data.canonical_url || ''
        });
      } else {
        console.warn("SEO verisi bulunamadı:", error);
      }
    };

    fetchSeo();
  }, [slug]);

  return { seo };
}
