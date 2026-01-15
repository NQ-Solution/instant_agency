import { generatePageMetadata } from '@/lib/seo';

export const metadata = generatePageMetadata('live');

export default function LiveLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
