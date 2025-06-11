-- Create site_content table
CREATE TABLE IF NOT EXISTS site_content (
  id BIGSERIAL PRIMARY KEY,
  content_key TEXT UNIQUE NOT NULL,
  content_value TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Insert initial records for About page
INSERT INTO site_content (content_key, content_value) VALUES
  ('about_hero_title', 'Hakkımızda'),
  ('about_hero_subtitle', 'Tarım teknolojilerinde 20 yıllık deneyim'),
  ('about_story_title', 'Hikayemiz'),
  ('about_story_content', '2004 yılında başlayan yolculuğumuzda, tarım sektörüne yenilikçi çözümler sunmaya devam ediyoruz.'),
  ('about_mission_title', 'Misyonumuz'),
  ('about_mission_content', 'Tarım sektörünü teknoloji ile buluşturarak, sürdürülebilir ve verimli üretim sağlamak.'),
  ('about_vision_title', 'Vizyonumuz'),
  ('about_vision_content', 'Türkiye''nin önde gelen tarım teknolojileri şirketi olmak ve global pazarda söz sahibi olmak.'),
  ('about_values_title', 'Değerlerimiz'),
  ('about_values', '[{"title":"Yenilikçilik","description":"Sürekli gelişim ve yenilikçi çözümler üretmek","icon":"💡"},{"title":"Güvenilirlik","description":"Müşterilerimize karşı şeffaf ve güvenilir hizmet","icon":"🤝"},{"title":"Sürdürülebilirlik","description":"Çevre dostu ve sürdürülebilir tarım çözümleri","icon":"🌱"}]'),
  ('about_team_title', 'Ekibimiz'),
  ('about_team_members', '[{"name":"Ahmet Yılmaz","position":"Genel Müdür","image":"https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop","bio":"20 yıllık tarım teknolojileri deneyimi","experience":["Genel Müdür - TK Teknoloji (2018-Devam)","Satış Müdürü - ABC Tarım (2010-2018)"],"education":["İşletme Yüksek Lisansı - İstanbul Üniversitesi","Makine Mühendisliği - ODTÜ"],"skills":["Liderlik","Stratejik Planlama","Pazarlama"]},{"name":"Ayşe Demir","position":"Teknik Direktör","image":"https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop","bio":"15 yıllık teknik deneyim","experience":["Teknik Direktör - TK Teknoloji (2015-Devam)","Kıdemli Mühendis - XYZ Teknoloji (2008-2015)"],"education":["Elektrik-Elektronik Mühendisliği - İTÜ"],"skills":["Proje Yönetimi","Sistem Tasarımı","Teknik Analiz"]},{"name":"Mehmet Kaya","position":"AR-GE Müdürü","image":"https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop","bio":"12 yıllık AR-GE deneyimi","experience":["AR-GE Müdürü - TK Teknoloji (2016-Devam)","AR-GE Uzmanı - DEF Teknoloji (2011-2016)"],"education":["Bilgisayar Mühendisliği - Boğaziçi Üniversitesi"],"skills":["Yazılım Geliştirme","Veri Analizi","İnovasyon"]}]');

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_site_content_updated_at
    BEFORE UPDATE ON site_content
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column(); 