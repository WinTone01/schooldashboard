import { differenceInMilliseconds, startOfDay, addMinutes, format } from 'date-fns';
import { tr } from 'date-fns/locale';

export function timeToMinutes(timeStr: string): number {
  if (!timeStr) return 0;
  const [hours, minutes] = timeStr.split(':').map(Number);
  return (hours || 0) * 60 + (minutes || 0);
}

export function minutesToTime(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
}

export function createTimeToday(timeStr: string, baseDate: Date = new Date()): Date {
  if (!timeStr) return baseDate;
  const [hours, minutes] = timeStr.split(':').map(Number);
  const date = new Date(baseDate);
  date.setHours(hours || 0, minutes || 0, 0, 0);
  return date;
}

export function getFormattedDate(date: Date): string {
  return format(date, 'd MMMM yyyy EEEE', { locale: tr });
}

export function getFormattedTime(date: Date): string {
  return format(date, 'HH:mm:ss');
}

export type TimeRemaining = {
  hours: number;
  minutes: number;
  seconds: number;
  totalMs: number;
};

export function calculateTimeRemaining(targetTime: Date, now: Date): TimeRemaining {
  const diffMs = differenceInMilliseconds(targetTime, now);
  
  if (diffMs <= 0) {
    return { hours: 0, minutes: 0, seconds: 0, totalMs: 0 };
  }

  const totalSeconds = Math.floor(diffMs / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return { hours, minutes, seconds, totalMs: diffMs };
}

export function formatCountdown(remaining: TimeRemaining): string {
  return `${String(remaining.hours).padStart(2, '0')}:${String(remaining.minutes).padStart(2, '0')}:${String(remaining.seconds).padStart(2, '0')}`;
}

