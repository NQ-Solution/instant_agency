import Navigation from '@/components/public/Navigation';
import Footer from '@/components/public/Footer';
import ScrollSnapProvider from '@/components/public/ScrollSnapProvider';

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <ScrollSnapProvider />
      {/* Background Circles */}
      <div className="bg-circles" aria-hidden="true" />
      <Navigation />
      <main>{children}</main>
      <Footer />
    </>
  );
}
