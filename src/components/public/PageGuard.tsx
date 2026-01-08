'use client';

import { useState, useEffect, ReactNode } from 'react';
import Link from 'next/link';
import type { PageVisibility } from '@/types';

interface PageGuardProps {
  pageKey: keyof PageVisibility;
  children: ReactNode;
}

export default function PageGuard({ pageKey, children }: PageGuardProps) {
  const [isVisible, setIsVisible] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkVisibility = async () => {
      try {
        const res = await fetch('/api/settings');
        const data = await res.json();

        if (data.success && data.data?.pageVisibility) {
          // Default to true if not set
          const visibility = data.data.pageVisibility[pageKey];
          setIsVisible(visibility !== false);
        } else {
          // Default to visible if no settings
          setIsVisible(true);
        }
      } catch (error) {
        console.error('Error checking page visibility:', error);
        setIsVisible(true); // Default to visible on error
      } finally {
        setLoading(false);
      }
    };

    checkVisibility();
  }, [pageKey]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-current"></div>
      </div>
    );
  }

  if (!isVisible) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center px-8">
        <h1 className="font-serif text-4xl md:text-6xl mb-6">페이지 준비중</h1>
        <p className="text-muted mb-8 max-w-md">
          이 페이지는 현재 준비중입니다. 빠른 시일 내에 공개될 예정입니다.
        </p>
        <Link
          href="/"
          className="inline-block px-8 py-4 border border-theme text-sm tracking-wider uppercase hover:bg-theme-inverse hover:text-theme-inverse transition-all duration-300"
        >
          홈으로 돌아가기
        </Link>
      </div>
    );
  }

  return <>{children}</>;
}
