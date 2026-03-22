import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Convert a raw base64 string to a data URI if it isn't already a URL/data URI */
export function toImageSrc(value: string | null | undefined): string | null {
  if (!value) return null;
  if (value.startsWith("http") || value.startsWith("data:") || value.startsWith("blob:")) return value;
  // Detect mime from base64 header bytes
  const mime = value.startsWith("/9j") ? "image/jpeg" : value.startsWith("iVBOR") ? "image/png" : "image/png";
  return `data:${mime};base64,${value}`;
}
