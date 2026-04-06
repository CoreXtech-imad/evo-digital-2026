import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireRole } from "@/lib/admin-auth";
import { getAllAdminUsers, createAdminUser } from "@/lib/admin-users";

const createSchema = z.object({
  username: z.string().min(3).max(30).regex(/^[a-z0-9_]+$/, "Lettres minuscules, chiffres et _ uniquement"),
  name:     z.string().min(2).max(60),
  role:     z.enum(["super_admin", "manager", "support", "viewer"]),
  password: z.string().min(8).max(100),
});

export async function GET(request: NextRequest) {
  const session = requireRole(request, "super_admin");
  if (!session) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const users = await getAllAdminUsers();
  return NextResponse.json({ users });
}

export async function POST(request: NextRequest) {
  const session = requireRole(request, "super_admin");
  if (!session) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const body   = await request.json();
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Données invalides", details: parsed.error.issues }, { status: 400 });
  }

  const { username, name, role, password } = parsed.data;
  const id = await createAdminUser({ username: username.toLowerCase(), name, role, password, active: true });
  return NextResponse.json({ id }, { status: 201 });
}
