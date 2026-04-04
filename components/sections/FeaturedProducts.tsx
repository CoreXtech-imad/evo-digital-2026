"use client";

import { Product } from "@/types";
import ProductCard from "@/components/ui/ProductCard";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

interface FeaturedProductsProps {
  products: Product[];
}

export default function FeaturedProducts({ products }: FeaturedProductsProps) {
  if (!products.length) return null;

  return (
    <section id="featured" className="px-6 py-24 max-w-screen-xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="section-label">Sélection Premium</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-black font-headline">
            Produits en Vedette
          </h2>
          <p className="text-on-surface-variant mt-2 max-w-md">
            Les outils numériques les plus populaires auprès de nos clients algériens.
          </p>
        </div>
        <Link
          href="/shop"
          className="flex items-center gap-2 text-secondary font-semibold hover:text-primary transition-colors group flex-shrink-0"
        >
          <span>Voir tout</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.slice(0, 8).map((product, i) => (
          <div
            key={product.id}
            className="fade-up"
            style={{ animationDelay: `${i * 0.08}s` }}
          >
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </section>
  );
}
