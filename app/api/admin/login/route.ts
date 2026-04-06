import { NextRequest, NextResponse } from "next/server";
import { verifyPassword, generateToken } from "@/lib/admin-auth";
import { getAdminUserByUsername, ensureDefaultAdmin } from "@/lib/admin-users";

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json({ error: "Identifiants requis" }, { status: 400 });
    }

    // Seed default admin on first run
    await ensureDefaultAdmin();

    const user = await getAdminUserByUsername(username.trim().toLowerCase());

    if (!user || !user.active) {
      return NextResponse.json({ error: "Identifiants incorrects" }, { status: 401 });
    }

    if (!verifyPassword(password, user.password)) {
      return NextResponse.json({ error: "Identifiants incorrects" }, { status: 401 });
    }

    const token = generateToken({
      userId:   user.id,
      username: user.username,
      name:     user.name,
      role:     user.role,
    });

    return NextResponse.json({ token, role: user.role, name: user.name });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
