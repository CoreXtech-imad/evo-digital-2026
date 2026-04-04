"use client";

import { useState } from "react";
import { Star, ChevronDown, Quote } from "lucide-react";
import { cn } from "@/lib/utils";

const testimonials = [
  {
    name: "Karim B.",
    city: "Alger",
    rating: 5,
    comment:
      "Produits de très haute qualité! J'ai acheté un template UI et j'ai reçu le fichier instantanément. Le service client est excellent.",
    product: "Template Dashboard Pro",
    avatar: "KB",
  },
  {
    name: "Yasmine M.",
    city: "Oran",
    rating: 5,
    comment:
      "Je recommande fortement Evo Digital. Les logiciels sont originaux et fonctionnent parfaitement. Paiement à la livraison très pratique!",
    product: "Pack Logiciels Business",
    avatar: "YM",
  },
  {
    name: "Anis T.",
    city: "Constantine",
    rating: 5,
    comment:
      "Excellent rapport qualité-prix. L'ebook que j'ai acheté m'a énormément aidé dans mon projet freelance. Merci Evo Digital!",
    product: "Ebook Marketing Digital",
    avatar: "AT",
  },
  {
    name: "Sara L.",
    city: "Annaba",
    rating: 5,
    comment:
      "Livraison rapide, produits conformes à la description. Je reviendrai certainement pour mes prochains achats numériques.",
    product: "Pack Templates Créatifs",
    avatar: "SL",
  },
  {
    name: "Mohamed R.",
    city: "Tlemcen",
    rating: 5,
    comment:
      "Site professionnel et fiable. Les prix en DZD et le paiement COD rendent les achats très simples. Je suis très satisfait!",
    product: "Script Automation Pro",
    avatar: "MR",
  },
  {
    name: "Fatima Z.",
    city: "Béjaïa",
    rating: 5,
    comment:
      "Première commande et déjà conquise! Le processus est simple et les produits sont vraiment de qualité professionnelle.",
    product: "Template E-commerce",
    avatar: "FZ",
  },
];

const faqs = [
  {
    q: "Comment fonctionne la livraison des produits numériques?",
    a: "Après confirmation de votre commande, vous recevrez un lien de téléchargement sécurisé par email. Pour les commandes COD, le lien est envoyé après la confirmation de paiement.",
  },
  {
    q: "Puis-je payer à la livraison (COD)?",
    a: "Oui! Nous acceptons le paiement à la livraison (Cash on Delivery) pour toutes les commandes en Algérie. C'est notre mode de paiement principal.",
  },
  {
    q: "Les produits sont-ils originaux et légaux?",
    a: "Absolument. Tous nos produits sont 100% originaux, légaux et disposent de licences appropriées. Nous ne vendons pas de produits piratés.",
  },
  {
    q: "Que faire si je rencontre un problème avec mon téléchargement?",
    a: "Contactez notre support par email ou WhatsApp. Nous vous répondons dans les 24h et résolvons tout problème rapidement.",
  },
  {
    q: "Puis-je obtenir un remboursement?",
    a: "Nous offrons un remboursement sous 7 jours si le produit ne correspond pas à la description. Contactez-nous avec votre numéro de commande.",
  },
  {
    q: "Livrez-vous dans toute l'Algérie?",
    a: "Oui, nous livrons des produits numériques dans toutes les 58 wilayas d'Algérie. La livraison est instantanée car tout est numérique!",
  },
];

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      className={cn(
        "rounded-2xl border transition-all duration-300 overflow-hidden",
        open
          ? "border-primary/30 bg-primary/5"
          : "border-white/5 bg-surface-container hover:border-white/10"
      )}
    >
      <button
        className="w-full flex items-center justify-between p-5 text-left"
        onClick={() => setOpen(!open)}
      >
        <span className="font-semibold font-headline text-sm pr-4">{q}</span>
        <ChevronDown
          className={cn(
            "w-5 h-5 text-primary flex-shrink-0 transition-transform duration-300",
            open && "rotate-180"
          )}
        />
      </button>
      {open && (
        <div className="px-5 pb-5 text-on-surface-variant text-sm leading-relaxed">
          {a}
        </div>
      )}
    </div>
  );
}

export default function TestimonialsAndFAQ() {
  return (
    <>
      {/* Testimonials */}
      <section className="px-6 py-24 bg-surface-container-low/20">
        <div className="max-w-screen-xl mx-auto">
          <div className="text-center mb-12">
            <span className="section-label mb-3 block">Avis Clients</span>
            <h2 className="text-3xl md:text-4xl font-black font-headline">
              Ce que disent nos clients
            </h2>
            <p className="text-on-surface-variant mt-3 max-w-xl mx-auto">
              Plus de 1000 clients satisfaits à travers toute l&apos;Algérie.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <div
                key={i}
                className="glass-card rounded-2xl p-6 border border-white/5 hover:border-primary/10 transition-all duration-300 group"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <Quote className="w-8 h-8 text-primary/20 mb-4" />
                <p className="text-on-surface-variant text-sm leading-relaxed mb-4">
                  &ldquo;{t.comment}&rdquo;
                </p>
                <div className="flex items-center gap-1 mb-4">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400"
                    />
                  ))}
                </div>
                <div className="flex items-center gap-3 pt-3 border-t border-white/5">
                  <div className="w-9 h-9 rounded-full hero-gradient flex items-center justify-center text-xs font-bold text-on-primary flex-shrink-0">
                    {t.avatar}
                  </div>
                  <div>
                    <div className="font-bold text-sm font-headline">
                      {t.name}
                    </div>
                    <div className="text-xs text-on-surface-variant">
                      {t.city} · {t.product}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="px-6 py-24">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <span className="section-label mb-3 block">Support</span>
            <h2 className="text-3xl md:text-4xl font-black font-headline">
              Questions Fréquentes
            </h2>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <FAQItem key={i} q={faq.q} a={faq.a} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
