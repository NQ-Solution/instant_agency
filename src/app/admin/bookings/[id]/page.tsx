'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft, Calendar, Clock, User, Mail, Phone, Instagram,
  Building, FileText, Check, X, Trash2, Edit, MessageCircle, GraduationCap
} from 'lucide-react';
import type { Booking } from '@/types';
import { formatKSTDateKorean, formatDateToKST } from '@/lib/kst';

const serviceLabels: Record<string, string> = {
  profile: '프로필 지원 및 접수',
  model: '모델 캐스팅',
  general: '일반 미팅',
};

export default function BookingDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (params.id) {
      fetchBooking();
    }
  }, [params.id]);

  const fetchBooking = async () => {
    try {
      const res = await fetch(`/api/bookings/${params.id}`);
      const data = await res.json();
      if (data.success) {
        setBooking(data.data);
        setNotes(data.data.notes || '');
      }
    } catch (error) {
      console.error('Error fetching booking:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (status: string) => {
    if (!booking) return;
    setUpdating(true);
    try {
      const res = await fetch(`/api/bookings/${booking.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        setBooking({ ...booking, status: status as 'pending' | 'confirmed' | 'cancelled' });
      }
    } catch (error) {
      console.error('Error updating status:', error);
    } finally {
      setUpdating(false);
    }
  };

  const saveNotes = async () => {
    if (!booking) return;
    setUpdating(true);
    try {
      const res = await fetch(`/api/bookings/${booking.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notes }),
      });
      if (res.ok) {
        setBooking({ ...booking, notes });
        setEditMode(false);
      }
    } catch (error) {
      console.error('Error saving notes:', error);
    } finally {
      setUpdating(false);
    }
  };

  const deleteBooking = async () => {
    if (!booking || !confirm('이 예약을 삭제하시겠습니까?')) return;
    try {
      const res = await fetch(`/api/bookings/${booking.id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        router.push('/admin/bookings');
      }
    } catch (error) {
      console.error('Error deleting booking:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-500/10 text-green-500 border-green-500/30';
      case 'pending':
        return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/30';
      case 'cancelled':
        return 'bg-red-500/10 text-red-500 border-red-500/30';
      default:
        return 'bg-gray-500/10 text-gray-500 border-gray-500/30';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'confirmed': return '확정됨';
      case 'pending': return '대기중';
      case 'cancelled': return '취소됨';
      default: return status;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--text)]"></div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="text-center py-12">
        <p className="text-[var(--text-muted)] mb-4">예약을 찾을 수 없습니다.</p>
        <Link href="/admin/bookings" className="text-blue-500 hover:underline">
          목록으로 돌아가기
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/bookings"
            className="p-2 border border-[var(--text)]/20 rounded-lg hover:bg-[var(--text)]/5"
          >
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="font-serif text-3xl">예약 상세</h1>
            <p className="text-[var(--text-muted)] text-sm mt-1">
              예약 ID: {booking.id}
            </p>
          </div>
        </div>
        <button
          onClick={deleteBooking}
          className="flex items-center gap-2 px-4 py-2 text-red-500 border border-red-500/30 rounded-lg hover:bg-red-500/10"
        >
          <Trash2 size={16} />
          삭제
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Status Card */}
          <div className="border border-[var(--text)]/10 rounded-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-serif text-xl">예약 상태</h2>
              <span className={`px-4 py-2 text-sm rounded-full border ${getStatusColor(booking.status)}`}>
                {getStatusLabel(booking.status)}
              </span>
            </div>

            {booking.status === 'pending' && (
              <div className="flex gap-3">
                <button
                  onClick={() => updateStatus('confirmed')}
                  disabled={updating}
                  className="flex-1 flex items-center justify-center gap-2 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50"
                >
                  <Check size={18} />
                  예약 확정
                </button>
                <button
                  onClick={() => updateStatus('cancelled')}
                  disabled={updating}
                  className="flex-1 flex items-center justify-center gap-2 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50"
                >
                  <X size={18} />
                  예약 취소
                </button>
              </div>
            )}

            {booking.status === 'confirmed' && (
              <button
                onClick={() => updateStatus('cancelled')}
                disabled={updating}
                className="w-full flex items-center justify-center gap-2 py-3 border border-red-500/30 text-red-500 rounded-lg hover:bg-red-500/10 disabled:opacity-50"
              >
                <X size={18} />
                예약 취소
              </button>
            )}

            {booking.status === 'cancelled' && (
              <button
                onClick={() => updateStatus('pending')}
                disabled={updating}
                className="w-full flex items-center justify-center gap-2 py-3 border border-[var(--text)]/20 rounded-lg hover:bg-[var(--text)]/5 disabled:opacity-50"
              >
                예약 복원
              </button>
            )}
          </div>

          {/* Customer Info */}
          <div className="border border-[var(--text)]/10 rounded-lg p-6">
            <h2 className="font-serif text-xl mb-6">고객 정보</h2>
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 bg-[var(--text)]/5 rounded-lg">
                <User className="text-[var(--text-muted)]" size={20} />
                <div>
                  <p className="text-xs text-[var(--text-muted)] mb-1">이름</p>
                  <p className="font-medium">{booking.customer.name}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 bg-[var(--text)]/5 rounded-lg">
                <Mail className="text-[var(--text-muted)]" size={20} />
                <div>
                  <p className="text-xs text-[var(--text-muted)] mb-1">이메일</p>
                  <a href={`mailto:${booking.customer.email}`} className="font-medium hover:text-blue-500">
                    {booking.customer.email}
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 bg-[var(--text)]/5 rounded-lg">
                <Phone className="text-[var(--text-muted)]" size={20} />
                <div>
                  <p className="text-xs text-[var(--text-muted)] mb-1">연락처</p>
                  <a href={`tel:${booking.customer.phone}`} className="font-medium hover:text-blue-500">
                    {booking.customer.phone}
                  </a>
                </div>
              </div>

              {booking.customer.company && (
                <div className="flex items-center gap-4 p-4 bg-[var(--text)]/5 rounded-lg">
                  <Building className="text-[var(--text-muted)]" size={20} />
                  <div>
                    <p className="text-xs text-[var(--text-muted)] mb-1">회사</p>
                    <p className="font-medium">{booking.customer.company}</p>
                  </div>
                </div>
              )}

              {booking.customer.instagram && (
                <div className="flex items-center gap-4 p-4 bg-[var(--text)]/5 rounded-lg">
                  <Instagram className="text-[var(--text-muted)]" size={20} />
                  <div>
                    <p className="text-xs text-[var(--text-muted)] mb-1">인스타그램</p>
                    <a
                      href={`https://instagram.com/${booking.customer.instagram.replace('@', '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium hover:text-blue-500"
                    >
                      {booking.customer.instagram}
                    </a>
                  </div>
                </div>
              )}

              {booking.customer.tiktok && (
                <div className="flex items-center gap-4 p-4 bg-[var(--text)]/5 rounded-lg">
                  <svg className="text-[var(--text-muted)]" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                  </svg>
                  <div>
                    <p className="text-xs text-[var(--text-muted)] mb-1">틱톡</p>
                    <a
                      href={`https://tiktok.com/${booking.customer.tiktok.replace('@', '@')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium hover:text-blue-500"
                    >
                      {booking.customer.tiktok}
                    </a>
                  </div>
                </div>
              )}

              {booking.kakaoId && (
                <div className="flex items-center gap-4 p-4 bg-[var(--text)]/5 rounded-lg">
                  <MessageCircle className="text-[var(--text-muted)]" size={20} />
                  <div>
                    <p className="text-xs text-[var(--text-muted)] mb-1">카카오톡 ID</p>
                    <p className="font-medium">{booking.kakaoId}</p>
                  </div>
                </div>
              )}

              {booking.isUniversityStudent !== undefined && (
                <div className="flex items-center gap-4 p-4 bg-[var(--text)]/5 rounded-lg">
                  <GraduationCap className="text-[var(--text-muted)]" size={20} />
                  <div>
                    <p className="text-xs text-[var(--text-muted)] mb-1">대학생 여부</p>
                    <p className={`font-medium ${booking.isUniversityStudent ? 'text-blue-500' : ''}`}>
                      {booking.isUniversityStudent ? '대학생' : '해당 없음'}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Notes */}
          <div className="border border-[var(--text)]/10 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-serif text-xl flex items-center gap-2">
                <FileText size={20} />
                메모
              </h2>
              {!editMode && (
                <button
                  onClick={() => setEditMode(true)}
                  className="flex items-center gap-1 text-sm text-[var(--text-muted)] hover:text-[var(--text)]"
                >
                  <Edit size={14} />
                  수정
                </button>
              )}
            </div>

            {editMode ? (
              <div className="space-y-3">
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 bg-transparent border border-[var(--text)]/20 rounded-lg focus:outline-none focus:border-[var(--text)]"
                  placeholder="메모를 입력하세요..."
                />
                <div className="flex gap-2">
                  <button
                    onClick={saveNotes}
                    disabled={updating}
                    className="px-4 py-2 bg-theme-inverse text-theme-inverse rounded-lg hover:opacity-90 disabled:opacity-50"
                  >
                    저장
                  </button>
                  <button
                    onClick={() => {
                      setNotes(booking.notes || '');
                      setEditMode(false);
                    }}
                    className="px-4 py-2 border border-[var(--text)]/20 rounded-lg hover:bg-[var(--text)]/5"
                  >
                    취소
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-[var(--text-muted)] whitespace-pre-wrap">
                {booking.notes || '메모가 없습니다.'}
              </p>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Date & Time */}
          <div className="border border-[var(--text)]/10 rounded-lg p-6">
            <h2 className="font-serif text-xl mb-4">예약 일시</h2>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Calendar className="text-[var(--text-muted)]" size={20} />
                <div>
                  <p className="text-xs text-[var(--text-muted)]">날짜</p>
                  <p className="font-medium">
                    {formatKSTDateKorean(new Date(booking.date))}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="text-[var(--text-muted)]" size={20} />
                <div>
                  <p className="text-xs text-[var(--text-muted)]">시간</p>
                  <p className="font-medium">
                    {booking.time} {booking.endTime && `- ${booking.endTime}`}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Service Type */}
          <div className="border border-[var(--text)]/10 rounded-lg p-6">
            <h2 className="font-serif text-xl mb-4">상담 유형</h2>
            <p className="px-4 py-3 bg-[var(--text)]/5 rounded-lg font-medium">
              {serviceLabels[booking.service] || booking.service}
            </p>
          </div>

          {/* Created At */}
          {booking.createdAt && (
            <div className="border border-[var(--text)]/10 rounded-lg p-6">
              <h2 className="font-serif text-xl mb-4">생성 정보</h2>
              <p className="text-sm text-[var(--text-muted)]">
                {new Date(booking.createdAt).toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' })}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
