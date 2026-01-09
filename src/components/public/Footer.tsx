'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import type { Settings } from '@/types';

const footerLinks = [
  { href: '/about', label: 'About' },
  { href: '/studio', label: 'Studio' },
  { href: '/models', label: 'Models' },
  { href: '/live', label: 'Live' },
  { href: '/contact', label: 'Contact' },
];

const legalLinks = [
  { href: '/privacy', label: '개인정보 처리방침' },
  { href: '/terms', label: '이용약관' },
];

export default function Footer() {
  const [settings, setSettings] = useState<Settings | null>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch('/api/settings');
        const data = await res.json();
        if (data.success) {
          setSettings(data.data);
        }
      } catch (error) {
        console.error('Error fetching settings:', error);
      }
    };
    fetchSettings();
  }, []);

  const socialLinks = [
    { href: settings?.social?.instagram, label: 'Instagram' },
    { href: settings?.social?.tiktok, label: 'TikTok' },
    { href: settings?.social?.youtube, label: 'YouTube' },
  ].filter(link => link.href);

  return (
    <footer className="border-t border-theme-10 min-h-[50vh]">
      <div className="px-8 py-16">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Brand */}
          <div>
            <Link href="/" className="text-2xl tracking-widest mb-4 block">
              {settings?.site?.name || 'Instant Agency'}
            </Link>
            <p className="text-sm text-muted leading-relaxed">
              {settings?.site?.tagline || '스튜디오, 모델 에이전시, 라이브 커머스를 아우르는 종합 크리에이티브 그룹'}
            </p>
          </div>

          {/* Links */}
          <div>
            <p className="text-xs tracking-widest uppercase text-muted mb-4">Navigation</p>
            <ul className="space-y-2">
              {footerLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted hover:text-theme transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Legal Links */}
            <p className="text-xs tracking-widest uppercase text-muted mb-4 mt-8">Legal</p>
            <ul className="space-y-2">
              {legalLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted hover:text-theme transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Social */}
          <div>
            <p className="text-xs tracking-widest uppercase text-muted mb-4">Connect</p>
            {socialLinks.length > 0 && (
              <ul className="space-y-2 mb-6">
                {socialLinks.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-muted hover:text-theme transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            )}
            {settings?.contact?.email && (
              <p className="text-sm text-muted">
                {settings.contact.email}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Business Info & Copyright */}
      <div className="px-8 py-6 border-t border-theme-10">
        <div className="max-w-6xl mx-auto">
          {/* Business Information */}
          {settings?.business && (
            <div className="text-xs text-muted mb-4 space-y-1">
              <div className="flex flex-wrap gap-x-4 gap-y-1">
                {settings.business.businessName && (
                  <span>상호: {settings.business.businessName}</span>
                )}
                {settings.business.representative && (
                  <span>대표: {settings.business.representative}</span>
                )}
                {settings.business.businessNumber && (
                  <span>사업자등록번호: {settings.business.businessNumber}</span>
                )}
                {settings.business.ecommerceNumber && (
                  <span>통신판매업: {settings.business.ecommerceNumber}</span>
                )}
              </div>
              {settings.business.businessAddress && (
                <p>주소: {settings.business.businessAddress}</p>
              )}
              {settings.business.hostingProvider && (
                <p>호스팅 서비스: {settings.business.hostingProvider}</p>
              )}
            </div>
          )}

          {/* Copyright */}
          <p className="text-xs tracking-widest text-muted text-center">
            &copy; {new Date().getFullYear()} {settings?.site?.name || 'Instant Agency'}. All rights reserved.
          </p>

          {/* Credit */}
          <p className="text-xs text-muted text-center mt-2">
            Designed & Developed by{' '}
            <a
              href="https://nqsolution.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-theme transition-colors"
            >
              NQSolution
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
