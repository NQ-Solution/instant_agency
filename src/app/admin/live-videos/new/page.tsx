'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save } from 'lucide-react';
import Link from 'next/link';

export default function NewLiveVideoPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    tag: '',
    title: '',
    creator: '',
    videoUrl: '',
    label: '',
    infoTitle: '',
    desc: '',
    stats: { views: '0', conversion: '0%' },
    active: true,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const res = await fetch('/api/live-videos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        router.push('/admin/live-videos');
      } else {
        alert('Failed to create video');
      }
    } catch (error) {
      console.error('Error creating video:', error);
      alert('Failed to create video');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl">
      <div className="flex items-center gap-4 mb-8">
        <Link
          href="/admin/live-videos"
          className="p-2 hover:bg-[var(--text)]/10 rounded-lg transition-colors"
        >
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="font-serif text-3xl">Add New Live Video</h1>
          <p className="text-[var(--text-muted)]">Add a new video to the live showcase</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs tracking-wider uppercase text-[var(--text-muted)] mb-2">
              Tag *
            </label>
            <input
              type="text"
              value={formData.tag}
              onChange={(e) => setFormData({ ...formData, tag: e.target.value })}
              placeholder="e.g., Fashion Live"
              className="w-full px-4 py-3 bg-transparent border border-[var(--text)]/20 rounded-lg focus:outline-none focus:border-[var(--text)]"
              required
            />
          </div>
          <div>
            <label className="block text-xs tracking-wider uppercase text-[var(--text-muted)] mb-2">
              Label *
            </label>
            <input
              type="text"
              value={formData.label}
              onChange={(e) => setFormData({ ...formData, label: e.target.value })}
              placeholder="e.g., Fashion & Beauty"
              className="w-full px-4 py-3 bg-transparent border border-[var(--text)]/20 rounded-lg focus:outline-none focus:border-[var(--text)]"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-xs tracking-wider uppercase text-[var(--text-muted)] mb-2">
            Video Title *
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="e.g., Summer Collection Launch"
            className="w-full px-4 py-3 bg-transparent border border-[var(--text)]/20 rounded-lg focus:outline-none focus:border-[var(--text)]"
            required
          />
        </div>

        <div>
          <label className="block text-xs tracking-wider uppercase text-[var(--text-muted)] mb-2">
            Creator Name *
          </label>
          <input
            type="text"
            value={formData.creator}
            onChange={(e) => setFormData({ ...formData, creator: e.target.value })}
            placeholder="e.g., Yuna Kim"
            className="w-full px-4 py-3 bg-transparent border border-[var(--text)]/20 rounded-lg focus:outline-none focus:border-[var(--text)]"
            required
          />
        </div>

        <div>
          <label className="block text-xs tracking-wider uppercase text-[var(--text-muted)] mb-2">
            Video URL *
          </label>
          <input
            type="url"
            value={formData.videoUrl}
            onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
            placeholder="https://example.com/video.mp4"
            className="w-full px-4 py-3 bg-transparent border border-[var(--text)]/20 rounded-lg focus:outline-none focus:border-[var(--text)]"
            required
          />
          <p className="text-xs text-[var(--text-muted)] mt-1">
            Direct video link (MP4) or TikTok/Instagram video URL
          </p>
        </div>

        <div>
          <label className="block text-xs tracking-wider uppercase text-[var(--text-muted)] mb-2">
            Info Title *
          </label>
          <textarea
            value={formData.infoTitle}
            onChange={(e) => setFormData({ ...formData, infoTitle: e.target.value })}
            placeholder="Use \n for line breaks"
            rows={2}
            className="w-full px-4 py-3 bg-transparent border border-[var(--text)]/20 rounded-lg focus:outline-none focus:border-[var(--text)] resize-none"
            required
          />
        </div>

        <div>
          <label className="block text-xs tracking-wider uppercase text-[var(--text-muted)] mb-2">
            Description *
          </label>
          <textarea
            value={formData.desc}
            onChange={(e) => setFormData({ ...formData, desc: e.target.value })}
            rows={3}
            className="w-full px-4 py-3 bg-transparent border border-[var(--text)]/20 rounded-lg focus:outline-none focus:border-[var(--text)] resize-none"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs tracking-wider uppercase text-[var(--text-muted)] mb-2">
              Views
            </label>
            <input
              type="text"
              value={formData.stats.views}
              onChange={(e) => setFormData({ ...formData, stats: { ...formData.stats, views: e.target.value } })}
              placeholder="e.g., 2.5M"
              className="w-full px-4 py-3 bg-transparent border border-[var(--text)]/20 rounded-lg focus:outline-none focus:border-[var(--text)]"
            />
          </div>
          <div>
            <label className="block text-xs tracking-wider uppercase text-[var(--text-muted)] mb-2">
              Conversion Rate
            </label>
            <input
              type="text"
              value={formData.stats.conversion}
              onChange={(e) => setFormData({ ...formData, stats: { ...formData.stats, conversion: e.target.value } })}
              placeholder="e.g., 12.8%"
              className="w-full px-4 py-3 bg-transparent border border-[var(--text)]/20 rounded-lg focus:outline-none focus:border-[var(--text)]"
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="active"
            checked={formData.active}
            onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
            className="w-4 h-4"
          />
          <label htmlFor="active" className="text-sm">Active (visible on live page)</label>
        </div>

        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-6 py-3 bg-theme-inverse text-theme-inverse rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            <Save size={18} />
            {saving ? 'Saving...' : 'Create Video'}
          </button>
          <Link
            href="/admin/live-videos"
            className="px-6 py-3 border border-[var(--text)]/20 rounded-lg hover:bg-[var(--text)]/5 transition-colors"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
