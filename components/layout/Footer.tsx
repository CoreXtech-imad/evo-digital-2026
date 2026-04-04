import Link from "next/link";
import { Zap, Mail, Phone, MapPin, Facebook, Instagram } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-surface-container-low border-t border-white/5 mt-24">
      {/* Top orb decoration */}
      <div className="relative overflow-hidden">
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-48 rounded-full opacity-20"
          style={{ background: "radial-gradient(ellipse, #61cdff33 0%, transparent 70%)", filter: "blur(40px)" }}
        />
      </div>

      <div className="max-w-screen-xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-4 gap-12 relative z-10">
        {/* Brand */}
        <div className="md:col-span-1 space-y-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg hero-gradient flex items-center justify-center shadow-neon-primary">
              <Zap className="w-4 h-4 text-on-primary" fill="currentColor" />
            </div>
            <span className="text-xl font-black font-headline gradient-text">
              Evo Digital
            </span>
          </Link>
          <p className="text-on-surface-variant text-sm leading-relaxed">
            La boutique numérique premium d&apos;Algérie. Logiciels, templates,
            outils et plus encore.
          </p>
          <div className="flex gap-3">
            <a
              href="#"
              className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center text-on-surface-variant hover:text-primary hover:bg-primary/10 transition-all"
            >
              <Facebook className="w-4 h-4" />
            </a>
            <a
              href="#"
              className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center text-on-surface-variant hover:text-primary hover:bg-primary/10 transition-all"
            >
              <Instagram className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Boutique */}
        <div>
          <h3 className="font-bold font-headline mb-4 text-sm uppercase tracking-wider text-on-surface-variant">
            Boutique
          </h3>
          <ul className="space-y-2">
            {[
              { label: "Tous les produits", href: "/shop" },
              { label: "Logiciels", href: "/shop?category=software" },
              { label: "Templates", href: "/shop?category=templates" },
              { label: "Ebooks", href: "/shop?category=ebooks" },
              { label: "Scripts & Outils", href: "/shop?category=scripts" },
            ].map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-sm text-on-surface-variant hover:text-primary transition-colors"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Support */}
        <div>
          <h3 className="font-bold font-headline mb-4 text-sm uppercase tracking-wider text-on-surface-variant">
            Support
          </h3>
          <ul className="space-y-2">
            {[
              { label: "FAQ", href: "/#faq" },
              { label: "Politique de remboursement", href: "#" },
              { label: "Conditions d'utilisation", href: "#" },
              { label: "Politique de confidentialité", href: "#" },
            ].map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  className="text-sm text-on-surface-variant hover:text-primary transition-colors"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="font-bold font-headline mb-4 text-sm uppercase tracking-wider text-on-surface-variant">
            Contact
          </h3>
          <ul className="space-y-3">
            <li className="flex items-center gap-2 text-sm text-on-surface-variant">
              <Mail className="w-4 h-4 text-primary flex-shrink-0" />
              <a
                href="mailto:contact@evodigital.dz"
                className="hover:text-primary transition-colors"
              >
                contact@evodigital.dz
              </a>
            </li>
            <li className="flex items-center gap-2 text-sm text-on-surface-variant">
              <Phone className="w-4 h-4 text-primary flex-shrink-0" />
              <span>+213 XXX XXX XXX</span>
            </li>
            <li className="flex items-start gap-2 text-sm text-on-surface-variant">
              <MapPin className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
              <span>Alger, Algérie</span>
            </li>
          </ul>

          <div className="mt-6 p-3 rounded-xl bg-surface-container border border-white/5">
            <p className="text-xs text-on-surface-variant">
              💵 <span className="text-primary font-semibold">Paiement COD</span> — Cash à la livraison dans toute l&apos;Algérie
            </p>
          </div>
        </div>
      </div>

      <div className="border-t border-white/5 py-6 px-6 max-w-screen-xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-xs text-on-surface-variant">
          © {new Date().getFullYear()} Evo Digital. Tous droits réservés.
        </p>
        <p className="text-xs text-on-surface-variant">
          Fait avec ❤️ en Algérie 🇩🇿
        </p>
      </div>
    </footer>
  );
}
