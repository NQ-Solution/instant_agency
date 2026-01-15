import { MetadataRoute } from 'next';
import { siteConfig } from '@/config/site';

/**
 * robots.txt 생성
 * - 검색엔진 크롤링 규칙 설정
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin/',      // 관리자 페이지 차단
          '/api/',        // API 라우트 차단
          '/_next/',      // Next.js 내부 파일 차단
        ],
      },
    ],
    sitemap: `${siteConfig.url}/sitemap.xml`,
  };
}
