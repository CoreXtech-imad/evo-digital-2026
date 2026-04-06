import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { sanitizeInput } from "@/lib/utils";

const reviewSchema = z.object({
  productId: z.string().min(1),
  customerName: z.string().min(2).max(60),
  rating: z.number().int().min(1).max(5),
  comment: z.string().min(10).max(500),
});

export async function GET(request: NextRequest) {
  const productId = new URL(request.url).searchParams.get("productId");
  if (!productId) {
    return NextResponse.json({ error: "productId requis" }, { status: 400 });
  }

  try {
    const { getAdminDb } = await import("@/lib/firebase-admin");
    const db = getAdminDb();
    const snap = await db
      .collection("reviews")
      .where("productId", "==", productId)
      .orderBy("createdAt", "desc")
      .limit(20)
      .get();

    const reviews = snap.docs.map((d: any) => ({ id: d.id, ...d.data() }));
    return NextResponse.json({ reviews });
  } catch {
    return NextResponse.json({ reviews: [] });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = reviewSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Données invalides", details: parsed.error.issues },
        { status: 400 }
      );
    }

    const data = parsed.data;
    data.customerName = sanitizeInput(data.customerName);
    data.comment = sanitizeInput(data.comment);

    const { getAdminDb } = await import("@/lib/firebase-admin");
    const db = getAdminDb();

    // Check product exists
    const productSnap = await db.collection("products").doc(data.productId).get();
    if (!productSnap.exists) {
      return NextResponse.json({ error: "Produit introuvable" }, { status: 404 });
    }

    // Add review
    const ref = await db.collection("reviews").add({
      ...data,
      verified: false,
      createdAt: new Date().toISOString(),
    });

    // Update product rating
    const allReviewsSnap = await db
      .collection("reviews")
      .where("productId", "==", data.productId)
      .get();

    const reviews = allReviewsSnap.docs.map((d: any) => d.data());
    const avgRating =
      reviews.reduce((sum: number, r: any) => sum + r.rating, 0) / reviews.length;

    await db.collection("products").doc(data.productId).update({
      rating: Math.round(avgRating * 10) / 10,
      reviewCount: reviews.length,
      updatedAt: new Date().toISOString(),
    });

    return NextResponse.json({ id: ref.id }, { status: 201 });
  } catch (error) {
    console.error("Review error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
