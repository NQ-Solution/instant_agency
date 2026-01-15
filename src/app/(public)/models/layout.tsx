import { generatePageMetadata } from '@/lib/seo';

export const metadata = generatePageMetadata('models');

export default function ModelsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
