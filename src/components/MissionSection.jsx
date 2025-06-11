import React from 'react';
import { motion } from 'framer-motion';
import { Globe, Zap, HeartHandshake } from 'lucide-react';

const MissionSection = ({ content, imageUrl }) => {
  const sectionTitle = content?.mission_section_title || "Misyonumuz";
  const sectionIntro = content?.mission_section_intro || "Tarımda sürdürülebilirlik ve inovasyon.";
  const item1Title = content?.mission_item1_title || "Sürdürülebilir Tarım Uygulamaları";
  const item1Text = content?.mission_item1_text || "Toprak verimliliğini artıran, su kaynaklarını koruyan ve biyoçeşitliliği destekleyen ekolojik tarım yöntemlerini yaygınlaştırmak.";
  const item2Title = content?.mission_item2_title || "Teknolojik Dönüşüm";
  const item2Text = content?.mission_item2_text || "Yapay zeka, IoT ve büyük veri gibi ileri teknolojileri tarım süreçlerine entegre ederek verimliliği ve karlılığı maksimize etmek.";
  const item3Title = content?.mission_item3_title || "Çiftçi Odaklı Destek";
  const item3Text = content?.mission_item3_text || "Genç çiftçilere ve kadın girişimcilere özel eğitim, danışmanlık ve finansal erişim imkanları sunarak tarımda fırsat eşitliği yaratmak.";

  return (
    <section id="mission" className="py-16 md:py-24 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 md:mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-primary mb-4"
            dangerouslySetInnerHTML={{ __html: sectionTitle.replace(/\n/g, '<br />') }}
          />
          <p className="text-lg text-gray-600 max-w-2xl mx-auto"
            dangerouslySetInnerHTML={{ __html: sectionIntro.replace(/\n/g, '<br />') }}
          />
        </motion.div>
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <img  
              alt="Misyon görseli" 
              className="rounded-xl shadow-2xl object-cover w-full h-auto max-h-[500px]"
              src={imageUrl || "https://images.unsplash.com/photo-1670607951160-d7780f0f0478"} 
              loading="lazy"
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            className="space-y-8"
          >
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 p-3 bg-primary text-white rounded-lg shadow-md">
                <Globe size={28} />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-primary mb-1"
                  dangerouslySetInnerHTML={{ __html: item1Title.replace(/\n/g, '<br />') }}
                />
                <p className="text-gray-600"
                  dangerouslySetInnerHTML={{ __html: item1Text.replace(/\n/g, '<br />') }}
                />
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 p-3 bg-secondary text-white rounded-lg shadow-md">
                <Zap size={28} />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-secondary mb-1"
                  dangerouslySetInnerHTML={{ __html: item2Title.replace(/\n/g, '<br />') }}
                />
                <p className="text-gray-600"
                  dangerouslySetInnerHTML={{ __html: item2Text.replace(/\n/g, '<br />') }}
                />
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 p-3 bg-teal-600 text-white rounded-lg shadow-md">
                <HeartHandshake size={28} />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-teal-700 mb-1"
                  dangerouslySetInnerHTML={{ __html: item3Title.replace(/\n/g, '<br />') }}
                />
                <p className="text-gray-600"
                  dangerouslySetInnerHTML={{ __html: item3Text.replace(/\n/g, '<br />') }}
                />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default MissionSection;