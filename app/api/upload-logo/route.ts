import { NextRequest, NextResponse } from "next/server";
import { requireRole } from "@/lib/admin-auth";

const ALLOWED = ["image/jpeg", "image/png", "image/webp", "image/svg+xml", "image/gif"];
const MAX_SIZE = 2 * 1024 * 1024; // 2 MB

export async function POST(request: NextRequest) {
  const session = requireRole(request, "super_admin");
  if (!session) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const formData = await request.formData();
  const file     = formData.get("file") as File | null;
  const type     = (formData.get("type") as string) || "logo";

  if (!file) return NextResponse.json({ error: "Aucun fichier reçu" }, { status: 400 });
  if (!ALLOWED.includes(file.type))
    return NextResponse.json({ error: "Format non supporté. Utilisez JPG, PNG, WebP ou SVG." }, { status: 400 });
  if (file.size > MAX_SIZE)
    return NextResponse.json({ error: "Fichier trop volumineux. Maximum 2 MB." }, { status: 400 });

  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    const base64 = `data:${file.type};base64,${buffer.toString("base64")}`;

    const { v2: cloudinary } = await import("cloudinary");
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key:    process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });

    const result = await cloudinary.uploader.upload(base64, {
      folder:    "evo-digital/store",
      public_id: type,          // logo, favicon, or og — overwrites previous
      overwrite: true,
      transformation: [{ quality: "auto", fetch_format: "auto" }],
    });

    return NextResponse.json({ url: result.secure_url });
  } catch (error) {
    console.error("Logo upload error:", error);
    return NextResponse.json({ error: "Erreur lors de l'upload" }, { status: 500 });
  }
}
