import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireRole } from "@/lib/admin-auth";
import { updateAdminUser, deleteAdminUser } from "@/lib/admin-users";

const updateSchema = z.object({
  name:     z.string().min(2).max(60).optional(),
  role:     z.enum(["super_admin", "manager", "support", "viewer"]).optional(),
  password: z.string().min(8).max(100).optional(),
  active:   z.boolean().optional(),
});

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = requireRole(request, "super_admin");
  if (!session) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const { id } = await params;
  const body   = await request.json();
  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Données invalides", details: parsed.error.issues }, { status: 400 });
  }

  await updateAdminUser(id, parsed.data);
  return NextResponse.json({ success: true });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = requireRole(request, "super_admin");
  if (!session) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const { id } = await params;

  // Prevent self-deletion
  if (id === session.userId) {
    return NextResponse.json({ error: "Impossible de supprimer votre propre compte" }, { status: 400 });
  }

  await deleteAdminUser(id);
  return NextResponse.json({ success: true });
}
