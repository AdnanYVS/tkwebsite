import React, { useState } from 'react';
    import { motion } from 'framer-motion';
    import { Button } from '@/components/ui/button';
    import { Input } from '@/components/ui/input';
    import { Textarea } from '@/components/ui/textarea'; 
    import { useToast } from '@/components/ui/use-toast';
    import { Send, Mail, Phone, User, MessageSquare, Sparkles, Loader2 } from 'lucide-react';
    import { supabase } from '@/lib/supabaseClient';

    const CallToActionSection = ({ content }) => {
      const { toast } = useToast();
      const [formData, setFormData] = useState({
        name: '',
        surname: '',
        phone: '',
        email: '',
        message: ''
      });
      const [loading, setLoading] = useState(false);
      
      const sectionTitle = content?.cta_section_title || "Bizimle İletişime Geçin";
      const sectionIntro = content?.cta_section_intro || "Sorularınız, önerileriniz veya işbirliği teklifleriniz mi var? Aşağıdaki formu doldurarak bize ulaşabilirsiniz.";


      const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
          ...prevState,
          [name]: value
        }));
      };

      const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
          const { data: messageData, error: insertError } = await supabase
            .from('contact_messages')
            .insert([
              { 
                name: formData.name,
                surname: formData.surname,
                phone: formData.phone,
                email: formData.email,
                message: formData.message
              }
            ])
            .select()
            .single();

          if (insertError) {
            throw insertError;
          }
          
          toast({
            title: "Mesajınız Gönderildi!",
            description: "En kısa sürede sizinle iletişime geçeceğiz.",
            variant: "success",
          });

          if (messageData) {
            const { error: functionError } = await supabase.functions.invoke('send-contact-email', {
              body: { record: messageData },
            });

            if (functionError) {
              console.error('Error invoking send-contact-email function:', functionError);
              toast({
                title: "E-posta Gönderim Hatası",
                description: "Mesajınız veritabanına kaydedildi ancak e-posta gönderilirken bir sorun oluştu. Lütfen daha sonra tekrar deneyin veya doğrudan e-posta gönderin.",
                variant: "warning",
              });
            }
          }
          
          setFormData({ name: '', surname: '', phone: '', email: '', message: '' });

        } catch (error) {
          console.error('Error submitting contact form:', error);
          toast({
            title: "Gönderim Başarısız",
            description: error.message || "Mesajınız gönderilirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.",
            variant: "destructive",
          });
        } finally {
          setLoading(false);
        }
      };

      return (
        <section id="cta" className="py-20 md:py-32 bg-gradient-to-br from-green-600 via-lime-600 to-amber-600 text-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="max-w-3xl mx-auto bg-white/90 backdrop-blur-md p-8 md:p-12 rounded-2xl shadow-2xl text-gray-800"
            >
              <div className="flex justify-center mb-6">
                <Sparkles size={48} className="text-primary animate-pulse" />
              </div>
              <h2 className="text-3xl md:text-4xl font-heading font-extrabold mb-4 text-center text-primary"
                dangerouslySetInnerHTML={{ __html: sectionTitle.replace(/\n/g, '<br />') }}
              />
              <p className="text-md md:text-lg mb-8 text-center text-gray-600"
                dangerouslySetInnerHTML={{ __html: sectionIntro.replace(/\n/g, '<br />') }}
              />
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input 
                      type="text" 
                      name="name" 
                      placeholder="Adınız" 
                      value={formData.name}
                      onChange={handleChange}
                      required 
                      className="pl-10 border-gray-300 focus:border-primary focus:ring-primary bg-white" 
                      disabled={loading}
                    />
                  </div>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input 
                      type="text" 
                      name="surname" 
                      placeholder="Soyadınız" 
                      value={formData.surname}
                      onChange={handleChange}
                      required 
                      className="pl-10 border-gray-300 focus:border-primary focus:ring-primary bg-white" 
                      disabled={loading}
                    />
                  </div>
                </div>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input 
                    type="tel" 
                    name="phone" 
                    placeholder="Telefon Numaranız (İsteğe Bağlı)" 
                    value={formData.phone}
                    onChange={handleChange}
                    className="pl-10 border-gray-300 focus:border-primary focus:ring-primary bg-white" 
                    disabled={loading}
                  />
                </div>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input 
                    type="email" 
                    name="email" 
                    placeholder="E-posta Adresiniz" 
                    value={formData.email}
                    onChange={handleChange}
                    required 
                    className="pl-10 border-gray-300 focus:border-primary focus:ring-primary bg-white" 
                    disabled={loading}
                  />
                </div>
                <div className="relative">
                  <MessageSquare className="absolute left-3 top-5 h-5 w-5 text-gray-400" />
                  <Textarea 
                    name="message" 
                    placeholder="Mesajınız..." 
                    rows="5" 
                    value={formData.message}
                    onChange={handleChange}
                    required 
                    className="pl-10 border-gray-300 focus:border-primary focus:ring-primary bg-white resize-none" 
                    disabled={loading}
                  />
                </div>
                <Button 
                  type="submit"
                  size="lg" 
                  className="w-full bg-gradient-to-r from-primary to-green-600 hover:from-primary/90 hover:to-green-600/90 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 group"
                  disabled={loading}
                >
                  {loading ? (
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  ) : (
                    <Send className="mr-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  )}
                  {loading ? "Gönderiliyor..." : "Mesajı Gönder"}
                </Button>
              </form>
              <div className="mt-8 text-center">
                <p className="text-sm text-gray-500">Mesajınız doğrudan bize ulaşacaktır.</p>
                <p className="text-sm text-gray-500">Alternatif olarak, her zaman <a href="mailto:info@tarimkafasi.com" className="text-primary hover:underline font-medium">info@tarimkafasi.com</a> adresine e-posta gönderebilirsiniz.</p>
              </div>
            </motion.div>
          </div>
        </section>
      );
    };

    export default CallToActionSection;