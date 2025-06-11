import React, { useState, useEffect } from 'react';
    import { Link, useNavigate } from 'react-router-dom';
    import { motion, AnimatePresence } from 'framer-motion';
    import { Menu, X } from 'lucide-react';
    import { Button } from '@/components/ui/button';
    import useSiteContent from '@/hooks/useSiteContent';

    const Navbar = () => {
      const [isOpen, setIsOpen] = useState(false);
      const navigate = useNavigate();
      const { content: siteSettings, loading: settingsLoading } = useSiteContent(['site_logo_header_url']);

      const navItems = [
        { name: 'Ana Sayfa', href: '/' },
        { name: 'Hakkımızda', href: '/about' },
        { name: 'Hizmetlerimiz', href: '/#services' },
        { name: 'Blog', href: '/blog' },
        { name: 'İletişim', href: '/#cta'}
      ];

      const itemVariants = {
        closed: { opacity: 0, y: -10 },
        open: { opacity: 1, y: 0 }
      };
      
      const handleLinkClick = (href) => {
        setIsOpen(false);
        if (href.startsWith('/#')) {
          const targetId = href.substring(2); 
          if (window.location.pathname === '/') {
            const element = document.getElementById(targetId);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
            } else {
                console.warn(`Element with id '${targetId}' not found on current page.`);
            }
          } else {
            navigate('/');
            setTimeout(() => {
              const element = document.getElementById(targetId);
              if (element) {
                  element.scrollIntoView({ behavior: 'smooth' });
              } else {
                  console.warn(`Element with id '${targetId}' not found after navigation.`);
              }
            }, 150); 
          }
        } else {
          navigate(href);
        }
      };

      const logoUrl = settingsLoading ? null : (siteSettings.site_logo_header_url || null);
      const defaultLogoImage = "https://storage.googleapis.com/hostinger-horizons-assets-prod/8bc7d88d-19a5-44c2-a372-75fc0071f31f/672eadb36fd71f1f90ed74ea6ae9f8ad.png";


      return (
        <motion.nav 
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="sticky top-0 z-50 bg-white/80 backdrop-blur-md shadow-sm"
        >
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-28"> {/* Yükseklik h-24'ten h-28'e çıkarıldı */}
              <motion.div
                className="flex items-center"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                    to="/"
                    className="flex items-center space-x-2 text-2xl font-heading font-bold text-primary hover:text-primary/80 transition-colors"
                    onClick={() => setIsOpen(false)}
                >
                    <img 
                        src={logoUrl || defaultLogoImage} 
                        alt="Tarım Kafası Logo" 
                        className="h-24 object-contain"  /* Yükseklik h-14'ten h-16'ya çıkarıldı */
                        loading="lazy"
                    />
                </Link>
              </motion.div>
              <div className="hidden md:flex items-center space-x-1 lg:space-x-2">
                {navItems.map((item) => (
                  <motion.button
                    key={item.name}
                    onClick={() => handleLinkClick(item.href)}
                    className="px-2 py-2 lg:px-3 rounded-md text-xs lg:text-sm font-medium text-gray-700 hover:bg-green-100 hover:text-primary transition-colors"
                    whileHover={{ y: -2 }}
                  >
                    {item.name}
                  </motion.button>
                ))}
              </div>
              <div className="md:hidden">
                <Button variant="ghost" size="icon" onClick={() => setIsOpen(!isOpen)}>
                  {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </Button>
              </div>
            </div>
          </div>
          <AnimatePresence>
            {isOpen && (
                <motion.div 
                initial="closed"
                animate="open"
                exit="closed"
                variants={{
                    open: { opacity: 1, height: 'auto', transition: { staggerChildren: 0.07, delayChildren: 0.2 } },
                    closed: { opacity: 0, height: 0, transition: { staggerChildren: 0.05, staggerDirection: -1, when: "afterChildren" } }
                }}
                className="md:hidden bg-white shadow-lg absolute w-full"
                >
                <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                    {navItems.map((item) => (
                    <motion.button
                        key={item.name}
                        onClick={() => handleLinkClick(item.href)}
                        className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-green-100 hover:text-primary transition-colors"
                        variants={itemVariants}
                    >
                        {item.name}
                    </motion.button>
                    ))}
                </div>
                </motion.div>
            )}
          </AnimatePresence>
        </motion.nav>
      );
    };

    export default Navbar;