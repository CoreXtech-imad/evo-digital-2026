"use client";

import { Product } from "@/types";
import { formatDZD, getDiscountPercentage, cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/hooks/useCart";
import { ShoppingCart, Star, Download, Flame, Zap } from "lucide-react";
import toast from "react-hot-toast";

interface ProductCardProps {
  product: Product;
  className?: string;
}

export default function ProductCard({ product, className }: ProductCardProps) {
  const { addItem } = useCart();
  const discount = getDiscountPercentage(
    product.originalPrice || 0,
    product.price
  );

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem(product);
    toast.success(`${product.name} ajouté au panier!`, {
      icon: "🛍️",
    });
  };

  return (
    <Link href={`/products/${product.slug}`} className={cn("block", className)}>
      <div className="product-card h-full flex flex-col group">
        {/* Image */}
        <div className="relative overflow-hidden rounded-t-3xl aspect-[4/3] bg-surface-container-high">
          <Image
            src={product.images[0] || "/images/placeholder.svg"}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex gap-2 flex-wrap">
            {product.bestSeller && (
              <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-yellow-500/80 to-orange-500/80 text-white backdrop-blur-sm">
                <Flame className="w-3 h-3" /> Best Seller
              </span>
            )}
            {product.isNew && (
              <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-primary/20 text-primary backdrop-blur-sm border border-primary/20">
                <Zap className="w-3 h-3" /> Nouveau
              </span>
            )}
            {discount > 0 && (
              <span className="lume-badge">-{discount}%</span>
            )}
          </div>

          {/* Quick Add */}
          <button
            onClick={handleAddToCart}
            className="absolute bottom-3 right-3 p-2.5 rounded-xl glass-panel border border-white/10 text-white opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-primary/20 hover:border-primary/30 hover:text-primary transform translate-y-2 group-hover:translate-y-0"
            aria-label="Ajouter au panier"
          >
            <ShoppingCart className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 flex flex-col flex-1">
          {/* Category */}
          <span className="section-label text-xs mb-2 block">
            {product.category}
          </span>

          {/* Name */}
          <h3 className="font-bold font-headline text-base leading-snug mb-2 line-clamp-2 group-hover:text-primary transition-colors">
            {product.name}
          </h3>

          {/* Rating */}
          {product.rating > 0 && (
            <div className="flex items-center gap-1.5 mb-3">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={cn(
                      "w-3.5 h-3.5",
                      star <= Math.round(product.rating)
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-on-surface-variant/30"
                    )}
                  />
                ))}
              </div>
              <span className="text-xs text-on-surface-variant">
                ({product.reviewCount})
              </span>
            </div>
          )}

          {/* Spacer */}
          <div className="flex-1" />

          {/* Price & Action */}
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/5">
            <div>
              <div className="font-bold text-lg font-headline gradient-text">
                {formatDZD(product.price)}
              </div>
              {product.originalPrice && product.originalPrice > product.price && (
                <div className="text-xs text-on-surface-variant line-through">
                  {formatDZD(product.originalPrice)}
                </div>
              )}
            </div>

            <button
              onClick={handleAddToCart}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-semibold hover:bg-primary/20 transition-all duration-200 hover:shadow-neon-primary border border-primary/20 hover:border-primary/40"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Acheter</span>
            </button>
          </div>

          {/* File info */}
          {product.fileType && (
            <p className="text-xs text-on-surface-variant mt-2 flex items-center gap-1">
              <span className="px-1.5 py-0.5 rounded bg-surface-container-high text-xs font-mono">
                {product.fileType}
              </span>
              {product.fileSize && <span>{product.fileSize}</span>}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}
