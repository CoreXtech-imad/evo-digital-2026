"use client";

import { useState } from "react";
import { Mail, Zap, ArrowRight, CheckCircle } from "lucide-react";
import toast from "react-hot-toast";

export default function NewsletterCTA() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes("@")) {
      toast.error("Entrez un email valide");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) throw new Error();
      setSubmitted(true);
      toast.success("Inscription réussie! 🎉");
    } catch {
      toast.error("Erreur lors de l'inscription. Réessayez.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="px-6 py-24">
      <div className="max-w-screen-xl mx-auto">
        <div className="relative overflow-hidden rounded-3xl p-8 md:p-16">
          {/* Background */}
          <div className="absolute inset-0 hero-gradient opacity-10" />
          <div className="absolute inset-0 bg-surface-container" />
          <div
            className="absolute top-0 right-0 w-80 h-80 rounded-full opacity-30"
            style={{
              background:
                "radial-gradient(circle, rgba(170,139,255,0.4) 0%, transparent 70%)",
              filter: "blur(60px)",
            }}
          />
          <div
            className="absolute bottom-0 left-0 w-64 h-64 rounded-full opacity-20"
            style={{
              background:
                "radial-gradient(circle, rgba(97,205,255,0.4) 0%, transparent 70%)",
              filter: "blur(40px)",
            }}
          />

          {/* Content */}
          <div className="relative z-10 max-w-2xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel border border-primary/20 text-sm text-primary font-semibold mb-6">
              <Zap className="w-4 h-4 fill-primary" />
              <span>Newsletter Evo Digital</span>
            </div>

            <h2 className="text-3xl md:text-4xl font-black font-headline mb-4">
              Restez informé des{" "}
              <span className="gradient-text">nouvelles offres</span>
            </h2>

            <p className="text-on-surface-variant mb-8 leading-relaxed">
              Recevez en avant-première nos nouveaux produits, promotions
              exclusives et conseils pour booster votre business digital en Algérie.
            </p>

            {submitted ? (
              <div className="flex items-center justify-center gap-3 text-green-400 font-semibold">
                <CheckCircle className="w-6 h-6" />
                <span>Merci! Vous êtes inscrit à notre newsletter.</span>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
              >
                <div className="relative flex-1">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="votre@email.com"
                    className="input-field pl-11 w-full"
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary flex items-center gap-2 whitespace-nowrap disabled:opacity-60"
                >
                  {loading ? (
                    <span className="w-4 h-4 border-2 border-on-primary border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <ArrowRight className="w-4 h-4" />
                  )}
                  S&apos;inscrire
                </button>
              </form>
            )}

            <p className="text-xs text-on-surface-variant mt-4">
              🔒 Pas de spam. Désabonnement en un clic. Zéro publicité.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
