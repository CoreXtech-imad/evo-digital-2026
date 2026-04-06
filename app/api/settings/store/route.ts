import { NextRequest, NextResponse } from "next/server";
import { getStoreSettings, saveStoreSettings } from "@/lib/store-settings";
import { requireRole } from "@/lib/admin-auth";

export async function GET() {
  const settings = await getStoreSettings();
  return NextResponse.json(settings, {
    headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300" },
  });
}

export async function POST(request: NextRequest) {
  const session = requireRole(request, "super_admin");
  if (!session) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const body = await request.json();
  await saveStoreSettings(body);
  return NextResponse.json({ success: true });
}
