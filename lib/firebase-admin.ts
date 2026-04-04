import { App, getApps } from "firebase-admin/app";

const isAdminConfigured =
  process.env.FIREBASE_ADMIN_PROJECT_ID &&
  process.env.FIREBASE_ADMIN_PROJECT_ID !== "your_project_id" &&
  process.env.FIREBASE_ADMIN_CLIENT_EMAIL &&
  process.env.FIREBASE_ADMIN_PRIVATE_KEY &&
  process.env.FIREBASE_ADMIN_PRIVATE_KEY !== '"-----BEGIN PRIVATE KEY-----\\nYOUR_KEY\\n-----END PRIVATE KEY-----\\n"';

function getAdminApp(): App | null {
  if (!isAdminConfigured) return null;

  try {
    if (getApps().length > 0) return getApps()[0];

    const { initializeApp, cert } = require("firebase-admin/app");
    const privateKey = (process.env.FIREBASE_ADMIN_PRIVATE_KEY ?? "").replace(/\\n/g, "\n");

    return initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
        clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
        privateKey,
      }),
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    });
  } catch (e) {
    console.warn("[Evo Digital] Firebase Admin init failed:", e);
    return null;
  }
}

export function getAdminDb() {
  const app = getAdminApp();
  if (!app) throw new Error("FIREBASE_NOT_CONFIGURED");
  const { getFirestore } = require("firebase-admin/firestore");
  return getFirestore(app);
}

export function getAdminStorage() {
  const app = getAdminApp();
  if (!app) throw new Error("FIREBASE_NOT_CONFIGURED");
  const { getStorage } = require("firebase-admin/storage");
  return getStorage(app);
}

export { isAdminConfigured };
