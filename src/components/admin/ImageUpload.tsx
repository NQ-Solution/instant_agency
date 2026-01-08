'use client';

import { useState, useRef, useCallback } from 'react';
import Image from 'next/image';
import { Upload, X, Loader2 } from 'lucide-react';

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  folder?: string;
  className?: string;
  aspectRatio?: 'square' | 'portrait' | 'landscape' | 'auto';
  placeholder?: string;
}

export default function ImageUpload({
  value,
  onChange,
  folder = 'uploads',
  className = '',
  aspectRatio = 'portrait',
  placeholder = 'Click or drag to upload image',
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const aspectClasses = {
    square: 'aspect-square',
    portrait: 'aspect-[3/4]',
    landscape: 'aspect-video',
    auto: 'min-h-[200px]',
  };

  const handleUpload = async (file: File) => {
    setError(null);
    setUploading(true);

    try {
      // Validate file type
      const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        throw new Error('JPG, PNG, GIF, WEBP 형식만 가능합니다.');
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        throw new Error('파일 크기는 5MB 이하만 가능합니다.');
      }

      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', folder);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (!data.success) {
        throw new Error(data.error || '업로드 실패');
      }

      onChange(data.data.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : '업로드 실패');
    } finally {
      setUploading(false);
    }
  };

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleUpload(e.dataTransfer.files[0]);
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleUpload(e.target.files[0]);
    }
  };

  const handleRemove = () => {
    onChange('');
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  return (
    <div className={className}>
      <div
        className={`relative ${aspectClasses[aspectRatio]} border-2 border-dashed rounded-lg overflow-hidden transition-colors ${
          dragActive
            ? 'border-[var(--text)] bg-[var(--text)]/5'
            : 'border-[var(--text)]/20 hover:border-[var(--text)]/40'
        } ${uploading ? 'pointer-events-none' : 'cursor-pointer'}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => !value && inputRef.current?.click()}
      >
        {value ? (
          <>
            <Image
              src={value}
              alt="Uploaded"
              fill
              className="object-cover"
            />
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleRemove();
              }}
              className="absolute top-2 right-2 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
            >
              <X size={16} />
            </button>
          </>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-[var(--text-muted)]">
            {uploading ? (
              <>
                <Loader2 size={32} className="animate-spin mb-2" />
                <span className="text-sm">업로드 중...</span>
              </>
            ) : (
              <>
                <Upload size={32} className="mb-2 opacity-50" />
                <span className="text-sm text-center px-4">{placeholder}</span>
                <span className="text-xs mt-1 opacity-50">JPG, PNG, GIF, WEBP (최대 5MB)</span>
              </>
            )}
          </div>
        )}

        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/gif,image/webp"
          onChange={handleChange}
          className="hidden"
        />
      </div>

      {error && (
        <p className="text-red-500 text-xs mt-2">{error}</p>
      )}

      {/* URL input as fallback */}
      <div className="mt-2">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="또는 이미지 URL 직접 입력"
          className="w-full px-3 py-2 text-sm bg-transparent border border-[var(--text)]/10 rounded-lg focus:outline-none focus:border-[var(--text)]/30"
        />
      </div>
    </div>
  );
}
