import Link from 'next/link';
import Image from 'next/image';

const divisions = [
  {
    id: 'studio',
    number: '01',
    title: 'Photo Studio',
    desc: '전문 촬영 장비와 공간을 갖춘 프리미엄 스튜디오. 화보, 광고, 프로필 촬영까지.',
    image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800',
    href: '/studio',
  },
  {
    id: 'models',
    number: '02',
    title: 'Model Agency',
    desc: '독보적인 재능을 가진 모델 발굴과 체계적인 매니지먼트 서비스.',
    image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800',
    href: '/models',
  },
  {
    id: 'live',
    number: '03',
    title: 'Live Commerce',
    desc: '틱톡, 인스타 라이브 등 실시간 스트리밍 콘텐츠 제작 및 커머스 솔루션.',
    image: 'https://images.unsplash.com/photo-1611162616475-46b635cb6868?w=800',
    href: '/live',
  },
];

const featuredModels = [
  { name: 'Aria Kim', stats: 'Seoul · 178cm · Women', image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600', slug: 'aria-kim' },
  { name: 'Luna Park', stats: 'Paris · 175cm · Women', image: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=600', slug: 'luna-park' },
  { name: 'Mia Chen', stats: 'Milan · 180cm · Women', image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=600', slug: 'mia-chen' },
  { name: 'Zoe Lee', stats: 'NYC · 177cm · Women', image: 'https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?w=600', slug: 'zoe-lee' },
  { name: 'Hana Lee', stats: 'Tokyo · 179cm · Women', image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=600', slug: 'hana-lee' },
  { name: 'Sora Kim', stats: 'London · 176cm · Women', image: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=600', slug: 'sora-kim' },
  { name: 'James Park', stats: 'Seoul · 188cm · Men', image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=600', slug: 'james-park' },
  { name: 'Daniel Kim', stats: 'Paris · 185cm · Men', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600', slug: 'daniel-kim' },
];

const stats = [
  { value: '150+', label: 'Elite Models' },
  { value: '50+', label: 'Countries' },
  { value: '1K+', label: 'Campaigns' },
  { value: '14', label: 'Years' },
];

export default function HomePage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="min-h-screen flex flex-col justify-center items-center text-center px-8 relative">
        {/* Logo + Text Group */}
        <div className="flex flex-col items-center animate-fade-up">
          <img
            src="/logo.png"
            alt="Instant Agency"
            className="w-40 h-40 md:w-56 md:h-56 lg:w-72 lg:h-72 no-grayscale"
            style={{ filter: 'var(--logo-filter, none)' }}
          />
          <h1 className="font-logo text-4xl md:text-5xl lg:text-6xl font-bold leading-[1] tracking-[0.3em] -mt-2">
            Instant Agency
          </h1>
        </div>
        <p className="font-logo text-xs md:text-sm tracking-[0.15em] text-muted mt-4 animate-fade-up-delay">
          Creative Studio & Management
        </p>

        {/* Scroll Indicator */}
        <div className="absolute bottom-16 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 animate-fade-up-delay">
          <span className="text-[0.65rem] tracking-[0.3em] uppercase text-muted">Scroll</span>
          <div className="w-px h-16 bg-gradient-to-b from-current to-transparent animate-scroll-pulse" />
        </div>
      </section>

      {/* Divisions Section */}
      <section className="min-h-screen flex flex-col justify-center pt-16">
        <div className="text-center px-8 mb-16">
          <p className="text-xs tracking-[0.3em] uppercase text-muted mb-4">01</p>
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-normal">
            What We Do
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3">
          {divisions.map((division) => (
            <Link
              key={division.id}
              href={division.href}
              className="group relative aspect-[4/5] overflow-hidden block"
            >
              <Image
                src={division.image}
                alt={division.title}
                fill
                className="object-cover grayscale group-hover:grayscale-[50%] group-hover:scale-105 transition-all duration-600"
              />
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

      {/* Featured Models */}
      <section className="min-h-screen flex flex-col justify-center pt-16">
        <div className="text-center px-8 mb-16">
          <p className="text-xs tracking-[0.3em] uppercase text-muted mb-4">02</p>
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-normal">
            Our Talents
          </h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4">
          {featuredModels.map((model) => (
            <Link
              key={model.slug}
              href={`/models/${model.slug}`}
              className="group block relative aspect-[3/4] overflow-hidden"
            >
              <Image
                src={model.image}
                alt={model.name}
                fill
                className="object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-600"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400" />
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white translate-y-5 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-400">
                <h3 className="font-serif text-xl md:text-2xl mb-2">{model.name}</h3>
                <p className="text-[0.7rem] tracking-[0.2em] uppercase text-gray-400">
                  {model.stats}
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
            View All Models
          </Link>
        </div>
      </section>

      {/* Stats Section */}
      <section className="min-h-[50vh] flex items-center bg-theme-inverse text-theme-inverse">
        <div className="grid grid-cols-2 md:grid-cols-4 w-full max-w-[1400px] mx-auto">
          {stats.map((stat, index) => (
            <div
              key={stat.label}
              className={`py-16 px-8 text-center ${index < stats.length - 1 ? 'md:border-r border-current/10' : ''} ${index < 2 ? 'border-b md:border-b-0 border-current/10' : ''}`}
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

      {/* About Preview */}
      <section className="min-h-screen flex items-center py-24 px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-32 max-w-[1400px] mx-auto">
          <div className="flex flex-col justify-center">
            <p className="text-xs tracking-[0.3em] uppercase text-muted mb-4">04</p>
            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-normal mb-8 leading-tight">
              Creative<br />Beyond Limits
            </h2>
            <p className="text-muted leading-loose mb-8">
              Instant Agency는 스튜디오, 모델 에이전시, 라이브 커머스를 아우르는 종합 크리에이티브 그룹입니다.
              각 분야의 전문성을 바탕으로 브랜드와 크리에이터에게 최상의 솔루션을 제공합니다.
              <br /><br />
              프리미엄 촬영 공간부터 모델 매니지먼트, 실시간 라이브 콘텐츠 제작까지,
              Instant Agency와 함께라면 모든 크리에이티브 니즈를 한 곳에서 해결할 수 있습니다.
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
              <Image
                src="https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=800"
                alt="About Instant Agency"
                fill
                className="object-cover grayscale"
              />
            </div>
            <div className="absolute -bottom-8 -left-8 lg:-left-16 bg-theme-inverse text-theme-inverse p-8 lg:p-12">
              <div className="mb-6">
                <p className="font-serif text-4xl lg:text-5xl font-normal">150+</p>
                <p className="text-xs tracking-[0.2em] uppercase opacity-60">Models Worldwide</p>
              </div>
              <div className="mb-6">
                <p className="font-serif text-4xl lg:text-5xl font-normal">14</p>
                <p className="text-xs tracking-[0.2em] uppercase opacity-60">Years Experience</p>
              </div>
              <div>
                <p className="font-serif text-4xl lg:text-5xl font-normal">500+</p>
                <p className="text-xs tracking-[0.2em] uppercase opacity-60">Brand Partners</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Let's Create Section */}
      <section className="min-h-screen flex flex-col items-center justify-center py-24 px-8 text-center">
        <p className="text-xs tracking-[0.3em] uppercase text-muted mb-8">06</p>
        <h2 className="font-serif text-5xl md:text-7xl lg:text-8xl font-normal mb-12">
          Let&apos;s Create
        </h2>
        <a
          href="mailto:hello@instantagency.com"
          className="text-lg md:text-xl tracking-[0.3em] text-muted hover:text-theme transition-colors mb-16"
        >
          hello@instantagency.com
        </a>
        <div className="flex gap-12 mb-16">
          <a href="#" className="text-xs tracking-[0.2em] uppercase text-muted hover:text-theme transition-colors">
            Instagram
          </a>
          <a href="#" className="text-xs tracking-[0.2em] uppercase text-muted hover:text-theme transition-colors">
            LinkedIn
          </a>
          <a href="#" className="text-xs tracking-[0.2em] uppercase text-muted hover:text-theme transition-colors">
            Twitter
          </a>
        </div>
        <div className="flex flex-col md:flex-row gap-8 md:gap-16">
          <div className="text-center">
            <h4 className="text-xs tracking-[0.2em] uppercase text-muted mb-2">Seoul Office</h4>
            <p className="text-sm">Gangnam-gu, Seoul</p>
          </div>
          <div className="text-center">
            <h4 className="text-xs tracking-[0.2em] uppercase text-muted mb-2">Paris Office</h4>
            <p className="text-sm">Le Marais, Paris</p>
          </div>
          <div className="text-center">
            <h4 className="text-xs tracking-[0.2em] uppercase text-muted mb-2">NYC Office</h4>
            <p className="text-sm">SoHo, New York</p>
          </div>
        </div>
      </section>
    </div>
  );
}
