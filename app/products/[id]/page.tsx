import { Metadata } from "next";
import { notFound } from "next/navigation";
import ProductDetailClient from "./ProductDetailClient";
import { Product } from "@/types";

const demoProducts: Record<string, Product> = {
  "dashboard-admin-pro": {
    id: "demo-1", name: "Dashboard Admin Pro — Template Next.js", slug: "dashboard-admin-pro",
    description: "Template admin moderne avec graphiques interactifs, tableaux et dark mode. Compatible Next.js 15 et TailwindCSS.",
    longDescription: "**Fonctionnalités incluses:**\n\n- Dashboard avec graphiques recharts\n- Tables avec tri, pagination et recherche\n- Authentification complète\n- Dark mode intégré\n- 15+ pages pré-construites\n- TypeScript complet\n- Responsive mobile/desktop",
    price: 2500, originalPrice: 4500, category: "templates", tags: ["nextjs","admin","dashboard"],
    images: ["https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=900&auto=format","https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=900&auto=format"],
    featured: true, bestSeller: true, isNew: false, stock: -1, sold: 234, rating: 4.9, reviewCount: 87,
    fileType: "ZIP", fileSize: "12.4 MB", seoTitle: "Dashboard Admin Pro Next.js 15 | Evo Digital",
    seoDescription: "Template admin Next.js 15 graphiques dark mode TypeScript. 2500 DZD livraison instantanée.",
    createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
  },
  "pack-logiciels-productivite": {
    id: "demo-2", name: "Pack Logiciels Productivité 2025", slug: "pack-logiciels-productivite",
    description: "Suite complète d'outils pour automatiser votre travail quotidien et booster votre productivité.",
    longDescription: "**Ce pack inclut:**\n\n- Gestionnaire de tâches avancé\n- Compression d'images par lots\n- Convertisseur de fichiers universel\n- Générateur de rapports auto\n- Licence permanente",
    price: 3800, originalPrice: 7000, category: "software", tags: ["productivité","automation"],
    images: ["https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=900&auto=format"],
    featured: true, bestSeller: true, isNew: true, stock: -1, sold: 156, rating: 4.8, reviewCount: 62,
    fileType: "EXE", fileSize: "345 MB", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
  },
  "ebook-marketing-digital-algerie": {
    id: "demo-3", name: "Ebook Complet — Marketing Digital Algérie", slug: "ebook-marketing-digital-algerie",
    description: "Guide pratique 200 pages pour lancer votre business digital en Algérie.",
    longDescription: "**Ce guide couvre:**\n\n- SEO algérien\n- Facebook & Instagram Ads\n- Vente en ligne sans capital\n- Cas pratiques algériens\n- Stratégies DZD",
    price: 1200, originalPrice: 2000, category: "ebooks", tags: ["marketing","algérie"],
    images: ["https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=900&auto=format"],
    featured: true, bestSeller: false, isNew: true, stock: -1, sold: 421, rating: 4.7, reviewCount: 133,
    fileType: "PDF", fileSize: "8.2 MB", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
  },
  "cours-react-avance": {
    id: "demo-6", name: "Cours Vidéo Complet — React.js Avancé", slug: "cours-react-avance",
    description: "Formation complète 40 heures pour maîtriser React.js de zéro à expert.",
    longDescription: "**Programme 40h:**\n\n- Fondamentaux React (6h)\n- Hooks avancés (8h)\n- Gestion état Zustand/Redux (6h)\n- Next.js 15 App Router (8h)\n- Tests Jest/RTL (4h)\n- 3 projets réels (8h)\n- Certificat inclus",
    price: 4500, originalPrice: 8000, category: "courses", tags: ["react","javascript","nextjs"],
    images: ["https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=900&auto=format"],
    featured: false, bestSeller: true, isNew: false, stock: -1, sold: 678, rating: 5.0, reviewCount: 201,
    fileType: "MP4", fileSize: "18.5 GB", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
  },
  "script-python-web-scraping": {
    id: "demo-5", name: "Script Python — Automation Web Scraping", slug: "script-python-web-scraping",
    description: "Script Python avancé pour extraire des données web automatiquement.",
    longDescription: "**Fonctionnalités:**\n\n- Playwright (rendu JS)\n- Rotation proxies\n- Export CSV/JSON/Excel\n- Scheduler intégré\n- Python 3.10+\n- 30 exemples inclus",
    price: 900, category: "scripts", tags: ["python","scraping","automation"],
    images: ["https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=900&auto=format"],
    featured: false, bestSeller: true, isNew: false, stock: -1, sold: 312, rating: 4.6, reviewCount: 98,
    fileType: "ZIP", fileSize: "2.1 MB", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
  },
  "ui-kit-figma-premium": {
    id: "demo-4", name: "UI Kit Figma — Design System Premium", slug: "ui-kit-figma-premium",
    description: "500+ composants Figma avec auto-layout, variables couleur et dark mode.",
    price: 1800, category: "assets", tags: ["figma","ui","design"],
    images: ["https://images.unsplash.com/photo-1561070791-2526d30994b5?w=900&auto=format"],
    featured: true, bestSeller: false, isNew: false, stock: -1, sold: 89, rating: 4.9, reviewCount: 44,
    fileType: "FIG", fileSize: "56 MB", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
  },
  "template-landing-saas": {
    id: "demo-7", name: "Template Landing Page — SaaS Premium", slug: "template-landing-saas",
    description: "Template conversion optimisée pour vendre votre SaaS ou service en ligne.",
    price: 1500, category: "templates", tags: ["landing","saas","html"],
    images: ["https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=900&auto=format"],
    featured: false, bestSeller: false, isNew: true, stock: -1, sold: 45, rating: 4.8, reviewCount: 23,
    fileType: "ZIP", fileSize: "5.8 MB", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
  },
  "pack-assets-3d-cinema4d": {
    id: "demo-8", name: "Pack Assets 3D — Rendus Cinema 4D", slug: "pack-assets-3d-cinema4d",
    description: "100 rendus 3D haute qualité avec fonds transparents pour publicités.",
    price: 2200, originalPrice: 3500, category: "assets", tags: ["3d","cinema4d","png"],
    images: ["https://images.unsplash.com/photo-1617791160505-6f00504e3519?w=900&auto=format"],
    featured: false, bestSeller: false, isNew: false, stock: -1, sold: 67, rating: 4.5, reviewCount: 29,
    fileType: "ZIP", fileSize: "2.3 GB", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
  },
};

async function getProduct(slug: string): Promise<Product | null> {
  try {
    const { getAdminDb } = await import("@/lib/firebase-admin");
    const db = getAdminDb();
    const snap = await db.collection("products").where("slug", "==", slug).limit(1).get();
    if (!snap.empty) return { id: snap.docs[0].id, ...snap.docs[0].data() } as Product;
  } catch {}
  return demoProducts[slug] ?? null;
}

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const product = await getProduct(params.id);
  if (!product) return { title: "Produit introuvable | Evo Digital" };
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://evo-digital.vercel.app";
  return {
    title: product.seoTitle ?? `${product.name} | Evo Digital`,
    description: product.seoDescription ?? product.description.slice(0, 155),
    openGraph: {
      title: product.name, description: product.description,
      images: product.images[0] ? [{ url: product.images[0] }] : [],
      url: `${appUrl}/products/${product.slug}`, type: "website",
    },
  };
}

export async function generateStaticParams() {
  try {
    const { getAdminDb } = await import("@/lib/firebase-admin");
    const db = getAdminDb();
    const snap = await db.collection("products").get();
    return snap.docs.map((d) => ({ id: (d.data() as Product).slug }));
  } catch {
    return Object.keys(demoProducts).map((slug) => ({ id: slug }));
  }
}

export const revalidate = 3600;

export default async function ProductPage({ params }: { params: { id: string } }) {
  const product = await getProduct(params.id);
  if (!product) notFound();
  let related: Product[] = [];
  try {
    const { getAdminDb } = await import("@/lib/firebase-admin");
    const db = getAdminDb();
    const snap = await db.collection("products").where("category", "==", product.category).limit(4).get();
    related = snap.docs.filter((d) => d.id !== product.id).slice(0, 3).map((d) => ({ id: d.id, ...d.data() } as Product));
  } catch {
    related = Object.values(demoProducts).filter((p) => p.category === product.category && p.id !== product.id).slice(0, 3);
  }
  return <ProductDetailClient product={product} related={related} />;
}
