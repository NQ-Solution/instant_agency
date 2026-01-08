import Navigation from '@/components/public/Navigation';
import Footer from '@/components/public/Footer';
import FloatingContactCard from '@/components/public/FloatingContactCard';

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* Background Circles */}
      <div className="bg-circles" aria-hidden="true" />
      <Navigation />
      <main>{children}</main>
      <Footer />
      <FloatingContactCard />
    </>
  );
}
