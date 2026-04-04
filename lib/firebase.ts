/**
 * Firebase Client SDK — only initializes when real credentials are provided.
 * In demo mode (placeholder .env values), this module exports null values
 * and the app runs entirely on demo data via the API routes.
 */
import { initializeApp, getApps, FirebaseApp } from "firebase/app";
import { getFirestore, Firestore } from "firebase/firestore";
import { getStorage, FirebaseStorage } from "firebase/storage";
import { getAuth, Auth } from "firebase/auth";

// Detect real vs placeholder credentials
export const firebaseConfigured =
  !!process.env.NEXT_PUBLIC_FIREBASE_API_KEY &&
  process.env.NEXT_PUBLIC_FIREBASE_API_KEY !== "your_firebase_api_key" &&
  process.env.NEXT_PUBLIC_FIREBASE_API_KEY.startsWith("AIza") &&
  !!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID &&
  process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID !== "your_project_id";

let app: FirebaseApp | null = null;
let db: Firestore | null = null;
let storage: FirebaseStorage | null = null;
let auth: Auth | null = null;

if (firebaseConfigured) {
  try {
    app = getApps().length
      ? getApps()[0]
      : initializeApp({
          apiKey:            process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
          authDomain:        process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
          projectId:         process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
          storageBucket:     process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET!,
          messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID!,
          appId:             process.env.NEXT_PUBLIC_FIREBASE_APP_ID!,
          measurementId:     process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
        });

    db      = getFirestore(app);
    storage = getStorage(app);
    auth    = getAuth(app);

    // Analytics — browser only, lazy, non-blocking
    if (typeof window !== "undefined" && process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID) {
      import("firebase/analytics")
        .then(({ getAnalytics, isSupported }) =>
          isSupported().then((ok) => { if (ok && app) getAnalytics(app!); })
        )
        .catch(() => {});
    }
  } catch (e) {
    if (process.env.NODE_ENV === "development") {
      console.warn("[Evo Digital] Firebase client init failed:", e);
    }
  }
} else if (process.env.NODE_ENV === "development") {
  console.info(
    "[Evo Digital] Firebase not configured — running in demo mode.\n" +
    "Edit .env.local with your real Firebase credentials to connect to the database."
  );
}

export { app, db, storage, auth };
