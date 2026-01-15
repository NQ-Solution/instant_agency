import type { Metadata, Viewport } from 'next';
import { Inter, Playfair_Display, Nanum_Myeongjo } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/ui/ThemeProvider';
import { siteConfig } from '@/config/site';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  display: 'swap',
});

const playfair = Playfair_Display({
  variable: '--font-playfair',
  subsets: ['latin'],
  display: 'swap',
});

const nanumMyeongjo = Nanum_Myeongjo({
  variable: '--font-nanum-myeongjo',
  subsets: ['latin'],
  weight: ['400', '700', '800'],
  display: 'swap',
});

/**
 * 전역 메타데이터 설정
 * 각 페이지에서 개별 설정 가능 (generateMetadata 사용)
 * 설정 수정은 src/config/site.ts 파일에서
 */
export const metadata: Metadata = {
  // 기본 메타데이터
  title: {
    default: siteConfig.title,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: siteConfig.keywords,

  // 작성자
  authors: [{ name: siteConfig.author.name, url: siteConfig.author.url }],
  creator: siteConfig.name,
  publisher: siteConfig.name,

  // 아이콘
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
    apple: '/logo.png',
  },

  // 기본 URL
  metadataBase: new URL(siteConfig.url),

  // Open Graph (Facebook, Kakao 등)
  openGraph: {
    type: 'website',
    locale: siteConfig.locale,
    url: siteConfig.url,
    title: siteConfig.title,
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: siteConfig.name,
      },
    ],
  },

  // Twitter Card
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.title,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
    creator: siteConfig.social.twitter || undefined,
  },

  // 로봇 설정
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },

  // 검증 (Google Search Console 등)
  // verification: {
  //   google: 'google-site-verification-code',
  //   naver: 'naver-site-verification-code',
  // },

  // 기타
  alternates: {
    canonical: siteConfig.url,
  },
};

// 뷰포트 설정
export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#e8e8e8' },
    { media: '(prefers-color-scheme: dark)', color: '#0a0a0a' },
  ],
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" data-theme="dark" suppressHydrationWarning>
      <body className={`${inter.variable} ${playfair.variable} ${nanumMyeongjo.variable} antialiased`}>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
