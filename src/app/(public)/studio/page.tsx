import Link from 'next/link';
import Image from 'next/image';
import prisma from '@/lib/db';
import type { StudioPageContent } from '@/types';

// Disable caching to always fetch fresh data
export const dynamic = 'force-dynamic';
export const revalidate = 0;

const defaultContent: StudioPageContent = {
  hero: {
    tag: 'Photo Studio',
    label: 'Create Your Vision',
    title: 'Studio',
    subtitle: '프로페셔널 촬영을 위한 프리미엄 스튜디오 공간을 제공합니다',
  },
  info: {
    image: '',
    label: 'Studio Rental',
    title: '공간 대여 서비스',
    description: '화보, 광고, 프로필 촬영을 위한 전문 스튜디오 공간을 대여해 드립니다. 최신 장비와 편의시설을 갖춘 프리미엄 환경에서 완벽한 결과물을 만들어보세요.',
    features: [],
    linkText: '문의하기',
  },
  cta: {
    title: '스튜디오 예약',
    description: '촬영 일정과 요청사항을 알려주시면 맞춤 견적을 안내해 드립니다.',
    buttonText: 'Contact Us',
  },
};

async function getStudioContent(): Promise<StudioPageContent> {
  try {
    const page = await prisma.page.findUnique({ where: { pageId: 'studio' } });
    if (page?.sections && typeof page.sections === 'object') {
      const sections = page.sections as { content?: StudioPageContent };
      if (sections.content) {
        return {
          hero: { ...defaultContent.hero, ...sections.content.hero },
          info: { ...defaultContent.info, ...sections.content.info },
          cta: { ...defaultContent.cta, ...sections.content.cta },
        };
      }
    }
  } catch (error) {
    console.error('Error fetching studio content:', error);
  }
  return defaultContent;
}

export default async function StudioPage() {
  const content = await getStudioContent();

  return (
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

      {/* Studio Info */}
      <section className="grid grid-cols-1 lg:grid-cols-2 min-h-[70vh]">
        <div className="relative aspect-square lg:aspect-auto">
          {content.info.image ? (
            <Image
              src={content.info.image}
              alt="Studio Space"
              fill
              className="object-cover grayscale hover:grayscale-0 transition-all duration-700"
            />
          ) : (
            <div className="absolute inset-0 bg-[var(--text)]/10" />
          )}
        </div>
        <div className="flex flex-col justify-center p-12 lg:p-20">
          <p className="text-xs tracking-widest uppercase text-muted mb-6">
            {content.info.label}
          </p>
          <h2 className="text-4xl md:text-5xl font-normal mb-8">
            {content.info.title}
          </h2>
          <p className="text-lg text-muted leading-relaxed mb-8">
            {content.info.description}
          </p>
          {content.info.features.length > 0 && (
            <ul className="space-y-4 mb-12">
              {content.info.features.map((feature, i) => (
                <li key={i} className="flex items-center gap-4 text-muted">
                  <span className="w-2 h-2 bg-[var(--text)] rounded-full" />
                  {feature}
                </li>
              ))}
            </ul>
          )}
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 text-xs tracking-wider uppercase hover:opacity-70 transition-opacity"
          >
            {content.info.linkText}
            <span>→</span>
          </Link>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-8 text-center bg-theme-inverse text-theme-inverse">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-normal mb-4">
          {content.cta.title}
        </h2>
        <p className="opacity-60 max-w-md mx-auto mb-8">
          {content.cta.description}
        </p>
        <Link
          href="/contact"
          className="inline-block px-12 py-5 bg-theme text-theme text-sm tracking-wider uppercase hover:opacity-90 transition-opacity"
        >
          {content.cta.buttonText}
        </Link>
      </section>
    </div>
  );
}
