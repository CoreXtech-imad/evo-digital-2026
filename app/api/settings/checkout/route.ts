import { NextRequest, NextResponse } from "next/server";
import { getCheckoutSettings, saveCheckoutSettings } from "@/lib/checkout-settings";
import { requireRole } from "@/lib/admin-auth";

export async function GET() {
  const settings = await getCheckoutSettings();
  return NextResponse.json(settings);
}

export async function POST(request: NextRequest) {
  const session = requireRole(request, "manager");
  if (!session) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const body = await request.json();
  await saveCheckoutSettings(body);
  return NextResponse.json({ success: true });
}
