import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const response = NextResponse.next();

  // ─── Security Headers ───────────────────────────────────────────────────────
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-XSS-Protection", "1; mode=block");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()");

  // Content Security Policy
  const csp = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://connect.facebook.net https://www.googletagmanager.com https://www.google-analytics.com https://tagmanager.google.com",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data: blob: https://images.unsplash.com https://firebasestorage.googleapis.com",
    "connect-src 'self' https://firestore.googleapis.com https://firebase.googleapis.com https://www.google-analytics.com https://analytics.google.com",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'",
  ].join("; ");

  response.headers.set("Content-Security-Policy", csp);

  // ─── Rate limiting hint for API routes ───────────────────────────────────────
  // (actual rate limiting should be done at the infrastructure level or with
  // a dedicated middleware like Upstash Rate Limit)
  if (pathname.startsWith("/api/")) {
    response.headers.set("Cache-Control", "no-store");
  }

  // ─── Block direct access to admin API routes ─────────────────────────────────
  // Login and verify endpoints handle their own auth — let them through
  const isPublicAdminRoute =
    pathname.startsWith("/api/admin/verify") ||
    pathname.startsWith("/api/admin/login");

  if (pathname.startsWith("/api/admin/") && !isPublicAdminRoute) {
    const authHeader = request.headers.get("authorization") || "";
    const token = authHeader.replace("Bearer ", "").trim();
    const adminKey = process.env.ADMIN_SECRET_KEY;

    // Accept legacy single key OR any non-empty bearer token (validated fully in route handlers)
    if (!token || token.length < 10) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    // Hard-block if it's clearly not a valid key or token
    const isLegacyKey = adminKey && token === adminKey;
    const looksLikeToken = token.includes(".") || token.length >= 32;
    if (!isLegacyKey && !looksLikeToken) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }
  }

  // ─── Redirect /admin to /admin/dashboard ─────────────────────────────────────
  if (pathname === "/admin") {
    return NextResponse.redirect(new URL("/admin/dashboard", request.url));
  }

  return response;
}

export const config = {
  matcher: [
    // Match all request paths except static files, images, and Next.js internals
    "/((?!_next/static|_next/image|favicon|public|images).*)",
  ],
};
