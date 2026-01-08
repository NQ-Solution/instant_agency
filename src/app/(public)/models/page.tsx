'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import PageGuard from '@/components/public/PageGuard';
import type { Model, ModelsPageContent } from '@/types';

const categories = [
  { id: 'all', label: 'All' },
  { id: 'women', label: 'Women' },
  { id: 'men', label: 'Men' },
  { id: 'new', label: 'New Faces' },
];

const defaultContent: ModelsPageContent = {
  hero: {
    tag: 'Model Agency',
    label: 'Discover Extraordinary',
    title: 'Talent',
    subtitle: '국내외 최고의 패션 모델들과 함께합니다',
  },
  cta: {
    title: 'Become a Model',
    description: 'Join our roster of talented models',
    buttonText: 'Apply Now',
  },
};

// Social icons as SVG
const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
  </svg>
);

const TikTokIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
  </svg>
);

const YouTubeIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
);

export default function ModelsPage() {
  const [content, setContent] = useState<ModelsPageContent>(defaultContent);
  const [models, setModels] = useState<Model[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');
  const [hoveredModel, setHoveredModel] = useState<Model | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [pageRes, modelsRes] = await Promise.all([
          fetch('/api/pages/models'),
          fetch('/api/models'),
        ]);

        const pageData = await pageRes.json();
        const modelsData = await modelsRes.json();

        if (pageData.success && pageData.data?.sections?.content) {
          setContent({ ...defaultContent, ...pageData.data.sections.content });
        }

        if (modelsData.success) {
          setModels(modelsData.data || []);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredModels = models.filter(
    (model) => activeCategory === 'all' || model.category === activeCategory
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--text)]"></div>
      </div>
    );
  }

  const modelSocial = hoveredModel?.social as { instagram?: string; tiktok?: string; youtube?: string } | undefined;

  return (
    <PageGuard pageKey="models">
    <div>
      {/* Hero */}
      <section className="min-h-screen flex flex-col justify-center items-center text-center px-8 relative">
        <span className="inline-block px-4 py-2 border border-theme-30 text-xs tracking-[0.3em] uppercase mb-8 animate-fade-up">
          {content.hero.tag}
        </span>
        <p className="text-xs tracking-[0.3em] uppercase text-muted mb-6 animate-fade-up">
          {content.hero.label}
        </p>
        <h1 className="font-logo text-[clamp(4rem,15vw,12rem)] font-normal leading-[0.9] tracking-[-0.02em] animate-fade-up">
          {content.hero.title}
        </h1>
        <p className="text-muted mt-8 max-w-xl mx-auto leading-relaxed animate-fade-up-delay">
          {content.hero.subtitle}
        </p>

        {/* Scroll Indicator */}
        <div className="absolute bottom-16 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 animate-fade-up-delay">
          <span className="text-[0.65rem] tracking-[0.3em] uppercase text-muted">Scroll</span>
          <div className="w-px h-16 bg-gradient-to-b from-current to-transparent animate-scroll-pulse" />
        </div>
      </section>

      {/* Filter */}
      <section className="px-8 py-8">
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

      {/* Models Grid with Preview */}
      <section className="pb-24 relative">
        <div className="flex">
          {/* Models Grid */}
          <div className="flex-1">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {filteredModels.map((model) => {
                const social = model.social as { instagram?: string; tiktok?: string; youtube?: string } | undefined;
                const hasSocial = social?.instagram || social?.tiktok || social?.youtube;

                return (
                  <div
                    key={model.id}
                    className="group block relative aspect-[3/4] overflow-hidden"
                    onMouseEnter={() => setHoveredModel(model)}
                    onMouseLeave={() => setHoveredModel(null)}
                  >
                    <Link href={`/models/${model.slug}`} className="block w-full h-full">
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
                    </Link>

                    {/* Hover Info */}
                    <div className="absolute bottom-0 left-0 right-0 p-4 text-white translate-y-full group-hover:translate-y-0 transition-transform duration-300 pointer-events-none group-hover:pointer-events-auto">
                      <div className="flex items-center gap-2 mb-1">
                        <Link href={`/models/${model.slug}`}>
                          <h3 className="text-lg md:text-xl hover:underline">{model.name}</h3>
                        </Link>

                        {/* Social Links */}
                        {hasSocial && (
                          <div className="flex gap-1 ml-2">
                            {social?.instagram && (
                              <a
                                href={social.instagram}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-7 h-7 rounded-full bg-white/20 hover:bg-white/40 flex items-center justify-center transition-colors"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <InstagramIcon />
                              </a>
                            )}
                            {social?.tiktok && (
                              <a
                                href={social.tiktok}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-7 h-7 rounded-full bg-white/20 hover:bg-white/40 flex items-center justify-center transition-colors"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <TikTokIcon />
                              </a>
                            )}
                            {social?.youtube && (
                              <a
                                href={social.youtube}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-7 h-7 rounded-full bg-white/20 hover:bg-white/40 flex items-center justify-center transition-colors"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <YouTubeIcon />
                              </a>
                            )}
                          </div>
                        )}
                      </div>
                      <p className="text-xs tracking-wider uppercase opacity-80">
                        {(model.stats as { height?: string })?.height || ''}cm · {model.location}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {filteredModels.length === 0 && (
              <div className="text-center py-16">
                <p className="text-muted">No models found</p>
              </div>
            )}
          </div>

          {/* Preview Panel (Desktop Only) */}
          <div
            className={`hidden xl:block w-80 sticky top-24 h-fit transition-all duration-300 ${
              hoveredModel ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'
            }`}
          >
            {hoveredModel && (
              <div className="m-4 border border-theme-20 bg-[var(--bg)] overflow-hidden">
                <div className="relative aspect-[3/4]">
                  {hoveredModel.profileImage ? (
                    <Image
                      src={hoveredModel.profileImage}
                      alt={hoveredModel.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-[var(--text)]/10" />
                  )}
                </div>
                <div className="p-4">
                  <h3 className="text-xl mb-2">{hoveredModel.name}</h3>
                  {hoveredModel.nameKr && (
                    <p className="text-sm text-muted mb-2">{hoveredModel.nameKr}</p>
                  )}
                  <div className="space-y-1 text-sm text-muted">
                    <p>Height: {(hoveredModel.stats as { height?: string })?.height || '-'}cm</p>
                    <p>Location: {hoveredModel.location}</p>
                    <p className="capitalize">Category: {hoveredModel.category}</p>
                  </div>

                  {/* Social Links in Preview */}
                  {(modelSocial?.instagram || modelSocial?.tiktok || modelSocial?.youtube) && (
                    <div className="flex gap-2 mt-4 pt-4 border-t border-theme-10">
                      {modelSocial?.instagram && (
                        <a
                          href={modelSocial.instagram}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-8 h-8 rounded-full border border-theme-20 hover:bg-theme-10 flex items-center justify-center transition-colors"
                        >
                          <InstagramIcon />
                        </a>
                      )}
                      {modelSocial?.tiktok && (
                        <a
                          href={modelSocial.tiktok}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-8 h-8 rounded-full border border-theme-20 hover:bg-theme-10 flex items-center justify-center transition-colors"
                        >
                          <TikTokIcon />
                        </a>
                      )}
                      {modelSocial?.youtube && (
                        <a
                          href={modelSocial.youtube}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-8 h-8 rounded-full border border-theme-20 hover:bg-theme-10 flex items-center justify-center transition-colors"
                        >
                          <YouTubeIcon />
                        </a>
                      )}
                    </div>
                  )}

                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-8 text-center border-t border-theme-10">
        <h2 className="text-2xl md:text-3xl mb-4">{content.cta.title}</h2>
        <p className="text-muted mb-8">{content.cta.description}</p>
        <Link
          href="/contact"
          className="inline-block px-8 py-4 border border-theme text-sm tracking-wider uppercase hover:bg-theme-inverse hover:text-theme-inverse transition-all duration-300"
        >
          {content.cta.buttonText}
        </Link>
      </section>
    </div>
    </PageGuard>
  );
}
