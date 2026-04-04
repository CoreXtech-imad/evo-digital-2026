/**
 * Firestore data access layer.
 * All functions silently fall back to empty results when Firebase
 * is not configured — the UI uses local demo data in that case.
 */
import { Product, Order, Review } from "@/types";

// ── Helper: safely get admin DB ───────────────────────────────────────────────
async function adminDb() {
  const { getAdminDb } = await import("./firebase-admin");
  return getAdminDb(); // throws "FIREBASE_NOT_CONFIGURED" when not set up
}

// ==================== PRODUCTS ====================

export async function getProducts(filters?: {
  category?: string;
  featured?: boolean;
  bestSeller?: boolean;
  limit?: number;
}): Promise<Product[]> {
  try {
    const db = await adminDb();
    let q: any = db.collection("products").orderBy("createdAt", "desc");
    if (filters?.featured)    q = q.where("featured",   "==", true);
    if (filters?.bestSeller)  q = q.where("bestSeller", "==", true);
    if (filters?.category)    q = q.where("category",   "==", filters.category);
    if (filters?.limit)       q = q.limit(filters.limit);
    const snap = await q.get();
    return snap.docs.map((d: any) => ({ id: d.id, ...d.data() } as Product));
  } catch {
    return [];
  }
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  try {
    const db = await adminDb();
    const snap = await db.collection("products").where("slug", "==", slug).limit(1).get();
    if (snap.empty) return null;
    return { id: snap.docs[0].id, ...snap.docs[0].data() } as Product;
  } catch {
    return null;
  }
}

export async function getProductById(id: string): Promise<Product | null> {
  try {
    const db = await adminDb();
    const snap = await db.collection("products").doc(id).get();
    if (!snap.exists) return null;
    return { id: snap.id, ...snap.data() } as Product;
  } catch {
    return null;
  }
}

export async function createProduct(data: Omit<Product, "id">): Promise<string> {
  const db = await adminDb();
  const ref = await db.collection("products").add({
    ...data,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });
  return ref.id;
}

export async function updateProduct(id: string, data: Partial<Product>): Promise<void> {
  const db = await adminDb();
  await db.collection("products").doc(id).update({
    ...data,
    updatedAt: new Date().toISOString(),
  });
}

export async function deleteProduct(id: string): Promise<void> {
  const db = await adminDb();
  await db.collection("products").doc(id).delete();
}

// ==================== ORDERS ====================

export async function createOrder(data: Omit<Order, "id">): Promise<string> {
  const db = await adminDb();
  const ref = await db.collection("orders").add({
    ...data,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });
  return ref.id;
}

export async function getOrders(status?: string): Promise<Order[]> {
  try {
    const db = await adminDb();
    let q: any = db.collection("orders").orderBy("createdAt", "desc");
    if (status) q = q.where("status", "==", status);
    const snap = await q.get();
    return snap.docs.map((d: any) => ({ id: d.id, ...d.data() } as Order));
  } catch {
    return [];
  }
}

export async function getOrderById(id: string): Promise<Order | null> {
  try {
    const db = await adminDb();
    const snap = await db.collection("orders").doc(id).get();
    if (!snap.exists) return null;
    return { id: snap.id, ...snap.data() } as Order;
  } catch {
    return null;
  }
}

export async function updateOrderStatus(id: string, status: Order["status"]): Promise<void> {
  const db = await adminDb();
  await db.collection("orders").doc(id).update({
    status,
    updatedAt: new Date().toISOString(),
  });
}

export async function incrementProductSold(productId: string): Promise<void> {
  try {
    const db = await adminDb();
    const { FieldValue } = require("firebase-admin/firestore");
    await db.collection("products").doc(productId).update({
      sold: FieldValue.increment(1),
    });
  } catch {
    // Silently ignore — demo products don't exist in DB
  }
}

// ==================== REVIEWS ====================

export async function getProductReviews(productId: string): Promise<Review[]> {
  try {
    const db = await adminDb();
    const snap = await db
      .collection("reviews")
      .where("productId", "==", productId)
      .orderBy("createdAt", "desc")
      .get();
    return snap.docs.map((d: any) => ({ id: d.id, ...d.data() } as Review));
  } catch {
    return [];
  }
}

// ==================== STATS ====================

export async function getDashboardStats() {
  try {
    const db = await adminDb();
    const [productSnap, orderSnap] = await Promise.all([
      db.collection("products").get(),
      db.collection("orders").orderBy("createdAt", "desc").get(),
    ]);

    const allOrders = orderSnap.docs.map((d: any) => ({
      id: d.id,
      ...d.data(),
    })) as Order[];

    const confirmed = allOrders.filter((o) =>
      ["confirmed", "processing", "delivered"].includes(o.status)
    );
    const pending = allOrders.filter((o) => o.status === "pending");
    const totalRevenue = confirmed.reduce((s, o) => s + o.total, 0);

    return {
      totalRevenue,
      totalOrders: allOrders.length,
      pendingOrders: pending.length,
      totalProducts: productSnap.size,
      conversionRate:
        allOrders.length > 0
          ? Math.round((confirmed.length / allOrders.length) * 100)
          : 0,
      recentOrders: allOrders.slice(0, 5),
    };
  } catch {
    // Return demo stats when Firebase is not configured
    return {
      totalRevenue: 458500,
      totalOrders: 124,
      pendingOrders: 8,
      totalProducts: 32,
      conversionRate: 68,
      recentOrders: [],
    };
  }
}
