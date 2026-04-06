import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { requireRole } from "@/lib/admin-auth";

const ALLOWED = ["image/jpeg", "image/png", "image/webp", "image/svg+xml", "image/gif"];
const MAX_SIZE = 2 * 1024 * 1024; // 2 MB

export async function POST(request: NextRequest) {
  const session = requireRole(request, "super_admin");
  if (!session) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const formData = await request.formData();
  const file     = formData.get("file") as File | null;
  const type     = (formData.get("type") as string) || "logo"; // "logo" | "favicon" | "og"

  if (!file) return NextResponse.json({ error: "Aucun fichier reçu" }, { status: 400 });
  if (!ALLOWED.includes(file.type)) {
    return NextResponse.json({ error: "Format non supporté. Utilisez JPG, PNG, WebP ou SVG." }, { status: 400 });
  }
  if (file.size > MAX_SIZE) {
    return NextResponse.json({ error: "Fichier trop volumineux. Maximum 2 MB." }, { status: 400 });
  }

  // Try Firebase Storage first
  try {
    const { getAdminStorage } = await import("@/lib/firebase-admin");
    const storage = getAdminStorage();
    const bucket  = storage.bucket();
    const ext     = file.name.split(".").pop() || "png";
    const filename = `store/${type}.${ext}`;
    const buffer  = Buffer.from(await file.arrayBuffer());
    const fileRef = bucket.file(filename);
    await fileRef.save(buffer, { metadata: { contentType: file.type }, public: true });
    const url = `https://storage.googleapis.com/${bucket.name}/${filename}`;
    return NextResponse.json({ url });
  } catch {}

  // Local fallback
  const ext      = file.name.split(".").pop()?.toLowerCase() || "png";
  const filename = `${type}.${ext}`;
  const dir = process.env.VERCEL
    ? path.join("/tmp", "uploads", "logos")
    : path.join(process.cwd(), "public", "uploads", "logos");
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, filename), Buffer.from(await file.arrayBuffer()));
  // On Vercel /tmp isn't publicly accessible — Firebase Storage must be configured
  const url = process.env.VERCEL ? "" : `/uploads/logos/${filename}`;
  return NextResponse.json({ url });
}
