// Types and defaults live in checkout-types.ts (client-safe, no server imports)
export type { FieldConfig, PaymentMethod, CheckoutSettings } from "./checkout-types";
export { DEFAULT_SETTINGS } from "./checkout-types";

import type { CheckoutSettings } from "./checkout-types";
import { DEFAULT_SETTINGS } from "./checkout-types";

// ── Server-side storage (Firestore + local JSON fallback) ────────────────────

export async function getCheckoutSettings(): Promise<CheckoutSettings> {
  try {
    const { getAdminDb } = await import("./firebase-admin");
    const db   = getAdminDb();
    const snap = await db.collection("settings").doc("checkout").get();
    if (snap.exists) return { ...DEFAULT_SETTINGS, ...(snap.data() as CheckoutSettings) };
  } catch {}

  try {
    const { localDb } = await import("./local-db");
    const docs = await localDb.collection("settings").getAll();
    const doc  = docs.find((d: any) => d.id === "checkout");
    if (doc) return { ...DEFAULT_SETTINGS, ...doc };
  } catch {}

  return DEFAULT_SETTINGS;
}

export async function saveCheckoutSettings(data: CheckoutSettings): Promise<void> {
  try {
    const { getAdminDb } = await import("./firebase-admin");
    const db = getAdminDb();
    await db.collection("settings").doc("checkout").set(data, { merge: true });
    return;
  } catch {}

  const { localDb } = await import("./local-db");
  const docs    = await localDb.collection("settings").getAll();
  const existing = docs.find((d: any) => d.id === "checkout");
  if (existing) {
    await localDb.collection("settings").update("checkout", data);
  } else {
    await localDb.collection("settings").add({ id: "checkout", ...data });
  }
}
