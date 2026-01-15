import { generatePageMetadata } from '@/lib/seo';

export const metadata = generatePageMetadata('studio');

export default function StudioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
