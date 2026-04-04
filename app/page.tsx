import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/sections/HeroSection";
import FeaturedProducts from "@/components/sections/FeaturedProducts";
import CategoriesGrid from "@/components/sections/CategoriesGrid";
import TrustBanner from "@/components/sections/TrustBanner";
import TestimonialsAndFAQ from "@/components/sections/TestimonialsAndFAQ";
import { getProducts } from "@/lib/db";
import { Product } from "@/types";
import BestSellersSection from "@/components/sections/BestSellersSection";
import NewsletterCTA from "@/components/sections/NewsletterCTA";

// Demo products shown before Firebase is configured
const demoProducts: Product[] = [
  {
    id: "demo-1",
    name: "Dashboard Admin Pro — Template Next.js",
    slug: "dashboard-admin-pro",
    description: "Template admin moderne avec graphiques, tableaux et dark mode. Prêt à déployer.",
    price: 2500,
    originalPrice: 4500,
    category: "templates",
    tags: ["nextjs", "admin", "dashboard"],
    images: ["https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&auto=format"],
    featured: true,
    bestSeller: true,
    isNew: false,
    stock: -1,
    sold: 234,
    rating: 4.9,
    reviewCount: 87,
    fileType: "ZIP",
    fileSize: "12.4 MB",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "demo-2",
    name: "Pack Logiciels Productivité 2025",
    slug: "pack-logiciels-productivite",
    description: "Suite complète d'outils pour automatiser votre travail quotidien.",
    price: 3800,
    originalPrice: 7000,
    category: "software",
    tags: ["productivité", "automation", "outils"],
    images: ["https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600&auto=format"],
    featured: true,
    bestSeller: true,
    isNew: true,
    stock: -1,
    sold: 156,
    rating: 4.8,
    reviewCount: 62,
    fileType: "EXE",
    fileSize: "345 MB",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "demo-3",
    name: "Ebook Complet — Marketing Digital Algérie",
    slug: "ebook-marketing-digital-algerie",
    description: "Guide pratique 200 pages pour lancer votre business digital en Algérie.",
    price: 1200,
    originalPrice: 2000,
    category: "ebooks",
    tags: ["marketing", "algérie", "business"],
    images: ["https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=600&auto=format"],
    featured: true,
    bestSeller: false,
    isNew: true,
    stock: -1,
    sold: 421,
    rating: 4.7,
    reviewCount: 133,
    fileType: "PDF",
    fileSize: "8.2 MB",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "demo-4",
    name: "UI Kit Figma — Design System Premium",
    slug: "ui-kit-figma-premium",
    description: "500+ composants Figma pour accélérer vos projets de design.",
    price: 1800,
    category: "assets",
    tags: ["figma", "ui", "design"],
    images: ["https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600&auto=format"],
    featured: true,
    bestSeller: false,
    isNew: false,
    stock: -1,
    sold: 89,
    rating: 4.9,
    reviewCount: 44,
    fileType: "FIG",
    fileSize: "56 MB",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "demo-5",
    name: "Script Python — Automation Web Scraping",
    slug: "script-python-web-scraping",
    description: "Script avancé pour extraire des données web automatiquement.",
    price: 900,
    category: "scripts",
    tags: ["python", "scraping", "automation"],
    images: ["https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=600&auto=format"],
    featured: false,
    bestSeller: true,
    isNew: false,
    stock: -1,
    sold: 312,
    rating: 4.6,
    reviewCount: 98,
    fileType: "PY",
    fileSize: "2.1 MB",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "demo-6",
    name: "Cours Vidéo — React.js Avancé",
    slug: "cours-react-avance",
    description: "Formation complète 40 heures pour maîtriser React.js de zéro à expert.",
    price: 4500,
    originalPrice: 8000,
    category: "courses",
    tags: ["react", "javascript", "formation"],
    images: ["https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=600&auto=format"],
    featured: false,
    bestSeller: true,
    isNew: false,
    stock: -1,
    sold: 678,
    rating: 5.0,
    reviewCount: 201,
    fileType: "MP4",
    fileSize: "18.5 GB",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "demo-7",
    name: "Template Landing Page — SaaS Premium",
    slug: "template-landing-saas",
    description: "Template conversion optimisée pour vendre votre SaaS ou service.",
    price: 1500,
    category: "templates",
    tags: ["landing", "saas", "conversion"],
    images: ["https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=600&auto=format"],
    featured: false,
    bestSeller: false,
    isNew: true,
    stock: -1,
    sold: 45,
    rating: 4.8,
    reviewCount: 23,
    fileType: "ZIP",
    fileSize: "5.8 MB",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "demo-8",
    name: "Pack Assets 3D — Rendus Cinema 4D",
    slug: "pack-assets-3d-cinema4d",
    description: "100 rendus 3D haute qualité pour vos projets créatifs et publicitaires.",
    price: 2200,
    originalPrice: 3500,
    category: "assets",
    tags: ["3d", "cinema4d", "créatif"],
    images: ["https://images.unsplash.com/photo-1617791160505-6f00504e3519?w=600&auto=format"],
    featured: false,
    bestSeller: false,
    isNew: false,
    stock: -1,
    sold: 67,
    rating: 4.5,
    reviewCount: 29,
    fileType: "ZIP",
    fileSize: "2.3 GB",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

async function getHomeProducts(): Promise<Product[]> {
  try {
    const products = await getProducts({ featured: true, limit: 8 });
    return products.length > 0 ? products : demoProducts;
  } catch {
    return demoProducts;
  }
}

export default async function HomePage() {
  const products = await getHomeProducts();
  const featured = products.filter((p) => p.featured);
  const bestSellers = products.filter((p) => p.bestSeller);

  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <TrustBanner />
        <FeaturedProducts products={featured.length ? featured : products} />
        <CategoriesGrid />
        <BestSellersSection products={bestSellers.length ? bestSellers : products.slice(0, 4)} />
        <TestimonialsAndFAQ />
        <NewsletterCTA />
      </main>
      <Footer />
    </>
  );
}
