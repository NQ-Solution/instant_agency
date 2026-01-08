'use client';

import { useState, useRef, useCallback } from 'react';
import Image from 'next/image';
import { Upload, X, Loader2, Plus } from 'lucide-react';

interface MultiImageUploadProps {
  values: string[];
  onChange: (urls: string[]) => void;
  folder?: string;
  className?: string;
  maxImages?: number;
  placeholder?: string;
}

export default function MultiImageUpload({
  values,
  onChange,
  folder = 'uploads',
  className = '',
  maxImages = 10,
  placeholder = 'Click or drag to upload images',
}: MultiImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (files: FileList) => {
    setError(null);
    setUploading(true);

    const newUrls: string[] = [];

    try {
      for (const file of Array.from(files)) {
        if (values.length + newUrls.length >= maxImages) {
          setError(`최대 ${maxImages}개의 이미지만 업로드 가능합니다.`);
          break;
        }

        // Validate file type
        const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        if (!validTypes.includes(file.type)) {
          continue;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
          continue;
        }

        const formData = new FormData();
        formData.append('file', file);
        formData.append('folder', folder);

        const res = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        const data = await res.json();

        if (data.success) {
          newUrls.push(data.data.url);
        }
      }

      if (newUrls.length > 0) {
        onChange([...values, ...newUrls]);
      }
    } catch (err) {
      setError('일부 파일 업로드에 실패했습니다.');
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

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleUpload(e.dataTransfer.files);
    }
  }, [values]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleUpload(e.target.files);
    }
  };

  const handleRemove = (index: number) => {
    onChange(values.filter((_, i) => i !== index));
  };

  const handleReorder = (fromIndex: number, toIndex: number) => {
    const newValues = [...values];
    const [removed] = newValues.splice(fromIndex, 1);
    newValues.splice(toIndex, 0, removed);
    onChange(newValues);
  };

  return (
    <div className={className}>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Existing images */}
        {values.map((url, index) => (
          <div key={index} className="relative aspect-[3/4] rounded-lg overflow-hidden group">
            <Image
              src={url}
              alt={`Gallery ${index + 1}`}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors" />
            <button
              type="button"
              onClick={() => handleRemove(index)}
              className="absolute top-2 right-2 p-1.5 bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 hover:bg-red-500 transition-all"
            >
              <X size={14} />
            </button>
            <div className="absolute bottom-2 left-2 px-2 py-1 bg-black/50 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-all">
              {index + 1}
            </div>
          </div>
        ))}

        {/* Upload box */}
        {values.length < maxImages && (
          <div
            className={`relative aspect-[3/4] border-2 border-dashed rounded-lg overflow-hidden transition-colors ${
              dragActive
                ? 'border-[var(--text)] bg-[var(--text)]/5'
                : 'border-[var(--text)]/20 hover:border-[var(--text)]/40'
            } ${uploading ? 'pointer-events-none' : 'cursor-pointer'}`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => inputRef.current?.click()}
          >
            <div className="absolute inset-0 flex flex-col items-center justify-center text-[var(--text-muted)]">
              {uploading ? (
                <>
                  <Loader2 size={24} className="animate-spin mb-2" />
                  <span className="text-xs">업로드 중...</span>
                </>
              ) : (
                <>
                  <Plus size={24} className="mb-1 opacity-50" />
                  <span className="text-xs text-center px-2">이미지 추가</span>
                </>
              )}
            </div>

            <input
              ref={inputRef}
              type="file"
              accept="image/jpeg,image/png,image/gif,image/webp"
              multiple
              onChange={handleChange}
              className="hidden"
            />
          </div>
        )}
      </div>

      {error && (
        <p className="text-red-500 text-xs mt-2">{error}</p>
      )}

      <p className="text-xs text-[var(--text-muted)] mt-2">
        {values.length}/{maxImages} 이미지 (JPG, PNG, GIF, WEBP 최대 5MB)
      </p>
    </div>
  );
}
