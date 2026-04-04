import { Shield, Zap, RefreshCw, Headphones, CreditCard, Globe } from "lucide-react";

const features = [
  {
    icon: Shield,
    title: "100% Sécurisé",
    desc: "Produits originaux & licenciés",
    color: "#61cdff",
  },
  {
    icon: Zap,
    title: "Livraison Instantanée",
    desc: "Recevez votre produit immédiatement",
    color: "#aa8bff",
  },
  {
    icon: CreditCard,
    title: "Paiement COD",
    desc: "Payez à la livraison en DZD",
    color: "#34d399",
  },
  {
    icon: RefreshCw,
    title: "Garantie 7 Jours",
    desc: "Remboursement sans question",
    color: "#fbbf24",
  },
  {
    icon: Headphones,
    title: "Support Dédié",
    desc: "Réponse sous 24h",
    color: "#f472b6",
  },
  {
    icon: Globe,
    title: "Toute l'Algérie",
    desc: "Livraison dans 58 wilayas",
    color: "#fb923c",
  },
];

export default function TrustBanner() {
  return (
    <section className="px-6 py-16 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-secondary/5" />

      <div className="max-w-screen-xl mx-auto relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {features.map(({ icon: Icon, title, desc, color }) => (
            <div
              key={title}
              className="flex flex-col items-center text-center gap-3 p-4 rounded-2xl hover:bg-surface-container transition-colors group"
            >
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
                style={{ background: `${color}15` }}
              >
                <Icon className="w-6 h-6" style={{ color }} />
              </div>
              <div>
                <div className="font-bold text-sm font-headline">{title}</div>
                <div className="text-xs text-on-surface-variant mt-0.5 leading-tight">
                  {desc}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
