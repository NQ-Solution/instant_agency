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
    {
      href: settings?.social?.instagram,
      label: 'Instagram',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
        </svg>
      )
    },
    {
      href: settings?.social?.youtube,
      label: 'YouTube',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
        </svg>
      )
    },
    {
      href: settings?.social?.tiktok,
      label: 'TikTok',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
        </svg>
      )
    },
  ].filter(link => link.href);

  return (
    <footer className="border-t border-theme-10 bg-[var(--bg)]">
      {/* Main Footer */}
      <div className="px-6 md:px-8 py-10 md:py-12">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-6">
            {/* Brand & Contact */}
            <div className="col-span-2 md:col-span-1">
              <Link href="/" className="flex items-center gap-2 mb-3">
                <img
                  src="/logo.png"
                  alt=""
                  className="w-8 h-8"
                  style={{ filter: 'var(--logo-filter, none)' }}
                />
                <span className="text-xl font-logo font-bold tracking-wide">
                  {settings?.site?.name || 'Instant Agency'}
                </span>
              </Link>
              <p className="text-sm text-muted leading-relaxed mb-4">
                {settings?.site?.tagline || '종합 크리에이티브 그룹'}
              </p>

              {/* Contact Info */}
              <div className="space-y-1.5">
                {settings?.contact?.email && (
                  <a
                    href={`mailto:${settings.contact.email}`}
                    className="text-sm text-muted hover:text-theme transition-colors flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    {settings.contact.email}
                  </a>
                )}
                {settings?.contact?.phone && (
                  <a
                    href={`tel:${settings.contact.phone}`}
                    className="text-sm text-muted hover:text-theme transition-colors flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    {settings.contact.phone}
                  </a>
                )}
              </div>
            </div>

            {/* Navigation */}
            <div>
              <p className="text-xs font-medium tracking-wider uppercase mb-3">Menu</p>
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
            </div>

            {/* Legal */}
            <div>
              <p className="text-xs font-medium tracking-wider uppercase mb-3">Legal</p>
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

              {/* Business Hours */}
              {settings?.contact?.businessHours && (
                <div className="mt-4">
                  <p className="text-xs font-medium tracking-wider uppercase mb-2">Hours</p>
                  <p className="text-sm text-muted">{settings.contact.businessHours}</p>
                </div>
              )}
            </div>

            {/* Social */}
            <div>
              <p className="text-xs font-medium tracking-wider uppercase mb-3">Follow Us</p>
              {socialLinks.length > 0 && (
                <div className="flex gap-3">
                  {socialLinks.map((link) => (
                    <a
                      key={link.label}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 flex items-center justify-center rounded-full bg-theme-5 text-muted hover:bg-theme-inverse hover:text-theme-inverse transition-all"
                      aria-label={link.label}
                    >
                      {link.icon}
                    </a>
                  ))}
                </div>
              )}

              {/* Offices */}
              {settings?.offices && settings.offices.length > 0 && (
                <div className="mt-4">
                  <p className="text-xs font-medium tracking-wider uppercase mb-2">Location</p>
                  <div className="space-y-1">
                    {settings.offices.slice(0, 2).map((office, idx) => (
                      <p key={idx} className="text-sm text-muted">
                        {office.city}
                      </p>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="px-6 md:px-8 py-4 border-t border-theme-10 bg-theme-5">
        <div className="max-w-6xl mx-auto">
          {/* Business Information */}
          {settings?.business && (
            <div className="text-[11px] text-muted/70 mb-3 leading-relaxed">
              <span className="inline-flex flex-wrap gap-x-3 gap-y-0.5">
                {settings.business.businessName && (
                  <span>{settings.business.businessName}</span>
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
              </span>
              {settings.business.businessAddress && (
                <span className="block mt-0.5">{settings.business.businessAddress}</span>
              )}
            </div>
          )}

          {/* Copyright & Credit */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-[11px] text-muted/60">
            <p>
              &copy; {new Date().getFullYear()} {settings?.site?.name || 'Instant Agency'}. All rights reserved.
            </p>
            <p>
              Design by{' '}
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
      </div>
    </footer>
  );
}
