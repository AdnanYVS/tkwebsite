import React from 'react';
import { motion } from 'framer-motion';
import { Target, Users, TrendingUp } from 'lucide-react';

const cardVariants = {
  offscreen: {
    y: 50,
    opacity: 0
  },
  onscreen: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      bounce: 0.4,
      duration: 0.8
    }
  }
};

const AboutSection = ({ content, imageUrl }) => {
  const sectionTitle = content?.about_section_title || "Hakkımızda";
  const sectionIntro = content?.about_section_intro || "Tarımda yenilikçi çözümler sunuyoruz.";
  const card1Title = content?.about_card1_title || "Yenilikçi Yaklaşım";
  const card1Text = content?.about_card1_text || "En son teknolojileri ve yaratıcı çözümleri kullanarak tarımda verimliliği artırıyor, kaynak kullanımını optimize ediyoruz. Drone'lardan akıllı sensörlere, veri analizinden otomasyona kadar geniş bir yelpazede hizmet sunuyoruz.";
  const card2Title = content?.about_card2_title || "Gençlere Destek";
  const card2Text = content?.about_card2_text || "Tarım sektörüne taze bir soluk getirmek isteyen genç girişimcileri ve çiftçileri destekliyoruz. Eğitim, mentorluk ve finansman olanaklarıyla onların yanında yer alıyor, hayallerini gerçekleştirmelerine yardımcı oluyoruz.";
  const card3Title = content?.about_card3_title || "Sürdürülebilir Gelecek";
  const card3Text = content?.about_card3_text || "Doğal kaynakları koruyan, çevreye duyarlı ve ekonomik olarak sürdürülebilir tarım uygulamalarını yaygınlaştırıyoruz. Gelecek nesillere daha yaşanabilir bir dünya bırakmak için çalışıyoruz.";

  return (
    <section id="about" className="py-16 md:py-24 bg-white">
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
        <div className="grid md:grid-cols-2 gap-8 justify-center items-stretch max-w-5xl mx-auto">
          <motion.div 
            className="bg-gradient-to-br from-green-50 to-lime-100 p-8 rounded-2xl shadow-2xl hover:shadow-3xl transition-shadow duration-300 transform hover:-translate-y-1 flex flex-row items-center w-full"
            variants={cardVariants}
            initial="offscreen"
            whileInView="onscreen"
            viewport={{ once: true, amount: 0.5 }}
          >
            <div className="flex-shrink-0 mr-6">
              <div className="p-4 bg-primary rounded-full text-white">
                <Target size={40} />
              </div>
            </div>
            <div className="flex-grow">
              <h3 className="text-2xl font-semibold text-primary mb-2 text-center"
                dangerouslySetInnerHTML={{ __html: card1Title.replace(/\n/g, '<br />') }}
              />
              <p className="text-gray-700 text-base leading-relaxed text-center"
                dangerouslySetInnerHTML={{ __html: card1Text.replace(/\n/g, '<br />') }}
              />
            </div>
          </motion.div>

          <motion.div 
            className="bg-gradient-to-br from-amber-50 to-yellow-100 p-8 rounded-2xl shadow-2xl hover:shadow-3xl transition-shadow duration-300 transform hover:-translate-y-1 flex flex-row items-center w-full"
            variants={cardVariants}
            initial="offscreen"
            whileInView="onscreen"
            viewport={{ once: true, amount: 0.5 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex-shrink-0 mr-6">
              <div className="p-4 bg-secondary rounded-full text-white">
                <Users size={40} />
              </div>
            </div>
            <div className="flex-grow">
              <h3 className="text-2xl font-semibold text-secondary mb-2 text-center"
                dangerouslySetInnerHTML={{ __html: card2Title.replace(/\n/g, '<br />') }}
              />
              <p className="text-gray-700 text-base leading-relaxed text-center"
                dangerouslySetInnerHTML={{ __html: card2Text.replace(/\n/g, '<br />') }}
              />
            </div>
          </motion.div>
        </div>
        
        <div className="mt-12 text-center">
          <img
            src={imageUrl || "https://images.unsplash.com/photo-1554048807-b043cffa8118"}
            alt="Hakkımızda görseli"
            className="rounded-lg shadow-xl mx-auto max-w-3xl w-full h-auto object-cover"
            loading="lazy"
          />
        </div>
      </div>
    </section>
  );
};

export default AboutSection;

    