import type { Metadata } from 'next';
import { Inter, Playfair_Display, Nanum_Myeongjo } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/ui/ThemeProvider';

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

export const metadata: Metadata = {
  title: 'Instant Agency - Creative Studio & Model Agency',
  description: '스튜디오, 모델 에이전시, 라이브 커머스를 아우르는 종합 크리에이티브 그룹',
  keywords: ['model agency', 'creative studio', 'live commerce', 'fashion', 'photography'],
  icons: {
    icon: '/favicon.svg',
    apple: '/logo.png',
  },
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
