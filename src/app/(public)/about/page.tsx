'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { AboutPageContent } from '@/types';

const defaultContent: AboutPageContent = {
  hero: {
    label: 'Our Story',
    title: 'About',
    subtitle: '스튜디오, 모델 에이전시, 라이브 커머스를 아우르는 종합 크리에이티브 그룹',
  },
  story: {
    image: '',
    title: 'Beyond the\nOrdinary',
    paragraphs: [],
  },
  values: {
    title: 'Our Values',
    items: [],
  },
  timeline: {
    title: 'Our Journey',
    subtitle: 'Milestones',
    items: [],
  },
  cta: {
    title: 'Work With Us',
    buttonText: 'Get in Touch',
  },
};

export default function AboutPage() {
  const [content, setContent] = useState<AboutPageContent>(defaultContent);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const res = await fetch('/api/pages/about');
        const data = await res.json();
        if (data.success && data.data?.sections?.content) {
          setContent({ ...defaultContent, ...data.data.sections.content });
        }
      } catch (error) {
        console.error('Error fetching about content:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchContent();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--text)]"></div>
      </div>
    );
  }

  return (
    <div>
      {/* Hero */}
      <section className="min-h-screen flex flex-col justify-center items-center text-center px-8 relative">
        <p className="text-xs tracking-[0.3em] uppercase text-muted mb-6 animate-fade-up">
          {content.hero.label}
        </p>
        <h1 className="font-logo text-[clamp(3rem,12vw,10rem)] font-normal leading-[0.9] tracking-[-0.02em] animate-fade-up">
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

      {/* Story Section */}
      {(content.story.image || content.story.paragraphs.length > 0) && (
        <section className="py-24 px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-32 max-w-[1400px] mx-auto items-center">
            {/* Image */}
            <div className="relative group">
              <div className="relative h-[50vh] lg:h-[70vh] overflow-hidden">
                {content.story.image ? (
                  <Image
                    src={content.story.image}
                    alt="Instant Agency Studio"
                    fill
                    className="object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                  />
                ) : (
                  <div className="absolute inset-0 bg-[var(--text)]/10" />
                )}
              </div>
            </div>

            {/* Content */}
            <div>
              <h2 className="font-serif text-[clamp(2rem,4vw,3rem)] font-normal mb-8 leading-[1.3] whitespace-pre-line">
                {content.story.title}
              </h2>
              <div className="space-y-6 text-muted leading-relaxed">
                {content.story.paragraphs.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Values Section */}
      {content.values.items.length > 0 && (
        <section className="py-24 bg-theme-inverse text-theme-inverse">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-normal">
              {content.values.title}
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-[1200px] mx-auto px-8">
            {content.values.items.map((value, i) => (
              <div
                key={i}
                className="p-8 border border-current/10 text-center hover:border-current transition-colors"
              >
                <div className="text-3xl opacity-80 mb-6">{value.icon}</div>
                <h3 className="text-xl mb-4">{value.title}</h3>
                <p className="text-sm opacity-70 leading-relaxed">{value.desc}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Timeline Section */}
      {content.timeline.items.length > 0 && (
        <section className="py-24 px-8 overflow-hidden">
          <div className="text-center mb-16">
            <p className="text-xs tracking-widest uppercase text-muted mb-4">
              {content.timeline.subtitle}
            </p>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-normal">
              {content.timeline.title}
            </h2>
          </div>
          <div className="overflow-x-auto pb-8">
            <div className="flex gap-0 min-w-max px-8">
              {content.timeline.items.map((item, i) => (
                <div
                  key={i}
                  className="flex-shrink-0 w-[300px] px-8 text-center relative"
                >
                  <div className="absolute top-[60px] left-0 right-0 h-px bg-theme-20" />
                  <div className="relative z-10 mb-12">
                    <span className="text-3xl md:text-4xl">{item.year}</span>
                  </div>
                  <div className="w-3 h-3 border-2 border-theme rounded-full bg-[var(--bg)] mx-auto mb-8" />
                  <h3 className="text-lg mb-2">{item.title}</h3>
                  <p className="text-sm text-muted">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
          <p className="text-center text-xs tracking-wider uppercase text-muted opacity-60">
            ← Scroll to explore →
          </p>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-24 px-8 text-center border-t border-theme-10">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-normal mb-8">
          {content.cta.title}
        </h2>
        <Link
          href="/contact"
          className="inline-block px-12 py-5 border border-theme text-sm tracking-wider uppercase hover:bg-theme-inverse hover:text-theme-inverse transition-all duration-300"
        >
          {content.cta.buttonText}
        </Link>
      </section>
    </div>
  );
}
