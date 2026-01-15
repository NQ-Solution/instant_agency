import Navigation from '@/components/public/Navigation';
import Footer from '@/components/public/Footer';
import FloatingContactCard from '@/components/public/FloatingContactCard';
import { generateOrganizationJsonLd } from '@/lib/seo';

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const organizationJsonLd = generateOrganizationJsonLd();

  return (
    <>
      {/* JSON-LD 구조화된 데이터 */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
      />

      {/* Background Circles */}
      <div className="bg-circles" aria-hidden="true" />
      <Navigation />
      <main>{children}</main>
      <Footer />
      <FloatingContactCard />
    </>
  );
}
