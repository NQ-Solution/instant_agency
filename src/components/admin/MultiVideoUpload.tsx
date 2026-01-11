'use client';

import { useState, useRef, useCallback } from 'react';
import { X, Loader2, Plus, Video, Link as LinkIcon, Play } from 'lucide-react';
import type { ModelVideo } from '@/types';

interface MultiVideoUploadProps {
  values: ModelVideo[];
  onChange: (videos: ModelVideo[]) => void;
  folder?: string;
  className?: string;
  maxVideos?: number;
}

// Helper to detect video type from URL
function detectVideoType(url: string): 'youtube' | 'vimeo' | 'upload' {
  if (url.includes('youtube.com') || url.includes('youtu.be')) return 'youtube';
  if (url.includes('vimeo.com')) return 'vimeo';
  return 'upload';
}

// Helper to get YouTube thumbnail
function getYouTubeThumbnail(url: string): string | undefined {
  const match = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]+)/);
  if (match) {
    return `https://img.youtube.com/vi/${match[1]}/hqdefault.jpg`;
  }
  return undefined;
}

// Helper to get embed URL
function getEmbedUrl(url: string, type: 'youtube' | 'vimeo' | 'upload'): string {
  if (type === 'youtube') {
    const match = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]+)/);
    if (match) return `https://www.youtube.com/embed/${match[1]}`;
  }
  if (type === 'vimeo') {
    const match = url.match(/vimeo\.com\/(\d+)/);
    if (match) return `https://player.vimeo.com/video/${match[1]}`;
  }
  return url;
}

export default function MultiVideoUpload({
  values,
  onChange,
  folder = 'videos',
  className = '',
  maxVideos = 6,
}: MultiVideoUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [urlInput, setUrlInput] = useState('');
  const [titleInput, setTitleInput] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (file: File) => {
    if (values.length >= maxVideos) {
      setError(`최대 ${maxVideos}개의 영상만 업로드 가능합니다.`);
      return;
    }

    setError(null);
    setUploading(true);
    setProgress(0);

    try {
      // Validate file type
      const validTypes = ['video/mp4', 'video/webm', 'video/quicktime', 'video/x-msvideo'];
      if (!validTypes.includes(file.type)) {
        throw new Error('MP4, WebM, MOV, AVI 형식만 가능합니다.');
      }

      // Validate file size (max 100MB)
      if (file.size > 100 * 1024 * 1024) {
        throw new Error('파일 크기는 100MB 이하만 가능합니다.');
      }

      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', folder);

      // Simulate progress
      const progressInterval = setInterval(() => {
        setProgress(prev => Math.min(prev + 10, 90));
      }, 500);

      const res = await fetch('/api/upload/video', {
        method: 'POST',
        body: formData,
      });

      clearInterval(progressInterval);
      setProgress(100);

      const data = await res.json();

      if (!data.success) {
        throw new Error(data.error || '업로드 실패');
      }

      const newVideo: ModelVideo = {
        url: data.data.url,
        title: file.name.replace(/\.[^/.]+$/, ''),
        type: 'upload',
      };

      onChange([...values, newVideo]);
    } catch (err) {
      setError(err instanceof Error ? err.message : '업로드 실패');
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  const handleAddUrl = () => {
    if (!urlInput.trim()) return;

    if (values.length >= maxVideos) {
      setError(`최대 ${maxVideos}개의 영상만 추가 가능합니다.`);
      return;
    }

    const type = detectVideoType(urlInput);
    const thumbnail = type === 'youtube' ? getYouTubeThumbnail(urlInput) : undefined;

    const newVideo: ModelVideo = {
      url: urlInput.trim(),
      title: titleInput.trim() || undefined,
      type,
      thumbnail,
    };

    onChange([...values, newVideo]);
    setUrlInput('');
    setTitleInput('');
    setShowUrlInput(false);
    setError(null);
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
  }, [values]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleUpload(e.target.files[0]);
    }
  };

  const handleRemove = (index: number) => {
    onChange(values.filter((_, i) => i !== index));
  };

  return (
    <div className={className}>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {/* Existing videos */}
        {values.map((video, index) => (
          <div key={index} className="relative aspect-video rounded-lg overflow-hidden group bg-black">
            {video.type === 'upload' || (!video.type && !video.url.includes('youtube') && !video.url.includes('vimeo')) ? (
              <video
                src={video.url}
                className="w-full h-full object-cover"
                muted
                playsInline
                preload="metadata"
              />
            ) : video.thumbnail ? (
              <div className="relative w-full h-full">
                <img
                  src={video.thumbnail}
                  alt={video.title || `Video ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center">
                    <Play size={24} className="text-white ml-1" fill="white" />
                  </div>
                </div>
              </div>
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-800">
                <Video size={32} className="text-gray-500" />
              </div>
            )}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors" />
            <button
              type="button"
              onClick={() => handleRemove(index)}
              className="absolute top-2 right-2 p-1.5 bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 hover:bg-red-500 transition-all"
            >
              <X size={14} />
            </button>
            {video.title && (
              <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-all">
                <p className="text-white text-xs truncate">{video.title}</p>
              </div>
            )}
            <div className="absolute top-2 left-2 px-2 py-0.5 bg-black/50 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-all">
              {video.type === 'youtube' ? 'YouTube' : video.type === 'vimeo' ? 'Vimeo' : '업로드'}
            </div>
          </div>
        ))}

        {/* Add video box */}
        {values.length < maxVideos && !showUrlInput && (
          <div className="aspect-video flex gap-2">
            {/* Upload box */}
            <div
              className={`flex-1 relative border-2 border-dashed rounded-lg overflow-hidden transition-colors ${
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
                    <Loader2 size={20} className="animate-spin mb-1" />
                    <span className="text-xs">{progress}%</span>
                  </>
                ) : (
                  <>
                    <Plus size={20} className="mb-1 opacity-50" />
                    <span className="text-xs">파일 업로드</span>
                  </>
                )}
              </div>

              <input
                ref={inputRef}
                type="file"
                accept="video/mp4,video/webm,video/quicktime,video/x-msvideo"
                onChange={handleChange}
                className="hidden"
              />
            </div>

            {/* URL input button */}
            <button
              type="button"
              onClick={() => setShowUrlInput(true)}
              className="flex-1 border-2 border-dashed border-[var(--text)]/20 hover:border-[var(--text)]/40 rounded-lg flex flex-col items-center justify-center text-[var(--text-muted)] transition-colors"
            >
              <LinkIcon size={20} className="mb-1 opacity-50" />
              <span className="text-xs">URL 추가</span>
            </button>
          </div>
        )}

        {/* URL input form */}
        {showUrlInput && (
          <div className="aspect-video col-span-full md:col-span-1 border border-[var(--text)]/20 rounded-lg p-4 flex flex-col gap-2">
            <input
              type="text"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="YouTube, Vimeo 또는 동영상 URL"
              className="flex-1 px-3 py-2 text-sm bg-transparent border border-[var(--text)]/20 rounded-lg focus:outline-none focus:border-[var(--text)]"
              autoFocus
            />
            <input
              type="text"
              value={titleInput}
              onChange={(e) => setTitleInput(e.target.value)}
              placeholder="영상 제목 (선택)"
              className="flex-1 px-3 py-2 text-sm bg-transparent border border-[var(--text)]/20 rounded-lg focus:outline-none focus:border-[var(--text)]"
            />
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleAddUrl}
                className="flex-1 py-2 text-xs bg-theme-inverse text-theme-inverse rounded-lg hover:opacity-90"
              >
                추가
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowUrlInput(false);
                  setUrlInput('');
                  setTitleInput('');
                }}
                className="flex-1 py-2 text-xs border border-[var(--text)]/20 rounded-lg hover:bg-[var(--text)]/5"
              >
                취소
              </button>
            </div>
          </div>
        )}
      </div>

      {error && (
        <p className="text-red-500 text-xs mt-2">{error}</p>
      )}

      <p className="text-xs text-[var(--text-muted)] mt-2">
        {values.length}/{maxVideos} 영상 (MP4, WebM 최대 100MB 또는 YouTube/Vimeo URL)
      </p>
    </div>
  );
}
