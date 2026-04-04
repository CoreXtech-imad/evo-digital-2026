import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json();

    if (!password || typeof password !== "string") {
      return NextResponse.json({ error: "Mot de passe requis" }, { status: 400 });
    }

    const adminPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD;
    
    // If no admin password is set, accept any 6+ char password (demo mode)
    if (!adminPassword) {
      if (password.length >= 6) {
        return NextResponse.json({ success: true });
      }
      return NextResponse.json({ error: "Incorrect" }, { status: 401 });
    }

    if (password !== adminPassword) {
      return NextResponse.json({ error: "Incorrect" }, { status: 401 });
    }

    return NextResponse.json({
      success: true,
      adminKey: process.env.ADMIN_SECRET_KEY || "",
    });
  } catch {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
