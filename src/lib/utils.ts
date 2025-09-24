import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatConfidenceScore(score: number): string {
  return `${Math.round(score * 100)}%`
}

export function formatTimestamp(timestamp: string): string {
  return new Date(timestamp).toLocaleString()
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength) + '...'
}

export function getConfidenceColor(score: number): string {
  if (score >= 0.8) return 'text-green-600'
  if (score >= 0.6) return 'text-yellow-600'
  if (score >= 0.4) return 'text-orange-600'
  return 'text-red-600'
}

export function getConfidenceBgColor(score: number): string {
  if (score >= 0.8) return 'bg-green-100'
  if (score >= 0.6) return 'bg-yellow-100'
  if (score >= 0.4) return 'bg-orange-100'
  return 'bg-red-100'
}
