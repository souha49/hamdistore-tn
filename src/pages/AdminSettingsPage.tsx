import { useState, useEffect } from 'react';
import { Save, Upload, X } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { SiteSettings } from '../lib/database.types';
import { useSettings } from '../contexts/SettingsContext';

const COLOR_PALETTES = [
  { name: 'Blue', primary: '#2563eb', secondary: '#1e40af' },
  { name: 'Red', primary: '#dc2626', secondary: '#991b1b' },
  { name: 'Green', primary: '#16a34a', secondary: '#15803d' },
  { name: 'Orange', primary: '#ea580c', secondary: '#c2410c' },
  { name: 'Purple', primary: '#9333ea', secondary: '#7e22ce' },
  { name: 'Pink', primary: '#ec4899', secondary: '#db2777' },
  { name: 'Teal', primary: '#14b8a6', secondary: '#0f766e' },
  { name: 'Yellow', primary: '#eab308', secondary: '#ca8a04' },
  { name: 'Gray', primary: '#6b7280', secondary: '#374151' },
  { name: 'Black', primary: '#1f2937', secondary: '#111827' },
];

export function AdminSettingsPage() {
  const { refreshSettings } = useSettings();
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [uploadingHero, setUploadingHero] = useState(false);
  const [uploadingSectionFemme, setUploadingSectionFemme] = useState(false);
  const [uploadingSectionHomme, setUploadingSectionHomme] = useState(false);
  const [uploadingSectionCollection, setUploadingSectionCollection] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  async function loadSettings() {
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .maybeSingle();

      if (error) throw error;
      if (data) setSettings(data);
    } catch (error) {
      console.error('Error loading settings:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleHeroImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !settings) return;

    if (!file.type.startsWith('image/')) {
      setMessage('Veuillez sélectionner un fichier image valide.');
      return;
    }

    setUploadingHero(true);
    setMessage('');

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `hero-${Date.now()}.${fileExt}`;
      const filePath = fileName;

      const { error: uploadError } = await supabase.storage
        .from('hero-images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        console.error('Upload error details:', uploadError);
        throw new Error(`Erreur de téléchargement: ${uploadError.message}`);
      }

      const { data: { publicUrl } } = supabase.storage
        .from('hero-images')
        .getPublicUrl(filePath);

      setSettings({ ...settings, hero_image_url: publicUrl });
      setMessage('Image téléchargée! Cliquez sur "Save Settings" pour enregistrer.');
      setTimeout(() => setMessage(''), 5000);
    } catch (error: any) {
      console.error('Error uploading hero image:', error);
      setMessage(error.message || 'Erreur lors du téléchargement de l\'image. Veuillez réessayer.');
    } finally {
      setUploadingHero(false);
    }
  }

  async function handleRemoveHeroImage() {
    if (!settings) return;
    setSettings({ ...settings, hero_image_url: null });
  }

  async function handleSectionImageUpload(
    e: React.ChangeEvent<HTMLInputElement>,
    section: 'femme' | 'homme' | 'collection'
  ) {
    const file = e.target.files?.[0];
    if (!file || !settings) return;

    if (!file.type.startsWith('image/')) {
      setMessage('Veuillez sélectionner un fichier image valide.');
      return;
    }

    const setUploading =
      section === 'femme' ? setUploadingSectionFemme :
      section === 'homme' ? setUploadingSectionHomme :
      setUploadingSectionCollection;

    setUploading(true);
    setMessage('');

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `section-${section}-${Date.now()}.${fileExt}`;
      const filePath = fileName;

      const { error: uploadError } = await supabase.storage
        .from('section-images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        console.error('Upload error details:', uploadError);
        throw new Error(`Erreur de téléchargement: ${uploadError.message}`);
      }

      const { data: { publicUrl } } = supabase.storage
        .from('section-images')
        .getPublicUrl(filePath);

      const fieldName =
        section === 'femme' ? 'section_femme_image_url' :
        section === 'homme' ? 'section_homme_image_url' :
        'section_collection_image_url';

      setSettings({ ...settings, [fieldName]: publicUrl });
      setMessage('Image téléchargée! Cliquez sur "Save Settings" pour enregistrer.');
      setTimeout(() => setMessage(''), 5000);
    } catch (error: any) {
      console.error('Error uploading section image:', error);
      setMessage(error.message || 'Erreur lors du téléchargement de l\'image. Veuillez réessayer.');
    } finally {
      setUploading(false);
    }
  }

  async function handleRemoveSectionImage(section: 'femme' | 'homme' | 'collection') {
    if (!settings) return;
    const fieldName =
      section === 'femme' ? 'section_femme_image_url' :
      section === 'homme' ? 'section_homme_image_url' :
      'section_collection_image_url';
    setSettings({ ...settings, [fieldName]: null });
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!settings) return;

    setSaving(true);
    setMessage('');

    try {
      console.log('Saving settings:', settings);

      const { data, error } = await supabase
        .from('site_settings')
        .update({
          store_name: settings.store_name,
          logo_url: settings.logo_url,
          hero_image_url: settings.hero_image_url,
          section_femme_image_url: settings.section_femme_image_url,
          section_homme_image_url: settings.section_homme_image_url,
          section_collection_image_url: settings.section_collection_image_url,
          primary_color: settings.primary_color,
          secondary_color: settings.secondary_color,
          header_style: settings.header_style,
          products_per_row_desktop: settings.products_per_row_desktop,
          products_per_row_tablet: settings.products_per_row_tablet,
          products_per_row_mobile: settings.products_per_row_mobile,
          updated_at: new Date().toISOString()
        })
        .eq('id', settings.id)
        .select();

      console.log('Update result:', { data, error });

      if (error) throw error;

      if (!data || data.length === 0) {
        throw new Error('Aucune ligne mise à jour. Vérifiez vos permissions.');
      }

      await refreshSettings();
      setMessage('Paramètres enregistrés avec succès!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error: any) {
      console.error('Error saving settings:', error);
      setMessage(`Erreur: ${error.message || 'Impossible de sauvegarder les paramètres.'}`);
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Loading settings...</div>
      </div>
    );
  }

  if (!settings) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-red-600">Failed to load settings</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Site Settings</h1>

          <form onSubmit={handleSave} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Store Name
              </label>
              <input
                type="text"
                value={settings.store_name}
                onChange={(e) => setSettings({ ...settings, store_name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Logo URL
              </label>
              <input
                type="url"
                value={settings.logo_url || ''}
                onChange={(e) => setSettings({ ...settings, logo_url: e.target.value })}
                placeholder="https://example.com/logo.png"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <p className="mt-1 text-sm text-gray-500">Leave empty to use store name as logo</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Hero Image (Homepage Cover)
              </label>

              <div className="space-y-4">
                {settings.hero_image_url && (
                  <div className="relative">
                    <img
                      src={settings.hero_image_url}
                      alt="Hero preview"
                      className="w-full max-w-2xl h-64 object-cover rounded-lg border border-gray-300"
                    />
                    <button
                      type="button"
                      onClick={handleRemoveHeroImage}
                      className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded-full hover:bg-red-700 transition-colors shadow-lg"
                      title="Remove image"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                )}

                <div>
                  <label className="cursor-pointer">
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition-colors">
                      <Upload className="w-12 h-12 mx-auto text-gray-400 mb-3" />
                      <p className="text-gray-600 mb-1">
                        {uploadingHero ? 'Uploading...' : settings.hero_image_url ? 'Click to replace hero image' : 'Click to upload hero image'}
                      </p>
                      <p className="text-sm text-gray-500">
                        PNG, JPG or WEBP (recommended size: 1920x700px)
                      </p>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleHeroImageUpload}
                      disabled={uploadingHero}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
            </div>

            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Section Cover Images</h3>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Pour Elle Section Image
                  </label>
                  <div className="space-y-4">
                    {settings.section_femme_image_url && (
                      <div className="relative">
                        <img
                          src={settings.section_femme_image_url}
                          alt="Section Femme preview"
                          className="w-full max-w-2xl h-48 object-cover rounded-lg border border-gray-300"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveSectionImage('femme')}
                          className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded-full hover:bg-red-700 transition-colors shadow-lg"
                          title="Remove image"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    )}
                    <div>
                      <label className="cursor-pointer">
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition-colors">
                          <Upload className="w-10 h-10 mx-auto text-gray-400 mb-2" />
                          <p className="text-gray-600 text-sm mb-1">
                            {uploadingSectionFemme ? 'Uploading...' : settings.section_femme_image_url ? 'Replace image' : 'Upload image'}
                          </p>
                          <p className="text-xs text-gray-500">PNG, JPG or WEBP (1920x600px)</p>
                        </div>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleSectionImageUpload(e, 'femme')}
                          disabled={uploadingSectionFemme}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Pour Lui Section Image
                  </label>
                  <div className="space-y-4">
                    {settings.section_homme_image_url && (
                      <div className="relative">
                        <img
                          src={settings.section_homme_image_url}
                          alt="Section Homme preview"
                          className="w-full max-w-2xl h-48 object-cover rounded-lg border border-gray-300"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveSectionImage('homme')}
                          className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded-full hover:bg-red-700 transition-colors shadow-lg"
                          title="Remove image"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    )}
                    <div>
                      <label className="cursor-pointer">
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition-colors">
                          <Upload className="w-10 h-10 mx-auto text-gray-400 mb-2" />
                          <p className="text-gray-600 text-sm mb-1">
                            {uploadingSectionHomme ? 'Uploading...' : settings.section_homme_image_url ? 'Replace image' : 'Upload image'}
                          </p>
                          <p className="text-xs text-gray-500">PNG, JPG or WEBP (1920x600px)</p>
                        </div>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleSectionImageUpload(e, 'homme')}
                          disabled={uploadingSectionHomme}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Collection 2024 Section Image
                  </label>
                  <div className="space-y-4">
                    {settings.section_collection_image_url && (
                      <div className="relative">
                        <img
                          src={settings.section_collection_image_url}
                          alt="Section Collection preview"
                          className="w-full max-w-2xl h-48 object-cover rounded-lg border border-gray-300"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveSectionImage('collection')}
                          className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded-full hover:bg-red-700 transition-colors shadow-lg"
                          title="Remove image"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    )}
                    <div>
                      <label className="cursor-pointer">
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition-colors">
                          <Upload className="w-10 h-10 mx-auto text-gray-400 mb-2" />
                          <p className="text-gray-600 text-sm mb-1">
                            {uploadingSectionCollection ? 'Uploading...' : settings.section_collection_image_url ? 'Replace image' : 'Upload image'}
                          </p>
                          <p className="text-xs text-gray-500">PNG, JPG or WEBP (1920x400px)</p>
                        </div>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleSectionImageUpload(e, 'collection')}
                          disabled={uploadingSectionCollection}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Brand Colors
              </label>

              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-3">Choose a color palette:</p>
                <div className="grid grid-cols-5 gap-3">
                  {COLOR_PALETTES.map((palette) => (
                    <button
                      key={palette.name}
                      type="button"
                      onClick={() => setSettings({
                        ...settings,
                        primary_color: palette.primary,
                        secondary_color: palette.secondary
                      })}
                      className={`group relative rounded-lg border-2 p-3 hover:shadow-lg transition-all ${
                        settings.primary_color === palette.primary
                          ? 'border-gray-900 shadow-md'
                          : 'border-gray-200 hover:border-gray-400'
                      }`}
                      title={palette.name}
                    >
                      <div className="flex gap-1">
                        <div
                          className="w-full h-12 rounded"
                          style={{ backgroundColor: palette.primary }}
                        />
                        <div
                          className="w-full h-12 rounded"
                          style={{ backgroundColor: palette.secondary }}
                        />
                      </div>
                      <p className="text-xs text-gray-600 text-center mt-2 font-medium">{palette.name}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div className="border-t pt-4 mt-4">
                <p className="text-sm text-gray-600 mb-3">Or customize your own colors:</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Primary Color
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={settings.primary_color}
                        onChange={(e) => setSettings({ ...settings, primary_color: e.target.value })}
                        className="h-10 w-16 border border-gray-300 rounded cursor-pointer"
                      />
                      <input
                        type="text"
                        value={settings.primary_color}
                        onChange={(e) => setSettings({ ...settings, primary_color: e.target.value })}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Secondary Color
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={settings.secondary_color}
                        onChange={(e) => setSettings({ ...settings, secondary_color: e.target.value })}
                        className="h-10 w-16 border border-gray-300 rounded cursor-pointer"
                      />
                      <input
                        type="text"
                        value={settings.secondary_color}
                        onChange={(e) => setSettings({ ...settings, secondary_color: e.target.value })}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Header Style
              </label>
              <select
                value={settings.header_style}
                onChange={(e) => setSettings({ ...settings, header_style: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="modern">Modern</option>
                <option value="classic">Classic</option>
                <option value="minimal">Minimal</option>
              </select>
            </div>

            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Grid Layout Settings</h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Desktop Columns
                  </label>
                  <select
                    value={settings.products_per_row_desktop}
                    onChange={(e) => setSettings({ ...settings, products_per_row_desktop: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="2">2 Columns</option>
                    <option value="3">3 Columns</option>
                    <option value="4">4 Columns</option>
                    <option value="5">5 Columns</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tablet Columns
                  </label>
                  <select
                    value={settings.products_per_row_tablet}
                    onChange={(e) => setSettings({ ...settings, products_per_row_tablet: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="2">2 Columns</option>
                    <option value="3">3 Columns</option>
                    <option value="4">4 Columns</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mobile Columns
                  </label>
                  <select
                    value={settings.products_per_row_mobile}
                    onChange={(e) => setSettings({ ...settings, products_per_row_mobile: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="1">1 Column</option>
                    <option value="2">2 Columns</option>
                    <option value="3">3 Columns</option>
                    <option value="4">4 Columns</option>
                  </select>
                </div>
              </div>
            </div>

            {message && (
              <div className={`p-4 rounded-lg ${message.includes('Error') ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
                {message}
              </div>
            )}

            <button
              type="submit"
              disabled={saving}
              className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Save className="w-5 h-5" />
              {saving ? 'Saving...' : 'Save Settings'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
