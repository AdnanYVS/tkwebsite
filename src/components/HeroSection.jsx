import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Youtube, ArrowRight, Leaf, Zap, Linkedin, Instagram, Facebook } from 'lucide-react';

const HeroSection = ({ content, imageUrl }) => {
  const mainTitle = content?.hero_main_title?.value || "Kafa Dengi Tarım";
  const mainTitleStyles = content?.hero_main_title?.styles || {
    fontWeight: 'extrabold',
    fontSize: 'text-7xl',
    textColor: 'text-white'
  };

  const subtitle = content?.hero_subtitle?.value || "Geleceğin tarımını bugünden inşa ediyoruz. Genç, dinamik ve teknoloji odaklı çözümlerle sürdürülebilir bir tarım ekosistemi yaratıyoruz.";
  const subtitleStyles = content?.hero_subtitle?.styles || {
    fontWeight: 'normal',
    fontSize: 'text-xl',
    textColor: 'text-gray-100'
  };

  const socialLinks = [
    { icon: <Linkedin size={24} />, href: "https://www.linkedin.com/company/tarım-kafası", label: "LinkedIn" },
    { icon: <Instagram size={24} />, href: "https://www.instagram.com/tarimkafasi/", label: "Instagram" },
    { icon: <Facebook size={24} />, href: "https://www.facebook.com/profile.php?id=61576552179639", label: "Facebook" },
    { icon: <Youtube size={24} />, href: "https://www.youtube.com/@tarimkafasi", label: "YouTube" },
  ];

  return (
    <section className="relative py-20 md:py-32 bg-gradient-to-br from-green-700 via-green-800 to-emerald-900 text-white overflow-hidden">
      <div className="absolute inset-0 opacity-30">
        <img  
          alt="Hero görseli" 
          className="w-full h-full object-cover"
          src={imageUrl || "/assets/images/tkbg.webp"} 
        />
      </div>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="max-w-3xl mx-auto text-center"
        >
          <motion.h1 
            className={`${mainTitleStyles.fontSize} ${mainTitleStyles.fontWeight} tracking-tight mb-6 text-shadow-lg ${mainTitleStyles.textColor}`}
            style={{ textShadow: '2px 2px 6px rgba(0,0,0,0.5)' }}
            dangerouslySetInnerHTML={{ __html: mainTitle.replace(/\n/g, '<br />') }}
          />
          <motion.p 
            className={`${subtitleStyles.fontSize} ${subtitleStyles.fontWeight} mb-10 ${subtitleStyles.textColor}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
            dangerouslySetInnerHTML={{ __html: subtitle.replace(/\n/g, '<br />') }}
          />
          <motion.div 
            className="flex justify-center items-center space-x-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
          >
            {socialLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white/10 hover:bg-white/20 text-white p-3 rounded-full transition-all duration-300 transform hover:scale-110 hover:shadow-lg"
                aria-label={link.label}
              >
                {link.icon}
              </a>
            ))}
          </motion.div>
        </motion.div>
      </div>
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-background via-background/80 to-transparent"></div>
      <motion.div
        className="absolute top-1/4 left-10 opacity-20"
        animate={{ y: [-10, 10, -10], x: [-5, 5, -5], rotate: [-3, 3, -3] }}
        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
      >
        <Zap size={80} className="text-yellow-400" />
      </motion.div>
      <motion.div
        className="absolute bottom-1/4 right-10 opacity-20"
        animate={{ y: [10, -10, 10], x: [5, -5, 5], rotate: [3, -3, 3] }}
        transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
      >
        <Leaf size={100} className="text-green-300" />
      </motion.div>
    </section>
  );
};

export default HeroSection;