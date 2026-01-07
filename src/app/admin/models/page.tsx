'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Plus, Search, Edit, Trash2, Eye, EyeOff, Star } from 'lucide-react';
import type { Model } from '@/types';

export default function ModelsPage() {
  const [models, setModels] = useState<Model[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [editingModel, setEditingModel] = useState<Model | null>(null);

  useEffect(() => {
    fetchModels();
  }, []);

  const fetchModels = async () => {
    try {
      const res = await fetch('/api/models?active=all');
      const data = await res.json();
      if (data.success) {
        setModels(data.data);
      }
    } catch (error) {
      console.error('Error fetching models:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteModel = async (id: string) => {
    if (!confirm('Are you sure you want to delete this model?')) return;

    try {
      const res = await fetch(`/api/models/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setModels(models.filter((m) => m.id !== id));
      }
    } catch (error) {
      console.error('Error deleting model:', error);
    }
  };

  const toggleActive = async (model: Model) => {
    try {
      const res = await fetch(`/api/models/${model.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ active: !model.active }),
      });
      if (res.ok) {
        setModels(
          models.map((m) =>
            m.id === model.id ? { ...m, active: !m.active } : m
          )
        );
      }
    } catch (error) {
      console.error('Error updating model:', error);
    }
  };

  const toggleFeatured = async (model: Model) => {
    try {
      const res = await fetch(`/api/models/${model.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ featured: !model.featured }),
      });
      if (res.ok) {
        setModels(
          models.map((m) =>
            m.id === model.id ? { ...m, featured: !m.featured } : m
          )
        );
      }
    } catch (error) {
      console.error('Error updating model:', error);
    }
  };

  const filteredModels = models.filter((model) => {
    const matchesSearch = model.name
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesCategory = category === 'all' || model.category === category;
    return matchesSearch && matchesCategory;
  });

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
          <h1 className="font-serif text-3xl mb-2">Models</h1>
          <p className="text-[var(--text-muted)]">
            Manage your model roster ({models.length} total)
          </p>
        </div>
        <Link
          href="/admin/models/new"
          className="flex items-center gap-2 px-4 py-2 bg-theme-inverse text-theme-inverse rounded-lg hover:opacity-90 transition-opacity"
        >
          <Plus size={18} />
          <span className="text-sm">Add Model</span>
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]"
            size={18}
          />
          <input
            type="text"
            placeholder="Search models..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-transparent border border-[var(--text)]/20 rounded-lg focus:outline-none focus:border-[var(--text)]"
          />
        </div>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="px-4 py-2 bg-transparent border border-[var(--text)]/20 rounded-lg focus:outline-none focus:border-[var(--text)]"
        >
          <option value="all">All Categories</option>
          <option value="women">Women</option>
          <option value="men">Men</option>
          <option value="new">New Faces</option>
        </select>
      </div>

      {/* Models Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredModels.map((model) => (
          <div
            key={model.id}
            className={`border border-[var(--text)]/10 rounded-lg overflow-hidden ${
              !model.active ? 'opacity-50' : ''
            }`}
          >
            <div className="relative aspect-[3/4]">
              {model.profileImage ? (
                <Image
                  src={model.profileImage}
                  alt={model.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full bg-[var(--text)]/10 flex items-center justify-center">
                  <span className="text-[var(--text-muted)]">No Image</span>
                </div>
              )}
              {model.featured && (
                <div className="absolute top-2 right-2">
                  <Star className="text-yellow-500 fill-yellow-500" size={20} />
                </div>
              )}
            </div>
            <div className="p-4">
              <h3 className="font-serif text-lg mb-1">{model.name}</h3>
              <p className="text-xs text-[var(--text-muted)] uppercase mb-4">
                {model.category} · {model.location}
              </p>
              <div className="flex items-center gap-2">
                <Link
                  href={`/admin/models/${model.id}`}
                  className="flex-1 flex items-center justify-center gap-1 py-2 border border-[var(--text)]/20 rounded text-xs hover:bg-[var(--text)]/5"
                >
                  <Edit size={14} />
                  Edit
                </Link>
                <button
                  onClick={() => toggleFeatured(model)}
                  className={`p-2 border border-[var(--text)]/20 rounded hover:bg-[var(--text)]/5 ${
                    model.featured ? 'text-yellow-500' : ''
                  }`}
                  title="Toggle Featured"
                >
                  <Star size={14} />
                </button>
                <button
                  onClick={() => toggleActive(model)}
                  className="p-2 border border-[var(--text)]/20 rounded hover:bg-[var(--text)]/5"
                  title={model.active ? 'Hide' : 'Show'}
                >
                  {model.active ? <Eye size={14} /> : <EyeOff size={14} />}
                </button>
                <button
                  onClick={() => deleteModel(model.id!)}
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

      {filteredModels.length === 0 && (
        <div className="text-center py-12">
          <p className="text-[var(--text-muted)]">No models found</p>
        </div>
      )}
    </div>
  );
}
