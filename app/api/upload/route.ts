import { NextRequest, NextResponse } from "next/server";
import { requireRole } from "@/lib/admin-auth";

export const config = {
  api: { bodyParser: false },
};

export async function POST(request: NextRequest) {
  if (!requireRole(request, "manager")) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const productId = formData.get("productId") as string | null;

    if (!file) {
      return NextResponse.json({ error: "Aucun fichier fourni" }, { status: 400 });
    }

    if (file.size > 500 * 1024 * 1024) {
      return NextResponse.json(
        { error: "Fichier trop volumineux (max 500MB)" },
        { status: 413 }
      );
    }

    const allowedTypes = [
      "application/zip",
      "application/x-zip-compressed",
      "application/pdf",
      "application/octet-stream",
      "video/mp4",
      "image/png",
      "image/jpeg",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.type) && !file.name.match(/\.(zip|pdf|exe|mp4|rar|7z|fig|sketch|xd|py|js|ts)$/i)) {
      return NextResponse.json(
        { error: "Type de fichier non autorisé" },
        { status: 400 }
      );
    }

    // Upload to Firebase Storage
    const { getAdminStorage, getAdminDb } = await import("@/lib/firebase-admin");
    const storage = getAdminStorage();
    const db = getAdminDb();

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const ext = file.name.split(".").pop();
    const filename = `products/${productId || "misc"}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

    const bucket = storage.bucket();
    const fileRef = bucket.file(filename);

    await fileRef.save(buffer, {
      metadata: {
        contentType: file.type,
        metadata: {
          originalName: file.name,
          productId: productId || "",
          uploadedAt: new Date().toISOString(),
        },
      },
    });

    // Make file private — only accessible via signed URL
    // Don't make it public

    // Generate a signed URL valid for 10 years (stored in DB, used for delivery)
    const [signedUrl] = await fileRef.getSignedUrl({
      action: "read",
      expires: Date.now() + 10 * 365 * 24 * 60 * 60 * 1000,
    });

    // Update product with file URL if productId provided
    if (productId) {
      await db.collection("products").doc(productId).update({
        fileUrl: signedUrl,
        fileSize: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
        fileType: ext?.toUpperCase() || "FILE",
        updatedAt: new Date().toISOString(),
      });
    }

    return NextResponse.json({
      success: true,
      fileUrl: signedUrl,
      filename,
      size: file.size,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Erreur lors de l'upload" }, { status: 500 });
  }
}
