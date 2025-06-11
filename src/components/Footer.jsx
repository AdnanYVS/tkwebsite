import React from 'react';
    import { motion } from 'framer-motion';
    import { Link } from 'react-router-dom';
    import { Linkedin, Twitter, Instagram, Facebook, ShieldCheck, Youtube } from 'lucide-react';
    import useSiteContent from '@/hooks/useSiteContent';

    const Footer = () => {
      const currentYear = new Date().getFullYear();
      const { content: siteSettings, loading: settingsLoading } = useSiteContent(['site_logo_footer_url']);


      const socialLinks = [
        { icon: <Linkedin size={20} />, href: "https://www.linkedin.com/company/tarım-kafası", label: "LinkedIn" },
        { icon: <Instagram size={20} />, href: "https://www.instagram.com/tarimkafasi/", label: "Instagram" },
        { icon: <Facebook size={20} />, href: "https://www.facebook.com/profile.php?id=61576552179639", label: "Facebook" },
        { icon: <Youtube size={20} />, href: "https://www.youtube.com/@tarimkafasi", label: "YouTube" }, 
      ];

      const footerPageLinks = [
        { name: 'Ana Sayfa', href: '/' },
        { name: 'Blog', href: '/blog' },
        { name: 'Hakkımızda', href: '/#about' },
        { name: 'İletişim', href: '/#cta' },
      ];
      
      const footerLegalLinks = [
        { name: 'Gizlilik Politikası', href: '/privacy-policy' },
        { name: 'Kullanım Şartları', href: '/terms-of-use' },
      ];
      
      const handleLinkClick = (href) => {
        if (href.startsWith('/#')) {
          const targetId = href.substring(2); 
          if (window.location.pathname !== '/') {
            window.location.href = `/#${targetId}`; 
          } else {
            const element = document.getElementById(targetId);
            if (element) {
              element.scrollIntoView({ behavior: 'smooth' });
            }
          }
        }
      };

      const logoUrl = settingsLoading ? null : siteSettings.site_logo_footer_url;
      const defaultLogoImage = "https://storage.googleapis.com/hostinger-horizons-assets-prod/8bc7d88d-19a5-44c2-a372-75fc0071f31f/672eadb36fd71f1f90ed74ea6ae9f8ad.png";


      return (
        <motion.footer 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="bg-gray-800 text-gray-300 py-12"
        >
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
              <div className="md:col-span-1">
                <Link to="/" className="flex items-center space-x-2 mb-4">
                  <img 
                    src={logoUrl || defaultLogoImage} 
                    alt="Tarım Kafası Footer Logo" 
                    className="h-20 object-contain"
                    loading="lazy"
                  />
                </Link>
                <p className="text-sm max-w-md">
                  Tarımda yenilikçi çözümlerle geleceği şekillendiriyoruz. Sürdürülebilir ve teknoloji odaklı tarım için buradayız.
                </p>
                 <div className="flex space-x-4 mt-6">
                  {socialLinks.map(link => (
                     <a 
                        key={link.label} 
                        href={link.href} 
                        aria-label={link.label}
                        className="text-gray-400 hover:text-green-400 transition-colors p-2 bg-gray-700 rounded-full hover:bg-gray-600"
                      >
                       {link.icon}
                     </a>
                  ))}
                </div>
              </div>
              
              <div>
                <p className="text-lg font-semibold text-white mb-4">Site Haritası</p>
                <ul className="space-y-2">
                  {footerPageLinks.map(link => (
                    <li key={link.name}>
                      {link.href.startsWith('/') && !link.href.includes('#') ? (
                        <Link to={link.href} className="hover:text-green-400 transition-colors text-sm">
                          {link.name}
                        </Link>
                      ) : (
                         <a href={link.href} onClick={() => handleLinkClick(link.href)} className="hover:text-green-400 transition-colors text-sm cursor-pointer">
                           {link.name}
                         </a>
                      )}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <p className="text-lg font-semibold text-white mb-4">Yasal</p>
                 <ul className="space-y-2">
                  {footerLegalLinks.map(link => (
                    <li key={link.name}>
                      <Link to={link.href} className="hover:text-green-400 transition-colors text-sm">
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              {/*
              <div>
                <p className="text-lg font-semibold text-white mb-4">Yönetim</p>
                 <ul className="space-y-2">
                    <li>
                      <Link to="/admin" className="hover:text-amber-400 transition-colors text-sm flex items-center">
                        <ShieldCheck size={16} className="mr-2"/> Admin Paneli
                      </Link>
                    </li>
                </ul>
              </div>
              */} 
            </div>
            <div className="border-t border-gray-700 pt-8 text-center">
              <p className="text-sm">
                &copy; {currentYear} Tarım Kafası. Tüm hakları saklıdır.
              </p>
              <p className="text-xs mt-1 text-gray-500">
                Sevgi ve teknoloji ile toprağa değer katanlar için.
              </p>
            </div>
          </div>
        </motion.footer>
      );
    };

    export default Footer;