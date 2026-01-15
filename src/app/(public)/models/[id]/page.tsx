'use client';

import { useState, useEffect, use } from 'react';
import { notFound, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

interface ModelVideo {
  url: string;
  thumbnail?: string;
  title?: string;
  type?: 'youtube' | 'vimeo' | 'upload';
}

interface ModelData {
  id: string;
  name: string;
  nameKr?: string;
  slug: string;
  category: string;
  profileImage: string;
  galleryImages: string[];
  galleryVideos?: ModelVideo[];
  stats: {
    height?: string;
    bust?: string;
    waist?: string;
    hips?: string;
    shoes?: string;
    eyes?: string;
    hair?: string;
  };
  location: string;
  bio?: string;
  experience?: { brand: string; year: string }[];
  social?: {
    instagram?: string;
    youtube?: string;
    tiktok?: string;
  };
}

export default function ModelDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [model, setModel] = useState<ModelData | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFoundError, setNotFoundError] = useState(false);

  useEffect(() => {
    async function fetchModel() {
      try {
        const res = await fetch(`/api/models/${id}`, { cache: 'no-store' });
        const data = await res.json();

        if (data.success && data.data) {
          setModel(data.data);
        } else {
          setNotFoundError(true);
        }
      } catch (error) {
        console.error('Error fetching model:', error);
        setNotFoundError(true);
      } finally {
        setLoading(false);
      }
    }

    fetchModel();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-current"></div>
      </div>
    );
  }

  if (notFoundError || !model) {
    notFound();
  }

  const stats = [
    { label: 'Height', value: model.stats?.height },
    { label: 'Bust', value: model.stats?.bust },
    { label: 'Waist', value: model.stats?.waist },
    { label: 'Hips', value: model.stats?.hips },
    { label: 'Shoes', value: model.stats?.shoes },
    { label: 'Eyes', value: model.stats?.eyes },
    { label: 'Hair', value: model.stats?.hair },
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
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6 mb-8">
            {stats.map((stat) => (
              <div key={stat.label}>
                <p className="text-[0.65rem] sm:text-xs tracking-wider uppercase text-[var(--text-muted)] mb-1">
                  {stat.label}
                </p>
                <p className="font-serif text-lg sm:text-xl">{stat.value}</p>
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
          {(model.social?.instagram || model.social?.youtube || model.social?.tiktok) && (
            <div className="flex flex-wrap gap-6">
              {model.social?.instagram && (
                <a
                  href={model.social.instagram.startsWith('http') ? model.social.instagram : `https://instagram.com/${model.social.instagram.replace('@', '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm hover:text-[var(--text-muted)] transition-colors"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                  <span>Instagram</span>
                </a>
              )}
              {model.social?.youtube && (
                <a
                  href={model.social.youtube.startsWith('http') ? model.social.youtube : `https://youtube.com/${model.social.youtube}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm hover:text-[var(--text-muted)] transition-colors"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                  <span>YouTube</span>
                </a>
              )}
              {model.social?.tiktok && (
                <a
                  href={model.social.tiktok.startsWith('http') ? model.social.tiktok : `https://tiktok.com/${model.social.tiktok.startsWith('@') ? model.social.tiktok : '@' + model.social.tiktok}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm hover:text-[var(--text-muted)] transition-colors"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/></svg>
                  <span>TikTok</span>
                </a>
              )}
            </div>
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

      {/* Video Gallery */}
      {model.galleryVideos && model.galleryVideos.length > 0 && (
        <section className="py-16 bg-[var(--bg-secondary)]">
          <div className="px-8 mb-8">
            <h2 className="font-serif text-2xl">Videos</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 px-8">
            {model.galleryVideos.map((video: ModelVideo, index: number) => {
              const isYouTube = video.type === 'youtube' || video.url.includes('youtube.com') || video.url.includes('youtu.be');
              const isVimeo = video.type === 'vimeo' || video.url.includes('vimeo.com');

              // Get embed URL for YouTube/Vimeo
              let embedUrl = video.url;
              if (isYouTube) {
                const match = video.url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]+)/);
                if (match) embedUrl = `https://www.youtube.com/embed/${match[1]}`;
              } else if (isVimeo) {
                const match = video.url.match(/vimeo\.com\/(\d+)/);
                if (match) embedUrl = `https://player.vimeo.com/video/${match[1]}`;
              }

              return (
                <div key={index} className="relative aspect-video bg-black rounded-lg overflow-hidden">
                  {isYouTube || isVimeo ? (
                    <iframe
                      src={embedUrl}
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  ) : (
                    <video
                      src={video.url}
                      className="w-full h-full object-cover"
                      controls
                      playsInline
                      preload="metadata"
                    />
                  )}
                  {video.title && (
                    <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/70 to-transparent">
                      <p className="text-white text-sm">{video.title}</p>
                    </div>
                  )}
                </div>
              );
            })}
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
