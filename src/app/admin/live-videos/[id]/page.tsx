'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save } from 'lucide-react';
import Link from 'next/link';
import type { LiveVideo } from '@/types';

export default function EditLiveVideoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<LiveVideo>({
    id: '',
    tag: '',
    title: '',
    creator: '',
    videoUrl: '',
    label: '',
    infoTitle: '',
    desc: '',
    stats: { views: '0', conversion: '0%' },
    order: 0,
    active: true,
  });

  useEffect(() => {
    fetchVideo();
  }, [id]);

  const fetchVideo = async () => {
    try {
      const res = await fetch(`/api/live-videos/${id}`);
      const data = await res.json();
      if (data.success && data.data) {
        setFormData(data.data);
      }
    } catch (error) {
      console.error('Error fetching video:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const res = await fetch(`/api/live-videos/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        router.push('/admin/live-videos');
      } else {
        alert('Failed to update video');
      }
    } catch (error) {
      console.error('Error updating video:', error);
      alert('Failed to update video');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--text)]"></div>
      </div>
    );
  }

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
          <h1 className="font-serif text-3xl">Edit Live Video</h1>
          <p className="text-[var(--text-muted)]">Update video details</p>
        </div>
      </div>

      {/* Video Preview */}
      {formData.videoUrl && (
        <div className="mb-8 rounded-lg overflow-hidden bg-black">
          <video
            src={formData.videoUrl}
            className="w-full aspect-video object-cover"
            controls
            muted
          />
        </div>
      )}

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

        <div>
          <label className="block text-xs tracking-wider uppercase text-[var(--text-muted)] mb-2">
            Display Order
          </label>
          <input
            type="number"
            value={formData.order}
            onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
            className="w-full px-4 py-3 bg-transparent border border-[var(--text)]/20 rounded-lg focus:outline-none focus:border-[var(--text)]"
          />
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
            {saving ? 'Saving...' : 'Save Changes'}
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
