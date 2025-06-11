import { supabase } from './supabaseClient';
import { config } from './config';

// Rate limiting için basit bir in-memory cache
const rateLimitCache = new Map();

// Rate limiting kontrolü
export const checkRateLimit = (key, limit = config.security.maxLoginAttempts, windowMs = config.security.loginTimeout * 1000) => {
  const now = Date.now();
  const windowStart = now - windowMs;
  
  if (!rateLimitCache.has(key)) {
    rateLimitCache.set(key, []);
  }
  
  const requests = rateLimitCache.get(key);
  const validRequests = requests.filter(time => time > windowStart);
  
  if (validRequests.length >= limit) {
    return false;
  }
  
  validRequests.push(now);
  rateLimitCache.set(key, validRequests);
  return true;
};

// XSS koruması için input sanitization
export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
};

// Oturum kontrolü
export const validateSession = async () => {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) throw error;
    return session;
  } catch (error) {
    console.error('Oturum doğrulama hatası:', error);
    return null;
  }
};

// API istekleri için güvenlik başlıkları
export const getSecurityHeaders = () => {
  return {
    'Content-Security-Policy': `default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:;`,
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
  };
};

// Görsel güvenlik kontrolü
export const validateImage = (file) => {
  if (!file) return false;
  
  // Boyut kontrolü
  if (file.size > config.image.maxSize) {
    throw new Error(`Görsel boyutu ${config.image.maxSize / 1024 / 1024}MB'dan küçük olmalıdır.`);
  }
  
  // Tür kontrolü
  if (!config.image.allowedTypes.includes(file.type)) {
    throw new Error('Sadece JPEG, PNG ve WebP formatları desteklenmektedir.');
  }
  
  return true;
}; 