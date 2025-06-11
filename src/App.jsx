import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import HomePage from '@/pages/HomePage';
import BlogPage from '@/pages/BlogPage';
import BlogPostPage from '@/pages/BlogPostPage'; 
import AboutPage from '@/pages/AboutPage';
import AdminLayout from '@/components/admin/AdminLayout';
import AdminDashboardPage from '@/pages/admin/AdminDashboardPage';
import AdminBlogPage from '@/pages/admin/AdminBlogPage';
import AdminBlogPostForm from '@/pages/admin/AdminBlogPostForm';
import AdminSiteContentPage from '@/pages/admin/AdminSiteContentPage';
import AdminSiteSettingsPage from '@/pages/admin/AdminSiteSettingsPage'; 
import AdminSeoPage from '@/pages/admin/AdminSeoPage';
import LoginPage from '@/pages/LoginPage';
import { supabase } from '@/lib/supabaseClient';
import { Loader2 } from 'lucide-react';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfUse from './pages/TermsOfUse.jsx';

const ProtectedRoute = ({ user, loadingAuth }) => {
  if (loadingAuth) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="ml-4 text-xl text-gray-700">Oturum durumu kontrol ediliyor...</p>
      </div>
    );
  }
  return user ? <Outlet /> : <Navigate to="/login" replace />;
};

const MainLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

function App() {
  const [user, setUser] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(true);

  useEffect(() => {
    const getSession = async () => {
      setLoadingAuth(true);
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) throw error;
        setUser(session?.user ?? null);
      } catch (error) {
        console.error("Error getting session:", error);
        setUser(null);
      } finally {
        setLoadingAuth(false);
      }
    };

    getSession();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-amber-50 to-lime-50 text-gray-800 font-sans">
      <Toaster />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        
        <Route element={<ProtectedRoute user={user} loadingAuth={loadingAuth} />}>
          <Route path="/admin/*" element={<AdminLayout user={user} />}>
            {/* AdminLayout içindeki Outlet'e render edilecek rotalar AdminLayout'ta tanımlanacak */}
            <Route path="seo" element={<AdminSeoPage />} /> 
          </Route>
        </Route>

        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/blog/:slug" element={<BlogPostPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-of-use" element={<TermsOfUse />} />
        </Route>
        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default App;