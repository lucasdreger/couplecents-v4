import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combines multiple class names into a single string, 
 * handling Tailwind CSS class conflicts
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formats a number as a currency string
 * @param value The value to format
 * @param currency The currency code (defaults to USD)
 */
export function formatCurrency(value: number, currency: string = "USD"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(value);
}

/**
 * Formats a date as a localized string
 * @param date The date to format
 * @param options Intl.DateTimeFormatOptions
 */
export function formatDate(
  date: Date | string | number,
  options: Intl.DateTimeFormatOptions = { 
    year: "numeric", 
    month: "short", 
    day: "numeric" 
  }
): string {
  const dateObj = typeof date === "string" || typeof date === "number" 
    ? new Date(date) 
    : date;
  
  return new Intl.DateTimeFormat("en-US", options).format(dateObj);
}

/**
 * Calculates the percentage change between two values
 */
export function calculatePercentageChange(
  currentValue: number,
  previousValue: number
): number {
  if (previousValue === 0) return 0;
  return ((currentValue - previousValue) / Math.abs(previousValue)) * 100;
}

/**
 * Truncates a string if it exceeds the specified length
 */
export function truncateString(str: string, maxLength: number = 30): string {
  if (str.length <= maxLength) return str;
  return `${str.substring(0, maxLength - 3)}...`;
}

/**
 * Generates a random ID
 */
export function generateId(length: number = 8): string {
  return Math.random().toString(36).substring(2, 2 + length);
}

/**
 * Deep clones an object
 */
export function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

/**
 * Debounces a function call
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}
