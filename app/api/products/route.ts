import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { slugify, isAdminAuthenticated } from "@/lib/utils";

// ── Demo products served when Firebase is not configured ──────────────────────
const DEMO_PRODUCTS = [
  { id:"demo-1", name:"Dashboard Admin Pro — Template Next.js", slug:"dashboard-admin-pro", description:"Template admin moderne avec graphiques interactifs et dark mode.", price:2500, originalPrice:4500, category:"templates", tags:["nextjs","admin"], images:["https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&auto=format"], featured:true, bestSeller:true, isNew:false, stock:-1, sold:234, rating:4.9, reviewCount:87, fileType:"ZIP", fileSize:"12.4 MB", createdAt:new Date().toISOString(), updatedAt:new Date().toISOString() },
  { id:"demo-2", name:"Pack Logiciels Productivité 2025", slug:"pack-logiciels-productivite", description:"Suite complète d'outils pour automatiser votre travail quotidien.", price:3800, originalPrice:7000, category:"software", tags:["productivité","automation"], images:["https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600&auto=format"], featured:true, bestSeller:true, isNew:true, stock:-1, sold:156, rating:4.8, reviewCount:62, fileType:"EXE", fileSize:"345 MB", createdAt:new Date().toISOString(), updatedAt:new Date().toISOString() },
  { id:"demo-3", name:"Ebook Marketing Digital Algérie", slug:"ebook-marketing-digital-algerie", description:"Guide pratique 200 pages pour lancer votre business digital.", price:1200, originalPrice:2000, category:"ebooks", tags:["marketing","algérie"], images:["https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=600&auto=format"], featured:true, bestSeller:false, isNew:true, stock:-1, sold:421, rating:4.7, reviewCount:133, fileType:"PDF", fileSize:"8.2 MB", createdAt:new Date().toISOString(), updatedAt:new Date().toISOString() },
  { id:"demo-4", name:"UI Kit Figma — Design System Premium", slug:"ui-kit-figma-premium", description:"500+ composants Figma avec auto-layout et dark mode.", price:1800, category:"assets", tags:["figma","ui"], images:["https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600&auto=format"], featured:true, bestSeller:false, isNew:false, stock:-1, sold:89, rating:4.9, reviewCount:44, fileType:"FIG", fileSize:"56 MB", createdAt:new Date().toISOString(), updatedAt:new Date().toISOString() },
  { id:"demo-5", name:"Script Python — Automation Web Scraping", slug:"script-python-web-scraping", description:"Script avancé pour extraire des données web automatiquement.", price:900, category:"scripts", tags:["python","scraping"], images:["https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=600&auto=format"], featured:false, bestSeller:true, isNew:false, stock:-1, sold:312, rating:4.6, reviewCount:98, fileType:"ZIP", fileSize:"2.1 MB", createdAt:new Date().toISOString(), updatedAt:new Date().toISOString() },
  { id:"demo-6", name:"Cours Vidéo Complet — React.js Avancé", slug:"cours-react-avance", description:"Formation 40 heures pour maîtriser React.js de zéro à expert.", price:4500, originalPrice:8000, category:"courses", tags:["react","javascript"], images:["https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=600&auto=format"], featured:false, bestSeller:true, isNew:false, stock:-1, sold:678, rating:5.0, reviewCount:201, fileType:"MP4", fileSize:"18.5 GB", createdAt:new Date().toISOString(), updatedAt:new Date().toISOString() },
  { id:"demo-7", name:"Template Landing Page — SaaS Premium", slug:"template-landing-saas", description:"Template conversion optimisée pour vendre votre SaaS.", price:1500, category:"templates", tags:["landing","saas"], images:["https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=600&auto=format"], featured:false, bestSeller:false, isNew:true, stock:-1, sold:45, rating:4.8, reviewCount:23, fileType:"ZIP", fileSize:"5.8 MB", createdAt:new Date().toISOString(), updatedAt:new Date().toISOString() },
  { id:"demo-8", name:"Pack Assets 3D — Rendus Cinema 4D", slug:"pack-assets-3d-cinema4d", description:"100 rendus 3D haute qualité pour vos projets créatifs.", price:2200, originalPrice:3500, category:"assets", tags:["3d","cinema4d"], images:["https://images.unsplash.com/photo-1617791160505-6f00504e3519?w=600&auto=format"], featured:false, bestSeller:false, isNew:false, stock:-1, sold:67, rating:4.5, reviewCount:29, fileType:"ZIP", fileSize:"2.3 GB", createdAt:new Date().toISOString(), updatedAt:new Date().toISOString() },
];

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");
  const featured = searchParams.get("featured") === "true";
  const bestSeller = searchParams.get("bestSeller") === "true";
  const limitN = parseInt(searchParams.get("limit") ?? "100");

  // Try Firebase first
  try {
    const { getAdminDb } = await import("@/lib/firebase-admin");
    const db = getAdminDb();

    let q: any = db.collection("products").orderBy("createdAt", "desc");
    if (category)    q = q.where("category",   "==", category);
    if (featured)    q = q.where("featured",   "==", true);
    if (bestSeller)  q = q.where("bestSeller", "==", true);
    q = q.limit(limitN);

    const snap = await q.get();
    const products = snap.docs.map((d: any) => ({ id: d.id, ...d.data() }));

    // If Firestore is empty, return demo data
    if (products.length === 0) {
      return NextResponse.json({ products: filterDemo(DEMO_PRODUCTS, { category, featured, bestSeller, limit: limitN }) });
    }

    return NextResponse.json({ products });
  } catch {
    // Firebase not configured — return demo products
    return NextResponse.json({
      products: filterDemo(DEMO_PRODUCTS, { category, featured, bestSeller, limit: limitN }),
    });
  }
}

function filterDemo(products: any[], filters: { category?: string | null; featured?: boolean; bestSeller?: boolean; limit?: number }) {
  let result = products;
  if (filters.category) result = result.filter((p) => p.category === filters.category);
  if (filters.featured) result = result.filter((p) => p.featured);
  if (filters.bestSeller) result = result.filter((p) => p.bestSeller);
  if (filters.limit) result = result.slice(0, filters.limit);
  return result;
}

const productSchema = z.object({
  name: z.string().min(2).max(200),
  description: z.string().min(10).max(5000),
  longDescription: z.string().max(10000).optional(),
  price: z.number().positive(),
  originalPrice: z.number().positive().optional(),
  category: z.enum(["software","templates","ebooks","courses","scripts","assets","other"]),
  tags: z.array(z.string()).max(10),
  images: z.array(z.string()).min(1).max(10),
  fileUrl: z.string().optional(),
  fileSize: z.string().optional(),
  fileType: z.string().optional(),
  featured: z.boolean().default(false),
  bestSeller: z.boolean().default(false),
  isNew: z.boolean().default(true),
  stock: z.number().default(-1),
  seoTitle: z.string().max(60).optional(),
  seoDescription: z.string().max(160).optional(),
});

export async function POST(request: NextRequest) {
  if (!isAdminAuthenticated(request)) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }
  try {
    const body = await request.json();
    const parsed = productSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Données invalides", details: parsed.error.issues }, { status: 400 });
    }
    const data = parsed.data;
    const slug = slugify(data.name);

    const { getAdminDb } = await import("@/lib/firebase-admin");
    const db = getAdminDb();
    const ref = await db.collection("products").add({
      ...data, slug, sold: 0, rating: 0, reviewCount: 0,
      createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
    });
    return NextResponse.json({ id: ref.id, slug }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
