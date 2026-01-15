import { generatePageMetadata } from '@/lib/seo';

export const metadata = generatePageMetadata('terms');

export default function TermsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
