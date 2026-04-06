import type { StoreSettings } from "./store-types";
import { DEFAULT_STORE } from "./store-types";

export type { StoreSettings } from "./store-types";
export { DEFAULT_STORE } from "./store-types";

// In-memory cache — avoids hitting Firebase on every server render
let _cache: StoreSettings | null = null;
let _cacheTime = 0;
const CACHE_TTL = 60_000; // 1 minute

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) => setTimeout(() => reject(new Error("timeout")), ms)),
  ]);
}

export async function getStoreSettings(): Promise<StoreSettings> {
  // Return cached value if still fresh
  if (_cache && Date.now() - _cacheTime < CACHE_TTL) return _cache;

  // Try Firebase with a 2-second timeout
  try {
    const { getAdminDb } = await import("./firebase-admin");
    const db   = getAdminDb();
    const snap = await withTimeout<any>(db.collection("settings").doc("store").get(), 2000);
    if (snap.exists) {
      _cache = { ...DEFAULT_STORE, ...(snap.data() as StoreSettings) };
      _cacheTime = Date.now();
      return _cache;
    }
  } catch {}

  // Try local file DB
  try {
    const { localDb } = await import("./local-db");
    const docs = await localDb.collection("settings").getAll();
    const doc  = docs.find((d: any) => d.id === "store");
    if (doc) {
      const result = { ...DEFAULT_STORE, ...doc };
      _cache = result;
      _cacheTime = Date.now();
      return result;
    }
  } catch {}

  return { ...DEFAULT_STORE };
}

export async function saveStoreSettings(data: Partial<StoreSettings>): Promise<void> {
  // Invalidate cache so next render picks up the new values
  _cache = null;
  _cacheTime = 0;

  try {
    const { getAdminDb } = await import("./firebase-admin");
    const db = getAdminDb();
    await db.collection("settings").doc("store").set(data, { merge: true });
    return;
  } catch {}

  const { localDb } = await import("./local-db");
  const docs    = await localDb.collection("settings").getAll();
  const existing = docs.find((d: any) => d.id === "store");
  if (existing) {
    await localDb.collection("settings").update("store", data);
  } else {
    await localDb.collection("settings").add({ id: "store", ...data });
  }
}
