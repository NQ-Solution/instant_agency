// KST (Korea Standard Time) Utility Functions
// 한국 표준시 (UTC+9) 기준으로 모든 날짜/시간 처리

const KST_OFFSET = 9 * 60; // 9시간 = 540분

/**
 * 현재 KST 시간 가져오기
 */
export function getKSTNow(): Date {
  const now = new Date();
  const utc = now.getTime() + now.getTimezoneOffset() * 60000;
  return new Date(utc + KST_OFFSET * 60000);
}

/**
 * 오늘 날짜를 KST 기준으로 가져오기 (시간은 00:00:00)
 */
export function getKSTToday(): Date {
  const kstNow = getKSTNow();
  return new Date(kstNow.getFullYear(), kstNow.getMonth(), kstNow.getDate());
}

/**
 * Date 객체를 KST 기준 YYYY-MM-DD 문자열로 변환
 */
export function formatDateToKST(date: Date): string {
  // 먼저 KST로 변환
  const utc = date.getTime() + date.getTimezoneOffset() * 60000;
  const kstDate = new Date(utc + KST_OFFSET * 60000);

  const year = kstDate.getFullYear();
  const month = String(kstDate.getMonth() + 1).padStart(2, '0');
  const day = String(kstDate.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

/**
 * KST 기준으로 날짜 객체 생성 (로컬 시간대 무시)
 */
export function createKSTDate(year: number, month: number, day: number): Date {
  // month는 0-indexed
  const date = new Date(year, month, day);
  // 로컬 시간대 보정
  const utc = date.getTime() + date.getTimezoneOffset() * 60000;
  // KST 시간대로 조정 후 다시 로컬로 변환
  return new Date(utc + KST_OFFSET * 60000 - date.getTimezoneOffset() * 60000);
}

/**
 * YYYY-MM-DD 문자열을 KST 기준 Date 객체로 변환
 */
export function parseKSTDateString(dateStr: string): Date {
  const [year, month, day] = dateStr.split('-').map(Number);
  return new Date(year, month - 1, day);
}

/**
 * UTC Date를 KST Date로 변환
 */
export function utcToKST(utcDate: Date): Date {
  const utc = utcDate.getTime() + utcDate.getTimezoneOffset() * 60000;
  return new Date(utc + KST_OFFSET * 60000);
}

/**
 * KST 기준으로 날짜가 오늘인지 확인
 */
export function isKSTToday(date: Date): boolean {
  const kstNow = getKSTNow();
  const kstDate = utcToKST(date);
  return (
    kstDate.getFullYear() === kstNow.getFullYear() &&
    kstDate.getMonth() === kstNow.getMonth() &&
    kstDate.getDate() === kstNow.getDate()
  );
}

/**
 * KST 기준으로 날짜가 과거인지 확인
 */
export function isKSTPast(date: Date): boolean {
  const kstToday = getKSTToday();
  const kstDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  return kstDate < kstToday;
}

/**
 * KST 기준으로 현재 시간(HH:MM) 가져오기
 */
export function getKSTTimeNow(): string {
  const kstNow = getKSTNow();
  const hours = String(kstNow.getHours()).padStart(2, '0');
  const minutes = String(kstNow.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
}

/**
 * 시간 문자열을 분으로 변환 (비교용)
 */
export function timeToMinutes(time: string): number {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
}

/**
 * KST 기준으로 특정 시간이 현재보다 지났는지 확인
 */
export function isKSTTimePast(date: Date, time: string): boolean {
  const kstToday = getKSTToday();
  const checkDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());

  if (checkDate < kstToday) return true;
  if (checkDate > kstToday) return false;

  // 같은 날이면 시간 비교
  const nowMinutes = timeToMinutes(getKSTTimeNow());
  const checkMinutes = timeToMinutes(time);
  return checkMinutes <= nowMinutes;
}

/**
 * 한국어 날짜 포맷 (예: 2025년 1월 15일 수요일)
 */
export function formatKSTDateKorean(date: Date): string {
  const kstDate = utcToKST(date);
  return kstDate.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long',
    timeZone: 'Asia/Seoul'
  });
}

/**
 * 한국어 짧은 날짜 포맷 (예: 1월 15일)
 */
export function formatKSTDateShort(date: Date): string {
  const kstDate = utcToKST(date);
  return kstDate.toLocaleDateString('ko-KR', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'Asia/Seoul'
  });
}
