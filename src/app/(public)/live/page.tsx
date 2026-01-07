'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { Creator, LiveVideo, LivePageContent } from '@/types';

const defaultContent: LivePageContent = {
  hero: {
    tag: 'Live Commerce',
    label: 'Live High With',
    title: 'Instant Agency',
    subtitle: '틱톡, 인스타그램 라이브를 통한 실시간 커머스 솔루션.\n크리에이터와 브랜드를 연결하고, 새로운 가능성을 만들어갑니다.',
  },
  cta: {
    title: 'Start Your Live Journey',
    description: '라이브 커머스로 브랜드의 새로운 가능성을 발견하세요.',
    buttonText: 'Get Started',
  },
};

export default function LivePage() {
  const [content, setContent] = useState<LivePageContent>(defaultContent);
  const [creators, setCreators] = useState<Creator[]>([]);
  const [liveVideos, setLiveVideos] = useState<LiveVideo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [pageRes, creatorsRes, videosRes] = await Promise.all([
          fetch('/api/pages/live'),
          fetch('/api/creators'),
          fetch('/api/live-videos'),
        ]);

        const pageData = await pageRes.json();
        const creatorsData = await creatorsRes.json();
        const videosData = await videosRes.json();

        if (pageData.success && pageData.data?.sections?.content) {
          setContent({ ...defaultContent, ...pageData.data.sections.content });
        }

        if (creatorsData.success) {
          setCreators(creatorsData.data || []);
        }

        if (videosData.success) {
          setLiveVideos(videosData.data || []);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
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
      <section className="min-h-screen flex flex-col justify-center items-center text-center px-8 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-[40vw] h-[40vw] bg-rose-500/10 rounded-full blur-[100px] animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-[30vw] h-[30vw] bg-rose-600/10 rounded-full blur-[80px] animate-pulse" style={{ animationDelay: '1s' }} />
        </div>

        <div className="relative z-10">
          <div className="inline-flex items-center gap-3 px-5 py-2.5 border border-rose-500/50 text-xs tracking-[0.3em] uppercase mb-8 animate-fade-up">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-500 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500" />
            </span>
            {content.hero.tag}
          </div>
          <p className="text-xs tracking-[0.3em] uppercase text-muted mb-6 animate-fade-up">
            {content.hero.label}
          </p>
          <h1 className="font-logo text-[clamp(3rem,12vw,10rem)] font-normal leading-[0.9] tracking-[-0.02em] animate-fade-up">
            {content.hero.title}
          </h1>
          <p className="text-muted mt-8 max-w-xl mx-auto leading-relaxed animate-fade-up-delay whitespace-pre-line">
            {content.hero.subtitle}
          </p>
        </div>

        <div className="absolute bottom-16 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 animate-fade-up-delay z-10">
          <span className="text-[0.65rem] tracking-[0.3em] uppercase text-muted">Scroll</span>
          <div className="w-px h-16 bg-gradient-to-b from-rose-500 to-transparent animate-scroll-pulse" />
        </div>
      </section>

      {/* Video Showcase */}
      {liveVideos.length > 0 && (
        <section className="py-16">
          <div className="text-center mb-12 px-8">
            <p className="text-xs tracking-widest uppercase text-rose-500 mb-4">
              Featured Content
            </p>
            <h2 className="text-4xl md:text-5xl font-normal">
              Live Highlights
            </h2>
          </div>
          <div className="flex flex-col">
            {liveVideos.map((item, index) => (
              <div
                key={item.id}
                className={`grid grid-cols-1 lg:grid-cols-2 min-h-[70vh] ${
                  index % 2 === 1 ? 'lg:flex-row-reverse' : ''
                }`}
                style={{ direction: index % 2 === 1 ? 'rtl' : 'ltr' }}
              >
                <div className="relative overflow-hidden bg-black" style={{ direction: 'ltr' }}>
                  <video
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="w-full h-full object-cover min-h-[50vh] lg:min-h-full"
                  >
                    <source src={item.videoUrl} type="video/mp4" />
                  </video>
                  <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black/80 to-transparent text-white">
                    <span className="inline-block px-3 py-1 bg-rose-500 text-xs tracking-wider uppercase mb-4">
                      {item.tag}
                    </span>
                    <h3 className="text-2xl mb-1">{item.title}</h3>
                    <p className="text-sm opacity-80">by {item.creator}</p>
                  </div>
                </div>

                <div className="flex flex-col justify-center p-8 lg:p-16 bg-theme-5" style={{ direction: 'ltr' }}>
                  <p className="text-xs tracking-widest uppercase text-rose-500 mb-6">
                    {item.label}
                  </p>
                  <h3 className="text-3xl md:text-4xl font-normal mb-6 whitespace-pre-line leading-tight">
                    {item.infoTitle}
                  </h3>
                  <p className="text-muted leading-relaxed mb-8">
                    {item.desc}
                  </p>
                  <div className="flex gap-12">
                    <div>
                      <p className="text-3xl text-rose-500 mb-1">{item.stats?.views || '-'}</p>
                      <p className="text-xs tracking-wider uppercase text-muted">Views</p>
                    </div>
                    <div>
                      <p className="text-3xl text-rose-500 mb-1">{item.stats?.conversion || '-'}</p>
                      <p className="text-xs tracking-wider uppercase text-muted">Conversion</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Creators */}
      {creators.length > 0 && (
        <section className="py-16 overflow-hidden">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 px-8 gap-4">
            <div>
              <p className="text-5xl md:text-6xl lg:text-7xl font-normal leading-none">
                <span className="text-rose-500">{creators.length}+</span>
              </p>
              <p className="text-5xl md:text-6xl lg:text-7xl font-normal">Creators</p>
            </div>
            <p className="text-xs tracking-wider uppercase text-muted md:text-right">
              Instant Agency Live Content Creator
            </p>
          </div>
          <div className="overflow-x-auto pb-8">
            <div className="flex gap-8 px-8 min-w-max">
              {creators.map((creator) => (
                <div key={creator.id} className="flex-shrink-0 w-[280px] group cursor-pointer">
                  <div className="relative aspect-[3/4] overflow-hidden mb-4">
                    {creator.image ? (
                      <Image
                        src={creator.image}
                        alt={creator.name}
                        fill
                        className="object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-[var(--text)]/10" />
                    )}
                  </div>
                  <h3 className="text-xl mb-1">{creator.name}</h3>
                  <p className="text-xs tracking-wider uppercase text-muted mb-3">
                    {creator.platform} · {creator.category}
                  </p>
                  <div className="flex gap-4 text-xs text-muted">
                    <span><strong className="text-theme">{creator.followers}</strong> Followers</span>
                    <span><strong className="text-theme">{creator.views}</strong> Views</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-24 px-8 text-center">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-normal mb-4">
          {content.cta.title}
        </h2>
        <p className="text-muted max-w-md mx-auto mb-8">
          {content.cta.description}
        </p>
        <Link
          href="/contact"
          className="inline-block px-12 py-5 bg-rose-500 text-white text-sm tracking-wider uppercase hover:opacity-90 transition-opacity"
        >
          {content.cta.buttonText}
        </Link>
      </section>
    </div>
  );
}
