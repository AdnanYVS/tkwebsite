import React from 'react';
import { motion } from 'framer-motion';
import { BarChart3, Briefcase, GraduationCap, Palette } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const staticServicesData = [
  {
    icon: <BarChart3 size={40} className="text-primary" />,
    defaultTitle: "Stratejik Pazarlama",
    contentKeyTitle: "service_1_title",
    defaultDescription: "Ürünlerinizi doğru kitlelere ulaştırmak için veri odaklı pazarlama stratejileri geliştiriyoruz. Dijital pazarlama, sosyal medya yönetimi ve pazar analizi konularında yanınızdayız.",
    contentKeyDescription: "service_1_description",
    bgColor: "from-green-100 to-lime-50",
    borderColor: "border-primary"
  },
  {
    icon: <Palette size={40} className="text-secondary" />,
    defaultTitle: "Markalaşma ve Kimlik",
    contentKeyTitle: "service_2_title",
    defaultDescription: "Tarım işletmeniz için güçlü bir marka kimliği oluşturuyoruz. Logo tasarımından ambalajlamaya, hikaye anlatımından kurumsal kimliğe kadar tüm süreçlerde size özel çözümler sunuyoruz.",
    contentKeyDescription: "service_2_description",
    bgColor: "from-amber-100 to-yellow-50",
    borderColor: "border-secondary"
  },
  {
    icon: <GraduationCap size={40} className="text-teal-600" />,
    defaultTitle: "Eğitim ve Danışmanlık",
    contentKeyTitle: "service_3_title",
    defaultDescription: "Modern tarım teknikleri, sürdürülebilir uygulamalar ve iş geliştirme konularında kapsamlı eğitim programları ve birebir danışmanlık hizmetleri sunuyoruz.",
    contentKeyDescription: "service_3_description",
    bgColor: "from-teal-100 to-cyan-50",
    borderColor: "border-teal-600"
  },
  {
    icon: <Briefcase size={40} className="text-indigo-600" />,
    defaultTitle: "Proje Geliştirme",
    contentKeyTitle: "service_4_title",
    defaultDescription: "Tarım projelerinizin fikir aşamasından uygulamaya geçirilmesine kadar tüm süreçlerde yanınızdayız. Fizibilite çalışmaları, fon bulma ve proje yönetimi konularında destek sağlıyoruz.",
    contentKeyDescription: "service_4_description",
    bgColor: "from-indigo-100 to-purple-50",
    borderColor: "border-indigo-600"
  }
];

const cardVariants = {
  hidden: { opacity: 0, scale: 0.8, y: 20 },
  visible: (i) => ({
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      delay: i * 0.15,
      duration: 0.5,
      ease: "easeOut"
    }
  })
};

const ServicesSection = ({ content, imageUrl }) => {
  console.log('ServicesSection received content:', content); // Debug log
  const sectionTitle = content?.services_section_title || "Hizmetlerimizle Tarımda Fark Yaratın";
  const sectionIntro = content?.services_section_intro || "Tarım işletmenizin potansiyelini en üst düzeye çıkarmak için kapsamlı ve yenilikçi hizmetler sunuyoruz.";

  return (
    <section id="services" className="py-16 md:py-24 bg-white">
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
        {imageUrl && (
          <div className="flex justify-center mb-8">
            <img src={imageUrl} alt="Hizmetler görseli" className="rounded-xl shadow-lg max-h-80 object-cover" />
          </div>
        )}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {staticServicesData.map((service, index) => {
            const title = content?.[service.contentKeyTitle] || service.defaultTitle;
            const description = content?.[service.contentKeyDescription] || service.defaultDescription;
            console.log(`Service ${index + 1} - Title key: ${service.contentKeyTitle}, Title value: ${title}`); // Debug log
            console.log(`Service ${index + 1} - Description key: ${service.contentKeyDescription}, Description value: ${description}`); // Debug log
            return (
              <motion.div
                key={service.defaultTitle}
                custom={index}
                variants={cardVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                className={`rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-2 ${service.borderColor}`}
              >
                <Card className={`h-full flex flex-col bg-gradient-to-br ${service.bgColor} border-0`}>
                  <CardHeader className="items-center text-center">
                    <div className="p-4 bg-white rounded-full mb-4 shadow-md">
                      {service.icon}
                    </div>
                    <CardTitle className="text-xl font-semibold"
                      dangerouslySetInnerHTML={{ __html: title.replace(/\n/g, '<br />') }}
                    />
                  </CardHeader>
                  <CardContent className="text-center flex-grow">
                    <p className="text-gray-700 text-sm leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: description.replace(/\n/g, '<br />') }}
                    />
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;