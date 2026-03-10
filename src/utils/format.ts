import { format, parseISO, isToday, isTomorrow, isYesterday, addDays } from 'date-fns';

const SAUDI_TZ = 'Asia/Riyadh';

export function formatDate(dateStr: string): string {
  const date = parseISO(dateStr);
  if (isToday(date)) return 'Today';
  if (isTomorrow(date)) return 'Tomorrow';
  if (isYesterday(date)) return 'Yesterday';
  return format(date, 'MMM d, yyyy');
}

export function formatTime(timeStr: string): string {
  const [hours, minutes] = timeStr.split(':').map(Number);
  const period = hours >= 12 ? 'PM' : 'AM';
  const h = hours % 12 || 12;
  return `${h}:${String(minutes).padStart(2, '0')} ${period}`;
}

export function formatShortDate(dateStr: string): string {
  return format(parseISO(dateStr), 'MMM d');
}

export function formatDayName(dateStr: string): string {
  return format(parseISO(dateStr), 'EEE');
}

export function formatDayNumber(dateStr: string): string {
  return format(parseISO(dateStr), 'd');
}

export function getDateRange(centerDate: string, daysBack: number, daysForward: number): string[] {
  const center = parseISO(centerDate);
  const dates: string[] = [];
  for (let i = -daysBack; i <= daysForward; i++) {
    dates.push(format(addDays(center, i), 'yyyy-MM-dd'));
  }
  return dates;
}

export function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

export function timeAgo(dateStr: string): string {
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  const diff = now - then;

  const seconds = Math.floor(diff / 1000);
  if (seconds < 60) return 'just now';

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;

  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;

  return formatShortDate(dateStr);
}
