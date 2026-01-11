'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function ScrollSnapProvider() {
  const pathname = usePathname();

  useEffect(() => {
    // Enable scroll-snap only on main pages (not on detail pages)
    const enableScrollSnap = pathname === '/' ||
      pathname === '/about' ||
      pathname === '/studio' ||
      pathname === '/live' ||
      pathname === '/models' ||
      pathname === '/contact';

    if (enableScrollSnap) {
      document.documentElement.classList.add('scroll-snap');
    } else {
      document.documentElement.classList.remove('scroll-snap');
    }

    // Intersection Observer for section animations
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, observerOptions);

    // Observe all elements with section-animate class
    document.querySelectorAll('.section-animate').forEach(el => {
      observer.observe(el);
    });

    return () => {
      document.documentElement.classList.remove('scroll-snap');
      observer.disconnect();
    };
  }, [pathname]);

  return null;
}
