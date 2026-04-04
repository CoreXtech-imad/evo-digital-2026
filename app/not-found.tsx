import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import { Home, ShoppingBag, Search } from "lucide-react";

export default function NotFound() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen flex items-center justify-center px-6 pt-20">
        {/* Background orbs */}
        <div
          className="evo-orb"
          style={{
            width: 500,
            height: 500,
            top: "20%",
            left: "50%",
            transform: "translateX(-50%)",
            background:
              "radial-gradient(circle, rgba(97,205,255,0.06) 0%, transparent 70%)",
          }}
        />

        <div className="text-center relative z-10 max-w-lg">
          {/* 404 display */}
          <div className="relative mb-8">
            <div className="text-[8rem] md:text-[12rem] font-black font-headline leading-none gradient-text opacity-20 select-none">
              404
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="glass-card rounded-2xl px-6 py-4 border border-white/5">
                <Search className="w-8 h-8 text-primary mx-auto mb-2" />
                <p className="text-sm font-bold font-headline">Page introuvable</p>
              </div>
            </div>
          </div>

          <h1 className="text-2xl md:text-3xl font-black font-headline mb-3">
            Oups! Cette page n&apos;existe pas.
          </h1>
          <p className="text-on-surface-variant mb-8 leading-relaxed">
            La page que vous cherchez a peut-être été déplacée ou supprimée.
            Retournez à l&apos;accueil ou explorez notre boutique.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/"
              className="btn-primary flex items-center justify-center gap-2 py-3.5"
            >
              <Home className="w-4 h-4" />
              Retour à l&apos;accueil
            </Link>
            <Link
              href="/shop"
              className="btn-secondary flex items-center justify-center gap-2 py-3.5"
            >
              <ShoppingBag className="w-4 h-4" />
              Explorer la boutique
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
