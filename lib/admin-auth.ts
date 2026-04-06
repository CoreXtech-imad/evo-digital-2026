import { createHmac, scryptSync, randomBytes, timingSafeEqual } from "crypto";

export type AdminRole = "super_admin" | "manager" | "support" | "viewer";

export const ROLE_LABELS: Record<AdminRole, string> = {
  super_admin: "Super Admin",
  manager:     "Manager",
  support:     "Support",
  viewer:      "Lecteur",
};

export const ROLE_HIERARCHY: Record<AdminRole, number> = {
  viewer:      1,
  support:     2,
  manager:     3,
  super_admin: 4,
};

export function hasRole(userRole: AdminRole, required: AdminRole): boolean {
  return ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[required];
}

// ── Password hashing (scrypt) ────────────────────────────────────────────────

export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, stored: string): boolean {
  try {
    const [salt, hash] = stored.split(":");
    const hashBuf  = Buffer.from(hash, "hex");
    const inputBuf = scryptSync(password, salt, 64);
    return timingSafeEqual(hashBuf, inputBuf);
  } catch {
    return false;
  }
}

// ── Session tokens ───────────────────────────────────────────────────────────

const SECRET = () => process.env.ADMIN_SECRET_KEY || "dev-secret-change-me";
const TOKEN_TTL_MS = 8 * 60 * 60 * 1000; // 8 hours

export interface AdminSession {
  userId:   string;
  username: string;
  name:     string;
  role:     AdminRole;
  exp:      number;
}

export function generateToken(session: Omit<AdminSession, "exp">): string {
  const payload: AdminSession = { ...session, exp: Date.now() + TOKEN_TTL_MS };
  const encoded = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const sig = createHmac("sha256", SECRET()).update(encoded).digest("hex");
  return `${encoded}.${sig}`;
}

export function verifyToken(token: string): AdminSession | null {
  try {
    const [encoded, sig] = token.split(".");
    if (!encoded || !sig) return null;
    const expected = createHmac("sha256", SECRET()).update(encoded).digest("hex");
    if (!timingSafeEqual(Buffer.from(sig, "hex"), Buffer.from(expected, "hex"))) return null;
    const session: AdminSession = JSON.parse(Buffer.from(encoded, "base64url").toString());
    if (session.exp < Date.now()) return null;
    return session;
  } catch {
    return null;
  }
}

export function getSessionFromRequest(request: Request): AdminSession | null {
  const auth = request.headers.get("authorization") || "";
  const token = auth.replace("Bearer ", "").trim();
  if (!token) return null;

  // New multi-user token
  const session = verifyToken(token);
  if (session) return session;

  // Legacy single-key fallback
  if (token === process.env.ADMIN_SECRET_KEY) {
    return {
      userId:   "legacy",
      username: "admin",
      name:     "Admin",
      role:     "super_admin",
      exp:      Date.now() + TOKEN_TTL_MS,
    };
  }
  return null;
}

export function requireRole(request: Request, required: AdminRole): AdminSession | null {
  const session = getSessionFromRequest(request);
  if (!session) return null;
  if (!hasRole(session.role, required)) return null;
  return session;
}
