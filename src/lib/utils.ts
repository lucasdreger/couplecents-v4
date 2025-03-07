import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Type-safe class name merging
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Type-safe date formatting
interface DateFormatOptions {
  format?: 'short' | 'medium' | 'long';
  includeTime?: boolean;
  locale?: string;
}

export function formatDate(date: Date | string, options: DateFormatOptions = {}) {
  const { format = 'medium', includeTime = false, locale = 'en-US' } = options;
  const dateObj = date instanceof Date ? date : new Date(date);

  const formatOptions: Intl.DateTimeFormatOptions = {
    short: { month: 'numeric', day: 'numeric', year: '2-digit' },
    medium: { month: 'short', day: 'numeric', year: 'numeric' },
    long: { month: 'long', day: 'numeric', year: 'numeric' },
  }[format];

  if (includeTime) {
    formatOptions.hour = 'numeric';
    formatOptions.minute = 'numeric';
  }

  return new Intl.DateTimeFormat(locale, formatOptions).format(dateObj);
}

// Type-safe currency formatting
interface CurrencyFormatOptions {
  currency?: string;
  locale?: string;
  minimumFractionDigits?: number;
  maximumFractionDigits?: number;
}

export function formatCurrency(
  amount: number,
  options: CurrencyFormatOptions = {}
) {
  const {
    currency = 'USD',
    locale = 'en-US',
    minimumFractionDigits = 2,
    maximumFractionDigits = 2,
  } = options;

  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits,
    maximumFractionDigits,
  }).format(amount);
}

// Type-safe number formatting
interface NumberFormatOptions {
  style?: 'decimal' | 'percent';
  minimumFractionDigits?: number;
  maximumFractionDigits?: number;
  locale?: string;
}

export function formatNumber(
  value: number,
  options: NumberFormatOptions = {}
) {
  const {
    style = 'decimal',
    minimumFractionDigits = 0,
    maximumFractionDigits = 2,
    locale = 'en-US',
  } = options;

  return new Intl.NumberFormat(locale, {
    style,
    minimumFractionDigits,
    maximumFractionDigits,
  }).format(value);
}

// Type-safe color utilities
interface RGB {
  r: number;
  g: number;
  b: number;
}

export function hexToRgb(hex: string): RGB | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

export function rgbToHex({ r, g, b }: RGB): string {
  return '#' + [r, g, b]
    .map(x => {
      const hex = x.toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    })
    .join('');
}

// Type-safe debounce function
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };

    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(later, wait);
  };
}

// Type-safe deep clone function
export function deepClone<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  if (obj instanceof Date) {
    return new Date(obj.getTime()) as any;
  }

  if (Array.isArray(obj)) {
    return obj.map(item => deepClone(item)) as any;
  }

  return Object.fromEntries(
    Object.entries(obj as any).map(([key, value]) => [
      key,
      deepClone(value),
    ])
  ) as T;
}

// Type-safe local storage helpers
export const storage = {
  get<T>(key: string, defaultValue: T): T {
    try {
      const item = localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : defaultValue;
    } catch {
      return defaultValue;
    }
  },

  set<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  },

  remove(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Error removing from localStorage:', error);
    }
  },
};
