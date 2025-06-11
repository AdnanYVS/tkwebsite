import React from 'react';
import HeroSection from '@/components/HeroSection';
import AboutSection from '@/components/AboutSection';
import MissionSection from '@/components/MissionSection';
import ServicesSection from '@/components/ServicesSection';
import FeaturedBlogSection from '@/components/FeaturedBlogSection';
import CallToActionSection from '@/components/CallToActionSection';
import ReferencesSection from '@/components/ReferencesSection';
import useSiteContent from '@/hooks/useSiteContent';
import { Loader2, AlertTriangle } from 'lucide-react';
import { Helmet } from 'react-helmet';
import { supabase } from '@/lib/supabaseClient';

const HomePage = () => {
  const contentKeys = [
    'hero_main_title', 'hero_subtitle', 'hero_youtube_button_text',
    'about_section_title', 'about_section_intro', 
    'about_card1_title', 'about_card1_text',
    'about_card2_title', 'about_card2_text',
    'about_card3_title', 'about_card3_text',
    'mission_section_title', 'mission_section_intro',
    'mission_item1_title', 'mission_item1_text',
    'mission_item2_title', 'mission_item2_text',
    'mission_item3_title', 'mission_item3_text',
    'services_section_title', 'services_section_intro',
    'service1_title', 'service1_description',
    'service2_title', 'service2_description',
    'service3_title', 'service3_description',
    'service4_title', 'service4_description',
    'cta_section_title', 'cta_section_intro',
  ];

  const { content, loading: contentLoading, error: contentError } = useSiteContent(contentKeys);
  const [homepageImages, setHomepageImages] = React.useState({});

  React.useEffect(() => {
    const fetchHomepageImages = async () => {
      const { data, error } = await supabase
        .from('site_settings')
        .select('key, value')
        .in('key', [
          'hero_image_url',
          'about_image_url',
          'mission_image_url',
          'services_image_url',
        ]);
      if (!error && data) {
        const imgObj = {};
        data.forEach(row => {
          imgObj[row.key] = row.value;
        });
        setHomepageImages(imgObj);
      }
    };
    fetchHomepageImages();
  }, []);

  if (contentLoading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-gradient-to-br from-green-50 via-amber-50 to-lime-50">
        <Loader2 className="h-20 w-20 animate-spin text-primary mb-6" />
        <p className="text-2xl font-semibold text-gray-700">Sayfa içeriği yükleniyor...</p>
        <p className="text-gray-500">Lütfen bekleyin.</p>
      </div>
    );
  }

  if (contentError) {
    console.error("Error loading site content for HomePage:", contentError);
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-red-50 text-red-700 p-8">
        <AlertTriangle size={64} className="mb-4" />
        <h2 className="text-3xl font-semibold mb-3">İçerik Yüklenemedi!</h2>
        <p className="text-lg text-center mb-6">Ana sayfa içeriği yüklenirken bir sorun oluştu. Lütfen daha sonra tekrar deneyin.</p>
        <p className="text-sm">Detaylar için konsolu kontrol edebilirsiniz.</p>
      </div>
    );
  }
  
  return (
    <>
      <Helmet>
        <title>Tarım Kafası - Ana Sayfa</title>
        <meta name="description" content="Tarım Kafası ana sayfası, tarım ve teknoloji üzerine güncel içerikler." />
      </Helmet>
      <HeroSection content={content} imageUrl={homepageImages.hero_image_url} />
      <AboutSection content={content} imageUrl={homepageImages.about_image_url} />
      <MissionSection content={content} imageUrl={homepageImages.mission_image_url} />
      <ServicesSection content={content} imageUrl={homepageImages.services_image_url} />
      <ReferencesSection />
      <FeaturedBlogSection />
      <CallToActionSection content={content} />
    </>
  );
};

export default HomePage;