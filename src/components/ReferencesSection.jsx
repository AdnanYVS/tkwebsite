import React, { useEffect, useState } from 'react';
import 'keen-slider/keen-slider.min.css';
import { useKeenSlider } from 'keen-slider/react';
import { supabase } from '@/lib/supabaseClient';
import { Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

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
  const [sliderRef] = useKeenSlider({
    loop: true,
    mode: 'snap',
    slides: {
      perView: 1,
      spacing: 16,
    },
    breakpoints: {
      '(min-width: 640px)': {
        slides: {
          perView: 2,
          spacing: 16,
        },
      },
      '(min-width: 1024px)': {
        slides: {
          perView: 3,
          spacing: 24,
        },
      },
    },
  });

  useEffect(() => {
    const fetchLogos = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('reference_logos')
        .select('id, logo_url, name')
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

  return (
    <>
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
            <div ref={sliderRef} className="keen-slider">
              {logos.map((logo, idx) => (
                <div key={logo.id} className="keen-slider__slide flex items-center justify-center">
                  <img
                    src={logo.logo_url}
                    alt={logo.name || `Referans logo ${idx + 1}`}
                    className="h-64 w-64 sm:h-64 sm:w-64 md:h-56 md:w-auto object-contain grayscale hover:grayscale-0 transition duration-300 bg-white rounded-lg shadow-md p-6 mx-auto"
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
      <YoutubeVideosSection />
    </>
  );
};

export default ReferencesSection; 