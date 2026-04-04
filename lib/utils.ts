import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { createHmac, randomBytes } from "crypto";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDZD(amount: number): string {
  return new Intl.NumberFormat("fr-DZ", {
    style: "currency",
    currency: "DZD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatNumber(num: number): string {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
  if (num >= 1000) return (num / 1000).toFixed(1) + "K";
  return num.toString();
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function generateOrderNumber(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `EVO-${timestamp}-${random}`;
}

export function generateDownloadToken(
  productId: string,
  orderId: string
): string {
  const secret = process.env.DOWNLOAD_TOKEN_SECRET || "fallback-secret";
  const data = `${productId}:${orderId}:${Date.now()}`;
  const token = createHmac("sha256", secret)
    .update(data)
    .digest("hex")
    .substring(0, 32);
  return token;
}

export function verifyDownloadToken(token: string): boolean {
  // Token validation logic — in production verify against DB
  return token.length === 32 && /^[a-f0-9]+$/.test(token);
}

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str;
  return str.substring(0, length) + "...";
}

export function getDiscountPercentage(
  originalPrice: number,
  currentPrice: number
): number {
  if (!originalPrice || originalPrice <= currentPrice) return 0;
  return Math.round(((originalPrice - currentPrice) / originalPrice) * 100);
}

export function isAdminAuthenticated(request: Request): boolean {
  const authHeader = request.headers.get("authorization");
  if (!authHeader) return false;
  
  const token = authHeader.replace("Bearer ", "");
  return token === process.env.ADMIN_SECRET_KEY;
}

export function sanitizeInput(input: string): string {
  return input
    .trim()
    .replace(/[<>]/g, "")
    .substring(0, 1000);
}
