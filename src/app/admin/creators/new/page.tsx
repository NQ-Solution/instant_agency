'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save } from 'lucide-react';
import Link from 'next/link';

export default function NewCreatorPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    platform: 'TikTok',
    category: '',
    image: '',
    followers: '',
    views: '',
    featured: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/creators', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        router.push('/admin/creators');
      } else {
        alert('Failed to create creator');
      }
    } catch (error) {
      console.error('Error creating creator:', error);
      alert('Failed to create creator');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl">
      <div className="flex items-center gap-4 mb-8">
        <Link
          href="/admin/creators"
          className="p-2 hover:bg-[var(--text)]/10 rounded-lg transition-colors"
        >
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="font-serif text-3xl">New Creator</h1>
          <p className="text-[var(--text-muted)]">Add a new live commerce creator</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-xs tracking-wider uppercase text-[var(--text-muted)] mb-2">
            Name *
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-4 py-3 bg-transparent border border-[var(--text)]/20 rounded-lg focus:outline-none focus:border-[var(--text)]"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs tracking-wider uppercase text-[var(--text-muted)] mb-2">
              Platform *
            </label>
            <select
              value={formData.platform}
              onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
              className="w-full px-4 py-3 bg-transparent border border-[var(--text)]/20 rounded-lg focus:outline-none focus:border-[var(--text)]"
              required
            >
              <option value="TikTok">TikTok</option>
              <option value="Instagram">Instagram</option>
              <option value="YouTube">YouTube</option>
            </select>
          </div>
          <div>
            <label className="block text-xs tracking-wider uppercase text-[var(--text-muted)] mb-2">
              Category *
            </label>
            <input
              type="text"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              placeholder="e.g., Fashion, Beauty, Food"
              className="w-full px-4 py-3 bg-transparent border border-[var(--text)]/20 rounded-lg focus:outline-none focus:border-[var(--text)]"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-xs tracking-wider uppercase text-[var(--text-muted)] mb-2">
            Profile Image URL
          </label>
          <input
            type="url"
            value={formData.image}
            onChange={(e) => setFormData({ ...formData, image: e.target.value })}
            placeholder="https://..."
            className="w-full px-4 py-3 bg-transparent border border-[var(--text)]/20 rounded-lg focus:outline-none focus:border-[var(--text)]"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs tracking-wider uppercase text-[var(--text-muted)] mb-2">
              Followers
            </label>
            <input
              type="text"
              value={formData.followers}
              onChange={(e) => setFormData({ ...formData, followers: e.target.value })}
              placeholder="e.g., 1.2M"
              className="w-full px-4 py-3 bg-transparent border border-[var(--text)]/20 rounded-lg focus:outline-none focus:border-[var(--text)]"
            />
          </div>
          <div>
            <label className="block text-xs tracking-wider uppercase text-[var(--text-muted)] mb-2">
              Total Views
            </label>
            <input
              type="text"
              value={formData.views}
              onChange={(e) => setFormData({ ...formData, views: e.target.value })}
              placeholder="e.g., 50M"
              className="w-full px-4 py-3 bg-transparent border border-[var(--text)]/20 rounded-lg focus:outline-none focus:border-[var(--text)]"
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="featured"
            checked={formData.featured}
            onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
            className="w-4 h-4"
          />
          <label htmlFor="featured" className="text-sm">
            Featured Creator
          </label>
        </div>

        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 px-6 py-3 bg-theme-inverse text-theme-inverse rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            <Save size={18} />
            {loading ? 'Saving...' : 'Save Creator'}
          </button>
          <Link
            href="/admin/creators"
            className="px-6 py-3 border border-[var(--text)]/20 rounded-lg hover:bg-[var(--text)]/5 transition-colors"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
