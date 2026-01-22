import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Returns a formatted currency string in format 12.5k for a given amount.
 * 12,500 -> 12.5k
 * 100,000 -> 100k
 * 1,250,000 -> 1.25M
 * @param amount 
 */
export function formatToCurrency(amount: number, locale = 'en-US'): string {
  return new Intl.NumberFormat(locale, {
    notation: "compact",
    compactDisplay: "short", // Use "k" instead of "thousand"
    maximumFractionDigits: 1 // Adjust decimal places as needed
  }).format(amount);
}