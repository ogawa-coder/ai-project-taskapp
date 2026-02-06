import {
  format,
  isToday,
  isTomorrow,
  isYesterday,
  isPast,
  parseISO,
  differenceInDays,
} from 'date-fns';
import { ja } from 'date-fns/locale';

export function formatDate(dateString: string | null): string {
  if (!dateString) return '';

  const date = parseISO(dateString);

  if (isToday(date)) {
    return '今日';
  }
  if (isTomorrow(date)) {
    return '明日';
  }
  if (isYesterday(date)) {
    return '昨日';
  }

  return format(date, 'M月d日', { locale: ja });
}

export function formatDateTime(dateString: string | null): string {
  if (!dateString) return '';

  const date = parseISO(dateString);
  return format(date, 'M月d日 HH:mm', { locale: ja });
}

export function formatFullDate(dateString: string | null): string {
  if (!dateString) return '';

  const date = parseISO(dateString);
  return format(date, 'yyyy年M月d日', { locale: ja });
}

export function isOverdue(dateString: string | null): boolean {
  if (!dateString) return false;

  const date = parseISO(dateString);
  return isPast(date) && !isToday(date);
}

export function getDaysUntilDue(dateString: string | null): number | null {
  if (!dateString) return null;

  const date = parseISO(dateString);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return differenceInDays(date, today);
}

export function toISODateString(date: Date): string {
  return format(date, 'yyyy-MM-dd');
}

export function getCurrentISOString(): string {
  return new Date().toISOString();
}
