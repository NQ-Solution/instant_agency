'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Search, Edit, Trash2, Eye, EyeOff, Video } from 'lucide-react';
import type { LiveVideo } from '@/types';

export default function LiveVideosPage() {
  const [videos, setVideos] = useState<LiveVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      const res = await fetch('/api/live-videos?active=all');
      const data = await res.json();
      if (data.success) {
        setVideos(data.data);
      }
    } catch (error) {
      console.error('Error fetching videos:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteVideo = async (id: string) => {
    if (!confirm('Are you sure you want to delete this video?')) return;

    try {
      const res = await fetch(`/api/live-videos/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setVideos(videos.filter((v) => v.id !== id));
      }
    } catch (error) {
      console.error('Error deleting video:', error);
    }
  };

  const toggleActive = async (video: LiveVideo) => {
    try {
      const res = await fetch(`/api/live-videos/${video.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ active: !video.active }),
      });
      if (res.ok) {
        setVideos(
          videos.map((v) =>
            v.id === video.id ? { ...v, active: !v.active } : v
          )
        );
      }
    } catch (error) {
      console.error('Error updating video:', error);
    }
  };

  const filteredVideos = videos.filter((video) =>
    video.title.toLowerCase().includes(search.toLowerCase()) ||
    video.creator.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--text)]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl mb-2">Live Videos</h1>
          <p className="text-[var(--text-muted)]">
            Manage live commerce video showcase ({videos.length} total)
          </p>
        </div>
        <Link
          href="/admin/live-videos/new"
          className="flex items-center gap-2 px-4 py-2 bg-theme-inverse text-theme-inverse rounded-lg hover:opacity-90 transition-opacity"
        >
          <Plus size={18} />
          <span className="text-sm">Add Video</span>
        </Link>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]"
          size={18}
        />
        <input
          type="text"
          placeholder="Search videos..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2 bg-transparent border border-[var(--text)]/20 rounded-lg focus:outline-none focus:border-[var(--text)]"
        />
      </div>

      {/* Videos List */}
      <div className="space-y-4">
        {filteredVideos.map((video) => (
          <div
            key={video.id}
            className={`border border-[var(--text)]/10 rounded-lg overflow-hidden ${
              !video.active ? 'opacity-50' : ''
            }`}
          >
            <div className="flex flex-col md:flex-row">
              {/* Video Preview */}
              <div className="relative w-full md:w-64 aspect-video bg-black flex-shrink-0">
                <video
                  src={video.videoUrl}
                  className="w-full h-full object-cover"
                  muted
                  playsInline
                  onMouseEnter={(e) => e.currentTarget.play()}
                  onMouseLeave={(e) => {
                    e.currentTarget.pause();
                    e.currentTarget.currentTime = 0;
                  }}
                />
                <div className="absolute top-2 left-2 px-2 py-1 bg-rose-500 text-white text-xs rounded">
                  {video.tag}
                </div>
              </div>

              {/* Video Info */}
              <div className="flex-1 p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-serif text-lg mb-1">{video.title}</h3>
                    <p className="text-xs text-[var(--text-muted)] uppercase mb-2">
                      by {video.creator} · {video.label}
                    </p>
                    <p className="text-sm text-[var(--text-muted)] line-clamp-2 mb-3">
                      {video.desc}
                    </p>
                    <div className="flex gap-4 text-xs text-[var(--text-muted)]">
                      <span>
                        <strong className="text-rose-500">{video.stats.views}</strong> Views
                      </span>
                      <span>
                        <strong className="text-rose-500">{video.stats.conversion}</strong> Conversion
                      </span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 mt-4 pt-4 border-t border-[var(--text)]/10">
                  <Link
                    href={`/admin/live-videos/${video.id}`}
                    className="flex items-center gap-1 px-3 py-2 border border-[var(--text)]/20 rounded text-xs hover:bg-[var(--text)]/5"
                  >
                    <Edit size={14} />
                    Edit
                  </Link>
                  <button
                    onClick={() => toggleActive(video)}
                    className="flex items-center gap-1 px-3 py-2 border border-[var(--text)]/20 rounded text-xs hover:bg-[var(--text)]/5"
                    title={video.active ? 'Hide' : 'Show'}
                  >
                    {video.active ? <Eye size={14} /> : <EyeOff size={14} />}
                    {video.active ? 'Active' : 'Hidden'}
                  </button>
                  <button
                    onClick={() => deleteVideo(video.id!)}
                    className="flex items-center gap-1 px-3 py-2 border border-red-500/20 text-red-500 rounded text-xs hover:bg-red-500/5"
                    title="Delete"
                  >
                    <Trash2 size={14} />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredVideos.length === 0 && (
        <div className="text-center py-12 border border-dashed border-[var(--text)]/20 rounded-lg">
          <Video size={48} className="mx-auto text-[var(--text-muted)] mb-4" />
          <p className="text-[var(--text-muted)] mb-4">No videos found</p>
          <Link
            href="/admin/live-videos/new"
            className="inline-flex items-center gap-2 px-4 py-2 bg-theme-inverse text-theme-inverse rounded-lg hover:opacity-90"
          >
            <Plus size={16} />
            Add First Video
          </Link>
        </div>
      )}
    </div>
  );
}
