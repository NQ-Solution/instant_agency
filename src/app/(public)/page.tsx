'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import PageGuard from '@/components/public/PageGuard';
import type { HomePageContent } from '@/types';

function getYouTubeId(url: string): string {
  const match = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
  return match ? match[1] : '';
}

function getVimeoId(url: string): string {
  const match = url.match(/(?:vimeo\.com\/)(\d+)/);
  return match ? match[1] : '';
}

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
  video: {
    sectionNumber: '03',
    title: 'Watch Our Story',
    subtitle: '',
    videoType: 'youtube',
    videoUrl: '',
    autoplay: false,
    muted: true,
    loop: false,
  },
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

interface Model {
  id: string;
  slug: string;
  name: string;
  profileImage: string;
  location: string;
  category: string;
  stats: { height?: string };
  social?: { instagram?: string; tiktok?: string; youtube?: string };
}

export default function HomePage() {
  const router = useRouter();
  const [content, setContent] = useState<HomePageContent>(defaultContent);
  const [featuredModels, setFeaturedModels] = useState<Model[]>([]);
  const [loading, setLoading] = useState(true);
  const [touchedModelId, setTouchedModelId] = useState<string | null>(null);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    // 터치 디바이스 감지
    setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0);
  }, []);

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

  // 외부 클릭 시 터치 상태 초기화
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent | TouchEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.model-card')) {
        setTouchedModelId(null);
      }
    };

    document.addEventListener('click', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, []);

  const handleModelClick = useCallback((e: React.MouseEvent | React.TouchEvent, model: Model) => {
    // 데스크톱이면 기본 동작 (바로 이동)
    if (!isTouchDevice) {
      return;
    }

    // SNS 링크 클릭이면 무시
    const target = e.target as HTMLElement;
    if (target.closest('a[target="_blank"]')) {
      return;
    }

    e.preventDefault();
    e.stopPropagation();

    // 이미 선택된 모델을 다시 터치하면 상세 페이지로 이동
    if (touchedModelId === model.id) {
      router.push(`/models/${model.slug}`);
      return;
    }

    // 첫 번째 터치: SNS 오버레이 표시
    setTouchedModelId(model.id);
  }, [isTouchDevice, touchedModelId, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-current"></div>
      </div>
    );
  }

  return (
    <PageGuard pageKey="home">
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
            {featuredModels.map((model) => {
              const social = model.social;
              const hasSocial = social?.instagram || social?.tiktok || social?.youtube;
              const isActive = isTouchDevice ? touchedModelId === model.id : false;

              return (
                <div
                  key={model.slug}
                  className={`model-card group block relative aspect-[3/4] overflow-hidden cursor-pointer ${isActive ? 'is-active' : ''}`}
                  onClick={(e) => handleModelClick(e, model)}
                  onTouchEnd={(e) => handleModelClick(e, model)}
                >
                  {/* 데스크톱: Link로 이동 / 모바일: onClick으로 처리 */}
                  {!isTouchDevice ? (
                    <Link href={`/models/${model.slug}`} className="block w-full h-full">
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
                    </Link>
                  ) : (
                    <>
                      {model.profileImage ? (
                        <Image
                          src={model.profileImage}
                          alt={model.name}
                          fill
                          className={`object-cover transition-all duration-600 ${isActive ? 'grayscale-0 scale-105' : 'grayscale'}`}
                        />
                      ) : (
                        <div className="absolute inset-0 bg-[var(--text)]/10" />
                      )}
                      <div className={`absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent transition-opacity duration-400 ${isActive ? 'opacity-100' : 'opacity-0'}`} />
                    </>
                  )}

                  {/* Hover/Touch Info */}
                  <div className={`absolute bottom-0 left-0 right-0 p-6 text-white transition-all duration-400 pointer-events-none ${
                    isTouchDevice
                      ? (isActive ? 'translate-y-0 opacity-100 pointer-events-auto' : 'translate-y-5 opacity-0')
                      : 'translate-y-5 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 group-hover:pointer-events-auto'
                  }`}>
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-serif text-xl md:text-2xl">{model.name}</h3>

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
                    <p className="text-[0.7rem] tracking-[0.2em] uppercase text-gray-400">
                      {model.location} · {model.stats?.height || ''} · {model.category}
                    </p>
                    {/* 모바일: 탭 안내 */}
                    {isTouchDevice && isActive && (
                      <p className="text-[10px] tracking-wider uppercase text-gray-500 mt-2">
                        한번 더 터치하면 프로필 보기
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
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
          <div className="text-center px-8 mb-8 md:mb-16">
            <p className="text-xs tracking-[0.3em] uppercase text-muted mb-4">{content.divisions.sectionNumber}</p>
            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-normal">
              {content.divisions.title}
            </h2>
          </div>
          {/* Mobile: 가로 스크롤 */}
          <div className="md:hidden overflow-x-auto scrollbar-hide">
            <div className="flex gap-4 px-4 pb-4" style={{ width: `${content.divisions.items.length * 280 + (content.divisions.items.length - 1) * 16 + 32}px` }}>
              {content.divisions.items.map((division) => (
                <Link
                  key={division.id}
                  href={division.href}
                  className="group relative w-[280px] flex-shrink-0 aspect-[3/4] overflow-hidden block rounded-lg"
                >
                  {division.image ? (
                    <Image
                      src={division.image}
                      alt={division.title}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-[var(--text)]/10" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
                    <p className="text-[0.6rem] tracking-[0.3em] text-gray-400 mb-2">
                      {division.number}
                    </p>
                    <h3 className="font-serif text-xl mb-2 tracking-wide">
                      {division.title}
                    </h3>
                    <p className="text-xs leading-relaxed text-gray-400 line-clamp-2">
                      {division.desc}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
            <p className="text-center text-[0.65rem] tracking-wider uppercase text-muted mt-2">
              ← 스와이프 →
            </p>
          </div>
          {/* Desktop: 그리드 */}
          <div className="hidden md:grid md:grid-cols-3">
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

      {/* Video Section */}
      {content.video?.videoUrl && (
        <section className="min-h-screen flex flex-col justify-center py-24 px-8">
          <div className="text-center mb-12">
            <p className="text-xs tracking-[0.3em] uppercase text-muted mb-4">{content.video.sectionNumber}</p>
            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-normal mb-4">
              {content.video.title}
            </h2>
            {content.video.subtitle && (
              <p className="text-muted text-lg max-w-2xl mx-auto">{content.video.subtitle}</p>
            )}
          </div>
          <div className="max-w-5xl mx-auto w-full">
            {content.video.videoType === 'youtube' ? (
              <div className="relative aspect-video w-full overflow-hidden rounded-lg">
                <iframe
                  src={`https://www.youtube.com/embed/${getYouTubeId(content.video.videoUrl)}${content.video.autoplay ? '?autoplay=1' : ''}${content.video.muted ? '&mute=1' : ''}${content.video.loop ? '&loop=1' : ''}`}
                  className="absolute inset-0 w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            ) : content.video.videoType === 'vimeo' ? (
              <div className="relative aspect-video w-full overflow-hidden rounded-lg">
                <iframe
                  src={`https://player.vimeo.com/video/${getVimeoId(content.video.videoUrl)}${content.video.autoplay ? '?autoplay=1' : ''}${content.video.muted ? '&muted=1' : ''}${content.video.loop ? '&loop=1' : ''}`}
                  className="absolute inset-0 w-full h-full"
                  allow="autoplay; fullscreen; picture-in-picture"
                  allowFullScreen
                />
              </div>
            ) : (
              <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-black">
                <video
                  src={content.video.videoUrl}
                  className="absolute inset-0 w-full h-full object-cover"
                  controls
                  autoPlay={content.video.autoplay}
                  muted={content.video.muted}
                  loop={content.video.loop}
                  poster={content.video.thumbnailUrl}
                />
              </div>
            )}
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
    </PageGuard>
  );
}
