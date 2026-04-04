"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ProductCard from "@/components/ui/ProductCard";
import { Product, ProductCategory } from "@/types";
import { Search, SlidersHorizontal, X, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const CATEGORIES: { value: string; label: string }[] = [
  { value: "", label: "Tout" },
  { value: "software", label: "Logiciels" },
  { value: "templates", label: "Templates" },
  { value: "ebooks", label: "Ebooks" },
  { value: "courses", label: "Cours" },
  { value: "scripts", label: "Scripts" },
  { value: "assets", label: "Assets" },
];

const SORT_OPTIONS = [
  { value: "newest", label: "Plus récents" },
  { value: "price_asc", label: "Prix croissant" },
  { value: "price_desc", label: "Prix décroissant" },
  { value: "popular", label: "Populaires" },
];

// Import demo products from homepage
const demoProducts: Product[] = [
  {
    id: "demo-1", name: "Dashboard Admin Pro — Template Next.js", slug: "dashboard-admin-pro",
    description: "Template admin moderne avec graphiques, tableaux et dark mode.", price: 2500, originalPrice: 4500,
    category: "templates", tags: ["nextjs", "admin"], images: ["https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&auto=format"],
    featured: true, bestSeller: true, isNew: false, stock: -1, sold: 234, rating: 4.9, reviewCount: 87,
    fileType: "ZIP", fileSize: "12.4 MB", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
  },
  {
    id: "demo-2", name: "Pack Logiciels Productivité 2025", slug: "pack-logiciels-productivite",
    description: "Suite complète d'outils pour automatiser votre travail quotidien.", price: 3800, originalPrice: 7000,
    category: "software", tags: ["productivité", "automation"], images: ["https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600&auto=format"],
    featured: true, bestSeller: true, isNew: true, stock: -1, sold: 156, rating: 4.8, reviewCount: 62,
    fileType: "EXE", fileSize: "345 MB", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
  },
  {
    id: "demo-3", name: "Ebook Complet — Marketing Digital Algérie", slug: "ebook-marketing-digital-algerie",
    description: "Guide pratique 200 pages pour lancer votre business digital.", price: 1200, originalPrice: 2000,
    category: "ebooks", tags: ["marketing", "algérie"], images: ["https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=600&auto=format"],
    featured: true, bestSeller: false, isNew: true, stock: -1, sold: 421, rating: 4.7, reviewCount: 133,
    fileType: "PDF", fileSize: "8.2 MB", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
  },
  {
    id: "demo-4", name: "UI Kit Figma — Design System Premium", slug: "ui-kit-figma-premium",
    description: "500+ composants Figma pour accélérer vos projets.", price: 1800,
    category: "assets", tags: ["figma", "ui"], images: ["https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600&auto=format"],
    featured: true, bestSeller: false, isNew: false, stock: -1, sold: 89, rating: 4.9, reviewCount: 44,
    fileType: "FIG", fileSize: "56 MB", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
  },
  {
    id: "demo-5", name: "Script Python — Automation Web Scraping", slug: "script-python-web-scraping",
    description: "Script avancé pour extraire des données web automatiquement.", price: 900,
    category: "scripts", tags: ["python", "scraping"], images: ["https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=600&auto=format"],
    featured: false, bestSeller: true, isNew: false, stock: -1, sold: 312, rating: 4.6, reviewCount: 98,
    fileType: "PY", fileSize: "2.1 MB", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
  },
  {
    id: "demo-6", name: "Cours Vidéo — React.js Avancé", slug: "cours-react-avance",
    description: "Formation complète 40 heures pour maîtriser React.js.", price: 4500, originalPrice: 8000,
    category: "courses", tags: ["react", "javascript"], images: ["https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=600&auto=format"],
    featured: false, bestSeller: true, isNew: false, stock: -1, sold: 678, rating: 5.0, reviewCount: 201,
    fileType: "MP4", fileSize: "18.5 GB", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
  },
  {
    id: "demo-7", name: "Template Landing Page — SaaS Premium", slug: "template-landing-saas",
    description: "Template conversion optimisée pour vendre votre SaaS.", price: 1500,
    category: "templates", tags: ["landing", "saas"], images: ["https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=600&auto=format"],
    featured: false, bestSeller: false, isNew: true, stock: -1, sold: 45, rating: 4.8, reviewCount: 23,
    fileType: "ZIP", fileSize: "5.8 MB", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
  },
  {
    id: "demo-8", name: "Pack Assets 3D — Rendus Cinema 4D", slug: "pack-assets-3d-cinema4d",
    description: "100 rendus 3D haute qualité pour vos projets créatifs.", price: 2200, originalPrice: 3500,
    category: "assets", tags: ["3d", "cinema4d"], images: ["https://images.unsplash.com/photo-1617791160505-6f00504e3519?w=600&auto=format"],
    featured: false, bestSeller: false, isNew: false, stock: -1, sold: 67, rating: 4.5, reviewCount: 29,
    fileType: "ZIP", fileSize: "2.3 GB", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
  },
];

function ShopContent() {
  const searchParams = useSearchParams();
  const [products] = useState<Product[]>(demoProducts);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState(searchParams.get("category") || "");
  const [sort, setSort] = useState("newest");
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 10000]);

  const filtered = products
    .filter((p) => !category || p.category === category)
    .filter(
      (p) =>
        !search ||
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.description.toLowerCase().includes(search.toLowerCase()) ||
        p.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()))
    )
    .filter((p) => p.price >= priceRange[0] && p.price <= priceRange[1])
    .sort((a, b) => {
      if (sort === "price_asc") return a.price - b.price;
      if (sort === "price_desc") return b.price - a.price;
      if (sort === "popular") return b.sold - a.sold;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

  return (
    <div className="max-w-screen-xl mx-auto px-6 py-8">
      {/* Header */}
      <div className="mb-8">
        <span className="section-label mb-2 block">Marketplace</span>
        <h1 className="text-3xl md:text-4xl font-black font-headline">
          Explorer la Boutique
        </h1>
        <p className="text-on-surface-variant mt-2">
          {filtered.length} produit{filtered.length !== 1 ? "s" : ""} disponible
          {filtered.length !== 1 ? "s" : ""}
        </p>
      </div>

      {/* Search + Controls */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
          <input
            type="text"
            placeholder="Rechercher un produit..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field pl-11"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="flex gap-3">
          <div className="relative">
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="input-field pr-10 appearance-none cursor-pointer min-w-[160px]"
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value} className="bg-surface-container">
                  {o.label}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant pointer-events-none" />
          </div>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className={cn(
              "flex items-center gap-2 px-4 py-3 rounded-xl border text-sm font-medium transition-all",
              showFilters
                ? "border-primary/40 bg-primary/10 text-primary"
                : "border-white/5 bg-surface-container text-on-surface-variant hover:border-white/10"
            )}
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span className="hidden sm:inline">Filtres</span>
          </button>
        </div>
      </div>

      {/* Category pills */}
      <div className="flex gap-2 flex-wrap mb-6">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.value}
            onClick={() => setCategory(cat.value)}
            className={cn(
              "px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200",
              category === cat.value
                ? "hero-gradient text-on-primary shadow-neon-primary font-bold"
                : "bg-surface-container text-on-surface-variant hover:bg-surface-container-high hover:text-white border border-white/5"
            )}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Advanced filters panel */}
      {showFilters && (
        <div className="glass-card rounded-2xl p-6 mb-6 border border-white/5">
          <h3 className="font-bold font-headline mb-4 text-sm">Plage de prix (DZD)</h3>
          <div className="flex items-center gap-4">
            <input
              type="number"
              placeholder="Min"
              value={priceRange[0] || ""}
              onChange={(e) => setPriceRange([Number(e.target.value) || 0, priceRange[1]])}
              className="input-field flex-1"
            />
            <span className="text-on-surface-variant">—</span>
            <input
              type="number"
              placeholder="Max"
              value={priceRange[1] === 10000 ? "" : priceRange[1]}
              onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value) || 10000])}
              className="input-field flex-1"
            />
            <button
              onClick={() => setPriceRange([0, 10000])}
              className="text-xs text-on-surface-variant hover:text-primary transition-colors whitespace-nowrap"
            >
              Réinitialiser
            </button>
          </div>
        </div>
      )}

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-24">
          <p className="text-4xl mb-4">🔍</p>
          <h3 className="font-bold font-headline text-xl mb-2">Aucun résultat</h3>
          <p className="text-on-surface-variant">
            Essayez avec d&apos;autres mots-clés ou catégories.
          </p>
          <button
            onClick={() => { setSearch(""); setCategory(""); }}
            className="btn-secondary mt-6 text-sm"
          >
            Réinitialiser les filtres
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map((product, i) => (
            <div
              key={product.id}
              className="fade-up"
              style={{ animationDelay: `${(i % 8) * 0.05}s` }}
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function ShopPage() {
  return (
    <>
      <Navbar />
      <main className="pt-20 min-h-screen">
        <Suspense fallback={<div className="pt-32 text-center text-on-surface-variant">Chargement...</div>}>
          <ShopContent />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
