import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Loader2, Save, UploadCloud, X } from 'lucide-react';
import useAboutContent from '@/hooks/useAboutContent';
import { supabase } from '@/lib/supabaseClient';
import { useToast } from '@/components/ui/use-toast';

const BUCKET = 'team-members';

const AdminAboutPage = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    hero_title: '',
    hero_subtitle: '',
    story_title: '',
    story_content: '',
    mission_title: '',
    mission_content: '',
    vision_title: '',
    vision_content: '',
    values_title: '',
    values: [],
    team_title: '',
    team_members: []
  });

  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [uploading, setUploading] = useState(false);

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

  const { content, loading, updateContent } = useAboutContent(contentKeys);

  useEffect(() => {
    if (content) {
      setFormData({
        hero_title: content.hero_title || '',
        hero_subtitle: content.hero_subtitle || '',
        story_title: content.story_title || '',
        story_content: content.story_content || '',
        mission_title: content.mission_title || '',
        mission_content: content.mission_content || '',
        vision_title: content.vision_title || '',
        vision_content: content.vision_content || '',
        values_title: content.values_title || '',
        values: content.values ? JSON.parse(content.values) : [],
        team_title: content.team_title || '',
        team_members: content.team_members ? JSON.parse(content.team_members) : []
      });
    }
  }, [content]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleValueChange = (index, field, value) => {
    const newValues = [...formData.values];
    newValues[index] = {
      ...newValues[index],
      [field]: value
    };
    setFormData(prev => ({
      ...prev,
      values: newValues
    }));
  };

  const handleTeamMemberChange = (index, field, value) => {
    const newTeamMembers = [...formData.team_members];
    newTeamMembers[index] = {
      ...newTeamMembers[index],
      [field]: value
    };
    setFormData(prev => ({
      ...prev,
      team_members: newTeamMembers
    }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setSaveSuccess(false);

      const updates = {
        hero_title: formData.hero_title,
        hero_subtitle: formData.hero_subtitle,
        story_title: formData.story_title,
        story_content: formData.story_content,
        mission_title: formData.mission_title,
        mission_content: formData.mission_content,
        vision_title: formData.vision_title,
        vision_content: formData.vision_content,
        values_title: formData.values_title,
        values: JSON.stringify(formData.values),
        team_title: formData.team_title,
        team_members: JSON.stringify(formData.team_members)
      };

      const success = await updateContent(updates);
      if (success) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      }
    } catch (error) {
      console.error('Error saving content:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleFileUpload = async (file, index) => {
    try {
      setUploading(true);
      
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast({
          title: 'Hata',
          description: 'Lütfen geçerli bir görsel dosyası seçin.',
          variant: 'destructive'
        });
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: 'Hata',
          description: 'Görsel boyutu 5MB\'dan küçük olmalıdır.',
          variant: 'destructive'
        });
        return;
      }

      // Create a unique file name
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      // Upload file to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from(BUCKET)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (uploadError) {
        throw uploadError;
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from(BUCKET)
        .getPublicUrl(filePath);

      // Update team member's image URL
      handleTeamMemberChange(index, 'image', publicUrl);
      
      toast({
        title: 'Başarılı',
        description: 'Fotoğraf başarıyla yüklendi.',
        variant: 'success'
      });
    } catch (error) {
      console.error('Error uploading file:', error);
      toast({
        title: 'Hata',
        description: 'Fotoğraf yüklenirken bir hata oluştu: ' + error.message,
        variant: 'destructive'
      });
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e, index) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      handleFileUpload(file, index);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleFileSelect = (e, index) => {
    const file = e.target.files[0];
    if (file) {
      handleFileUpload(file, index);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Hakkımızda Sayfası Düzenle</h1>
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 focus:ring-2 focus:ring-green-300 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {saving ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              Kaydediliyor...
            </>
          ) : (
            <>
              <Save className="h-5 w-5" />
              Kaydet
            </>
          )}
        </button>
      </div>

      {saveSuccess && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-green-50 border-l-4 border-green-500 p-4 mb-6 rounded-lg"
        >
          <p className="text-green-700">Değişiklikler başarıyla kaydedildi!</p>
        </motion.div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Hero Section */}
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Hero Bölümü</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Başlık
              </label>
              <input
                type="text"
                name="hero_title"
                value={formData.hero_title}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-300 focus:border-primary-500 transition-all duration-300"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Alt Başlık
              </label>
              <input
                type="text"
                name="hero_subtitle"
                value={formData.hero_subtitle}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-300 focus:border-primary-500 transition-all duration-300"
              />
            </div>
          </div>
        </div>

        {/* Story Section */}
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Hikaye Bölümü</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Başlık
              </label>
              <input
                type="text"
                name="story_title"
                value={formData.story_title}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-300 focus:border-primary-500 transition-all duration-300"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                İçerik
              </label>
              <textarea
                name="story_content"
                value={formData.story_content}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-300 focus:border-primary-500 transition-all duration-300"
              />
            </div>
          </div>
        </div>

        {/* Mission & Vision */}
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Misyon</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Başlık
              </label>
              <input
                type="text"
                name="mission_title"
                value={formData.mission_title}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-300 focus:border-primary-500 transition-all duration-300"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                İçerik
              </label>
              <textarea
                name="mission_content"
                value={formData.mission_content}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-300 focus:border-primary-500 transition-all duration-300"
              />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Vizyon</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Başlık
              </label>
              <input
                type="text"
                name="vision_title"
                value={formData.vision_title}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-300 focus:border-primary-500 transition-all duration-300"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                İçerik
              </label>
              <textarea
                name="vision_content"
                value={formData.vision_content}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-300 focus:border-primary-500 transition-all duration-300"
              />
            </div>
          </div>
        </div>

        {/* Values */}
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Değerler</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Başlık
              </label>
              <input
                type="text"
                name="values_title"
                value={formData.values_title}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-300 focus:border-primary-500 transition-all duration-300"
              />
            </div>
            {formData.values.map((value, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <h3 className="text-lg font-medium text-gray-900 mb-3">
                  Değer {index + 1}
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Başlık
                    </label>
                    <input
                      type="text"
                      value={value.title}
                      onChange={(e) => handleValueChange(index, 'title', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-300 focus:border-primary-500 transition-all duration-300"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Açıklama
                    </label>
                    <textarea
                      value={value.description}
                      onChange={(e) => handleValueChange(index, 'description', e.target.value)}
                      rows={2}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-300 focus:border-primary-500 transition-all duration-300"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      İkon (emoji)
                    </label>
                    <input
                      type="text"
                      value={value.icon}
                      onChange={(e) => handleValueChange(index, 'icon', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-300 focus:border-primary-500 transition-all duration-300"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Team */}
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Ekip</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Başlık
              </label>
              <input
                type="text"
                name="team_title"
                value={formData.team_title}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-300 focus:border-primary-500 transition-all duration-300"
              />
            </div>
            {formData.team_members.map((member, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <h3 className="text-lg font-medium text-gray-900 mb-3">
                  Ekip Üyesi {index + 1}
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      İsim
                    </label>
                    <input
                      type="text"
                      value={member.name}
                      onChange={(e) => handleTeamMemberChange(index, 'name', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-300 focus:border-primary-500 transition-all duration-300"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Pozisyon
                    </label>
                    <input
                      type="text"
                      value={member.position}
                      onChange={(e) => handleTeamMemberChange(index, 'position', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-300 focus:border-primary-500 transition-all duration-300"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Fotoğraf
                    </label>
                    <div
                      className={`relative border-2 border-dashed rounded-lg p-4 text-center ${
                        member.image ? 'border-primary-300' : 'border-gray-300'
                      }`}
                      onDrop={(e) => handleDrop(e, index)}
                      onDragOver={handleDragOver}
                    >
                      {member.image ? (
                        <div className="relative">
                          <img
                            src={member.image}
                            alt={member.name}
                            className="w-32 h-32 object-cover rounded-lg mx-auto"
                          />
                          <button
                            onClick={() => handleTeamMemberChange(index, 'image', '')}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <UploadCloud className="mx-auto h-12 w-12 text-gray-400" />
                          <div className="text-sm text-gray-600">
                            <span className="font-medium text-primary-600 hover:text-primary-500">
                              Fotoğraf yüklemek için tıklayın
                            </span>{' '}
                            veya sürükleyip bırakın
                          </div>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleFileSelect(e, index)}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Biyografi
                    </label>
                    <textarea
                      value={member.bio}
                      onChange={(e) => handleTeamMemberChange(index, 'bio', e.target.value)}
                      rows={2}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-300 focus:border-primary-500 transition-all duration-300"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Deneyim (her satıra bir deneyim)
                    </label>
                    <textarea
                      value={member.experience.join('\n')}
                      onChange={(e) => handleTeamMemberChange(index, 'experience', e.target.value.split('\n'))}
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-300 focus:border-primary-500 transition-all duration-300"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Eğitim (her satıra bir eğitim)
                    </label>
                    <textarea
                      value={member.education.join('\n')}
                      onChange={(e) => handleTeamMemberChange(index, 'education', e.target.value.split('\n'))}
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-300 focus:border-primary-500 transition-all duration-300"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Yetenekler (virgülle ayırın)
                    </label>
                    <input
                      type="text"
                      value={member.skills.join(', ')}
                      onChange={(e) => handleTeamMemberChange(index, 'skills', e.target.value.split(',').map(s => s.trim()))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-300 focus:border-primary-500 transition-all duration-300"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAboutPage; 