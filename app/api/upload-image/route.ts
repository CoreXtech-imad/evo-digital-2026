import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { requireRole } from "@/lib/admin-auth";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif"];
const MAX_SIZE = 5 * 1024 * 1024; // 5 MB

export async function POST(request: NextRequest) {
  if (!requireRole(request, "manager")) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "Aucun fichier reçu" }, { status: 400 });
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: "Type de fichier non autorisé. Utilisez JPG, PNG, WebP ou GIF." },
        { status: 400 }
      );
    }

    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: "Fichier trop volumineux. Maximum 5 MB." },
        { status: 400 }
      );
    }

    // Try Firebase Storage first
    try {
      const { getAdminStorage } = await import("@/lib/firebase-admin");
      const storage = getAdminStorage();
      const bucket = storage.bucket();

      const ext = file.name.split(".").pop() || "jpg";
      const filename = `products/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

      const buffer = Buffer.from(await file.arrayBuffer());
      const fileRef = bucket.file(filename);

      await fileRef.save(buffer, {
        metadata: { contentType: file.type },
        public: true,
      });

      const publicUrl = `https://storage.googleapis.com/${bucket.name}/${filename}`;
      return NextResponse.json({ url: publicUrl, size: file.size });
    } catch {
      // Firebase Storage not configured — save locally
    }

    // Local fallback: save to /tmp on Vercel, public/uploads locally
    const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
    const safeName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const uploadDir = process.env.VERCEL
      ? path.join("/tmp", "uploads", "images")
      : path.join(process.cwd(), "public", "uploads", "images");

    await mkdir(uploadDir, { recursive: true });
    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(path.join(uploadDir, safeName), buffer);

    // On Vercel /tmp files aren't publicly accessible — return a placeholder
    const url = process.env.VERCEL ? "" : `/uploads/images/${safeName}`;
    return NextResponse.json({ url, size: file.size });
  } catch (error) {
    console.error("Image upload error:", error);
    return NextResponse.json({ error: "Erreur lors de l'upload" }, { status: 500 });
  }
}
