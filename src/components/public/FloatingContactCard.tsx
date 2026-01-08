'use client';

import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { MessageCircle, Calendar, X, ChevronRight } from 'lucide-react';

export default function FloatingContactCard() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  // Don't show on contact page
  if (pathname === '/contact') return null;

  const handleSelect = (tab: 'inquiry' | 'booking') => {
    setIsOpen(false);
    router.push(`/contact?tab=${tab}`);
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed right-6 bottom-6 z-50 w-14 h-14 rounded-full bg-theme-inverse text-theme-inverse shadow-lg hover:scale-110 transition-all duration-300 flex items-center justify-center ${
          isOpen ? 'rotate-45' : ''
        }`}
        aria-label="Contact us"
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
      </button>

      {/* Card Panel */}
      <div
        className={`fixed right-6 bottom-24 z-50 w-72 bg-[var(--bg)] border border-theme-20 shadow-2xl rounded-lg overflow-hidden transition-all duration-300 ${
          isOpen
            ? 'opacity-100 translate-y-0 pointer-events-auto'
            : 'opacity-0 translate-y-4 pointer-events-none'
        }`}
      >
        <div className="p-4 border-b border-theme-10">
          <h3 className="font-serif text-lg">Get in Touch</h3>
          <p className="text-xs text-muted mt-1">How can we help you?</p>
        </div>

        <div className="p-2">
          <button
            onClick={() => handleSelect('booking')}
            className="w-full flex items-center gap-4 p-4 hover:bg-theme-5 rounded-lg transition-colors group text-left"
          >
            <div className="w-10 h-10 rounded-full bg-theme-10 flex items-center justify-center group-hover:bg-theme-20 transition-colors">
              <Calendar size={20} />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">Profile Submission</p>
              <p className="text-xs text-muted">Schedule a meeting</p>
            </div>
            <ChevronRight size={16} className="text-muted group-hover:translate-x-1 transition-transform" />
          </button>

          <button
            onClick={() => handleSelect('inquiry')}
            className="w-full flex items-center gap-4 p-4 hover:bg-theme-5 rounded-lg transition-colors group text-left"
          >
            <div className="w-10 h-10 rounded-full bg-theme-10 flex items-center justify-center group-hover:bg-theme-20 transition-colors">
              <MessageCircle size={20} />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">Inquiry</p>
              <p className="text-xs text-muted">Send us a message</p>
            </div>
            <ChevronRight size={16} className="text-muted group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
