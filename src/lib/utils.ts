import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Format currency with proper decimals
export function formatCurrency(value: number): string {
  if (value >= 1) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  }
  
  // For small values, show more decimals
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 6,
  }).format(value);
}

// Format percentage change
export function formatPercentage(value: number): string {
  const prefix = value >= 0 ? '+' : '';
  return `${prefix}${value.toFixed(2)}%`;
}

// Format holdings
export function formatHoldings(value: number): string {
  if (value >= 1) {
    return value.toFixed(4);
  }
  return value.toFixed(6);
}

// Format date for "Last updated"
export function formatLastUpdated(isoString: string | null): string {
  if (!isoString) return 'Never';
  
  const date = new Date(isoString);
  return new Intl.DateTimeFormat('en-US', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).format(date);
}

// Shorten wallet address
export function shortenAddress(address: string): string {
  if (!address) return '';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

// Chart colors array
export const CHART_COLORS = [
  '#F97316', // Orange
  '#A855F7', // Purple
  '#14B8A6', // Teal
  '#EC4899', // Pink
  '#3B82F6', // Blue
  '#EAB308', // Yellow
  '#22C55E', // Green
  '#F43F5E', // Rose
  '#06B6D4', // Cyan
  '#8B5CF6', // Violet
];

// Get color for token by index
export function getTokenColor(index: number): string {
  return CHART_COLORS[index % CHART_COLORS.length];
}

// Debounce function
export function debounce<T extends (...args: unknown[]) => void>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;
  
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}
