"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ProductCard from "@/components/ui/ProductCard";
import { useCart } from "@/hooks/useCart";
import { formatDZD, getDiscountPercentage } from "@/lib/utils";
import { Product } from "@/types";
import toast from "react-hot-toast";
import {
  ShoppingCart, Download, Star, Shield, Zap, Package,
  FileText, ChevronRight, Flame, CheckCircle, Users,
  Heart, Share2, Copy,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  product: Product;
  related: Product[];
}

export default function ProductDetailClient({ product, related }: Props) {
  const { addItem } = useCart();
  const [activeImage, setActiveImage] = useState(0);
  const [wishlisted, setWishlisted] = useState(false);

  const discount = getDiscountPercentage(product.originalPrice ?? 0, product.price);

  const handleAddToCart = () => {
    addItem(product);
    toast.success(`${product.name} ajouté au panier!`, { icon: "🛍️" });
  };

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      await navigator.share({ title: product.name, url });
    } else {
      navigator.clipboard.writeText(url);
      toast.success("Lien copié!");
    }
  };

  // Parse markdown-style long description
  const renderDescription = (text: string) => {
    return text.split("\n").map((line, i) => {
      if (line.startsWith("**") && line.endsWith("**")) {
        return <p key={i} className="font-bold text-white mt-4 mb-2">{line.slice(2, -2)}</p>;
      }
      if (line.startsWith("- ")) {
        return (
          <div key={i} className="flex items-start gap-2 py-1">
            <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
            <span className="text-on-surface-variant text-sm">{line.slice(2)}</span>
          </div>
        );
      }
      if (line.trim()) {
        return <p key={i} className="text-on-surface-variant text-sm leading-relaxed">{line}</p>;
      }
      return null;
    });
  };

  return (
    <>
      <Navbar />
      <main className="pt-24 min-h-screen">
        {/* Background orbs */}
        <div className="evo-orb" style={{ width: 400, height: 400, top: "10%", right: "5%", background: "radial-gradient(circle, rgba(170,139,255,0.06) 0%, transparent 70%)" }} />

        <div className="max-w-screen-xl mx-auto px-6 py-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-1.5 text-sm text-on-surface-variant mb-8 flex-wrap">
            <Link href="/" className="hover:text-primary transition-colors">Accueil</Link>
            <ChevronRight className="w-3.5 h-3.5 flex-shrink-0" />
            <Link href="/shop" className="hover:text-primary transition-colors">Boutique</Link>
            <ChevronRight className="w-3.5 h-3.5 flex-shrink-0" />
            <Link href={`/shop?category=${product.category}`} className="hover:text-primary transition-colors capitalize">
              {product.category}
            </Link>
            <ChevronRight className="w-3.5 h-3.5 flex-shrink-0" />
            <span className="text-on-surface truncate max-w-[200px]">{product.name}</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
            {/* ── Image Gallery ───────────────────────────── */}
            <div className="space-y-4">
              <div className="relative aspect-[4/3] rounded-3xl overflow-hidden glass-card border border-white/5 group">
                <Image
                  src={product.images[activeImage] ?? "/images/placeholder.svg"}
                  alt={product.name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                {/* Overlay badges */}
                <div className="absolute top-4 left-4 flex gap-2 flex-wrap">
                  {product.bestSeller && (
                    <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-gradient-to-r from-yellow-500/80 to-orange-500/80 text-white backdrop-blur-sm">
                      <Flame className="w-3 h-3" /> Best Seller
                    </span>
                  )}
                  {product.isNew && (
                    <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-primary/20 text-primary backdrop-blur-sm border border-primary/20">
                      <Zap className="w-3 h-3" /> Nouveau
                    </span>
                  )}
                </div>
                {discount > 0 && (
                  <div className="absolute top-4 right-4 lume-badge text-sm">-{discount}%</div>
                )}
              </div>

              {/* Thumbnails */}
              {product.images.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-1">
                  {product.images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveImage(i)}
                      className={cn(
                        "relative w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 border-2 transition-all",
                        activeImage === i
                          ? "border-primary shadow-neon-primary"
                          : "border-white/10 hover:border-white/30 opacity-60 hover:opacity-100"
                      )}
                    >
                      <Image src={img} alt="" fill className="object-cover" />
                    </button>
                  ))}
                </div>
              )}

              {/* Social proof numbers */}
              <div className="flex gap-4 p-4 rounded-2xl bg-surface-container border border-white/5">
                <div className="flex items-center gap-2 text-sm">
                  <Users className="w-4 h-4 text-primary" />
                  <span className="font-bold">{product.sold}</span>
                  <span className="text-on-surface-variant">clients</span>
                </div>
                <div className="w-px bg-white/10" />
                <div className="flex items-center gap-1.5 text-sm">
                  {[1,2,3,4,5].map((s) => (
                    <Star key={s} className={cn("w-3.5 h-3.5", s <= Math.round(product.rating) ? "text-yellow-400 fill-yellow-400" : "text-white/20")} />
                  ))}
                  <span className="font-bold ml-1">{product.rating}</span>
                  <span className="text-on-surface-variant">({product.reviewCount} avis)</span>
                </div>
              </div>
            </div>

            {/* ── Product Details ──────────────────────────── */}
            <div className="space-y-6">
              <div>
                <span className="section-label mb-2 block capitalize">{product.category}</span>
                <h1 className="text-2xl md:text-3xl font-black font-headline leading-tight mb-4">
                  {product.name}
                </h1>
                <p className="text-on-surface-variant leading-relaxed">{product.description}</p>
              </div>

              {/* Price block */}
              <div className="flex items-end gap-4 p-5 rounded-2xl bg-surface-container border border-white/5">
                <div>
                  <div className="text-4xl font-black font-headline gradient-text">
                    {formatDZD(product.price)}
                  </div>
                  {product.originalPrice && product.originalPrice > product.price && (
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-lg text-on-surface-variant line-through">
                        {formatDZD(product.originalPrice)}
                      </span>
                      <span className="px-2 py-0.5 bg-error/20 text-error text-xs font-bold rounded-full">
                        -{discount}% · Économisez {formatDZD(product.originalPrice - product.price)}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* File info pills */}
              {(product.fileType || product.fileSize) && (
                <div className="flex gap-2 flex-wrap">
                  {product.fileType && (
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-surface-container text-sm border border-white/5">
                      <FileText className="w-4 h-4 text-primary" />
                      <span className="font-mono font-bold">{product.fileType}</span>
                    </div>
                  )}
                  {product.fileSize && (
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-surface-container text-sm border border-white/5">
                      <Package className="w-4 h-4 text-primary" />
                      <span>{product.fileSize}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-primary/10 text-primary text-sm border border-primary/20">
                    <Zap className="w-4 h-4" />
                    <span className="font-medium">Livraison instantanée</span>
                  </div>
                </div>
              )}

              {/* CTA buttons */}
              <div className="flex gap-3 flex-wrap">
                <button
                  onClick={handleAddToCart}
                  className="btn-primary flex-1 flex items-center justify-center gap-2 py-4 text-base min-w-[160px]"
                >
                  <ShoppingCart className="w-5 h-5" />
                  Ajouter au Panier
                </button>
                <Link
                  href="/checkout"
                  onClick={handleAddToCart}
                  className="btn-secondary flex items-center justify-center gap-2 px-6 py-4"
                >
                  <Download className="w-5 h-5" />
                  Acheter maintenant
                </Link>
              </div>

              {/* Action row */}
              <div className="flex gap-3">
                <button
                  onClick={() => setWishlisted(!wishlisted)}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border transition-all",
                    wishlisted
                      ? "bg-error/10 text-error border-error/20"
                      : "bg-surface-container text-on-surface-variant border-white/5 hover:border-white/10"
                  )}
                >
                  <Heart className={cn("w-4 h-4", wishlisted && "fill-error")} />
                  {wishlisted ? "Sauvegardé" : "Sauvegarder"}
                </button>
                <button
                  onClick={handleShare}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-surface-container text-on-surface-variant border border-white/5 hover:border-white/10 transition-all"
                >
                  <Share2 className="w-4 h-4" />
                  Partager
                </button>
              </div>

              {/* Trust block */}
              <div className="space-y-2 p-5 rounded-2xl bg-surface-container border border-white/5">
                <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-3">
                  Garanties
                </p>
                {[
                  { icon: Shield, text: "Paiement sécurisé — Cash à la livraison (COD)" },
                  { icon: Download, text: "Livraison digitale instantanée après confirmation" },
                  { icon: CheckCircle, text: "Garantie satisfait ou remboursé sous 7 jours" },
                  { icon: Star, text: "Produit 100% original et licencié" },
                ].map(({ icon: Icon, text }) => (
                  <div key={text} className="flex items-start gap-3 text-sm text-on-surface-variant">
                    <Icon className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                    <span>{text}</span>
                  </div>
                ))}
              </div>

              {/* Tags */}
              {product.tags.length > 0 && (
                <div className="flex gap-2 flex-wrap">
                  {product.tags.map((tag) => (
                    <Link
                      key={tag}
                      href={`/shop?q=${tag}`}
                      className="px-3 py-1 rounded-full text-xs bg-surface-container text-on-surface-variant border border-white/5 hover:border-primary/20 hover:text-primary transition-all"
                    >
                      #{tag}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* ── Long Description ─────────────────────────────── */}
          {product.longDescription && (
            <div className="mb-16 max-w-3xl">
              <h2 className="text-2xl font-black font-headline mb-6">
                Description complète
              </h2>
              <div className="glass-card rounded-2xl p-8 border border-white/5 space-y-1">
                {renderDescription(product.longDescription)}
              </div>
            </div>
          )}

          {/* ── Related Products ─────────────────────────────── */}
          {related.length > 0 && (
            <div>
              <div className="flex items-end justify-between mb-8">
                <div>
                  <span className="section-label mb-2 block">Vous aimerez aussi</span>
                  <h2 className="text-2xl font-black font-headline">Produits similaires</h2>
                </div>
                <Link href={`/shop?category=${product.category}`} className="text-secondary text-sm font-semibold hover:text-primary transition-colors">
                  Voir tout →
                </Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {related.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
