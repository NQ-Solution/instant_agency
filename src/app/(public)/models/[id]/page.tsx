import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Instagram } from 'lucide-react';

async function getModel(id: string) {
  try {
    const res = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/models/${id}`, {
      cache: 'no-store',
    });

    if (!res.ok) return null;

    const data = await res.json();
    return data.success ? data.data : null;
  } catch {
    return null;
  }
}

export default async function ModelDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const model = await getModel(id);

  if (!model) {
    notFound();
  }

  const stats = [
    { label: 'Height', value: model.stats.height },
    { label: 'Bust', value: model.stats.bust },
    { label: 'Waist', value: model.stats.waist },
    { label: 'Hips', value: model.stats.hips },
    { label: 'Shoes', value: model.stats.shoes },
    { label: 'Eyes', value: model.stats.eyes },
    { label: 'Hair', value: model.stats.hair },
  ].filter((s) => s.value);

  return (
    <div className="pt-24">
      {/* Back Button */}
      <div className="px-8 mb-8">
        <Link
          href="/models"
          className="inline-flex items-center gap-2 text-[var(--text-muted)] hover:text-[var(--text)] transition-colors"
        >
          <ArrowLeft size={20} />
          <span className="text-sm tracking-wider uppercase">Back to Models</span>
        </Link>
      </div>

      {/* Hero */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-0">
        <div className="relative aspect-[3/4] lg:aspect-auto lg:min-h-[80vh]">
          <Image
            src={model.profileImage}
            alt={model.name}
            fill
            className="object-cover"
            priority
          />
        </div>
        <div className="flex flex-col justify-center p-8 lg:p-16">
          <p className="text-xs tracking-[0.3em] uppercase text-[var(--text-muted)] mb-4">
            {model.category} · {model.location}
          </p>
          <h1 className="font-serif text-[clamp(2.5rem,6vw,5rem)] font-normal mb-8 leading-tight">
            {model.name}
          </h1>

          {/* Stats */}
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-6 mb-8">
            {stats.map((stat) => (
              <div key={stat.label}>
                <p className="text-xs tracking-wider uppercase text-[var(--text-muted)] mb-1">
                  {stat.label}
                </p>
                <p className="font-serif text-xl">{stat.value}</p>
              </div>
            ))}
          </div>

          {/* Bio */}
          {model.bio && (
            <p className="text-[var(--text-muted)] leading-relaxed mb-8">
              {model.bio}
            </p>
          )}

          {/* Social */}
          {model.social?.instagram && (
            <a
              href={`https://instagram.com/${model.social.instagram.replace('@', '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm hover:text-[var(--text-muted)] transition-colors"
            >
              <Instagram size={18} />
              <span>{model.social.instagram}</span>
            </a>
          )}
        </div>
      </section>

      {/* Gallery */}
      {model.galleryImages && model.galleryImages.length > 0 && (
        <section className="py-16">
          <div className="px-8 mb-8">
            <h2 className="font-serif text-2xl">Portfolio</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-1">
            {model.galleryImages.map((img: string, index: number) => (
              <div key={index} className="relative aspect-square">
                <Image
                  src={img}
                  alt={`${model.name} - ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Experience */}
      {model.experience && model.experience.length > 0 && (
        <section className="py-16 px-8">
          <h2 className="font-serif text-2xl mb-8">Experience</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {model.experience.map((exp: { brand: string; year: string }, index: number) => (
              <div
                key={index}
                className="p-6 border border-[var(--text)]/10"
              >
                <p className="font-serif text-lg">{exp.brand}</p>
                <p className="text-xs text-[var(--text-muted)]">{exp.year}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-16 px-8 text-center border-t border-[var(--text)]/10">
        <h2 className="font-serif text-3xl mb-4">Book {model.name}</h2>
        <p className="text-[var(--text-muted)] mb-8">
          For casting inquiries and bookings
        </p>
        <Link
          href="/contact"
          className="inline-block px-8 py-4 bg-theme-inverse text-theme-inverse text-sm tracking-wider uppercase hover:opacity-90 transition-opacity"
        >
          Contact Us
        </Link>
      </section>
    </div>
  );
}
