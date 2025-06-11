import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '@/lib/supabaseClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, LogIn, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';
import useSiteContent from '@/hooks/useSiteContent';

const LoginPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [user, setUser] = useState(null);
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [lockoutTime, setLockoutTime] = useState(null);
  const { content: siteSettings, loading: settingsLoading } = useSiteContent(['site_logo_header_url']);

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setUser(session.user);
        navigate('/admin'); 
      }
    };
    getSession();
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    
    // Rate limiting kontrolü
    if (lockoutTime && Date.now() < lockoutTime) {
      const remainingTime = Math.ceil((lockoutTime - Date.now()) / 1000);
      setError(`Çok fazla başarısız deneme. Lütfen ${remainingTime} saniye bekleyin.`);
      return;
    }

    setLoading(true);
    setError('');

    if (!email || !password) {
      setError('Lütfen e-posta ve şifrenizi girin.');
      setLoading(false);
      return;
    }

    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

      if (signInError) {
        setLoginAttempts(prev => prev + 1);
        
        // 5 başarısız denemeden sonra 15 dakika bekleme süresi
        if (loginAttempts >= 4) {
          const lockoutDuration = 15 * 60 * 1000; // 15 dakika
          setLockoutTime(Date.now() + lockoutDuration);
          setError('Çok fazla başarısız deneme. Hesabınız 15 dakika boyunca kilitlendi.');
          return;
        }
        
        throw signInError;
      }

      // Başarılı girişte sayaçları sıfırla
      setLoginAttempts(0);
      setLockoutTime(null);

      if (data.user) {
        toast({
          title: 'Giriş Başarılı!',
          description: 'Yönetim paneline yönlendiriliyorsunuz.',
          variant: 'success',
        });
        navigate('/admin');
      }
    } catch (err) {
      console.error('Login error:', err);
      if (err.message.includes("Invalid login credentials")) {
        setError(`Geçersiz e-posta veya şifre. Kalan deneme hakkı: ${5 - loginAttempts}`);
      } else if (err.message.includes("Email not confirmed")) {
        setError('E-posta adresiniz henüz doğrulanmamış. Lütfen e-postanızı kontrol edin.');
      } else {
        setError('Giriş sırasında bir hata oluştu. Lütfen daha sonra tekrar deneyin.');
      }
    } finally {
      setLoading(false);
    }
  };
  
  const logoUrl = settingsLoading ? null : (siteSettings.site_logo_header_url || null);
  const defaultLogoImage = "https://storage.googleapis.com/hostinger-horizons-assets-prod/8bc7d88d-19a5-44c2-a372-75fc0071f31f/672eadb36fd71f1f90ed74ea6ae9f8ad.png";

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-green-200 via-lime-100 to-amber-100 p-4">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8 text-center"
      >
        <Link to="/" className="inline-flex items-center space-x-3">
           <img 
            src={logoUrl || defaultLogoImage} 
            alt="Tarım Kafası Logo" 
            className="h-24 object-contain" /* Yükseklik h-20'den h-24'e çıkarıldı */
          />
        </Link>
        <p className="text-gray-600 mt-2">Yönetim Paneli Girişi</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card className="w-full max-w-md shadow-2xl border-gray-300">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center text-primary">Giriş Yap</CardTitle>
            <CardDescription className="text-center text-gray-600">
              Devam etmek için yönetici bilgilerinizi girin.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-6">
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-md flex items-center text-sm">
                  <AlertTriangle size={18} className="mr-2 flex-shrink-0"/> 
                  <p>{error}</p>
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="email">E-posta Adresi</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="focus:ring-primary focus:border-primary"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Şifre</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="focus:ring-primary focus:border-primary"
                />
              </div>
              <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-white" disabled={loading}>
                {loading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <LogIn className="mr-2 h-4 w-4" />
                )}
                Giriş Yap
              </Button>
            </form>
          </CardContent>
          <CardFooter className="text-center text-sm text-gray-500">
            <p>Sorun mu yaşıyorsunuz? <a href="mailto:info@tarimkafasi.com" className="text-primary hover:underline">Destek ile iletişime geçin.</a></p>
          </CardFooter>
        </Card>
      </motion.div>
       <p className="mt-8 text-center text-sm text-gray-600">
        <Link to="/" className="hover:text-primary transition-colors">&larr; Ana Sayfaya Dön</Link>
      </p>
    </div>
  );
};

export default LoginPage;