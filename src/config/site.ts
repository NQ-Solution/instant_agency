/**
 * ===========================================
 * SITE CONFIGURATION - SEO & 메타데이터 설정
 * ===========================================
 *
 * 이 파일에서 사이트의 모든 SEO 관련 설정을 관리합니다.
 * 수정이 필요한 경우 아래 값들을 직접 변경하세요.
 */

export const siteConfig = {
  // ==========================================
  // 기본 사이트 정보
  // ==========================================
  name: 'Instant Agency',
  title: 'Instant Agency - Creative Studio & Model Agency',
  description: '스튜디오, 모델 에이전시, 라이브 커머스를 아우르는 종합 크리에이티브 그룹. 브랜드와 크리에이터를 연결하고 새로운 가치를 만들어갑니다.',

  // 사이트 URL (배포 후 실제 URL로 변경하세요)
  url: 'https://instantagency.co.kr',

  // 기본 OG 이미지 (1200x630 권장)
  ogImage: '/og-image.jpg',

  // 언어 설정
  locale: 'ko_KR',
  language: 'ko',

  // ==========================================
  // 비즈니스 정보
  // ==========================================
  business: {
    email: 'contact@instantagency.co.kr',
    phone: '',
    address: '',
  },

  // ==========================================
  // 소셜 미디어 링크
  // ==========================================
  social: {
    instagram: 'https://instagram.com/instantagency',
    youtube: '',
    tiktok: '',
    twitter: '', // X (Twitter) - SEO용
  },

  // ==========================================
  // SEO 키워드
  // ==========================================
  keywords: [
    '모델 에이전시',
    'model agency',
    '크리에이티브 스튜디오',
    'creative studio',
    '라이브 커머스',
    'live commerce',
    '패션 모델',
    'fashion model',
    '사진 스튜디오',
    'photo studio',
    '인플루언서 마케팅',
    'influencer marketing',
    '브랜드 콜라보',
  ],

  // ==========================================
  // 작성자 정보
  // ==========================================
  author: {
    name: 'Instant Agency',
    url: 'https://instantagency.co.kr',
  },

  // ==========================================
  // 페이지별 SEO 설정
  // ==========================================
  pages: {
    home: {
      title: 'Instant Agency - Creative Studio & Model Agency',
      description: '스튜디오, 모델 에이전시, 라이브 커머스를 아우르는 종합 크리에이티브 그룹',
    },
    about: {
      title: 'About - Instant Agency',
      description: 'Instant Agency의 스토리와 가치를 소개합니다. 크리에이티브의 새로운 가능성을 탐구하는 종합 크리에이티브 그룹입니다.',
    },
    studio: {
      title: 'Studio - Instant Agency',
      description: '프로페셔널 촬영을 위한 프리미엄 스튜디오 공간. 화보, 광고, 프로필 촬영을 위한 전문 스튜디오를 대여해 드립니다.',
    },
    models: {
      title: 'Models - Instant Agency',
      description: '국내외 최고의 패션 모델들과 함께합니다. Instant Agency의 전문 모델 로스터를 만나보세요.',
    },
    live: {
      title: 'Live Commerce - Instant Agency',
      description: '틱톡, 인스타그램 라이브를 통한 실시간 커머스 솔루션. 크리에이터와 브랜드를 연결하고 새로운 가능성을 만들어갑니다.',
    },
    contact: {
      title: 'Contact - Instant Agency',
      description: '프로필 접수, 촬영 문의, 라이브 커머스 협업 등 다양한 문의를 받고 있습니다.',
    },
    privacy: {
      title: '개인정보 처리방침 - Instant Agency',
      description: 'Instant Agency 개인정보 처리방침',
    },
    terms: {
      title: '이용약관 - Instant Agency',
      description: 'Instant Agency 서비스 이용약관',
    },
  },

  // ==========================================
  // 구조화된 데이터 (JSON-LD)
  // ==========================================
  structuredData: {
    organization: {
      '@type': 'Organization',
      name: 'Instant Agency',
      description: '스튜디오, 모델 에이전시, 라이브 커머스를 아우르는 종합 크리에이티브 그룹',
      url: 'https://instantagency.co.kr',
      logo: 'https://instantagency.co.kr/logo.png',
      sameAs: [
        // 소셜 미디어 URL들 추가
      ],
    },
  },
};

// 타입 정의
export type SiteConfig = typeof siteConfig;
export type PageKey = keyof typeof siteConfig.pages;
