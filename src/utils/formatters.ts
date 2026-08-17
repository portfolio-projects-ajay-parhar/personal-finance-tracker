// src/utils/formatters.ts
import { format, parseISO, isValid } from 'date-fns';

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatDate(dateString: string): string {
  const date = parseISO(dateString);
  if (!isValid(date)) return dateString;
  return format(date, 'MMM dd, yyyy');
}

export function formatDateShort(dateString: string): string {
  const date = parseISO(dateString);
  if (!isValid(date)) return dateString;
  return format(date, 'MM/dd/yy');
}

export function formatMonth(monthString: string): string {
  // monthString format: 'YYYY-MM'
  const date = parseISO(`${monthString}-01`);
  if (!isValid(date)) return monthString;
  return format(date, 'MMMM yyyy');
}

export function getCurrentDateString(): string {
  return format(new Date(), 'yyyy-MM-dd');
}

export function getCurrentMonthString(): string {
  return format(new Date(), 'yyyy-MM');
}

export function formatPercentage(value: number): string {
  return `${value.toFixed(1)}%`;
}

export function formatCompactCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(amount);
}