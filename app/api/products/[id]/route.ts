import { NextRequest, NextResponse } from "next/server";
import { slugify } from "@/lib/utils";
import { requireRole } from "@/lib/admin-auth";
import { localDb } from "@/lib/local-db";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  // Try Firebase first
  try {
    const { getAdminDb } = await import("@/lib/firebase-admin");
    const db = getAdminDb();
    const snap = await db.collection("products").doc(id).get();
    if (!snap.exists) {
      return NextResponse.json({ error: "Produit introuvable" }, { status: 404 });
    }
    return NextResponse.json({ id: snap.id, ...snap.data() });
  } catch {
    // Firebase not configured — use local DB
  }

  const doc = await localDb.collection("products").getById(id);
  if (!doc) return NextResponse.json({ error: "Produit introuvable" }, { status: 404 });
  return NextResponse.json(doc);
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!requireRole(request, "manager")) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json();
  if (body.name) body.slug = slugify(body.name);
  body.updatedAt = new Date().toISOString();

  // Try Firebase first
  try {
    const { getAdminDb } = await import("@/lib/firebase-admin");
    const db = getAdminDb();
    await db.collection("products").doc(id).update(body);
    return NextResponse.json({ success: true });
  } catch {
    // Firebase not configured — update locally
  }

  try {
    await localDb.collection("products").update(id, body);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Produit introuvable" }, { status: 404 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!requireRole(request, "manager")) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const { id } = await params;

  // Try Firebase first
  try {
    const { getAdminDb } = await import("@/lib/firebase-admin");
    const db = getAdminDb();
    await db.collection("products").doc(id).delete();
    return NextResponse.json({ success: true });
  } catch {
    // Firebase not configured — delete locally
  }

  await localDb.collection("products").remove(id);
  return NextResponse.json({ success: true });
}
