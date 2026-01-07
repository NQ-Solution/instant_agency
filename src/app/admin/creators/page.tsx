'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Plus, Search, Edit, Trash2, Star } from 'lucide-react';
import type { Creator } from '@/types';

export default function CreatorsPage() {
  const [creators, setCreators] = useState<Creator[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchCreators();
  }, []);

  const fetchCreators = async () => {
    try {
      const res = await fetch('/api/creators?active=all');
      const data = await res.json();
      if (data.success) {
        setCreators(data.data);
      }
    } catch (error) {
      console.error('Error fetching creators:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteCreator = async (id: string) => {
    if (!confirm('Are you sure you want to delete this creator?')) return;

    try {
      const res = await fetch(`/api/creators/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setCreators(creators.filter((c) => c.id !== id));
      }
    } catch (error) {
      console.error('Error deleting creator:', error);
    }
  };

  const toggleFeatured = async (creator: Creator) => {
    try {
      const res = await fetch(`/api/creators/${creator.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ featured: !creator.featured }),
      });
      if (res.ok) {
        setCreators(
          creators.map((c) =>
            c.id === creator.id ? { ...c, featured: !c.featured } : c
          )
        );
      }
    } catch (error) {
      console.error('Error updating creator:', error);
    }
  };

  const filteredCreators = creators.filter((creator) =>
    creator.name.toLowerCase().includes(search.toLowerCase())
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
          <h1 className="font-serif text-3xl mb-2">Creators</h1>
          <p className="text-[var(--text-muted)]">
            Manage live commerce creators ({creators.length} total)
          </p>
        </div>
        <Link
          href="/admin/creators/new"
          className="flex items-center gap-2 px-4 py-2 bg-theme-inverse text-theme-inverse rounded-lg hover:opacity-90 transition-opacity"
        >
          <Plus size={18} />
          <span className="text-sm">Add Creator</span>
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
          placeholder="Search creators..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2 bg-transparent border border-[var(--text)]/20 rounded-lg focus:outline-none focus:border-[var(--text)]"
        />
      </div>

      {/* Creators Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredCreators.map((creator) => (
          <div
            key={creator.id}
            className="border border-[var(--text)]/10 rounded-lg overflow-hidden"
          >
            <div className="relative aspect-square">
              {creator.image ? (
                <Image
                  src={creator.image}
                  alt={creator.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full bg-[var(--text)]/10 flex items-center justify-center">
                  <span className="text-[var(--text-muted)]">No Image</span>
                </div>
              )}
              {creator.featured && (
                <div className="absolute top-2 right-2">
                  <Star className="text-yellow-500 fill-yellow-500" size={20} />
                </div>
              )}
            </div>
            <div className="p-4">
              <h3 className="font-serif text-lg mb-1">{creator.name}</h3>
              <p className="text-xs text-[var(--text-muted)] uppercase mb-2">
                {creator.platform} · {creator.category}
              </p>
              <div className="flex gap-4 text-xs text-[var(--text-muted)] mb-4">
                <span><strong className="text-[var(--text)]">{creator.followers}</strong> Followers</span>
                <span><strong className="text-[var(--text)]">{creator.views}</strong> Views</span>
              </div>
              <div className="flex items-center gap-2">
                <Link
                  href={`/admin/creators/${creator.id}`}
                  className="flex-1 flex items-center justify-center gap-1 py-2 border border-[var(--text)]/20 rounded text-xs hover:bg-[var(--text)]/5"
                >
                  <Edit size={14} />
                  Edit
                </Link>
                <button
                  onClick={() => toggleFeatured(creator)}
                  className={`p-2 border border-[var(--text)]/20 rounded hover:bg-[var(--text)]/5 ${
                    creator.featured ? 'text-yellow-500' : ''
                  }`}
                  title="Toggle Featured"
                >
                  <Star size={14} />
                </button>
                <button
                  onClick={() => deleteCreator(creator.id!)}
                  className="p-2 border border-red-500/20 text-red-500 rounded hover:bg-red-500/5"
                  title="Delete"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredCreators.length === 0 && (
        <div className="text-center py-12">
          <p className="text-[var(--text-muted)]">No creators found</p>
        </div>
      )}
    </div>
  );
}
