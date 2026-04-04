"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useCart } from "@/hooks/useCart";
import { cn } from "@/lib/utils";
import CartDrawer from "./CartDrawer";
import { Menu, X, ShoppingCart, Search, Zap } from "lucide-react";

const navLinks = [
  { label: "Boutique", href: "/shop" },
  { label: "Logiciels", href: "/shop?category=software" },
  { label: "Templates", href: "/shop?category=templates" },
  { label: "Ebooks", href: "/shop?category=ebooks" },
];

export default function Navbar() {
  const { count, items } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <nav
        className={cn(
          "fixed top-0 w-full z-50 transition-all duration-500",
          scrolled
            ? "bg-background/80 backdrop-blur-glass shadow-glass border-b border-white/5"
            : "bg-transparent"
        )}
      >
        <div className="max-w-screen-xl mx-auto px-6 py-4 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg hero-gradient flex items-center justify-center shadow-neon-primary group-hover:shadow-neon-primary-lg transition-all">
              <Zap className="w-4 h-4 text-on-primary" fill="currentColor" />
            </div>
            <span className="text-xl font-black font-headline gradient-text tracking-tight">
              Evo Digital
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-4 py-2 text-sm font-medium text-on-surface-variant hover:text-primary transition-colors duration-200 rounded-lg hover:bg-white/5"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <Link
              href="/shop"
              className="hidden md:flex p-2 text-on-surface-variant hover:text-primary transition-colors rounded-lg hover:bg-white/5"
              aria-label="Rechercher"
            >
              <Search className="w-5 h-5" />
            </Link>

            <button
              onClick={() => setCartOpen(true)}
              className="relative p-2 text-on-surface-variant hover:text-primary transition-colors rounded-lg hover:bg-white/5"
              aria-label="Panier"
            >
              <ShoppingCart className="w-5 h-5" />
              {count > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 hero-gradient rounded-full text-xs font-bold text-on-primary flex items-center justify-center shadow-neon-primary animate-pulse-glow">
                  {count > 9 ? "9+" : count}
                </span>
              )}
            </button>

            <Link href="/shop" className="hidden md:block btn-primary text-sm ml-2">
              Explorer
            </Link>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 text-on-surface-variant hover:text-primary transition-colors"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="md:hidden glass-panel border-t border-white/5 px-6 py-4 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="block px-4 py-3 text-on-surface-variant hover:text-primary transition-colors rounded-xl hover:bg-white/5 font-medium"
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-2">
              <Link href="/shop" className="btn-primary w-full text-center block">
                Explorer la Boutique
              </Link>
            </div>
          </div>
        )}
      </nav>

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}
