import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/utils";
import { createHmac } from "crypto";

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!isAdminAuthenticated(request)) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  try {
    const { status } = await request.json();
    const validStatuses = ["pending", "confirmed", "processing", "delivered", "cancelled"];

    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: "Statut invalide" }, { status: 400 });
    }

    const { getAdminDb } = await import("@/lib/firebase-admin");
    const db = getAdminDb();

    const orderRef = db.collection("orders").doc(params.id);
    const orderSnap = await orderRef.get();

    if (!orderSnap.exists) {
      return NextResponse.json({ error: "Commande introuvable" }, { status: 404 });
    }

    const order = orderSnap.data()!;

    // If confirming order, generate download links for digital products
    let downloadLinks = order.downloadLinks || [];
    if (status === "confirmed" && downloadLinks.length === 0) {
      const secret = process.env.DOWNLOAD_TOKEN_SECRET || "fallback-secret";
      const expiry = parseInt(process.env.DOWNLOAD_EXPIRY_HOURS || "72");

      downloadLinks = order.items.map((item: any) => {
        const token = createHmac("sha256", secret)
          .update(`${params.id}:${item.productId}`)
          .digest("hex")
          .substring(0, 32);

        const downloadUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/download?token=${token}&orderId=${params.id}&productId=${item.productId}`;

        return {
          productId: item.productId,
          productName: item.productName,
          token,
          downloadUrl,
          expiresAt: new Date(Date.now() + expiry * 3600 * 1000).toISOString(),
          downloadCount: 0,
          maxDownloads: parseInt(process.env.MAX_DOWNLOADS || "3"),
        };
      });

      // TODO: Send download links via email to customer
    }

    await orderRef.update({
      status,
      downloadLinks,
      updatedAt: new Date().toISOString(),
    });

    return NextResponse.json({ success: true, status, downloadLinks });
  } catch (error) {
    console.error("Order update error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!isAdminAuthenticated(request)) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  try {
    const { getAdminDb } = await import("@/lib/firebase-admin");
    const db = getAdminDb();
    const snap = await db.collection("orders").doc(params.id).get();

    if (!snap.exists) {
      return NextResponse.json({ error: "Commande introuvable" }, { status: 404 });
    }

    return NextResponse.json({ id: snap.id, ...snap.data() });
  } catch {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
