
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function sanitizeNumberInput(value: string): string {
  return value.replace(/[^0-9.]/g, "")
}
