"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Link from "next/link";
import { CheckCircle, Package, Mail, Phone, ArrowRight, Home, Zap } from "lucide-react";

function ConfirmationContent() {
  const params = useSearchParams();
  const orderId = params.get("id");
  const orderNumber = params.get("number");

  return (
    <div className="max-w-2xl mx-auto px-6 py-16 text-center">
      {/* Success animation */}
      <div className="relative mx-auto w-24 h-24 mb-8">
        <div className="absolute inset-0 rounded-full hero-gradient opacity-20 animate-ping" />
        <div className="relative w-24 h-24 rounded-full hero-gradient flex items-center justify-center shadow-neon-primary-lg">
          <CheckCircle className="w-12 h-12 text-on-primary" />
        </div>
      </div>

      <h1 className="text-3xl md:text-4xl font-black font-headline mb-3">
        Commande <span className="gradient-text">Confirmée!</span>
      </h1>

      <p className="text-on-surface-variant text-lg mb-2">
        Merci pour votre commande. Nous l&apos;avons bien reçue!
      </p>

      {orderNumber && (
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel border border-primary/20 text-primary text-sm font-bold mb-8">
          <Package className="w-4 h-4" />
          Numéro de commande: {orderNumber}
        </div>
      )}

      {/* Steps */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
        {[
          {
            icon: CheckCircle,
            title: "Commande reçue",
            desc: "Votre commande a été enregistrée avec succès",
            color: "#34d399",
            done: true,
          },
          {
            icon: Mail,
            title: "Email envoyé",
            desc: "Vérifiez votre boîte mail pour la confirmation",
            color: "#61cdff",
            done: true,
          },
          {
            icon: Zap,
            title: "Livraison",
            desc: "Votre produit sera livré après paiement COD",
            color: "#aa8bff",
            done: false,
          },
        ].map(({ icon: Icon, title, desc, color, done }) => (
          <div
            key={title}
            className="glass-card rounded-2xl p-5 border border-white/5 text-left"
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
              style={{ background: `${color}20` }}
            >
              <Icon className="w-5 h-5" style={{ color }} />
            </div>
            <h3 className="font-bold font-headline text-sm mb-1">{title}</h3>
            <p className="text-xs text-on-surface-variant leading-relaxed">{desc}</p>
          </div>
        ))}
      </div>

      {/* Info box */}
      <div className="glass-card rounded-2xl p-6 border border-white/5 text-left mb-8">
        <h3 className="font-bold font-headline mb-4">Prochaines étapes</h3>
        <ul className="space-y-3 text-sm text-on-surface-variant">
          <li className="flex items-start gap-2">
            <span className="w-5 h-5 rounded-full bg-primary/20 text-primary text-xs flex items-center justify-center mt-0.5 flex-shrink-0 font-bold">1</span>
            Notre équipe va confirmer votre commande sous 24h
          </li>
          <li className="flex items-start gap-2">
            <span className="w-5 h-5 rounded-full bg-primary/20 text-primary text-xs flex items-center justify-center mt-0.5 flex-shrink-0 font-bold">2</span>
            Vous recevrez un lien de téléchargement sécurisé par email
          </li>
          <li className="flex items-start gap-2">
            <span className="w-5 h-5 rounded-full bg-primary/20 text-primary text-xs flex items-center justify-center mt-0.5 flex-shrink-0 font-bold">3</span>
            Payez en cash à la livraison (COD) en DZD
          </li>
        </ul>
      </div>

      {/* Contact */}
      <div className="flex flex-col sm:flex-row gap-3 justify-center mb-8">
        <a
          href="mailto:support@evodigital.dz"
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl glass-panel border border-white/10 text-sm text-on-surface-variant hover:text-primary hover:border-primary/20 transition-all"
        >
          <Mail className="w-4 h-4 text-primary" />
          support@evodigital.dz
        </a>
        <a
          href="https://wa.me/213XXXXXXXXX"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl glass-panel border border-white/10 text-sm text-on-surface-variant hover:text-primary hover:border-primary/20 transition-all"
        >
          <Phone className="w-4 h-4 text-primary" />
          WhatsApp Support
        </a>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link href="/" className="btn-secondary flex items-center justify-center gap-2">
          <Home className="w-4 h-4" />
          Retour à l&apos;accueil
        </Link>
        <Link href="/shop" className="btn-primary flex items-center justify-center gap-2">
          Continuer les achats
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}

export default function OrderConfirmationPage() {
  return (
    <>
      <Navbar />
      <main className="pt-20 min-h-screen relative overflow-hidden">
        {/* Orbs */}
        <div className="evo-orb" style={{ width: 500, height: 500, top: "10%", left: "50%", transform: "translateX(-50%)", background: "radial-gradient(circle, rgba(97,205,255,0.06) 0%, transparent 70%)" }} />
        <Suspense fallback={<div className="text-center pt-20 text-on-surface-variant">Chargement...</div>}>
          <ConfirmationContent />
        </Suspense>
      </main>
    </>
  );
}
