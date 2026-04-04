import { NextRequest, NextResponse } from "next/server";
import { createHmac } from "crypto";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get("token");
  const orderId = searchParams.get("orderId");
  const productId = searchParams.get("productId");

  if (!token || !orderId || !productId) {
    return NextResponse.json({ error: "Paramètres manquants" }, { status: 400 });
  }

  try {
    const { getAdminDb } = await import("@/lib/firebase-admin");
    const db = getAdminDb();

    // Get order and verify it exists & is paid
    const orderSnap = await db.collection("orders").doc(orderId).get();
    if (!orderSnap.exists) {
      return NextResponse.json({ error: "Commande introuvable" }, { status: 404 });
    }

    const order = orderSnap.data()!;
    if (!["confirmed", "processing", "delivered"].includes(order.status)) {
      return NextResponse.json(
        { error: "Commande non confirmée. Veuillez contacter le support." },
        { status: 403 }
      );
    }

    // Verify token
    const secret = process.env.DOWNLOAD_TOKEN_SECRET || "fallback-secret";
    const expectedToken = createHmac("sha256", secret)
      .update(`${orderId}:${productId}`)
      .digest("hex")
      .substring(0, 32);

    if (token !== expectedToken) {
      return NextResponse.json({ error: "Lien invalide ou expiré" }, { status: 403 });
    }

    // Check download links in order
    const downloadLinks: any[] = order.downloadLinks || [];
    const link = downloadLinks.find(
      (l: any) => l.productId === productId && l.token === token
    );

    if (!link) {
      return NextResponse.json({ error: "Lien de téléchargement introuvable" }, { status: 404 });
    }

    // Check expiry
    if (new Date(link.expiresAt) < new Date()) {
      return NextResponse.json({ error: "Lien expiré" }, { status: 410 });
    }

    // Check download count
    if (link.downloadCount >= link.maxDownloads) {
      return NextResponse.json(
        { error: "Limite de téléchargements atteinte" },
        { status: 429 }
      );
    }

    // Increment download count
    const updatedLinks = downloadLinks.map((l: any) =>
      l.productId === productId && l.token === token
        ? { ...l, downloadCount: l.downloadCount + 1 }
        : l
    );

    await db.collection("orders").doc(orderId).update({
      downloadLinks: updatedLinks,
    });

    // Get product file URL
    const productSnap = await db.collection("products").doc(productId).get();
    if (!productSnap.exists) {
      return NextResponse.json({ error: "Produit introuvable" }, { status: 404 });
    }

    const product = productSnap.data()!;
    if (!product.fileUrl) {
      return NextResponse.json(
        { error: "Fichier non disponible. Contactez le support." },
        { status: 404 }
      );
    }

    // Redirect to the secure file URL
    return NextResponse.redirect(product.fileUrl);
  } catch (error) {
    console.error("Download error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
