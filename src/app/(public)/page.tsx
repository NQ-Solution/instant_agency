'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { HomePageContent } from '@/types';

const defaultContent: HomePageContent = {
  hero: {
    title: 'Instant Agency',
    subtitle: 'Creative Studio & Management',
    scrollText: 'Scroll',
  },
  divisions: {
    sectionNumber: '01',
    title: 'What We Do',
    items: [],
  },
  talents: {
    sectionNumber: '02',
    title: 'Our Talents',
    buttonText: 'View All Models',
  },
  stats: [],
  about: {
    sectionNumber: '04',
    title: 'Creative\nBeyond Limits',
    description: '',
    image: '',
    stats: [],
  },
  cta: {
    sectionNumber: '06',
    title: "Let's Create",
    email: '',
    socialLinks: [],
    offices: [],
  },
};

interface Model {
  slug: string;
  name: string;
  profileImage: string;
  location: string;
  category: string;
  stats: { height?: string };
}

export default function HomePage() {
  const [content, setContent] = useState<HomePageContent>(defaultContent);
  const [featuredModels, setFeaturedModels] = useState<Model[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [pageRes, modelsRes] = await Promise.all([
          fetch('/api/pages/home', { cache: 'no-store' }),
          fetch('/api/models?featured=true', { cache: 'no-store' }),
        ]);

        const pageData = await pageRes.json();
        const modelsData = await modelsRes.json();

        if (pageData.success && pageData.data?.sections) {
          const sections = pageData.data.sections as { content?: HomePageContent };
          if (sections.content) {
            setContent({ ...defaultContent, ...sections.content });
          }
        }

        if (modelsData.success && modelsData.data) {
          setFeaturedModels(modelsData.data.slice(0, 8));
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-current"></div>
      </div>
    );
  }

  return (
    <div>
      {/* Hero Section */}
      <section className="min-h-screen flex flex-col justify-center items-center text-center px-8 relative">
        <div className="flex flex-col items-center animate-fade-up">
          <img
            src="/logo.png"
            alt="Instant Agency"
            className="w-40 h-40 md:w-56 md:h-56 lg:w-72 lg:h-72 no-grayscale"
            style={{ filter: 'var(--logo-filter, none)' }}
          />
          <h1 className="font-logo text-4xl md:text-5xl lg:text-6xl font-bold leading-[1] tracking-[0.3em] -mt-2">
            {content.hero.title}
          </h1>
        </div>
        <p className="font-logo text-xs md:text-sm tracking-[0.15em] text-muted mt-4 animate-fade-up-delay">
          {content.hero.subtitle}
        </p>

        <div className="absolute bottom-16 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 animate-fade-up-delay">
          <span className="text-[0.65rem] tracking-[0.3em] uppercase text-muted">{content.hero.scrollText}</span>
          <div className="w-px h-16 bg-gradient-to-b from-current to-transparent animate-scroll-pulse" />
        </div>
      </section>

      {/* Featured Models */}
      {featuredModels.length > 0 && (
        <section className="min-h-screen flex flex-col justify-center pt-16">
          <div className="text-center px-8 mb-16">
            <p className="text-xs tracking-[0.3em] uppercase text-muted mb-4">{content.talents.sectionNumber}</p>
            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-normal">
              {content.talents.title}
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4">
            {featuredModels.map((model) => (
              <Link
                key={model.slug}
                href={`/models/${model.slug}`}
                className="group block relative aspect-[3/4] overflow-hidden"
              >
                {model.profileImage ? (
                  <Image
                    src={model.profileImage}
                    alt={model.name}
                    fill
                    className="object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-600"
                  />
                ) : (
                  <div className="absolute inset-0 bg-[var(--text)]/10" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400" />
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white translate-y-5 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-400">
                  <h3 className="font-serif text-xl md:text-2xl mb-2">{model.name}</h3>
                  <p className="text-[0.7rem] tracking-[0.2em] uppercase text-gray-400">
                    {model.location} · {model.stats?.height || ''} · {model.category}
                  </p>
                </div>
              </Link>
            ))}
          </div>
          <div className="py-12 text-center">
            <Link
              href="/models"
              className="inline-block px-12 py-4 border border-theme text-xs tracking-[0.2em] uppercase hover:bg-theme-inverse hover:text-theme-inverse transition-all duration-300"
            >
              {content.talents.buttonText}
            </Link>
          </div>
        </section>
      )}

      {/* Divisions Section */}
      {content.divisions.items.length > 0 && (
        <section className="min-h-screen flex flex-col justify-center pt-16">
          <div className="text-center px-8 mb-16">
            <p className="text-xs tracking-[0.3em] uppercase text-muted mb-4">{content.divisions.sectionNumber}</p>
            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-normal">
              {content.divisions.title}
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3">
            {content.divisions.items.map((division) => (
              <Link
                key={division.id}
                href={division.href}
                className="group relative aspect-[4/5] overflow-hidden block"
              >
                {division.image ? (
                  <Image
                    src={division.image}
                    alt={division.title}
                    fill
                    className="object-cover grayscale group-hover:grayscale-[50%] group-hover:scale-105 transition-all duration-600"
                  />
                ) : (
                  <div className="absolute inset-0 bg-[var(--text)]/10" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-8 lg:p-12 text-white">
                  <p className="text-[0.65rem] tracking-[0.3em] text-gray-400 mb-4">
                    {division.number}
                  </p>
                  <h3 className="font-serif text-2xl md:text-3xl lg:text-4xl mb-4 tracking-wide">
                    {division.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-gray-400 mb-6 max-w-[300px]">
                    {division.desc}
                  </p>
                  <span className="inline-flex items-center gap-2 text-xs tracking-[0.2em] uppercase text-white opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-400">
                    Explore <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Stats Section */}
      {content.stats.length > 0 && (
        <section className="min-h-[50vh] flex items-center bg-theme-inverse text-theme-inverse">
          <div className="grid grid-cols-2 md:grid-cols-4 w-full max-w-[1400px] mx-auto">
            {content.stats.map((stat, index) => (
              <div
                key={stat.label}
                className={`py-16 px-8 text-center ${index < content.stats.length - 1 ? 'md:border-r border-current/10' : ''} ${index < 2 ? 'border-b md:border-b-0 border-current/10' : ''}`}
              >
                <p className="font-serif text-5xl md:text-6xl lg:text-7xl font-normal leading-none mb-4">
                  {stat.value}
                </p>
                <p className="text-[0.7rem] tracking-[0.2em] uppercase opacity-60">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* About Preview */}
      {content.about.description && (
        <section className="min-h-screen flex items-center py-24 px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-32 max-w-[1400px] mx-auto">
            <div className="flex flex-col justify-center">
              <p className="text-xs tracking-[0.3em] uppercase text-muted mb-4">{content.about.sectionNumber}</p>
              <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-normal mb-8 leading-tight whitespace-pre-line">
                {content.about.title}
              </h2>
              <p className="text-muted leading-loose mb-8 whitespace-pre-line">
                {content.about.description}
              </p>
              <Link
                href="/about"
                className="inline-flex items-center gap-2 text-xs tracking-[0.2em] uppercase group"
              >
                Learn More <span className="group-hover:translate-x-2 transition-transform">→</span>
              </Link>
            </div>
            <div className="relative">
              <div className="relative aspect-[3/4] lg:h-[80vh]">
                {content.about.image ? (
                  <Image
                    src={content.about.image}
                    alt="About Instant Agency"
                    fill
                    className="object-cover grayscale"
                  />
                ) : (
                  <div className="absolute inset-0 bg-[var(--text)]/10" />
                )}
              </div>
              {content.about.stats.length > 0 && (
                <div className="absolute -bottom-8 -left-8 lg:-left-16 bg-theme-inverse text-theme-inverse p-8 lg:p-12">
                  {content.about.stats.map((stat, index) => (
                    <div key={stat.label} className={index < content.about.stats.length - 1 ? 'mb-6' : ''}>
                      <p className="font-serif text-4xl lg:text-5xl font-normal">{stat.value}</p>
                      <p className="text-xs tracking-[0.2em] uppercase opacity-60">{stat.label}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Let's Create Section */}
      <section className="min-h-screen flex flex-col items-center justify-center py-24 px-8 text-center">
        <p className="text-xs tracking-[0.3em] uppercase text-muted mb-8">{content.cta.sectionNumber}</p>
        <h2 className="font-serif text-5xl md:text-7xl lg:text-8xl font-normal mb-12">
          {content.cta.title}
        </h2>
        {content.cta.email && (
          <a
            href={`mailto:${content.cta.email}`}
            className="text-lg md:text-xl tracking-[0.3em] text-muted hover:text-theme transition-colors mb-16"
          >
            {content.cta.email}
          </a>
        )}
        {content.cta.socialLinks.length > 0 && (
          <div className="flex gap-12 mb-16">
            {content.cta.socialLinks.map((link) => (
              <a key={link.label} href={link.href} className="text-xs tracking-[0.2em] uppercase text-muted hover:text-theme transition-colors">
                {link.label}
              </a>
            ))}
          </div>
        )}
        {content.cta.offices.length > 0 && (
          <div className="flex flex-col md:flex-row gap-8 md:gap-16">
            {content.cta.offices.map((office) => (
              <div key={office.title} className="text-center">
                <h4 className="text-xs tracking-[0.2em] uppercase text-muted mb-2">{office.title}</h4>
                <p className="text-sm">{office.address}</p>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
