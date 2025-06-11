-- Create about_page_content table
CREATE TABLE IF NOT EXISTS about_page_content (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  content_key TEXT NOT NULL UNIQUE,
  content_value TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create trigger function to update updated_at column
CREATE OR REPLACE FUNCTION update_about_page_content_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger
CREATE TRIGGER update_about_page_content_updated_at
  BEFORE UPDATE ON about_page_content
  FOR EACH ROW
  EXECUTE FUNCTION update_about_page_content_updated_at();

-- Insert initial records
INSERT INTO about_page_content (content_key, content_value) VALUES
  ('hero_title', 'Hakkımızda'),
  ('hero_subtitle', 'Yenilikçi çözümler ve sürdürülebilir başarı hikayemiz'),
  ('story_title', 'Hikayemiz'),
  ('story_content', '2020 yılında kurulan şirketimiz, teknoloji ve inovasyon alanında öncü çözümler sunmaya başladı. Müşteri odaklı yaklaşımımız ve yenilikçi çözümlerimizle sektörde fark yaratmaya devam ediyoruz.'),
  ('mission_title', 'Misyonumuz'),
  ('mission_content', 'Müşterilerimize en yenilikçi ve sürdürülebilir çözümleri sunarak, teknoloji dünyasında öncü olmak ve değer yaratmak.'),
  ('vision_title', 'Vizyonumuz'),
  ('vision_content', 'Global ölçekte tanınan, yenilikçi ve sürdürülebilir çözümlerle teknoloji dünyasında lider konuma ulaşmak.'),
  ('values_title', 'Değerlerimiz'),
  ('values', '[
    {
      "title": "Yenilikçilik",
      "description": "Sürekli gelişim ve yenilikçi çözümler üretmek için çalışıyoruz.",
      "icon": "🚀"
    },
    {
      "title": "Müşteri Odaklılık",
      "description": "Müşterilerimizin ihtiyaçlarını en iyi şekilde karşılamak önceliğimizdir.",
      "icon": "💡"
    },
    {
      "title": "Sürdürülebilirlik",
      "description": "Çevreye ve topluma karşı sorumluluklarımızın bilincindeyiz.",
      "icon": "🌱"
    }
  ]'),
  ('team_title', 'Ekibimiz'),
  ('team_members', '[
    {
      "name": "Ahmet Yılmaz",
      "position": "CEO",
      "image": "/images/team-1.jpg",
      "bio": "15 yıllık sektör deneyimi ile teknoloji ve inovasyon alanında öncü çözümler geliştiriyor.",
      "experience": [
        "XYZ Teknoloji - Genel Müdür (2018-2023)",
        "ABC Yazılım - Teknoloji Direktörü (2015-2018)",
        "DEF Sistemler - Kıdemli Yazılım Mimarı (2010-2015)"
      ],
      "education": [
        "İstanbul Teknik Üniversitesi - Bilgisayar Mühendisliği (2006-2010)",
        "Boğaziçi Üniversitesi - MBA (2012-2014)"
      ],
      "skills": ["Stratejik Planlama", "Liderlik", "İnovasyon", "Proje Yönetimi"]
    },
    {
      "name": "Ayşe Demir",
      "position": "CTO",
      "image": "/images/team-2.jpg",
      "bio": "Yapay zeka ve makine öğrenmesi alanında uzman, teknoloji stratejileri geliştiriyor.",
      "experience": [
        "GHI Teknoloji - CTO (2019-2023)",
        "JKL Yazılım - Baş Mühendis (2016-2019)",
        "MNO Sistemler - Yazılım Geliştirici (2013-2016)"
      ],
      "education": [
        "Orta Doğu Teknik Üniversitesi - Bilgisayar Mühendisliği (2009-2013)",
        "Stanford Üniversitesi - Yapay Zeka Yüksek Lisans (2014-2016)"
      ],
      "skills": ["Yapay Zeka", "Makine Öğrenmesi", "Yazılım Mimarisi", "Teknoloji Stratejisi"]
    },
    {
      "name": "Mehmet Kaya",
      "position": "COO",
      "image": "/images/team-3.jpg",
      "bio": "Operasyonel mükemmellik ve süreç optimizasyonu konularında uzman.",
      "experience": [
        "PQR Teknoloji - COO (2020-2023)",
        "STU Sistemler - Operasyon Müdürü (2017-2020)",
        "VWX Yazılım - Proje Yöneticisi (2014-2017)"
      ],
      "education": [
        "Koç Üniversitesi - Endüstri Mühendisliği (2010-2014)",
        "Sabancı Üniversitesi - İşletme Yüksek Lisans (2015-2017)"
      ],
      "skills": ["Operasyon Yönetimi", "Süreç İyileştirme", "Proje Yönetimi", "Stratejik Planlama"]
    }
  ]')
ON CONFLICT (content_key) DO UPDATE
SET content_value = EXCLUDED.content_value,
    updated_at = timezone('utc'::text, now()); 