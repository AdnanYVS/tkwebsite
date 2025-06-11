import React, { useEffect, useState } from 'react';
import 'keen-slider/keen-slider.min.css';
import { useKeenSlider } from 'keen-slider/react';
import { supabase } from '@/lib/supabaseClient';
import { Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { Dialog } from '@headlessui/react';

const YOUTUBE_CHANNEL_ID = "UCVJhnwd7OVuYiDD4DVm53nw"; // Kanal ID'nizi buraya girin
const YOUTUBE_API_KEY = "AIzaSyBrGpyqfhM54Lmq3lOO--dRqVGhcIitEbQ"; // API anahtarınızı buraya girin

function YoutubeVideosSection() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchVideos() {
      try {
        const res = await fetch(
          `https://www.googleapis.com/youtube/v3/search?key=${YOUTUBE_API_KEY}&channelId=${YOUTUBE_CHANNEL_ID}&part=snippet,id&order=date&maxResults=3&type=video`
        );
        const data = await res.json();
        if (data.items) {
          setVideos(data.items);
        } else {
          setError("Video bulunamadı.");
        }
      } catch (err) {
        setError("YouTube videoları alınamadı.");
      } finally {
        setLoading(false);
      }
    }
    fetchVideos();
  }, []);

  if (loading) return <div className="text-center py-8">Yükleniyor...</div>;
  if (error) return <div className="text-center text-red-500 py-8">{error}</div>;

  return (
    <div className="py-8 bg-gray-100">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12 md:mb-16"
      >
        <h2 className="text-3xl md:text-4xl font-heading font-bold text-primary mb-4">
          Son YouTube Videolarımız
        </h2>
      </motion.div>
      <div className="flex flex-wrap justify-center gap-6">
        {videos.map((video) => (
          <a
            key={video.id.videoId}
            href={`https://www.youtube.com/watch?v=${video.id.videoId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-64"
          >
            <img
              src={video.snippet.thumbnails.high.url}
              alt={video.snippet.title}
              className="rounded-lg shadow-md w-full h-36 object-cover mb-2"
            />
            <div className="text-sm font-medium line-clamp-2 text-center">
              {video.snippet.title}
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}

const ReferencesSection = () => {
  const [logos, setLogos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedLogo, setSelectedLogo] = useState(null);
  const [activeTab, setActiveTab] = useState('company');

  useEffect(() => {
    const fetchLogos = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('reference_logos')
        .select('id, logo_url, name, job')
        .order('sort_order', { ascending: true });
      if (!error && data) {
        setLogos(data);
      } else {
        setLogos([]);
      }
      setLoading(false);
    };
    fetchLogos();
  }, []);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === logos.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? logos.length - 1 : prevIndex - 1
    );
  };

  // Otomatik kaydırma
  useEffect(() => {
    if (logos.length > 0) {
      const timer = setInterval(nextSlide, 3000);
      return () => clearInterval(timer);
    }
  }, [logos.length, currentIndex]);

  return (
    <>
      {/* Modal */}
      <Dialog open={modalOpen} onClose={() => setModalOpen(false)} className="fixed z-50 inset-0 overflow-y-auto">
        <div className="flex items-center justify-center min-h-screen px-4">
          {/* Overlay */}
          <div className="fixed inset-0 bg-black/40" aria-hidden="true" />
          <div className="relative bg-white rounded-xl shadow-xl max-w-md w-full mx-auto p-6 z-50">
            <Dialog.Title className="text-xl font-bold mb-4 text-primary">Referans Detayı</Dialog.Title>
            <div className="flex border-b mb-4">
              <button
                className={`flex-1 py-2 font-semibold ${activeTab === 'company' ? 'border-b-2 border-primary text-primary' : 'text-gray-500'}`}
                onClick={() => setActiveTab('company')}
              >
                Şirket Adı
              </button>
              <button
                className={`flex-1 py-2 font-semibold ${activeTab === 'job' ? 'border-b-2 border-primary text-primary' : 'text-gray-500'}`}
                onClick={() => setActiveTab('job')}
              >
                Yapılan İş
              </button>
            </div>
            {selectedLogo ? (
              <div>
                {activeTab === 'company' && (
                  <div className="text-center">
                    {selectedLogo.logo_url && (
                      <img src={selectedLogo.logo_url} alt={selectedLogo.name || 'Şirket'} className="h-24 mx-auto mb-4 object-contain" />
                    )}
                    <div className="text-lg font-semibold text-gray-800">
                      {selectedLogo.name || 'Şirket adı yok'}
                    </div>
                  </div>
                )}
                {activeTab === 'job' && (
                  <div className="text-center">
                    <div className="text-base text-gray-700">
                      {selectedLogo.job || 'Bilgi eklenmedi.'}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div>Yükleniyor...</div>
            )}
            <button
              className="mt-6 w-full py-2 rounded-lg bg-primary text-white font-semibold hover:bg-primary-700 transition"
              onClick={() => setModalOpen(false)}
            >
              Kapat
            </button>
          </div>
        </div>
      </Dialog>
      <section className="py-16 bg-gradient-to-br from-gray-50 to-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12 md:mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-primary mb-4">
              Referanslarımız
            </h2>
          </motion.div>

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-10 w-10 animate-spin text-primary mr-4" />
              <span className="text-lg text-gray-600">Logolar yükleniyor...</span>
            </div>
          ) : (
            <div className="relative flex flex-col items-center" style={{ minHeight: '220px' }}>
              <div className="flex justify-center items-center w-full max-w-3xl mx-auto relative" style={{ minHeight: '180px' }}>
                <button
                  onClick={prevSlide}
                  className="absolute left-2 z-10 p-1.5 rounded-full bg-white/90 shadow hover:bg-white transition-colors"
                  aria-label="Önceki logo"
                  style={{ top: '50%', transform: 'translateY(-50%)' }}
                >
                  <ChevronLeft className="h-5 w-5 text-primary" />
                </button>

                <div className="flex items-center justify-center w-full gap-2">
                  {logos.length > 0 && [
                    -1, 0, 1
                  ].map((offset) => {
                    // Sonsuz döngü için index hesaplama
                    const idx = (currentIndex + offset + logos.length) % logos.length;
                    const isCenter = offset === 0;
                    return (
                      <motion.div
                        key={idx}
                        initial={{ scale: isCenter ? 0.8 : 0.6, opacity: isCenter ? 0.7 : 0.5 }}
                        animate={{
                          scale: isCenter ? 1 : 0.7,
                          opacity: isCenter ? 1 : 0.6,
                          zIndex: isCenter ? 2 : 1,
                        }}
                        transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
                        className={`flex justify-center items-center ${isCenter ? 'shadow-xl' : 'shadow'} bg-white rounded-lg cursor-pointer`}
                        style={{
                          width: isCenter ? 180 : 100,
                          height: isCenter ? 180 : 100,
                          margin: isCenter ? '0 12px' : '0 4px',
                          position: 'relative',
                        }}
                        onClick={() => {
                          setSelectedLogo(logos[idx]);
                          setActiveTab('company');
                          setModalOpen(true);
                        }}
                      >
                        <img
                          src={logos[idx].logo_url}
                          alt={logos[idx].name || `Referans logo ${idx + 1}`}
                          className="object-contain grayscale hover:grayscale-0 transition duration-300 rounded-lg"
                          style={{ width: '100%', height: '100%', padding: isCenter ? 16 : 8 }}
                          loading="lazy"
                        />
                      </motion.div>
                    );
                  })}
                </div>

                <button
                  onClick={nextSlide}
                  className="absolute right-2 z-10 p-1.5 rounded-full bg-white/90 shadow hover:bg-white transition-colors"
                  aria-label="Sonraki logo"
                  style={{ top: '50%', transform: 'translateY(-50%)' }}
                >
                  <ChevronRight className="h-5 w-5 text-primary" />
                </button>
              </div>

              {/* Nokta navigasyonu */}
              <div className="flex justify-center gap-2 mt-4">
                {logos.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentIndex(idx)}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      idx === currentIndex ? 'bg-primary' : 'bg-gray-300'
                    }`}
                    aria-label={`Logo ${idx + 1}`}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
      <YoutubeVideosSection />
    </>
  );
};

export default ReferencesSection; 