'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Plus, X } from 'lucide-react';
import Link from 'next/link';
import { generateSlug } from '@/lib/utils';
import ImageUpload from '@/components/admin/ImageUpload';
import MultiImageUpload from '@/components/admin/MultiImageUpload';
import MultiVideoUpload from '@/components/admin/MultiVideoUpload';
import type { ModelVideo } from '@/types';

export default function NewModelPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    nameKr: '',
    category: 'women',
    profileImage: '',
    galleryImages: [] as string[],
    galleryVideos: [] as ModelVideo[],
    stats: {
      height: '',
      bust: '',
      waist: '',
      hips: '',
      shoes: '',
      eyes: '',
      hair: '',
    },
    location: 'Seoul',
    bio: '',
    experience: [] as { brand: string; year: string }[],
    social: {
      instagram: '',
      youtube: '',
      tiktok: '',
      portfolioPdf: '',
    },
    featured: false,
    active: true,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const slug = generateSlug(formData.name);

      const res = await fetch('/api/models', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, slug }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to create model');
      }

      router.push('/admin/models');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const addExperience = () => {
    setFormData({
      ...formData,
      experience: [...formData.experience, { brand: '', year: '' }],
    });
  };

  const removeExperience = (index: number) => {
    setFormData({
      ...formData,
      experience: formData.experience.filter((_, i) => i !== index),
    });
  };

  const updateExperience = (index: number, field: string, value: string) => {
    const updated = [...formData.experience];
    updated[index] = { ...updated[index], [field]: value };
    setFormData({ ...formData, experience: updated });
  };

  return (
    <div className="max-w-4xl">
      <div className="flex items-center gap-4 mb-8">
        <Link
          href="/admin/models"
          className="p-2 border border-[var(--text)]/20 rounded-lg hover:bg-[var(--text)]/5"
        >
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="font-serif text-3xl">Add New Model</h1>
          <p className="text-[var(--text-muted)]">Create a new model profile</p>
        </div>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-500 text-sm p-4 rounded-lg mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Info */}
        <section className="border border-[var(--text)]/10 rounded-lg p-6">
          <h2 className="font-serif text-xl mb-6">Basic Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs tracking-wider uppercase text-[var(--text-muted)] mb-2">
                Name (English) *
              </label>
              <input
                type="text"
                value={formData.name}
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
                value={formData.nameKr}
                onChange={(e) => setFormData({ ...formData, nameKr: e.target.value })}
                className="w-full px-4 py-3 bg-transparent border border-[var(--text)]/20 rounded-lg focus:outline-none focus:border-[var(--text)]"
              />
            </div>
            <div>
              <label className="block text-xs tracking-wider uppercase text-[var(--text-muted)] mb-2">
                Category *
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-3 bg-transparent border border-[var(--text)]/20 rounded-lg focus:outline-none focus:border-[var(--text)]"
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
                value={formData.location}
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
                value={formData.profileImage}
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
                values={formData.galleryImages}
                onChange={(urls) => setFormData({ ...formData, galleryImages: urls })}
                folder="models"
                maxImages={12}
                placeholder="갤러리 이미지 추가"
              />
            </div>
            <div>
              <label className="block text-xs tracking-wider uppercase text-[var(--text-muted)] mb-3">
                Gallery Videos
              </label>
              <MultiVideoUpload
                values={formData.galleryVideos}
                onChange={(videos) => setFormData({ ...formData, galleryVideos: videos })}
                folder="models"
                maxVideos={6}
              />
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="border border-[var(--text)]/10 rounded-lg p-6">
          <h2 className="font-serif text-xl mb-6">Measurements</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs tracking-wider uppercase text-[var(--text-muted)] mb-2">
                Height *
              </label>
              <input
                type="text"
                value={formData.stats.height}
                onChange={(e) => setFormData({
                  ...formData,
                  stats: { ...formData.stats, height: e.target.value }
                })}
                placeholder="175"
                className="w-full px-4 py-3 bg-transparent border border-[var(--text)]/20 rounded-lg focus:outline-none focus:border-[var(--text)]"
                required
              />
            </div>
            <div>
              <label className="block text-xs tracking-wider uppercase text-[var(--text-muted)] mb-2">
                Bust
              </label>
              <input
                type="text"
                value={formData.stats.bust}
                onChange={(e) => setFormData({
                  ...formData,
                  stats: { ...formData.stats, bust: e.target.value }
                })}
                placeholder="82"
                className="w-full px-4 py-3 bg-transparent border border-[var(--text)]/20 rounded-lg focus:outline-none focus:border-[var(--text)]"
              />
            </div>
            <div>
              <label className="block text-xs tracking-wider uppercase text-[var(--text-muted)] mb-2">
                Waist
              </label>
              <input
                type="text"
                value={formData.stats.waist}
                onChange={(e) => setFormData({
                  ...formData,
                  stats: { ...formData.stats, waist: e.target.value }
                })}
                placeholder="58"
                className="w-full px-4 py-3 bg-transparent border border-[var(--text)]/20 rounded-lg focus:outline-none focus:border-[var(--text)]"
              />
            </div>
            <div>
              <label className="block text-xs tracking-wider uppercase text-[var(--text-muted)] mb-2">
                Hips
              </label>
              <input
                type="text"
                value={formData.stats.hips}
                onChange={(e) => setFormData({
                  ...formData,
                  stats: { ...formData.stats, hips: e.target.value }
                })}
                placeholder="88"
                className="w-full px-4 py-3 bg-transparent border border-[var(--text)]/20 rounded-lg focus:outline-none focus:border-[var(--text)]"
              />
            </div>
            <div>
              <label className="block text-xs tracking-wider uppercase text-[var(--text-muted)] mb-2">
                Shoes
              </label>
              <input
                type="text"
                value={formData.stats.shoes}
                onChange={(e) => setFormData({
                  ...formData,
                  stats: { ...formData.stats, shoes: e.target.value }
                })}
                placeholder="250"
                className="w-full px-4 py-3 bg-transparent border border-[var(--text)]/20 rounded-lg focus:outline-none focus:border-[var(--text)]"
              />
            </div>
            <div>
              <label className="block text-xs tracking-wider uppercase text-[var(--text-muted)] mb-2">
                Eyes
              </label>
              <input
                type="text"
                value={formData.stats.eyes}
                onChange={(e) => setFormData({
                  ...formData,
                  stats: { ...formData.stats, eyes: e.target.value }
                })}
                placeholder="Brown"
                className="w-full px-4 py-3 bg-transparent border border-[var(--text)]/20 rounded-lg focus:outline-none focus:border-[var(--text)]"
              />
            </div>
            <div>
              <label className="block text-xs tracking-wider uppercase text-[var(--text-muted)] mb-2">
                Hair
              </label>
              <input
                type="text"
                value={formData.stats.hair}
                onChange={(e) => setFormData({
                  ...formData,
                  stats: { ...formData.stats, hair: e.target.value }
                })}
                placeholder="Black"
                className="w-full px-4 py-3 bg-transparent border border-[var(--text)]/20 rounded-lg focus:outline-none focus:border-[var(--text)]"
              />
            </div>
          </div>
        </section>

        {/* Bio */}
        <section className="border border-[var(--text)]/10 rounded-lg p-6">
          <h2 className="font-serif text-xl mb-6">Biography</h2>
          <textarea
            value={formData.bio}
            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
            rows={4}
            placeholder="Write a short bio..."
            className="w-full px-4 py-3 bg-transparent border border-[var(--text)]/20 rounded-lg focus:outline-none focus:border-[var(--text)] resize-none"
          />
        </section>

        {/* Experience */}
        <section className="border border-[var(--text)]/10 rounded-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-serif text-xl">Experience</h2>
            <button
              type="button"
              onClick={addExperience}
              className="flex items-center gap-2 text-sm text-[var(--text-muted)] hover:text-[var(--text)]"
            >
              <Plus size={16} />
              Add Experience
            </button>
          </div>
          <div className="space-y-4">
            {formData.experience.map((exp, index) => (
              <div key={index} className="flex gap-4">
                <input
                  type="text"
                  value={exp.brand}
                  onChange={(e) => updateExperience(index, 'brand', e.target.value)}
                  placeholder="Brand / Campaign"
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
                  <X size={16} />
                </button>
              </div>
            ))}
            {formData.experience.length === 0 && (
              <p className="text-[var(--text-muted)] text-sm">No experience added yet</p>
            )}
          </div>
        </section>

        {/* Social */}
        <section className="border border-[var(--text)]/10 rounded-lg p-6">
          <h2 className="font-serif text-xl mb-6">Social</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs tracking-wider uppercase text-[var(--text-muted)] mb-2">
                Instagram
              </label>
              <input
                type="text"
                value={formData.social.instagram}
                onChange={(e) => setFormData({
                  ...formData,
                  social: { ...formData.social, instagram: e.target.value }
                })}
                placeholder="@username 또는 전체 URL"
                className="w-full px-4 py-3 bg-transparent border border-[var(--text)]/20 rounded-lg focus:outline-none focus:border-[var(--text)]"
              />
            </div>
            <div>
              <label className="block text-xs tracking-wider uppercase text-[var(--text-muted)] mb-2">
                YouTube
              </label>
              <input
                type="text"
                value={formData.social.youtube}
                onChange={(e) => setFormData({
                  ...formData,
                  social: { ...formData.social, youtube: e.target.value }
                })}
                placeholder="채널 URL"
                className="w-full px-4 py-3 bg-transparent border border-[var(--text)]/20 rounded-lg focus:outline-none focus:border-[var(--text)]"
              />
            </div>
            <div>
              <label className="block text-xs tracking-wider uppercase text-[var(--text-muted)] mb-2">
                TikTok
              </label>
              <input
                type="text"
                value={formData.social.tiktok}
                onChange={(e) => setFormData({
                  ...formData,
                  social: { ...formData.social, tiktok: e.target.value }
                })}
                placeholder="@username 또는 전체 URL"
                className="w-full px-4 py-3 bg-transparent border border-[var(--text)]/20 rounded-lg focus:outline-none focus:border-[var(--text)]"
              />
            </div>
          </div>
        </section>

        {/* Options */}
        <section className="border border-[var(--text)]/10 rounded-lg p-6">
          <h2 className="font-serif text-xl mb-6">Options</h2>
          <div className="flex gap-6">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.featured}
                onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                className="w-5 h-5"
              />
              <span className="text-sm">Featured</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.active}
                onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                className="w-5 h-5"
              />
              <span className="text-sm">Active</span>
            </label>
          </div>
        </section>

        {/* Submit */}
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="px-8 py-4 bg-theme-inverse text-theme-inverse text-sm tracking-wider uppercase rounded-lg hover:opacity-90 disabled:opacity-50"
          >
            {loading ? 'Creating...' : 'Create Model'}
          </button>
          <Link
            href="/admin/models"
            className="px-8 py-4 border border-[var(--text)]/20 text-sm tracking-wider uppercase rounded-lg hover:bg-[var(--text)]/5"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
