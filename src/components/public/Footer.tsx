import Link from 'next/link';

const footerLinks = [
  { href: '/about', label: 'About' },
  { href: '/studio', label: 'Studio' },
  { href: '/models', label: 'Models' },
  { href: '/live', label: 'Live' },
  { href: '/contact', label: 'Contact' },
];

const socialLinks = [
  { href: '#', label: 'Instagram' },
  { href: '#', label: 'LinkedIn' },
  { href: '#', label: 'Twitter' },
];

export default function Footer() {
  return (
    <footer className="border-t border-theme-10 min-h-[50vh]">
      <div className="px-8 py-16">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Brand */}
          <div>
            <Link href="/" className="text-2xl tracking-widest mb-4 block">
              Instant Agency
            </Link>
            <p className="text-sm text-muted leading-relaxed">
              스튜디오, 모델 에이전시, 라이브 커머스를 아우르는<br />
              종합 크리에이티브 그룹
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
          </div>

          {/* Contact & Social */}
          <div>
            <p className="text-xs tracking-widest uppercase text-muted mb-4">Connect</p>
            <ul className="space-y-2 mb-6">
              {socialLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted hover:text-theme transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            <p className="text-sm text-muted">
              contact@instant-agency.com
            </p>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="px-8 py-6 border-t border-theme-10">
        <p className="text-xs tracking-widest text-muted text-center">
          &copy; {new Date().getFullYear()} Instant Agency. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
