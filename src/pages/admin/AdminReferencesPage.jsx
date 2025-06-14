import React, { useEffect, useState, useRef } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, UploadCloud, Trash2, GripVertical, Save } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const BUCKET = 'reference-logos';

const AdminReferencesPage = () => {
  const { toast } = useToast();
  const [logos, setLogos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [file, setFile] = useState(null);
  const [name, setName] = useState('');
  const [job, setJob] = useState('');
  const [editedJobs, setEditedJobs] = useState({});
  const fileInputRef = useRef();

  // Fetch logos from Supabase
  const fetchLogos = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('reference_logos')
      .select('*')
      .order('sort_order', { ascending: true });
    if (error) {
      toast({ title: 'Hata', description: error.message, variant: 'destructive' });
      setLogos([]);
    } else {
      setLogos(data || []);
      // Initialize editedJobs with current job values
      const initialEditedJobs = {};
      data?.forEach(logo => {
        initialEditedJobs[logo.id] = logo.job || '';
      });
      setEditedJobs(initialEditedJobs);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchLogos();
  }, []);

  // Upload logo to Supabase Storage and add to DB
  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    try {
      const fileName = `${Date.now()}_${file.name.replace(/\s+/g, '_')}`;
      const { error: uploadError } = await supabase.storage
        .from(BUCKET)
        .upload(fileName, file, { upsert: true });
      if (uploadError) throw uploadError;
      const { data: { publicUrl } } = supabase.storage.from(BUCKET).getPublicUrl(fileName);
      // Insert into DB
      const { error: dbError } = await supabase
        .from('reference_logos')
        .insert({ 
          name, 
          logo_url: publicUrl, 
          sort_order: logos.length,
          job: job || null 
        });
      if (dbError) throw dbError;
      toast({ title: 'Başarılı', description: 'Logo ve iş bilgisi eklendi.', variant: 'success' });
      setFile(null);
      setName('');
      setJob('');
      if (fileInputRef.current) fileInputRef.current.value = '';
      fetchLogos();
    } catch (err) {
      toast({ title: 'Hata', description: err.message, variant: 'destructive' });
    } finally {
      setUploading(false);
    }
  };

  // Delete logo from DB and Storage
  const handleDelete = async (id, logoUrl) => {
    if (!window.confirm('Bu logoyu silmek istediğinize emin misiniz?')) return;
    // Remove from storage
    const path = logoUrl.split(`/${BUCKET}/`)[1];
    if (path) {
      await supabase.storage.from(BUCKET).remove([path]);
    }
    // Remove from DB
    const { error } = await supabase.from('reference_logos').delete().eq('id', id);
    if (error) {
      toast({ title: 'Hata', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Başarılı', description: 'Logo silindi.', variant: 'success' });
      fetchLogos();
    }
  };

  // Update job information
  const handleUpdateJob = async (id) => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from('reference_logos')
        .update({ job: editedJobs[id] })
        .eq('id', id);
      
      if (error) {
        toast({ title: 'Hata', description: error.message, variant: 'destructive' });
      } else {
        toast({ title: 'Başarılı', description: 'İş bilgisi güncellendi.', variant: 'success' });
        fetchLogos();
      }
    } catch (err) {
      toast({ title: 'Hata', description: err.message, variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  // Handle job text change
  const handleJobChange = (id, value) => {
    setEditedJobs(prev => ({
      ...prev,
      [id]: value
    }));
  };

  // Drag & drop reordering (simple version)
  const handleReorder = async (fromIdx, toIdx) => {
    if (fromIdx === toIdx) return;
    const updated = [...logos];
    const [moved] = updated.splice(fromIdx, 1);
    updated.splice(toIdx, 0, moved);
    setLogos(updated);
    // Update sort_order in DB
    for (let i = 0; i < updated.length; i++) {
      await supabase.from('reference_logos').update({ sort_order: i }).eq('id', updated[i].id);
    }
    fetchLogos();
  };

  return (
    <div className="max-w-2xl mx-auto py-10">
      <Card className="shadow-xl border-gray-200">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-primary">Referans Logoları</CardTitle>
          <p className="text-gray-600 mt-2">Buradan ana sayfa referans logolarını ekleyebilir, silebilir ve sıralayabilirsiniz.</p>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 mb-6">
            <div className="flex items-center gap-4">
              <Input
                type="file"
                accept="image/*"
                onChange={e => setFile(e.target.files[0])}
                ref={fileInputRef}
                className="w-auto"
                disabled={uploading}
              />
              <Input
                type="text"
                placeholder="Firma/Logo Adı"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-48"
                disabled={uploading}
              />
            </div>
            <Textarea
              placeholder="Yapılan İş Bilgisi"
              value={job}
              onChange={e => setJob(e.target.value)}
              className="w-full"
              disabled={uploading}
              rows={3}
            />
            <Button onClick={handleUpload} disabled={uploading || !file} className="bg-primary text-white">
              {uploading ? <Loader2 size={18} className="animate-spin mr-2" /> : <UploadCloud size={18} className="mr-2" />}
              Logo ve İş Bilgisi Ekle
            </Button>
          </div>
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-3 text-gray-600">Logolar yükleniyor...</span>
            </div>
          ) : (
            <ul className="space-y-4">
              {logos.map((logo, idx) => (
                <li key={logo.id} className="flex flex-col gap-4 bg-gray-50 rounded-lg p-4 shadow-sm">
                  <div className="flex items-center gap-4">
                    <span className="cursor-move" title="Sürükle-bırak ile sırala">
                      <GripVertical size={20} />
                    </span>
                    <img src={logo.logo_url} alt={logo.name || `Logo ${idx + 1}`} className="h-12 w-auto object-contain bg-white rounded shadow p-2" />
                    <span className="flex-1 text-gray-700">{logo.name || <span className="italic text-gray-400">Adsız</span>}</span>
                    <Button type="button" variant="destructive" size="icon" onClick={() => handleDelete(logo.id, logo.logo_url)}>
                      <Trash2 size={18} />
                    </Button>
                  </div>
                  <div className="pl-12 space-y-2">
                    <Textarea
                      placeholder="Yapılan İş Bilgisi"
                      value={editedJobs[logo.id] || ''}
                      onChange={e => handleJobChange(logo.id, e.target.value)}
                      className="w-full"
                      rows={2}
                    />
                    <Button
                      onClick={() => handleUpdateJob(logo.id)}
                      disabled={saving}
                      className="bg-green-500 hover:bg-green-600 text-white"
                    >
                      {saving ? (
                        <Loader2 size={18} className="animate-spin mr-2" />
                      ) : (
                        <Save size={18} className="mr-2" />
                      )}
                      Kaydet
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
        <CardFooter>
          <p className="text-xs text-gray-500">Logoları sürükleyerek sıralayabilirsiniz.</p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default AdminReferencesPage; 