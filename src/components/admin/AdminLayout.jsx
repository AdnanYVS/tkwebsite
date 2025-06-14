import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate, Outlet, Routes, Route, Navigate } from 'react-router-dom';
import { supabase } from '@/lib/supabaseClient';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { LayoutDashboard, Newspaper, FileText, LogOut, Menu, X, UserCircle, ChevronDown, ExternalLink, Info, Settings, Image, Users, BookOpen } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import useSiteContent from '@/hooks/useSiteContent';

import AdminDashboardPage from '@/pages/admin/AdminDashboardPage';
import AdminBlogPage from '@/pages/admin/AdminBlogPage';
import AdminBlogPostForm from '@/pages/admin/AdminBlogPostForm';
import AdminSiteContentPage from '@/pages/admin/AdminSiteContentPage';
import AdminSeoPage from '@/pages/admin/AdminSeoPage';
import AdminHomepageImages from '@/pages/admin/AdminHomepageImages';
import AdminReferencesPage from '@/pages/admin/AdminReferencesPage';
import AdminAboutPage from '@/pages/admin/AdminAboutPage';
import AdminAuthorsPage from '@/pages/admin/AdminAuthorsPage';


const AdminLayout = ({ user }) => {
    const navigate = useNavigate();
    const { toast } = useToast();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const { content: siteSettings, loading: siteSettingsLoading } = useSiteContent(['site_logo_header_url']);

    const handleLogout = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) {
            toast({ title: "Çıkış Hatası", description: error.message, variant: "destructive" });
        } else {
            toast({ title: "Başarılı Çıkış", description: "Güvenle çıkış yaptınız.", variant: "success" });
            navigate('/login');
        }
    };

    const navItems = [
        { name: 'Panel', href: '', icon: LayoutDashboard, exact: true }, 
        { name: 'Blog Yazıları', href: 'blog', icon: Newspaper },
        { name: 'Yazarlar', href: 'authors', icon: Users },
        { name: 'Site İçerikleri', href: 'site-content', icon: FileText },
        { name: 'Hakkımızda', href: 'about', icon: Info },
        { name: 'SEO', href: 'seo', icon: Settings },
        { name: 'Ana Sayfa Görselleri', href: 'homepage-images', icon: Image },
        { name: 'Referans Logoları', href: 'references', icon: FileText },
    ];
    
    const NavItemComponent = ({ item, onClick }) => (
        <NavLink
            to={item.href} 
            onClick={onClick}
            end={item.exact} 
            className={({ isActive }) => 
                `flex items-center px-3 py-3 rounded-lg transition-colors duration-200 ease-in-out group
                ${isActive
                    ? 'bg-primary text-white shadow-lg'
                    : 'text-gray-600 hover:bg-primary/10 hover:text-primary'
                }`
            }
        >
            {({ isActive }) => (
                <>
                    <item.icon size={20} className={`mr-3 ${ isActive ? 'text-white' : 'text-gray-500 group-hover:text-primary'}`} />
                    <span className="font-medium">{item.name}</span>
                </>
            )}
        </NavLink>
    );

    const adminLogoUrl = siteSettingsLoading ? null : (siteSettings.site_logo_header_url || null);
    const defaultAdminLogoImage = "https://storage.googleapis.com/hostinger-horizons-assets-prod/8bc7d88d-19a5-44c2-a372-75fc0071f31f/672eadb36fd71f1f90ed74ea6ae9f8ad.png";


    return (
        <div className="min-h-screen flex bg-gray-100">
            <Button 
                variant="ghost" 
                size="icon" 
                className="md:hidden fixed top-4 left-4 z-[60] bg-white shadow-md" 
                onClick={() => setSidebarOpen(!sidebarOpen)}
            >
                {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </Button>

            <AnimatePresence>
            {sidebarOpen && (
                 <motion.div 
                    className="fixed inset-0 bg-black/50 z-40 md:hidden" 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setSidebarOpen(false)}
                />
            )}
            </AnimatePresence>
            <motion.aside 
                className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl flex flex-col transform transition-transform duration-300 ease-in-out md:static md:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
            >
                <div className="p-6 border-b border-gray-200">
                    <Link to="/" className="flex items-center space-x-2 text-2xl font-heading font-bold text-primary hover:text-primary/80 transition-colors">
                        <img 
                            src={adminLogoUrl || defaultAdminLogoImage} 
                            alt="Tarım Kafası Admin Logo" 
                            className="h-16 object-contain"
                            loading="lazy"
                        />
                    </Link>
                    <p className="text-xs text-gray-500 mt-1">Yönetim Paneli</p>
                </div>
                <nav className="flex-grow p-4 space-y-2 overflow-y-auto">
                    {navItems.map(item => (
                       <NavItemComponent key={item.name} item={item} onClick={() => setSidebarOpen(false)} />
                    ))}
                </nav>
                <div className="p-4 border-t border-gray-200">
                    <Button variant="outline" onClick={handleLogout} className="w-full text-red-600 border-red-500 hover:bg-red-50 hover:text-red-700">
                        <LogOut size={18} className="mr-2" /> Çıkış Yap
                    </Button>
                </div>
            </motion.aside>

            <div className="flex-1 flex flex-col overflow-hidden">
                <header className="bg-white shadow-sm p-4 md:p-6 flex justify-between items-center">
                    <div className="md:hidden"> 
                        <span style={{width: '40px', display: 'inline-block'}}></span>
                    </div>
                    <h1 className="text-xl font-semibold text-gray-700 hidden md:block">Yönetim Paneli</h1>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="flex items-center space-x-2">
                                <UserCircle size={24} className="text-gray-600" />
                                <span className="hidden sm:inline text-sm text-gray-700">{user?.email?.split('@')[0]}</span>
                                <ChevronDown size={16} className="text-gray-500" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56">
                            <DropdownMenuLabel className="font-normal">
                                <div className="flex flex-col space-y-1">
                                    <p className="text-sm font-medium leading-none">Giriş Yapıldı</p>
                                    <p className="text-xs leading-none text-muted-foreground truncate">
                                        {user?.email}
                                    </p>
                                </div>
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => navigate('/')} className="cursor-pointer">
                                <ExternalLink size={16} className="mr-2" /> Siteyi Görüntüle
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={handleLogout} className="text-red-600 focus:bg-red-50 focus:text-red-700 cursor-pointer">
                                <LogOut size={16} className="mr-2" /> Çıkış Yap
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </header>
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6 md:p-8">
                    <Routes>
                        <Route index element={<AdminDashboardPage />} />
                        <Route path="blog" element={<AdminBlogPage />} />
                        <Route path="blog/new" element={<AdminBlogPostForm />} />
                        <Route path="blog/edit/:id" element={<AdminBlogPostForm />} />
                        <Route path="authors" element={<AdminAuthorsPage />} />
                        <Route path="site-content" element={<AdminSiteContentPage />} />
                        <Route path="about" element={<AdminAboutPage />} />
                        <Route path="seo" element={<AdminSeoPage />} />
                        <Route path="homepage-images" element={<AdminHomepageImages />} />
                        <Route path="references" element={<AdminReferencesPage />} />
                        <Route path="*" element={<Navigate to="" replace />} /> 
                    </Routes>
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;