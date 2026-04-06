import { NextRequest, NextResponse } from "next/server";

export async function GET(_request: NextRequest) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://evo-digital.vercel.app";

  // Static pages
  const staticPages: { url: string; priority: string; changefreq: string; lastmod?: string }[] = [
    { url: "/", priority: "1.0", changefreq: "daily" },
    { url: "/shop", priority: "0.9", changefreq: "daily" },
    { url: "/checkout", priority: "0.7", changefreq: "monthly" },
  ];

  // Try to fetch products from DB
  let productPages: typeof staticPages = [];
  try {
    const { getAdminDb } = await import("@/lib/firebase-admin");
    const db = getAdminDb();
    const snap = await db.collection("products").get();
    productPages = snap.docs.map((d: any) => {
      const data = d.data();
      return {
        url: `/products/${data.slug}`,
        priority: "0.8",
        changefreq: "weekly",
        lastmod: data.updatedAt?.split("T")[0],
      };
    });
  } catch {
    // Firebase not configured yet — skip product pages
  }

  const allPages = [...staticPages, ...productPages];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allPages
  .map(
    (page) => `  <url>
    <loc>${baseUrl}${page.url}</loc>
    ${page.lastmod ? `<lastmod>${page.lastmod}</lastmod>` : ""}
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`
  )
  .join("\n")}
</urlset>`;

  return new NextResponse(sitemap, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
