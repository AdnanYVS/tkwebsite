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
        <div className="mt-12 text-center">
          {imageUrl && (
            <img
              src={imageUrl}
              alt="Hakkımızda görseli"
              className="rounded-lg shadow-xl mx-auto max-w-3xl w-full h-auto object-cover"
              loading="lazy"
            />
          )}
        </div>
      </div>
    </section>
  );
};

export default AboutSection;

    