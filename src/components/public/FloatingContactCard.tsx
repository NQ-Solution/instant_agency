'use client';

import { useRouter, usePathname } from 'next/navigation';
import { Calendar, Video } from 'lucide-react';

export default function FloatingContactCard() {
  const router = useRouter();
  const pathname = usePathname();

  // Don't show on contact page
  if (pathname === '/contact') return null;

  return (
    <div className="fixed right-4 bottom-4 md:right-6 md:bottom-6 z-50 flex flex-col gap-2 md:gap-3">
      {/* 프로필 접수 및 지원 */}
      <button
        onClick={() => router.push('/contact?tab=booking')}
        className="flex items-center gap-2 md:gap-3 px-3 py-2 md:px-5 md:py-3 bg-theme-inverse text-theme-inverse rounded-full shadow-lg hover:scale-105 transition-all duration-300 group"
      >
        <Calendar size={16} className="md:w-[18px] md:h-[18px]" />
        <span className="text-xs md:text-sm font-medium whitespace-nowrap">프로필 접수 및 지원</span>
      </button>

      {/* 라이브커머스 지원 */}
      <button
        onClick={() => router.push('/contact?tab=inquiry')}
        className="flex items-center gap-2 md:gap-3 px-3 py-2 md:px-5 md:py-3 bg-rose-500 text-white rounded-full shadow-lg hover:scale-105 transition-all duration-300 group"
      >
        <Video size={16} className="md:w-[18px] md:h-[18px]" />
        <span className="text-xs md:text-sm font-medium whitespace-nowrap">라이브커머스 지원</span>
      </button>
    </div>
  );
}
