// =====================
// EVO DIGITAL — Types
// =====================

export type ProductCategory =
  | "software"
  | "templates"
  | "ebooks"
  | "courses"
  | "scripts"
  | "assets"
  | "other";

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  longDescription?: string;
  price: number; // in DZD
  originalPrice?: number; // for showing discount
  category: ProductCategory;
  tags: string[];
  images: string[]; // URLs
  fileUrl?: string; // Secure storage URL (hidden from public)
  fileSize?: string; // e.g. "2.4 MB"
  fileType?: string; // e.g. "ZIP", "PDF"
  featured: boolean;
  bestSeller: boolean;
  isNew: boolean;
  stock: number; // -1 = unlimited digital
  sold: number;
  rating: number;
  reviewCount: number;
  createdAt: string;
  updatedAt: string;
  seoTitle?: string;
  seoDescription?: string;
}

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "processing"
  | "delivered"
  | "cancelled";

export interface OrderItem {
  productId: string;
  productName: string;
  productImage: string;
  price: number;
  quantity: number;
}

export interface CustomerInfo {
  name?: string;
  email?: string;
  phone?: string;
  city?: string;
  address?: string;
  wilaya?: string;
  notes?: string;
  [key: string]: string | undefined;
}

export interface Order {
  id: string;
  orderNumber: string;
  items: OrderItem[];
  customer: CustomerInfo;
  subtotal: number;
  shippingFee?: number;
  total: number;
  status: OrderStatus;
  paymentMethod: string;
  downloadLinks?: DownloadLink[];
  webhookSent?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface DownloadLink {
  productId: string;
  productName: string;
  token: string;
  expiresAt: string;
  downloadCount: number;
  maxDownloads: number;
}

export interface Review {
  id: string;
  productId: string;
  customerName: string;
  rating: number;
  comment: string;
  createdAt: string;
  verified: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface SiteSettings {
  storeName: string;
  storeDescription: string;
  contactEmail: string;
  contactPhone: string;
  whatsapp: string;
  address: string;
  logo?: string;
  socialFacebook?: string;
  socialInstagram?: string;
  heroTitle: string;
  heroSubtitle: string;
  shippingNote: string;
}

export interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  pendingOrders: number;
  totalProducts: number;
  conversionRate: number;
  recentOrders: Order[];
  topProducts: { product: Product; sold: number }[];
  revenueByDay: { date: string; revenue: number }[];
}

export const ALGERIA_WILAYAS = [
  "Adrar", "Chlef", "Laghouat", "Oum El Bouaghi", "Batna", "Béjaïa",
  "Biskra", "Béchar", "Blida", "Bouira", "Tamanrasset", "Tébessa",
  "Tlemcen", "Tiaret", "Tizi Ouzou", "Alger", "Djelfa", "Jijel",
  "Sétif", "Saïda", "Skikda", "Sidi Bel Abbès", "Annaba", "Guelma",
  "Constantine", "Médéa", "Mostaganem", "M'Sila", "Mascara", "Ouargla",
  "Oran", "El Bayadh", "Illizi", "Bordj Bou Arréridj", "Boumerdès",
  "El Tarf", "Tindouf", "Tissemsilt", "El Oued", "Khenchela",
  "Souk Ahras", "Tipaza", "Mila", "Aïn Defla", "Naâma", "Aïn Témouchent",
  "Ghardaïa", "Relizane", "Timimoun", "Bordj Badji Mokhtar",
  "Ouled Djellal", "Béni Abbès", "In Salah", "In Guezzam",
  "Touggourt", "Djanet", "El M'Ghair", "El Meniaa",
] as const;

export type AlgeriaWilaya = (typeof ALGERIA_WILAYAS)[number];
