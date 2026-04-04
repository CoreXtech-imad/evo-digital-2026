"use client";

import Link from "next/link";
import { ArrowRight, Shield, Zap, Download, Star } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center px-6 overflow-hidden pt-20">
      {/* Background Orbs */}
      <div
        className="evo-orb animate-float"
        style={{
          width: 600,
          height: 600,
          top: "-10%",
          left: "-10%",
          background:
            "radial-gradient(circle, rgba(97,205,255,0.12) 0%, transparent 70%)",
        }}
      />
      <div
        className="evo-orb animate-float-delayed"
        style={{
          width: 500,
          height: 500,
          bottom: "-5%",
          right: "-5%",
          background:
            "radial-gradient(circle, rgba(170,139,255,0.10) 0%, transparent 70%)",
        }}
      />

      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(rgba(97,205,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(97,205,255,0.5) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />

      <div className="max-w-screen-xl mx-auto w-full relative z-10">
        <div className="max-w-4xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel border border-primary/20 text-sm text-primary font-semibold mb-8 shadow-neon-primary/20 fade-up">
            <Zap className="w-4 h-4 fill-primary" />
            <span>Boutique Numérique #1 en Algérie</span>
            <span className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />
          </div>

          {/* Headline */}
          <h1
            className="text-5xl md:text-7xl lg:text-8xl font-black font-headline tracking-tighter leading-[0.95] mb-6 fade-up"
            style={{ animationDelay: "0.1s" }}
          >
            Votre{" "}
            <span className="gradient-text">Boutique</span>
            <br />
            Numérique
            <br />
            <span className="text-on-surface-variant">Premium.</span>
          </h1>

          {/* Subtitle */}
          <p
            className="text-lg md:text-xl text-on-surface-variant max-w-2xl mb-10 leading-relaxed fade-up"
            style={{ animationDelay: "0.2s" }}
          >
            Téléchargez des logiciels premium, templates, outils et plus
            encore. Livraison instantanée. Paiement à la livraison disponible
            partout en Algérie.
          </p>

          {/* CTAs */}
          <div
            className="flex flex-wrap gap-4 mb-16 fade-up"
            style={{ animationDelay: "0.3s" }}
          >
            <Link href="/shop" className="btn-primary text-base px-8 py-4">
              Explorer la Boutique
              <ArrowRight className="w-4 h-4 inline ml-2" />
            </Link>
            <Link href="#featured" className="btn-secondary text-base px-8 py-4">
              Voir les produits
            </Link>
          </div>

          {/* Trust signals */}
          <div
            className="flex flex-wrap gap-6 fade-up"
            style={{ animationDelay: "0.4s" }}
          >
            {[
              { icon: Shield, label: "Paiement 100% Sécurisé" },
              { icon: Download, label: "Livraison Instantanée" },
              { icon: Star, label: "4.9/5 Satisfaction Client" },
            ].map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="flex items-center gap-2 text-sm text-on-surface-variant"
              >
                <Icon className="w-4 h-4 text-primary" />
                <span>{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Floating stats cards */}
        <div className="hidden lg:block">
          <div
            className="absolute right-0 top-1/4 glass-card rounded-2xl p-4 border border-white/5 shadow-card-hover fade-up"
            style={{ animationDelay: "0.5s" }}
          >
            <div className="text-2xl font-black font-headline gradient-text">
              500+
            </div>
            <div className="text-xs text-on-surface-variant mt-1">
              Produits disponibles
            </div>
          </div>

          <div
            className="absolute right-32 top-2/3 glass-card rounded-2xl p-4 border border-white/5 shadow-card-hover fade-up"
            style={{ animationDelay: "0.6s" }}
          >
            <div className="flex items-center gap-1 text-yellow-400 mb-1">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} className="w-3 h-3 fill-yellow-400" />
              ))}
            </div>
            <div className="text-xs text-on-surface-variant">
              1000+ clients satisfaits
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-on-surface-variant/40 animate-bounce">
        <div className="w-5 h-8 rounded-full border border-current flex items-start justify-center p-1">
          <div className="w-1 h-1.5 bg-current rounded-full animate-pulse" />
        </div>
      </div>
    </section>
  );
}
