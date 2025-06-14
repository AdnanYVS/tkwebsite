import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet';
import useAboutContent from '@/hooks/useAboutContent';
import { Loader2 } from 'lucide-react';

const TeamMemberModal = ({ member, onClose }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex items-start gap-6">
            <img
              src={member.image}
              alt={member.name}
              className="w-32 h-32 rounded-lg object-cover"
            />
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-gray-900">{member.name}</h3>
              <p className="text-primary-600 font-medium">{member.position}</p>
              <p className="text-gray-600 mt-2">{member.bio}</p>
            </div>
          </div>

          <div className="mt-8 space-y-6">
            {member.experience.length > 0 && (
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-3">Deneyim</h4>
                <ul className="space-y-2">
                  {member.experience.map((exp, index) => (
                    <li key={index} className="text-gray-600">{exp}</li>
                  ))}
                </ul>
              </div>
            )}

            {member.education.length > 0 && (
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-3">Eğitim</h4>
                <ul className="space-y-2">
                  {member.education.map((edu, index) => (
                    <li key={index} className="text-gray-600">{edu}</li>
                  ))}
                </ul>
              </div>
            )}

            {member.skills.length > 0 && (
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-3">Yetenekler</h4>
                <div className="flex flex-wrap gap-2">
                  {member.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-primary-50 text-primary-700 rounded-full text-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

const AboutPage = () => {
  const [selectedMember, setSelectedMember] = useState(null);
  const contentKeys = [
    'hero_title',
    'hero_subtitle',
    'story_title',
    'story_content',
    'mission_title',
    'mission_content',
    'vision_title',
    'vision_content',
    'values_title',
    'values',
    'team_title',
    'team_members'
  ];

  const { content, loading } = useAboutContent(contentKeys);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const values = content.values ? JSON.parse(content.values) : [];
  const teamMembers = content.team_members ? JSON.parse(content.team_members) : [];

  return (
    <>
      <Helmet>
        <title>Hakkımızda - TK Teknoloji</title>
        <meta name="description" content="TK Teknoloji hakkında bilgi edinin. Misyonumuz, vizyonumuz, değerlerimiz ve ekibimiz." />
      </Helmet>

      <AnimatePresence>
        {selectedMember && (
          <TeamMemberModal
            member={selectedMember}
            onClose={() => setSelectedMember(null)}
          />
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <section className="relative py-20 bg-[#14532d] text-white">
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl mx-auto text-center"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{content.hero_title}</h1>
            <p className="text-xl text-primary-100">{content.hero_subtitle}</p>
          </motion.div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl mx-auto text-center"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-6">{content.story_title}</h2>
            <p className="text-lg text-gray-600 leading-relaxed">{content.story_content}</p>
          </motion.div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="bg-white p-8 rounded-xl shadow-lg"
            >
              <h3 className="text-2xl font-bold text-gray-900 mb-4">{content.mission_title}</h3>
              <p className="text-gray-600">{content.mission_content}</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="bg-white p-8 rounded-xl shadow-lg"
            >
              <h3 className="text-2xl font-bold text-gray-900 mb-4">{content.vision_title}</h3>
              <p className="text-gray-600">{content.vision_content}</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">{content.values_title}</h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-gray-50 p-6 rounded-xl text-center"
              >
                <div className="text-4xl mb-4">{value.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">{content.team_title}</h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {teamMembers.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-lg overflow-hidden cursor-pointer transform hover:scale-105 transition-transform duration-300"
                onClick={() => setSelectedMember(member)}
              >
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-64 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{member.name}</h3>
                  <p className="text-primary-600 font-medium">{member.position}</p>
                  <p className="text-gray-600 mt-2 line-clamp-2">{member.bio}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default AboutPage; 