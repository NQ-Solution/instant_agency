'use client';

import { useState, useEffect, use, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, Plus, Trash2, Upload, X, Image as ImageIcon } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import type { Model } from '@/types';

export default function EditModelPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState(false);
  const profileInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

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

  // Profile image upload
  const handleProfileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const formDataUpload = new FormData();
      formDataUpload.append('file', file);
      formDataUpload.append('folder', 'models');

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formDataUpload,
      });

      const data = await res.json();
      if (data.success) {
        setFormData({ ...formData, profileImage: data.data.url });
      } else {
        alert(data.error || 'Failed to upload image');
      }
    } catch (error) {
      console.error('Error uploading profile image:', error);
      alert('Failed to upload image');
    } finally {
      setUploading(false);
      if (profileInputRef.current) {
        profileInputRef.current.value = '';
      }
    }
  };

  // Gallery images upload
  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingGallery(true);
    const newImages: string[] = [];

    try {
      for (const file of Array.from(files)) {
        const formDataUpload = new FormData();
        formDataUpload.append('file', file);
        formDataUpload.append('folder', 'models/gallery');

        const res = await fetch('/api/upload', {
          method: 'POST',
          body: formDataUpload,
        });

        const data = await res.json();
        if (data.success) {
          newImages.push(data.data.url);
        }
      }

      setFormData({
        ...formData,
        galleryImages: [...(formData.galleryImages || []), ...newImages],
      });
    } catch (error) {
      console.error('Error uploading gallery images:', error);
      alert('Failed to upload some images');
    } finally {
      setUploadingGallery(false);
      if (galleryInputRef.current) {
        galleryInputRef.current.value = '';
      }
    }
  };

  // Remove gallery image
  const removeGalleryImage = (index: number) => {
    setFormData({
      ...formData,
      galleryImages: formData.galleryImages?.filter((_, i) => i !== index) || [],
    });
  };

  // Remove profile image
  const removeProfileImage = () => {
    setFormData({ ...formData, profileImage: '' });
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

        {/* Profile Image */}
        <section className="border border-[var(--text)]/10 rounded-lg p-6">
          <h2 className="font-serif text-xl mb-4">Profile Image</h2>
          <div className="space-y-4">
            {formData.profileImage ? (
              <div className="relative inline-block">
                <div className="w-40 h-52 relative rounded-lg overflow-hidden">
                  <Image
                    src={formData.profileImage}
                    alt="Profile preview"
                    fill
                    className="object-cover"
                  />
                </div>
                <button
                  type="button"
                  onClick={removeProfileImage}
                  className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600"
                >
                  <X size={14} />
                </button>
              </div>
            ) : (
              <div
                onClick={() => profileInputRef.current?.click()}
                className="w-40 h-52 border-2 border-dashed border-[var(--text)]/20 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-[var(--text)]/40 transition-colors"
              >
                {uploading ? (
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[var(--text)]" />
                ) : (
                  <>
                    <ImageIcon size={32} className="text-[var(--text-muted)] mb-2" />
                    <span className="text-xs text-[var(--text-muted)]">Click to upload</span>
                  </>
                )}
              </div>
            )}
            <input
              ref={profileInputRef}
              type="file"
              accept="image/*"
              onChange={handleProfileUpload}
              className="hidden"
            />
            {formData.profileImage && (
              <button
                type="button"
                onClick={() => profileInputRef.current?.click()}
                disabled={uploading}
                className="flex items-center gap-2 px-4 py-2 text-sm border border-[var(--text)]/20 rounded-lg hover:bg-[var(--text)]/5 disabled:opacity-50"
              >
                <Upload size={16} />
                {uploading ? 'Uploading...' : 'Change Image'}
              </button>
            )}
            <div>
              <label className="block text-xs tracking-wider uppercase text-[var(--text-muted)] mb-2">
                Or enter URL directly
              </label>
              <input
                type="url"
                value={formData.profileImage || ''}
                onChange={(e) => setFormData({ ...formData, profileImage: e.target.value })}
                placeholder="https://..."
                className="w-full px-4 py-3 bg-transparent border border-[var(--text)]/20 rounded-lg focus:outline-none focus:border-[var(--text)]"
              />
            </div>
          </div>
        </section>

        {/* Gallery Images */}
        <section className="border border-[var(--text)]/10 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-serif text-xl">Gallery Images</h2>
            <span className="text-sm text-[var(--text-muted)]">
              {formData.galleryImages?.length || 0} images
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-4">
            {formData.galleryImages?.map((image, index) => (
              <div key={index} className="relative group">
                <div className="aspect-[3/4] relative rounded-lg overflow-hidden">
                  <Image
                    src={image}
                    alt={`Gallery ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeGalleryImage(index)}
                  className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                >
                  <X size={14} />
                </button>
              </div>
            ))}

            {/* Upload button */}
            <div
              onClick={() => galleryInputRef.current?.click()}
              className="aspect-[3/4] border-2 border-dashed border-[var(--text)]/20 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-[var(--text)]/40 transition-colors"
            >
              {uploadingGallery ? (
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[var(--text)]" />
              ) : (
                <>
                  <Plus size={24} className="text-[var(--text-muted)] mb-1" />
                  <span className="text-xs text-[var(--text-muted)]">Add Images</span>
                </>
              )}
            </div>
          </div>

          <input
            ref={galleryInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleGalleryUpload}
            className="hidden"
          />

          <p className="text-xs text-[var(--text-muted)]">
            Click the + button to upload multiple images. Supported formats: JPEG, PNG, GIF, WEBP (Max 10MB each)
          </p>
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
