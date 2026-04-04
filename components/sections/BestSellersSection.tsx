import { Product } from "@/types";
import ProductCard from "@/components/ui/ProductCard";
import { Flame } from "lucide-react";

interface BestSellersSectionProps {
  products: Product[];
}

export default function BestSellersSection({ products }: BestSellersSectionProps) {
  if (!products.length) return null;

  return (
    <section className="px-6 py-24 relative overflow-hidden">
      {/* Background accent */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          background:
            "radial-gradient(ellipse at 50% 50%, rgba(170,139,255,0.08) 0%, transparent 70%)",
        }}
      />

      <div className="max-w-screen-xl mx-auto relative z-10">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Flame className="w-5 h-5 text-orange-400" />
            <span className="section-label">Tendances</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-black font-headline">
            Meilleures Ventes
          </h2>
          <p className="text-on-surface-variant mt-2 max-w-lg mx-auto">
            Les produits plébiscités par notre communauté algérienne.
          </p>
        </div>

        {/* Urgency bar */}
        <div className="mb-8 p-4 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center gap-3">
          <div className="w-2 h-2 rounded-full bg-orange-400 animate-pulse" />
          <p className="text-sm text-orange-300 font-semibold">
            🔥 Offres limitées — Stock digital disponible maintenant
          </p>
          <div className="w-2 h-2 rounded-full bg-orange-400 animate-pulse" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.slice(0, 4).map((product, i) => (
            <div
              key={product.id}
              className="fade-up"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
