import { Metadata } from 'next';
import { siteConfig, PageKey } from '@/config/site';

/**
 * 페이지별 메타데이터 생성 헬퍼 함수
 *
 * 사용법:
 * export const metadata = generateMetadata('about');
 *
 * 또는 커스텀 오버라이드:
 * export const metadata = generateMetadata('about', {
 *   title: '커스텀 타이틀',
 *   description: '커스텀 설명',
 * });
 */
export function generatePageMetadata(
  pageKey: PageKey,
  overrides?: Partial<Metadata>
): Metadata {
  const pageConfig = siteConfig.pages[pageKey];

  const metadata: Metadata = {
    title: pageConfig.title,
    description: pageConfig.description,
    openGraph: {
      title: pageConfig.title,
      description: pageConfig.description,
      url: `${siteConfig.url}/${pageKey === 'home' ? '' : pageKey}`,
      type: 'website',
    },
    twitter: {
      title: pageConfig.title,
      description: pageConfig.description,
    },
    alternates: {
      canonical: `${siteConfig.url}/${pageKey === 'home' ? '' : pageKey}`,
    },
    ...overrides,
  };

  return metadata;
}

/**
 * 모델 상세 페이지용 동적 메타데이터 생성
 */
export function generateModelMetadata(model: {
  name: string;
  nameKr?: string;
  slug: string;
  category: string;
  location: string;
  profileImage?: string;
  bio?: string;
}): Metadata {
  const title = `${model.name}${model.nameKr ? ` (${model.nameKr})` : ''} - Models | ${siteConfig.name}`;
  const description = model.bio
    ? model.bio.slice(0, 160)
    : `${model.name} - ${model.category} model based in ${model.location}. ${siteConfig.name}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `${siteConfig.url}/models/${model.slug}`,
      type: 'profile',
      images: model.profileImage
        ? [
            {
              url: model.profileImage,
              width: 800,
              height: 1067,
              alt: model.name,
            },
          ]
        : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: model.profileImage ? [model.profileImage] : undefined,
    },
    alternates: {
      canonical: `${siteConfig.url}/models/${model.slug}`,
    },
  };
}

/**
 * JSON-LD 구조화된 데이터 생성 (Organization)
 */
export function generateOrganizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.url,
    logo: `${siteConfig.url}/logo.png`,
    contactPoint: {
      '@type': 'ContactPoint',
      email: siteConfig.business.email,
      contactType: 'customer service',
    },
    sameAs: [
      siteConfig.social.instagram,
      siteConfig.social.youtube,
      siteConfig.social.tiktok,
    ].filter(Boolean),
  };
}

/**
 * JSON-LD 구조화된 데이터 생성 (Person/Model)
 */
export function generateModelJsonLd(model: {
  name: string;
  slug: string;
  profileImage?: string;
  bio?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: model.name,
    url: `${siteConfig.url}/models/${model.slug}`,
    image: model.profileImage,
    description: model.bio,
    worksFor: {
      '@type': 'Organization',
      name: siteConfig.name,
      url: siteConfig.url,
    },
  };
}
