'use client';

import { useState, useEffect } from 'react';
import { Save, Plus, Trash2 } from 'lucide-react';
import type { Settings } from '@/types';

export default function SettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState<Settings>({
    id: '',
    site: { name: '', tagline: '' },
    contact: { email: '', phone: '', businessHours: '' },
    offices: [],
    social: {},
    partners: [],
  });
  const [newPartner, setNewPartner] = useState('');

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/settings');
      const data = await res.json();
      if (data.success) {
        setSettings(data.data);
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });

      if (res.ok) {
        alert('Settings saved successfully!');
      } else {
        alert('Failed to save settings');
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const addOffice = () => {
    setSettings({
      ...settings,
      offices: [...(settings.offices || []), { city: '', address: '' }],
    });
  };

  const removeOffice = (index: number) => {
    setSettings({
      ...settings,
      offices: settings.offices?.filter((_, i) => i !== index) || [],
    });
  };

  const updateOffice = (index: number, field: 'city' | 'address', value: string) => {
    const updatedOffices = [...(settings.offices || [])];
    updatedOffices[index] = { ...updatedOffices[index], [field]: value };
    setSettings({ ...settings, offices: updatedOffices });
  };

  const addPartner = () => {
    if (newPartner.trim()) {
      setSettings({
        ...settings,
        partners: [...(settings.partners || []), newPartner.trim()],
      });
      setNewPartner('');
    }
  };

  const removePartner = (index: number) => {
    setSettings({
      ...settings,
      partners: settings.partners?.filter((_, i) => i !== index) || [],
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--text)]"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl">
      <div className="mb-8">
        <h1 className="font-serif text-3xl mb-2">Settings</h1>
        <p className="text-[var(--text-muted)]">Manage your site settings</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Site Settings */}
        <section className="border border-[var(--text)]/10 rounded-lg p-6">
          <h2 className="font-serif text-xl mb-4">Site Information</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-xs tracking-wider uppercase text-[var(--text-muted)] mb-2">
                Site Name
              </label>
              <input
                type="text"
                value={settings.site?.name || ''}
                onChange={(e) =>
                  setSettings({ ...settings, site: { ...settings.site, name: e.target.value } })
                }
                className="w-full px-4 py-3 bg-transparent border border-[var(--text)]/20 rounded-lg focus:outline-none focus:border-[var(--text)]"
              />
            </div>
            <div>
              <label className="block text-xs tracking-wider uppercase text-[var(--text-muted)] mb-2">
                Tagline
              </label>
              <input
                type="text"
                value={settings.site?.tagline || ''}
                onChange={(e) =>
                  setSettings({ ...settings, site: { ...settings.site, tagline: e.target.value } })
                }
                className="w-full px-4 py-3 bg-transparent border border-[var(--text)]/20 rounded-lg focus:outline-none focus:border-[var(--text)]"
              />
            </div>
          </div>
        </section>

        {/* Contact Settings */}
        <section className="border border-[var(--text)]/10 rounded-lg p-6">
          <h2 className="font-serif text-xl mb-4">Contact Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs tracking-wider uppercase text-[var(--text-muted)] mb-2">
                Email
              </label>
              <input
                type="email"
                value={settings.contact?.email || ''}
                onChange={(e) =>
                  setSettings({ ...settings, contact: { ...settings.contact, email: e.target.value } })
                }
                className="w-full px-4 py-3 bg-transparent border border-[var(--text)]/20 rounded-lg focus:outline-none focus:border-[var(--text)]"
              />
            </div>
            <div>
              <label className="block text-xs tracking-wider uppercase text-[var(--text-muted)] mb-2">
                Phone
              </label>
              <input
                type="tel"
                value={settings.contact?.phone || ''}
                onChange={(e) =>
                  setSettings({ ...settings, contact: { ...settings.contact, phone: e.target.value } })
                }
                className="w-full px-4 py-3 bg-transparent border border-[var(--text)]/20 rounded-lg focus:outline-none focus:border-[var(--text)]"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs tracking-wider uppercase text-[var(--text-muted)] mb-2">
                Business Hours
              </label>
              <input
                type="text"
                value={settings.contact?.businessHours || ''}
                onChange={(e) =>
                  setSettings({ ...settings, contact: { ...settings.contact, businessHours: e.target.value } })
                }
                placeholder="e.g., Mon - Fri, 10:00 - 19:00"
                className="w-full px-4 py-3 bg-transparent border border-[var(--text)]/20 rounded-lg focus:outline-none focus:border-[var(--text)]"
              />
            </div>
          </div>
        </section>

        {/* Social Links */}
        <section className="border border-[var(--text)]/10 rounded-lg p-6">
          <h2 className="font-serif text-xl mb-4">Social Links</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs tracking-wider uppercase text-[var(--text-muted)] mb-2">
                Instagram
              </label>
              <input
                type="url"
                value={settings.social?.instagram || ''}
                onChange={(e) =>
                  setSettings({ ...settings, social: { ...settings.social, instagram: e.target.value } })
                }
                placeholder="https://instagram.com/..."
                className="w-full px-4 py-3 bg-transparent border border-[var(--text)]/20 rounded-lg focus:outline-none focus:border-[var(--text)]"
              />
            </div>
            <div>
              <label className="block text-xs tracking-wider uppercase text-[var(--text-muted)] mb-2">
                LinkedIn
              </label>
              <input
                type="url"
                value={settings.social?.linkedin || ''}
                onChange={(e) =>
                  setSettings({ ...settings, social: { ...settings.social, linkedin: e.target.value } })
                }
                placeholder="https://linkedin.com/..."
                className="w-full px-4 py-3 bg-transparent border border-[var(--text)]/20 rounded-lg focus:outline-none focus:border-[var(--text)]"
              />
            </div>
          </div>
        </section>

        {/* Offices */}
        <section className="border border-[var(--text)]/10 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-serif text-xl">Offices</h2>
            <button
              type="button"
              onClick={addOffice}
              className="flex items-center gap-2 px-3 py-1 text-xs border border-[var(--text)]/20 rounded hover:bg-[var(--text)]/5"
            >
              <Plus size={14} />
              Add Office
            </button>
          </div>
          <div className="space-y-4">
            {settings.offices?.map((office, index) => (
              <div key={index} className="flex gap-4 items-start">
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    value={office.city}
                    onChange={(e) => updateOffice(index, 'city', e.target.value)}
                    placeholder="City"
                    className="px-4 py-3 bg-transparent border border-[var(--text)]/20 rounded-lg focus:outline-none focus:border-[var(--text)]"
                  />
                  <input
                    type="text"
                    value={office.address}
                    onChange={(e) => updateOffice(index, 'address', e.target.value)}
                    placeholder="Address"
                    className="px-4 py-3 bg-transparent border border-[var(--text)]/20 rounded-lg focus:outline-none focus:border-[var(--text)]"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeOffice(index)}
                  className="p-3 text-red-500 hover:bg-red-500/10 rounded-lg"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Partners */}
        <section className="border border-[var(--text)]/10 rounded-lg p-6">
          <h2 className="font-serif text-xl mb-4">Partners</h2>
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              value={newPartner}
              onChange={(e) => setNewPartner(e.target.value)}
              placeholder="Add partner name"
              className="flex-1 px-4 py-3 bg-transparent border border-[var(--text)]/20 rounded-lg focus:outline-none focus:border-[var(--text)]"
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addPartner())}
            />
            <button
              type="button"
              onClick={addPartner}
              className="px-4 py-3 bg-theme-inverse text-theme-inverse rounded-lg hover:opacity-90"
            >
              <Plus size={18} />
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {settings.partners?.map((partner, index) => (
              <span
                key={index}
                className="flex items-center gap-2 px-3 py-1 bg-[var(--text)]/10 rounded-full text-sm"
              >
                {partner}
                <button
                  type="button"
                  onClick={() => removePartner(index)}
                  className="text-red-500 hover:text-red-400"
                >
                  <Trash2 size={12} />
                </button>
              </span>
            ))}
          </div>
        </section>

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-6 py-3 bg-theme-inverse text-theme-inverse rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            <Save size={18} />
            {saving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </form>
    </div>
  );
}
