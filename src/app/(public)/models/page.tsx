'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { Model } from '@/types';

const categories = [
  { id: 'all', label: 'All' },
  { id: 'women', label: 'Women' },
  { id: 'men', label: 'Men' },
  { id: 'new', label: 'New Faces' },
];

export default function ModelsPage() {
  const [models, setModels] = useState<Model[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');

  useEffect(() => {
    const fetchModels = async () => {
      try {
        const res = await fetch('/api/models');
        const data = await res.json();
        if (data.success) {
          setModels(data.data || []);
        }
      } catch (error) {
        console.error('Error fetching models:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchModels();
  }, []);

  const filteredModels = models.filter(
    (model) => activeCategory === 'all' || model.category === activeCategory
  );

  const featuredModels = models.filter((m) => m.featured).slice(0, 2);

  return (
    <div>
      {/* Hero */}
      <section className="min-h-screen flex flex-col justify-center items-center text-center px-8 relative">
        <span className="inline-block px-4 py-2 border border-theme-30 text-xs tracking-[0.3em] uppercase mb-8 animate-fade-up">
          Model Agency
        </span>
        <p className="text-xs tracking-[0.3em] uppercase text-muted mb-6 animate-fade-up">
          Discover Extraordinary
        </p>
        <h1 className="font-logo text-[clamp(4rem,15vw,12rem)] font-normal leading-[0.9] tracking-[-0.02em] animate-fade-up">
          Talent
        </h1>
        <p className="text-muted mt-8 max-w-xl mx-auto leading-relaxed animate-fade-up-delay">
          국내외 최고의 패션 모델들과 함께합니다
        </p>

        {/* Scroll Indicator */}
        <div className="absolute bottom-16 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 animate-fade-up-delay">
          <span className="text-[0.65rem] tracking-[0.3em] uppercase text-muted">Scroll</span>
          <div className="w-px h-16 bg-gradient-to-b from-current to-transparent animate-scroll-pulse" />
        </div>
      </section>

      {/* Featured Models */}
      {featuredModels.length > 0 && (
        <section className="px-8 mb-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {featuredModels.map((model) => (
              <Link
                key={model.id}
                href={`/models/${model.slug}`}
                className="group relative aspect-[3/4] overflow-hidden block"
              >
                {model.profileImage ? (
                  <Image
                    src={model.profileImage}
                    alt={model.name}
                    fill
                    className="object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
                  />
                ) : (
                  <div className="absolute inset-0 bg-[var(--text)]/10" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                  <span className="inline-block px-3 py-1 border border-white/30 text-xs tracking-wider uppercase mb-4">
                    Featured
                  </span>
                  <h2 className="text-2xl md:text-3xl mb-2">{model.name}</h2>
                  <p className="text-sm opacity-80">
                    {model.stats.height}cm · {model.location}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Filter */}
      <section className="px-8 mb-8">
        <div className="flex justify-center gap-4 flex-wrap">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-6 py-3 border text-xs tracking-wider uppercase transition-all duration-300 ${
                activeCategory === cat.id
                  ? 'bg-theme-inverse text-theme-inverse border-theme'
                  : 'border-theme-20 hover:border-theme'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </section>

      {/* Models Grid */}
      <section className="pb-24">
        {loading ? (
          <div className="flex justify-center py-16">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-current" />
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {filteredModels.map((model) => (
              <Link
                key={model.id}
                href={`/models/${model.slug}`}
                className="group block relative aspect-[3/4] overflow-hidden"
              >
                {model.profileImage ? (
                  <Image
                    src={model.profileImage}
                    alt={model.name}
                    fill
                    className="object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500"
                  />
                ) : (
                  <div className="absolute inset-0 bg-[var(--text)]/10" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-0 left-0 right-0 p-4 text-white translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <h3 className="text-lg md:text-xl">{model.name}</h3>
                  <p className="text-xs tracking-wider uppercase opacity-80">
                    {model.stats.height}cm · {model.location}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}

        {!loading && filteredModels.length === 0 && (
          <div className="text-center py-16">
            <p className="text-muted">No models found</p>
          </div>
        )}
      </section>

      {/* CTA */}
      <section className="py-16 px-8 text-center border-t border-theme-10">
        <h2 className="text-2xl md:text-3xl mb-4">Become a Model</h2>
        <p className="text-muted mb-8">
          Join our roster of talented models
        </p>
        <Link
          href="/contact"
          className="inline-block px-8 py-4 border border-theme text-sm tracking-wider uppercase hover:bg-theme-inverse hover:text-theme-inverse transition-all duration-300"
        >
          Apply Now
        </Link>
      </section>
    </div>
  );
}
