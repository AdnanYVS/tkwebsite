import React from 'react';
    import { Link } from 'react-router-dom';
    import { Newspaper, Edit3, Settings, BarChart2, Users, Leaf, FileText } from 'lucide-react';
    import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
    import { Button } from '@/components/ui/button';
    import { motion } from 'framer-motion';

    const AdminDashboardPage = () => {
      const quickLinks = [
        { title: 'Blog Yazılarını Yönet', href: '/admin/blog', icon: <Newspaper size={32} className="text-green-600" />, description: "Yeni yazılar ekleyin, mevcutları düzenleyin veya silin." },
        { title: 'Site İçeriklerini Düzenle', href: '/admin/site-content', icon: <FileText size={32} className="text-blue-600" />, description: "Ana sayfa, hakkımızda gibi metinleri güncelleyin." },
        { title: 'Yeni Blog Yazısı Ekle', href: '/admin/blog/new', icon: <Edit3 size={32} className="text-amber-600" />, description: "Hemen yeni bir blog içeriği oluşturun." },
        // { title: 'Genel Ayarlar', href: '/admin/site-settings', icon: <Settings size={32} className="text-purple-600" />, description: "Logo, site başlığı gibi genel ayarları yapılandırın (yakında)." },
      ];

      const stats = [
        // Örnek istatistikler, Supabase'den veri çekilerek dinamikleştirilebilir.
        { title: 'Toplam Blog Yazısı', value: '12', icon: <Newspaper size={24} className="text-gray-500" />, note: "Veritabanındaki yazı sayısı" },
        { title: 'Yönetilebilir İçerik Alanı', value: '20+', icon: <FileText size={24} className="text-gray-500" />, note: "Site genelindeki metin alanları" },
        // { title: 'Kullanıcılar', value: '1', icon: <Users size={24} className="text-gray-500" />, note: "Yönetici kullanıcılar (yakında)" },
      ];
      
      const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: { staggerChildren: 0.1 }
        }
      };

      const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 }
      };

      return (
        <motion.div 
          className="space-y-8"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <motion.div variants={itemVariants} className="pb-6 border-b border-gray-200">
            <h1 className="text-3xl font-bold text-gray-800 flex items-center">
              <Leaf size={36} className="mr-3 text-primary" /> Tarım Kafası Yönetim Paneli
            </h1>
            <p className="text-gray-600 mt-1">Web sitenizin içeriğini buradan yönetebilirsiniz.</p>
          </motion.div>

          <motion.section variants={itemVariants}>
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">Hızlı İşlemler</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {quickLinks.map(link => (
                <motion.div key={link.title} whileHover={{ y: -5, boxShadow: "0px 10px 20px rgba(0,0,0,0.1)" }} className="h-full">
                  <Card className="h-full flex flex-col justify-between hover:border-primary transition-all duration-200">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-lg font-semibold text-primary">{link.title}</CardTitle>
                      {link.icon}
                    </CardHeader>
                    <CardContent className="flex-grow">
                      <p className="text-sm text-gray-600">{link.description}</p>
                    </CardContent>
                    <div className="p-6 pt-0">
                      <Button asChild className="w-full bg-green-600 hover:bg-green-700 text-white">
                        <Link to={link.href}>Git</Link>
                      </Button>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.section>
          
          <motion.section variants={itemVariants}>
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">Genel Bakış</h2>
             <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {stats.map(stat => (
                <Card key={stat.title} className="shadow-sm hover:shadow-md transition-shadow">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-gray-500">{stat.title}</CardTitle>
                    {stat.icon}
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-gray-800">{stat.value}</div>
                    <p className="text-xs text-gray-500 mt-1">{stat.note}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </motion.section>

        </motion.div>
      );
    };

    export default AdminDashboardPage;