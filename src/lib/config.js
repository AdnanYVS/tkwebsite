export const config = {
  app: {
    name: import.meta.env.VITE_APP_NAME || 'Tarım Kafası',
    url: import.meta.env.VITE_APP_URL || 'https://tarimkafasi.com',
    env: import.meta.env.VITE_APP_ENV || 'development',
  },
  security: {
    sessionTimeout: parseInt(import.meta.env.VITE_SESSION_TIMEOUT) || 3600,
    maxLoginAttempts: parseInt(import.meta.env.VITE_MAX_LOGIN_ATTEMPTS) || 5,
    loginTimeout: parseInt(import.meta.env.VITE_LOGIN_TIMEOUT) || 300,
  },
  api: {
    rateLimit: parseInt(import.meta.env.VITE_API_RATE_LIMIT) || 100,
    timeout: parseInt(import.meta.env.VITE_API_TIMEOUT) || 30000,
  },
  image: {
    maxSize: parseInt(import.meta.env.VITE_MAX_IMAGE_SIZE) || 5242880, // 5MB
    allowedTypes: (import.meta.env.VITE_ALLOWED_IMAGE_TYPES || 'image/jpeg,image/png,image/webp').split(','),
    quality: parseFloat(import.meta.env.VITE_IMAGE_QUALITY) || 0.85,
  },
  seo: {
    defaultTitle: import.meta.env.VITE_DEFAULT_META_TITLE || 'Tarım Kafası - Tarım ve Gıda Haberleri',
    defaultDescription: import.meta.env.VITE_DEFAULT_META_DESCRIPTION || 'Tarım ve gıda sektöründeki en güncel haberler, analizler ve yorumlar.',
    defaultKeywords: import.meta.env.VITE_DEFAULT_META_KEYWORDS || 'tarım, gıda, haber, analiz, yorum, sektör',
  },
}; 