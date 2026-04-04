import { NextResponse } from "next/server";

export async function GET() {
  const checks: Record<string, "ok" | "error" | "unconfigured"> = {
    app: "ok",
    firebase: "unconfigured",
    email: "unconfigured",
  };

  // Check Firebase
  try {
    if (
      process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID &&
      process.env.FIREBASE_ADMIN_PRIVATE_KEY
    ) {
      const { getAdminDb } = await import("@/lib/firebase-admin");
      const db = getAdminDb();
      await db.collection("_health").limit(1).get();
      checks.firebase = "ok";
    }
  } catch {
    checks.firebase = "error";
  }

  // Check email config
  if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
    checks.email = "ok";
  }

  const allOk = Object.values(checks).every((v) => v === "ok" || v === "unconfigured");

  return NextResponse.json(
    {
      status: allOk ? "healthy" : "degraded",
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version || "0.1.0",
      checks,
    },
    {
      status: allOk ? 200 : 503,
      headers: {
        "Cache-Control": "no-store",
      },
    }
  );
}
