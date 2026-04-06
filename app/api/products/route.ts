import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { slugify, isAdminAuthenticated } from "@/lib/utils";
import { localDb } from "@/lib/local-db";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const category   = searchParams.get("category");
  const featured   = searchParams.get("featured") === "true";
  const bestSeller = searchParams.get("bestSeller") === "true";
  const limitN     = parseInt(searchParams.get("limit") ?? "100");

  // Try Firebase first
  try {
    const { getAdminDb } = await import("@/lib/firebase-admin");
    const db = getAdminDb();

    let q: any = db.collection("products").orderBy("createdAt", "desc");
    if (category)   q = q.where("category",   "==", category);
    if (featured)   q = q.where("featured",   "==", true);
    if (bestSeller) q = q.where("bestSeller", "==", true);
    q = q.limit(limitN);

    const snap = await q.get();
    const products = snap.docs.map((d: any) => ({ id: d.id, ...d.data() }));
    if (products.length > 0) {
      return NextResponse.json({ products });
    }
    // Firestore empty — fall through to local DB
  } catch {
    // Firebase not configured — use local DB
  }

  const products = await localDb.collection("products").getAll({
    category, featured, bestSeller, limit: limitN, orderByDesc: "createdAt",
  });
  return NextResponse.json({ products });
}

const productSchema = z.object({
  name:            z.string().min(2).max(200),
  description:     z.string().min(2).max(5000),
  longDescription: z.string().max(10000).optional(),
  price:           z.number().positive(),
  originalPrice:   z.number().positive().optional(),
  category:        z.enum(["software","templates","ebooks","courses","scripts","assets","other"]),
  tags:            z.array(z.string()).max(10),
  images:          z.array(z.string()).max(10),
  fileUrl:         z.string().optional(),
  fileSize:        z.string().optional(),
  fileType:        z.string().optional(),
  featured:        z.boolean().default(false),
  bestSeller:      z.boolean().default(false),
  isNew:           z.boolean().default(true),
  stock:           z.number().default(-1),
  seoTitle:        z.string().max(60).optional(),
  seoDescription:  z.string().max(160).optional(),
});

export async function POST(request: NextRequest) {
  if (!isAdminAuthenticated(request)) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const body = await request.json();
  const parsed = productSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Données invalides", details: parsed.error.issues }, { status: 400 });
  }

  const data = parsed.data;
  const slug = slugify(data.name);
  const now  = new Date().toISOString();

  // Try Firebase first
  try {
    const { getAdminDb } = await import("@/lib/firebase-admin");
    const db = getAdminDb();
    const ref = await db.collection("products").add({
      ...data, slug, sold: 0, rating: 0, reviewCount: 0, createdAt: now, updatedAt: now,
    });
    return NextResponse.json({ id: ref.id, slug }, { status: 201 });
  } catch {
    // Firebase not configured — save locally
  }

  const id = await localDb.collection("products").add({
    ...data, slug, sold: 0, rating: 0, reviewCount: 0, createdAt: now, updatedAt: now,
  });
  return NextResponse.json({ id, slug }, { status: 201 });
}
