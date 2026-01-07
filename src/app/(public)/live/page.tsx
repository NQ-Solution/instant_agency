'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { Creator, LiveVideo } from '@/types';

const defaultVideoShowcase: LiveVideo[] = [
  {
    id: '1',
    tag: 'Fashion Live',
    title: 'Summer Collection Launch',
    creator: 'Yuna Kim',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-woman-modeling-for-a-photo-shoot-40291-large.mp4',
    label: 'Fashion & Beauty',
    infoTitle: '실시간 패션쇼로\n트렌드를 선도하다',
    desc: '라이브 커머스를 통해 최신 컬렉션을 실시간으로 선보이고, 시청자와 직접 소통하며 즉각적인 구매 전환을 이끌어냅니다.',
    stats: { views: '2.5M', conversion: '12.8%' },
    order: 1,
    active: true,
  },
  {
    id: '2',
    tag: 'Beauty Live',
    title: 'K-Beauty Masterclass',
    creator: 'Soo Min',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-putting-makeup-on-a-model-for-a-beauty-shoot-39880-large.mp4',
    label: 'Beauty Tutorial',
    infoTitle: '뷰티 라이브로\n브랜드 가치를 높이다',
    desc: '전문 메이크업 아티스트가 제품을 실시간으로 시연하고, 시청자의 질문에 즉시 답변하며 신뢰를 구축합니다.',
    stats: { views: '1.8M', conversion: '9.5%' },
    order: 2,
    active: true,
  },
  {
    id: '3',
    tag: 'Lifestyle Live',
    title: 'Urban Life Essentials',
    creator: 'Jin Park',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-young-woman-vlogging-over-a-city-background-2-41379-large.mp4',
    label: 'Lifestyle Content',
    infoTitle: '일상을 공유하며\n팬들과 함께하다',
    desc: '일상 브이로그 형식의 자연스러운 라이브로 팬덤을 구축하고, 진정성 있는 브랜드 메시지를 전달합니다.',
    stats: { views: '3.2M', conversion: '15.2%' },
    order: 3,
    active: true,
  },
];

const services = [
  { num: '01', title: 'Live Management', desc: '크리에이터의 라이브 방송 스케줄링부터 실시간 운영까지 전문적으로 관리합니다.', features: ['스케줄 관리', '실시간 모니터링', '위기 대응'] },
  { num: '02', title: 'Content Monetization', desc: '다양한 수익화 채널을 통해 크리에이터의 수익을 극대화합니다.', features: ['브랜드 협찬', '커머스 연동', '후원 시스템'] },
  { num: '03', title: 'Production Support', desc: '고품질 콘텐츠 제작을 위한 스튜디오와 장비를 지원합니다.', features: ['전문 스튜디오', '촬영 장비', '편집 지원'] },
  { num: '04', title: 'Data Consulting', desc: '데이터 기반의 인사이트로 성장 전략을 제시합니다.', features: ['성과 분석', '트렌드 리포트', '성장 전략'] },
];

const showcaseItems = [
  {
    label: 'To Brands',
    title: 'Live Entertainment',
    desc: '실시간으로 소통하며 브랜드의 이야기를 전달합니다. 엔터테인먼트 요소와 커머스를 결합한 새로운 형태의 마케팅을 경험하세요.',
    features: ['실시간 Q&A 및 소통', '인플루언서 콜라보레이션', '바이럴 콘텐츠 제작'],
    image: 'https://images.unsplash.com/photo-1611162616475-46b635cb6868?w=1200',
  },
  {
    label: 'To Brands',
    title: 'Live Commerce Solution',
    desc: '기획부터 방송, 결제까지 원스톱 라이브 커머스 솔루션을 제공합니다. 전문 호스트와 함께 높은 전환율을 달성하세요.',
    features: ['전문 쇼호스트 매칭', '결제 시스템 연동', '실시간 데이터 대시보드'],
    image: 'https://images.unsplash.com/photo-1516321497487-e288fb19713f?w=1200',
  },
];

const stats = [
  { value: '100+', label: 'Creators' },
  { value: '500M+', label: 'Total Views' },
  { value: '8.5%', label: 'Avg. Conversion' },
  { value: '200+', label: 'Brand Partners' },
];

const sampleCreators: Creator[] = [
  { id: '1', name: 'Yuna Kim', platform: 'TikTok', category: 'Fashion', image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400', followers: '1.2M', views: '50M', featured: true, active: true, order: 1 },
  { id: '2', name: 'Soo Min', platform: 'Instagram', category: 'Beauty', image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400', followers: '850K', views: '35M', featured: true, active: true, order: 2 },
  { id: '3', name: 'Jin Park', platform: 'TikTok', category: 'Lifestyle', image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400', followers: '2.1M', views: '80M', featured: false, active: true, order: 3 },
  { id: '4', name: 'Hana Lee', platform: 'Instagram', category: 'Food', image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400', followers: '600K', views: '25M', featured: false, active: true, order: 4 },
  { id: '5', name: 'Chris Jung', platform: 'TikTok', category: 'Tech', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400', followers: '1.5M', views: '60M', featured: false, active: true, order: 5 },
  { id: '6', name: 'Mia Choi', platform: 'Instagram', category: 'Fashion', image: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400', followers: '920K', views: '40M', featured: false, active: true, order: 6 },
];

export default function LivePage() {
  const [creators, setCreators] = useState<Creator[]>([]);
  const [liveVideos, setLiveVideos] = useState<LiveVideo[]>(defaultVideoShowcase);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch creators and live videos in parallel
        const [creatorsRes, videosRes] = await Promise.all([
          fetch('/api/creators'),
          fetch('/api/live-videos'),
        ]);

        const creatorsData = await creatorsRes.json();
        const videosData = await videosRes.json();

        if (creatorsData.success && creatorsData.data.length > 0) {
          setCreators(creatorsData.data);
        } else {
          setCreators(sampleCreators);
        }

        if (videosData.success && videosData.data.length > 0) {
          setLiveVideos(videosData.data);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setCreators(sampleCreators);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const displayCreators = creators.length > 0 ? creators : sampleCreators;
  const displayVideos = liveVideos;

  return (
    <div>
      {/* Hero */}
      <section className="min-h-screen flex flex-col justify-center items-center text-center px-8 relative overflow-hidden">
        {/* Red Flourish Background */}
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
            Live Commerce
          </div>
          <p className="text-xs tracking-[0.3em] uppercase text-muted mb-6 animate-fade-up">
            Live High With
          </p>
          <h1 className="font-logo text-[clamp(3rem,12vw,10rem)] font-normal leading-[0.9] tracking-[-0.02em] animate-fade-up">
            Instant Agency
          </h1>
          <p className="text-muted mt-8 max-w-xl mx-auto leading-relaxed animate-fade-up-delay">
            틱톡, 인스타그램 라이브를 통한 실시간 커머스 솔루션.<br />
            크리에이터와 브랜드를 연결하고, 새로운 가능성을 만들어갑니다.
          </p>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-16 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 animate-fade-up-delay z-10">
          <span className="text-[0.65rem] tracking-[0.3em] uppercase text-muted">Scroll</span>
          <div className="w-px h-16 bg-gradient-to-b from-rose-500 to-transparent animate-scroll-pulse" />
        </div>
      </section>

      {/* Video Showcase */}
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
          {displayVideos.map((item, index) => (
            <div
              key={item.title}
              className={`grid grid-cols-1 lg:grid-cols-2 min-h-[70vh] ${
                index % 2 === 1 ? 'lg:flex-row-reverse' : ''
              }`}
              style={{ direction: index % 2 === 1 ? 'rtl' : 'ltr' }}
            >
              {/* Video */}
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

              {/* Info */}
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
                    <p className="text-3xl text-rose-500 mb-1">{item.stats.views}</p>
                    <p className="text-xs tracking-wider uppercase text-muted">Views</p>
                  </div>
                  <div>
                    <p className="text-3xl text-rose-500 mb-1">{item.stats.conversion}</p>
                    <p className="text-xs tracking-wider uppercase text-muted">Conversion</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Services */}
      <section className="py-16">
        <div className="text-center mb-16 px-8">
          <p className="text-xs tracking-widest uppercase text-rose-500 mb-4">
            For Creators
          </p>
          <h2 className="text-4xl md:text-5xl font-normal">
            What We Offer
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
          {services.map((service) => (
            <div
              key={service.num}
              className="p-8 border border-theme-10 hover:bg-rose-500/5 transition-colors"
            >
              <p className="text-4xl text-rose-500 mb-6">{service.num}</p>
              <h3 className="text-xl mb-4">{service.title}</h3>
              <p className="text-sm text-muted leading-relaxed mb-6">{service.desc}</p>
              <ul className="space-y-2">
                {service.features.map((feature) => (
                  <li key={feature} className="text-xs text-muted flex items-center gap-2">
                    <span className="text-rose-500">→</span>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Showcase (To Brands) */}
      <section className="py-16">
        {showcaseItems.map((item, index) => (
          <div
            key={item.title}
            className={`grid grid-cols-1 lg:grid-cols-2 min-h-[80vh] ${
              index % 2 === 1 ? 'lg:flex-row-reverse' : ''
            }`}
            style={{ direction: index % 2 === 1 ? 'rtl' : 'ltr' }}
          >
            {/* Image */}
            <div className="relative aspect-square lg:aspect-auto overflow-hidden" style={{ direction: 'ltr' }}>
              <Image
                src={item.image}
                alt={item.title}
                fill
                className="object-cover grayscale hover:grayscale-0 transition-all duration-700"
              />
            </div>

            {/* Content */}
            <div className="flex flex-col justify-center p-8 lg:p-16 bg-theme-5" style={{ direction: 'ltr' }}>
              <p className="text-xs tracking-widest uppercase text-rose-500 mb-6">
                {item.label}
              </p>
              <h3 className="text-3xl md:text-4xl font-normal mb-6">
                {item.title}
              </h3>
              <p className="text-muted leading-relaxed mb-8">
                {item.desc}
              </p>
              <ul className="space-y-3 mb-8">
                {item.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-3 py-2 border-b border-theme-10">
                    <span className="text-rose-500 text-xs">◇</span>
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 text-xs tracking-wider uppercase hover:text-rose-500 transition-colors"
              >
                Learn More
                <span>→</span>
              </Link>
            </div>
          </div>
        ))}
      </section>

      {/* Creators */}
      <section className="py-16 overflow-hidden">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 px-8 gap-4">
          <div>
            <p className="text-5xl md:text-6xl lg:text-7xl font-normal leading-none">
              <span className="text-rose-500">100+</span>
            </p>
            <p className="text-5xl md:text-6xl lg:text-7xl font-normal">Creators</p>
          </div>
          <p className="text-xs tracking-wider uppercase text-muted md:text-right">
            Instant Agency Live Content Creator
          </p>
        </div>
        <div className="overflow-x-auto pb-8">
          <div className="flex gap-8 px-8 min-w-max">
            {displayCreators.map((creator) => (
              <div key={creator.id} className="flex-shrink-0 w-[280px] group cursor-pointer">
                <div className="relative aspect-[3/4] overflow-hidden mb-4">
                  <Image
                    src={creator.image}
                    alt={creator.name}
                    fill
                    className="object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                  />
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

      {/* Stats */}
      <section className="py-16 bg-theme-inverse text-theme-inverse">
        <div className="grid grid-cols-2 md:grid-cols-4">
          {stats.map((stat, index) => (
            <div key={stat.label} className={`py-12 px-8 text-center ${index < stats.length - 1 ? 'border-r border-current/10' : ''}`}>
              <p className="text-4xl md:text-5xl lg:text-6xl font-normal leading-none mb-2">
                {stat.value}
              </p>
              <p className="text-xs tracking-wider uppercase opacity-60">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-8 text-center">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-normal mb-4">
          Start Your Live Journey
        </h2>
        <p className="text-muted max-w-md mx-auto mb-8">
          라이브 커머스로 브랜드의 새로운 가능성을 발견하세요.
        </p>
        <Link
          href="/contact"
          className="inline-block px-12 py-5 bg-rose-500 text-white text-sm tracking-wider uppercase hover:opacity-90 transition-opacity"
        >
          Get Started
        </Link>
      </section>
    </div>
  );
}
