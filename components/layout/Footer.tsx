import Link from "next/link";
import { Zap, Mail, Phone, MapPin } from "lucide-react";

const FacebookIcon = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);
const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);
import { getStoreSettings } from "@/lib/store-settings";

export default async function Footer() {
  const store = await getStoreSettings();

  return (
    <footer className="bg-surface-container-low border-t border-white/5 mt-24">
      <div className="relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-48 rounded-full opacity-20"
          style={{ background: "radial-gradient(ellipse, #61cdff33 0%, transparent 70%)", filter: "blur(40px)" }} />
      </div>

      <div className="max-w-screen-xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-4 gap-12 relative z-10">
        {/* Brand */}
        <div className="md:col-span-1 space-y-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg hero-gradient flex items-center justify-center shadow-neon-primary">
              <Zap className="w-4 h-4 text-on-primary" fill="currentColor" />
            </div>
            <span className="text-xl font-black font-headline gradient-text">{store.storeName}</span>
          </Link>
          <p className="text-on-surface-variant text-sm leading-relaxed">
            {store.description}
          </p>
          <div className="flex gap-3">
            {store.facebook && (
              <a href={store.facebook} target="_blank" rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center text-on-surface-variant hover:text-primary hover:bg-primary/10 transition-all">
                <FacebookIcon />
              </a>
            )}
            {store.instagram && (
              <a href={store.instagram} target="_blank" rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center text-on-surface-variant hover:text-primary hover:bg-primary/10 transition-all">
                <InstagramIcon />
              </a>
            )}
            {store.tiktok && (
              <a href={store.tiktok} target="_blank" rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center text-on-surface-variant hover:text-primary hover:bg-primary/10 transition-all">
                <span className="text-sm">🎵</span>
              </a>
            )}
            {store.youtube && (
              <a href={store.youtube} target="_blank" rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center text-on-surface-variant hover:text-primary hover:bg-primary/10 transition-all">
                <span className="text-sm">▶️</span>
              </a>
            )}
            {!store.facebook && !store.instagram && !store.tiktok && !store.youtube && (
              <>
                <a href="#" className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center text-on-surface-variant hover:text-primary hover:bg-primary/10 transition-all">
                  <FacebookIcon />
                </a>
                <a href="#" className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center text-on-surface-variant hover:text-primary hover:bg-primary/10 transition-all">
                  <InstagramIcon />
                </a>
              </>
            )}
          </div>
        </div>

        {/* Boutique */}
        <div>
          <h3 className="font-bold font-headline mb-4 text-sm uppercase tracking-wider text-on-surface-variant">Boutique</h3>
          <ul className="space-y-2">
            {[
              { label: "Tous les produits", href: "/shop" },
              { label: "Logiciels",          href: "/shop?category=software" },
              { label: "Templates",          href: "/shop?category=templates" },
              { label: "Ebooks",             href: "/shop?category=ebooks" },
              { label: "Scripts & Outils",   href: "/shop?category=scripts" },
            ].map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="text-sm text-on-surface-variant hover:text-primary transition-colors">{link.label}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Support */}
        <div>
          <h3 className="font-bold font-headline mb-4 text-sm uppercase tracking-wider text-on-surface-variant">Support</h3>
          <ul className="space-y-2">
            {[
              { label: "FAQ",                          href: "/#faq" },
              { label: "Politique de remboursement",   href: "/legal/refund" },
              { label: "Conditions d'utilisation",     href: "/legal/terms" },
              { label: "Politique de confidentialité", href: "/legal/privacy" },
            ].map((link) => (
              <li key={link.label}>
                <Link href={link.href} className="text-sm text-on-surface-variant hover:text-primary transition-colors">{link.label}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="font-bold font-headline mb-4 text-sm uppercase tracking-wider text-on-surface-variant">Contact</h3>
          <ul className="space-y-3">
            {store.email && (
              <li className="flex items-center gap-2 text-sm text-on-surface-variant">
                <Mail className="w-4 h-4 text-primary flex-shrink-0" />
                <a href={`mailto:${store.email}`} className="hover:text-primary transition-colors">{store.email}</a>
              </li>
            )}
            {store.phone && (
              <li className="flex items-center gap-2 text-sm text-on-surface-variant">
                <Phone className="w-4 h-4 text-primary flex-shrink-0" />
                <span>{store.phone}</span>
              </li>
            )}
            {store.address && (
              <li className="flex items-start gap-2 text-sm text-on-surface-variant">
                <MapPin className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                <span>{store.address}</span>
              </li>
            )}
          </ul>

          {store.whatsapp && (
            <a href={`https://wa.me/${store.whatsapp.replace(/[^0-9]/g, "")}`} target="_blank" rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-medium hover:bg-green-500/20 transition-all">
              <span>💬</span> WhatsApp
            </a>
          )}
        </div>
      </div>

      <div className="border-t border-white/5 py-6 px-6 max-w-screen-xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-xs text-on-surface-variant">© {new Date().getFullYear()} {store.storeName}. Tous droits réservés.</p>
        <p className="text-xs text-on-surface-variant">Fait avec ❤️ en Algérie 🇩🇿</p>
      </div>
    </footer>
  );
}
