'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, Plus, Trash2 } from 'lucide-react';
import Link from 'next/link';
import type { Model } from '@/types';
import ImageUpload from '@/components/admin/ImageUpload';
import MultiImageUpload from '@/components/admin/MultiImageUpload';

export default function EditModelPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState<Partial<Model>>({
    name: '',
    nameKr: '',
    slug: '',
    category: 'women',
    featured: false,
    profileImage: '',
    galleryImages: [],
    stats: {
      height: '',
      bust: '',
      waist: '',
      hips: '',
      shoes: '',
      eyes: '',
      hair: '',
    },
    location: '',
    bio: '',
    experience: [],
    social: { instagram: '' },
    active: true,
  });

  useEffect(() => {
    fetchModel();
  }, [id]);

  const fetchModel = async () => {
    try {
      const res = await fetch(`/api/models/${id}`);
      const data = await res.json();
      if (data.success) {
        setFormData(data.data);
      }
    } catch (error) {
      console.error('Error fetching model:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const res = await fetch(`/api/models/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        router.push('/admin/models');
      } else {
        alert('Failed to update model');
      }
    } catch (error) {
      console.error('Error updating model:', error);
      alert('Failed to update model');
    } finally {
      setSaving(false);
    }
  };

  const addExperience = () => {
    setFormData({
      ...formData,
      experience: [...(formData.experience || []), { brand: '', year: '' }],
    });
  };

  const removeExperience = (index: number) => {
    setFormData({
      ...formData,
      experience: formData.experience?.filter((_, i) => i !== index) || [],
    });
  };

  const updateExperience = (index: number, field: 'brand' | 'year', value: string) => {
    const updatedExp = [...(formData.experience || [])];
    updatedExp[index] = { ...updatedExp[index], [field]: value };
    setFormData({ ...formData, experience: updatedExp });
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
      <div className="flex items-center gap-4 mb-8">
        <Link
          href="/admin/models"
          className="p-2 hover:bg-[var(--text)]/10 rounded-lg transition-colors"
        >
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="font-serif text-3xl">Edit Model</h1>
          <p className="text-[var(--text-muted)]">{formData.name}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Info */}
        <section className="border border-[var(--text)]/10 rounded-lg p-6">
          <h2 className="font-serif text-xl mb-4">Basic Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs tracking-wider uppercase text-[var(--text-muted)] mb-2">
                Name (English) *
              </label>
              <input
                type="text"
                value={formData.name || ''}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 bg-transparent border border-[var(--text)]/20 rounded-lg focus:outline-none focus:border-[var(--text)]"
                required
              />
            </div>
            <div>
              <label className="block text-xs tracking-wider uppercase text-[var(--text-muted)] mb-2">
                Name (Korean)
              </label>
              <input
                type="text"
                value={formData.nameKr || ''}
                onChange={(e) => setFormData({ ...formData, nameKr: e.target.value })}
                className="w-full px-4 py-3 bg-transparent border border-[var(--text)]/20 rounded-lg focus:outline-none focus:border-[var(--text)]"
              />
            </div>
            <div>
              <label className="block text-xs tracking-wider uppercase text-[var(--text-muted)] mb-2">
                Category *
              </label>
              <select
                value={formData.category || 'women'}
                onChange={(e) => setFormData({ ...formData, category: e.target.value as 'women' | 'men' | 'new' })}
                className="w-full px-4 py-3 bg-transparent border border-[var(--text)]/20 rounded-lg focus:outline-none focus:border-[var(--text)]"
                required
              >
                <option value="women">Women</option>
                <option value="men">Men</option>
                <option value="new">New Faces</option>
              </select>
            </div>
            <div>
              <label className="block text-xs tracking-wider uppercase text-[var(--text-muted)] mb-2">
                Location
              </label>
              <input
                type="text"
                value={formData.location || ''}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full px-4 py-3 bg-transparent border border-[var(--text)]/20 rounded-lg focus:outline-none focus:border-[var(--text)]"
              />
            </div>
          </div>
        </section>

        {/* Images */}
        <section className="border border-[var(--text)]/10 rounded-lg p-6">
          <h2 className="font-serif text-xl mb-6">Images</h2>
          <div className="space-y-6">
            <div>
              <label className="block text-xs tracking-wider uppercase text-[var(--text-muted)] mb-3">
                Profile Image *
              </label>
              <ImageUpload
                value={formData.profileImage || ''}
                onChange={(url) => setFormData({ ...formData, profileImage: url })}
                folder="models"
                aspectRatio="portrait"
                placeholder="프로필 이미지 업로드"
              />
            </div>
            <div>
              <label className="block text-xs tracking-wider uppercase text-[var(--text-muted)] mb-3">
                Gallery Images
              </label>
              <MultiImageUpload
                values={formData.galleryImages || []}
                onChange={(urls) => setFormData({ ...formData, galleryImages: urls })}
                folder="models"
                maxImages={12}
                placeholder="갤러리 이미지 추가"
              />
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="border border-[var(--text)]/10 rounded-lg p-6">
          <h2 className="font-serif text-xl mb-4">Stats</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {['height', 'bust', 'waist', 'hips', 'shoes', 'eyes', 'hair'].map((stat) => (
              <div key={stat}>
                <label className="block text-xs tracking-wider uppercase text-[var(--text-muted)] mb-2">
                  {stat}
                </label>
                <input
                  type="text"
                  value={(formData.stats as unknown as Record<string, string>)?.[stat] || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      stats: { ...formData.stats, [stat]: e.target.value },
                    })
                  }
                  className="w-full px-4 py-3 bg-transparent border border-[var(--text)]/20 rounded-lg focus:outline-none focus:border-[var(--text)]"
                />
              </div>
            ))}
          </div>
        </section>

        {/* Bio */}
        <section className="border border-[var(--text)]/10 rounded-lg p-6">
          <h2 className="font-serif text-xl mb-4">Bio</h2>
          <textarea
            value={formData.bio || ''}
            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
            rows={4}
            className="w-full px-4 py-3 bg-transparent border border-[var(--text)]/20 rounded-lg focus:outline-none focus:border-[var(--text)] resize-none"
          />
        </section>

        {/* Experience */}
        <section className="border border-[var(--text)]/10 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-serif text-xl">Experience</h2>
            <button
              type="button"
              onClick={addExperience}
              className="flex items-center gap-2 px-3 py-1 text-xs border border-[var(--text)]/20 rounded hover:bg-[var(--text)]/5"
            >
              <Plus size={14} />
              Add
            </button>
          </div>
          <div className="space-y-3">
            {formData.experience?.map((exp, index) => (
              <div key={index} className="flex gap-4 items-center">
                <input
                  type="text"
                  value={exp.brand}
                  onChange={(e) => updateExperience(index, 'brand', e.target.value)}
                  placeholder="Brand"
                  className="flex-1 px-4 py-3 bg-transparent border border-[var(--text)]/20 rounded-lg focus:outline-none focus:border-[var(--text)]"
                />
                <input
                  type="text"
                  value={exp.year}
                  onChange={(e) => updateExperience(index, 'year', e.target.value)}
                  placeholder="Year"
                  className="w-24 px-4 py-3 bg-transparent border border-[var(--text)]/20 rounded-lg focus:outline-none focus:border-[var(--text)]"
                />
                <button
                  type="button"
                  onClick={() => removeExperience(index)}
                  className="p-3 text-red-500 hover:bg-red-500/10 rounded-lg"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
            {formData.experience?.length === 0 && (
              <p className="text-sm text-[var(--text-muted)] text-center py-4">
                No experience added yet. Click &quot;Add&quot; to add experience.
              </p>
            )}
          </div>
        </section>

        {/* Social */}
        <section className="border border-[var(--text)]/10 rounded-lg p-6">
          <h2 className="font-serif text-xl mb-4">Social</h2>
          <div>
            <label className="block text-xs tracking-wider uppercase text-[var(--text-muted)] mb-2">
              Instagram
            </label>
            <input
              type="text"
              value={formData.social?.instagram || ''}
              onChange={(e) => setFormData({ ...formData, social: { ...formData.social, instagram: e.target.value } })}
              placeholder="@username"
              className="w-full px-4 py-3 bg-transparent border border-[var(--text)]/20 rounded-lg focus:outline-none focus:border-[var(--text)]"
            />
          </div>
        </section>

        {/* Options */}
        <section className="border border-[var(--text)]/10 rounded-lg p-6">
          <h2 className="font-serif text-xl mb-4">Options</h2>
          <div className="flex flex-wrap gap-6">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.featured || false}
                onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                className="w-4 h-4"
              />
              <span className="text-sm">Featured Model</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.active !== false}
                onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                className="w-4 h-4"
              />
              <span className="text-sm">Active (visible on site)</span>
            </label>
          </div>
        </section>

        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-6 py-3 bg-theme-inverse text-theme-inverse rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            <Save size={18} />
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
          <Link
            href="/admin/models"
            className="px-6 py-3 border border-[var(--text)]/20 rounded-lg hover:bg-[var(--text)]/5 transition-colors"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
