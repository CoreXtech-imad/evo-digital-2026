import { hashPassword } from "./admin-auth";
import type { AdminRole } from "./admin-auth";

export interface AdminUser {
  id:        string;
  username:  string;
  name:      string;
  role:      AdminRole;
  password:  string; // hashed
  active:    boolean;
  createdAt: string;
  updatedAt: string;
}

// ── Firestore helpers ────────────────────────────────────────────────────────

async function getDb() {
  const { getAdminDb } = await import("./firebase-admin");
  return getAdminDb();
}

// ── Ensure a default super_admin exists ──────────────────────────────────────

export async function ensureDefaultAdmin(): Promise<void> {
  const users = await getAllAdminUsers();
  if (users.length > 0) return;

  const defaultUsername = process.env.ADMIN_USERNAME || "admin";
  const defaultPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "admin123";

  await createAdminUser({
    username: defaultUsername,
    name:     "Super Admin",
    role:     "super_admin",
    password: defaultPassword,
    active:   true,
  });
}

// ── CRUD ─────────────────────────────────────────────────────────────────────

export async function getAllAdminUsers(): Promise<Omit<AdminUser, "password">[]> {
  try {
    const db   = await getDb();
    const snap = await db.collection("admin_users").orderBy("createdAt", "asc").get();
    return snap.docs.map((d: any) => {
      const { password: _p, ...rest } = { id: d.id, ...d.data() };
      return rest;
    });
  } catch {
    const { localDb } = await import("./local-db");
    const users = await localDb.collection("admins").getAll({ orderByDesc: "createdAt" });
    return users.map(({ password: _p, ...rest }) => rest);
  }
}

export async function getAdminUserByUsername(username: string): Promise<AdminUser | null> {
  try {
    const db   = await getDb();
    const snap = await db.collection("admin_users").where("username", "==", username).limit(1).get();
    if (snap.empty) return null;
    const doc = snap.docs[0];
    return { id: doc.id, ...doc.data() } as AdminUser;
  } catch {
    const { localDb } = await import("./local-db");
    const users = await localDb.collection("admins").getAll();
    return users.find((u: any) => u.username === username) ?? null;
  }
}

export async function createAdminUser(data: {
  username: string;
  name:     string;
  role:     AdminRole;
  password: string;
  active:   boolean;
}): Promise<string> {
  const now    = new Date().toISOString();
  const hashed = hashPassword(data.password);
  const doc    = { ...data, password: hashed, createdAt: now, updatedAt: now };

  try {
    const db  = await getDb();
    const ref = await db.collection("admin_users").add(doc);
    return ref.id;
  } catch {
    const { localDb } = await import("./local-db");
    return await localDb.collection("admins").add(doc);
  }
}

export async function updateAdminUser(
  id: string,
  data: Partial<{ name: string; role: AdminRole; password: string; active: boolean }>
): Promise<void> {
  const update: any = { ...data, updatedAt: new Date().toISOString() };
  if (data.password) update.password = hashPassword(data.password);

  try {
    const db = await getDb();
    await db.collection("admin_users").doc(id).update(update);
  } catch {
    const { localDb } = await import("./local-db");
    await localDb.collection("admins").update(id, update);
  }
}

export async function deleteAdminUser(id: string): Promise<void> {
  try {
    const db = await getDb();
    await db.collection("admin_users").doc(id).delete();
  } catch {
    const { localDb } = await import("./local-db");
    await localDb.collection("admins").remove(id);
  }
}
