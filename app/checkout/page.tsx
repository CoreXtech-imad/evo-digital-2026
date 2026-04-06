"use client";

import { useState, useEffect } from "react";
import { useCart } from "@/hooks/useCart";
import { formatDZD } from "@/lib/utils";
import Navbar from "@/components/layout/Navbar";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { User, MapPin, Shield, Truck, ChevronRight, Loader2, ShoppingBag, CreditCard } from "lucide-react";
import { ALGERIA_WILAYAS } from "@/types";
import { cn } from "@/lib/utils";
import type { CheckoutSettings } from "@/lib/checkout-types";
import { DEFAULT_SETTINGS } from "@/lib/checkout-types";

export default function CheckoutPage() {
  const { items, total, clearCart } = useCart();
  const router  = useRouter();
  const [loading, setLoading]     = useState(false);
  const [settings, setSettings]   = useState<CheckoutSettings>(DEFAULT_SETTINGS);
  const [form, setForm]           = useState<Record<string, string>>({});
  const [errors, setErrors]       = useState<Record<string, string>>({});
  const [selectedPayment, setSelectedPayment] = useState(
    DEFAULT_SETTINGS.paymentMethods.find((m) => m.enabled)?.id ?? ""
  );

  // Load checkout settings
  useEffect(() => {
    fetch("/api/settings/checkout")
      .then((r) => r.json())
      .then((data: CheckoutSettings) => {
        setSettings(data);
        // Auto-select first enabled payment
        const first = data.paymentMethods.find((m) => m.enabled);
        if (first) setSelectedPayment(first.id);
      })
      .catch(() => {
        const first = DEFAULT_SETTINGS.paymentMethods.find((m) => m.enabled);
        if (first) setSelectedPayment(first.id);
      });
  }, []);

  const enabledFields   = settings.fields.filter((f) => f.enabled);
  const enabledPayments = settings.paymentMethods.filter((m) => m.enabled);

  const setField = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: "" }));
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    for (const field of enabledFields) {
      if (!field.required) continue;
      const val = (form[field.key] || "").trim();
      if (!val) {
        newErrors[field.key] = `${field.label} est requis`;
        continue;
      }
      if (field.key === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
        newErrors[field.key] = "Email invalide";
      }
      // Permissive phone: at least 7 digits anywhere in the string
      if (field.key === "phone" && (val.replace(/\D/g, "").length < 7)) {
        newErrors[field.key] = "Numéro de téléphone invalide (min 7 chiffres)";
      }
      if (field.key === "name" && val.length < 2) {
        newErrors[field.key] = "Le nom doit contenir au moins 2 caractères";
      }
    }
    // Auto-pick first payment if none selected
    const firstPayment = enabledPayments[0]?.id;
    const payment = selectedPayment || firstPayment || "";
    if (!payment) newErrors["payment"] = "Veuillez sélectionner un mode de paiement";
    else if (!selectedPayment) setSelectedPayment(payment);
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const shippingFee = (() => {
    if (settings.shippingFee === 0) return 0;
    if (settings.freeShippingAbove > 0 && total >= settings.freeShippingAbove) return 0;
    return settings.shippingFee;
  })();

  const orderTotal = total + shippingFee;

  const onSubmit = async (e: { preventDefault(): void }) => {
    e.preventDefault();
    if (items.length === 0) { toast.error("Votre panier est vide"); return; }
    if (settings.minOrderAmount > 0 && total < settings.minOrderAmount) {
      toast.error(`Commande minimum: ${formatDZD(settings.minOrderAmount)}`);
      return;
    }
    if (!validate()) { toast.error("Veuillez corriger les erreurs"); return; }

    setLoading(true);
    try {
      const customer: Record<string, string> = {};
      for (const field of enabledFields) customer[field.key] = form[field.key] || "";

      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer,
          items: items.map((i) => ({
            productId:    i.product.id,
            productName:  i.product.name,
            productImage: i.product.images[0] || "",
            price:        i.product.price,
            quantity:     i.quantity,
          })),
          subtotal:      total,
          shippingFee,
          total:         orderTotal,
          paymentMethod: selectedPayment,
        }),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Erreur serveur");

      clearCart();
      router.push(`/order-confirmation?id=${result.orderId}&number=${result.orderNumber}`);
    } catch (error: any) {
      toast.error(error.message || "Une erreur s'est produite. Réessayez.");
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <>
        <Navbar />
        <main className="pt-24 min-h-screen flex items-center justify-center px-6">
          <div className="text-center">
            <ShoppingBag className="w-16 h-16 text-on-surface-variant/30 mx-auto mb-4" />
            <h1 className="text-2xl font-black font-headline mb-3">Panier vide</h1>
            <p className="text-on-surface-variant mb-6">Ajoutez des produits avant de passer commande.</p>
            <Link href="/shop" className="btn-primary">Explorer la Boutique</Link>
          </div>
        </main>
      </>
    );
  }

  // Group fields by section
  const personalKeys = ["name", "email", "phone"];
  const deliveryKeys = ["wilaya", "city", "address", "notes"];
  const personalFields = enabledFields.filter((f) => personalKeys.includes(f.key));
  const deliveryFields  = enabledFields.filter((f) => deliveryKeys.includes(f.key));

  const renderField = (field: typeof enabledFields[0]) => {
    const val = form[field.key] || "";
    const err = errors[field.key];
    const base = cn("input-field", err && "border-error/50");

    if (field.type === "select") {
      return (
        <div key={field.key}>
          <label className="block text-sm font-medium text-on-surface-variant mb-1.5">
            {field.label}{field.required && " *"}
          </label>
          <select value={val} onChange={(e) => setField(field.key, e.target.value)} className={base}>
            <option value="" className="bg-surface-container">{field.placeholder}</option>
            {ALGERIA_WILAYAS.map((w) => <option key={w} value={w} className="bg-surface-container">{w}</option>)}
          </select>
          {err && <p className="text-error text-xs mt-1">{err}</p>}
        </div>
      );
    }

    if (field.type === "textarea") {
      return (
        <div key={field.key} className="md:col-span-2">
          <label className="block text-sm font-medium text-on-surface-variant mb-1.5">
            {field.label}{field.required ? " *" : " (optionnel)"}
          </label>
          <textarea value={val} onChange={(e) => setField(field.key, e.target.value)}
            placeholder={field.placeholder} rows={3} className={cn(base, "resize-none")} />
          {err && <p className="text-error text-xs mt-1">{err}</p>}
        </div>
      );
    }

    return (
      <div key={field.key}>
        <label className="block text-sm font-medium text-on-surface-variant mb-1.5">
          {field.label}{field.required ? " *" : " (optionnel)"}
        </label>
        <input type={field.type} value={val} onChange={(e) => setField(field.key, e.target.value)}
          placeholder={field.placeholder} className={base} />
        {err && <p className="text-error text-xs mt-1">{err}</p>}
      </div>
    );
  };

  return (
    <>
      <Navbar />
      <main className="pt-24 min-h-screen">
        <div className="evo-orb" style={{ width: 400, height: 400, top: "10%", right: "-5%", background: "radial-gradient(circle, rgba(97,205,255,0.06) 0%, transparent 70%)" }} />
        <div className="max-w-screen-xl mx-auto px-6 py-8">
          <nav className="flex items-center gap-2 text-sm text-on-surface-variant mb-8">
            <Link href="/" className="hover:text-primary transition-colors">Accueil</Link>
            <ChevronRight className="w-4 h-4" />
            <Link href="/shop" className="hover:text-primary transition-colors">Boutique</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-on-surface">Commande</span>
          </nav>

          <h1 className="text-3xl font-black font-headline mb-8">
            Finaliser la <span className="gradient-text">Commande</span>
          </h1>

          <form onSubmit={onSubmit}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">

                {/* Personal info */}
                {personalFields.length > 0 && (
                  <div className="glass-card rounded-2xl p-6 border border-white/5">
                    <h2 className="font-bold font-headline mb-5 flex items-center gap-2">
                      <User className="w-5 h-5 text-primary" />
                      Informations Personnelles
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {personalFields.map(renderField)}
                    </div>
                  </div>
                )}

                {/* Delivery */}
                {deliveryFields.length > 0 && (
                  <div className="glass-card rounded-2xl p-6 border border-white/5">
                    <h2 className="font-bold font-headline mb-5 flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-primary" />
                      Adresse de Livraison
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {deliveryFields.map(renderField)}
                    </div>
                  </div>
                )}

                {/* Payment methods */}
                {enabledPayments.length > 0 && (
                  <div className="glass-card rounded-2xl p-6 border border-white/5">
                    <h2 className="font-bold font-headline mb-5 flex items-center gap-2">
                      <CreditCard className="w-5 h-5 text-primary" />
                      Mode de Paiement
                    </h2>
                    <div className="space-y-3">
                      {enabledPayments.map((method) => {
                        const selected = selectedPayment === method.id;
                        return (
                          <div key={method.id}>
                            <button type="button" onClick={() => setSelectedPayment(method.id)}
                              className={cn("w-full flex items-center gap-4 p-4 rounded-xl border transition-all text-left",
                                selected ? "bg-primary/5 border-primary/30" : "border-white/5 hover:border-white/10 hover:bg-white/2"
                              )}>
                              <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-all",
                                selected ? "bg-primary/15" : "bg-surface-container-high")}>
                                <span className="text-2xl">{method.icon}</span>
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-bold font-headline">{method.label}</p>
                                {method.description && <p className="text-sm text-on-surface-variant">{method.description}</p>}
                              </div>
                              <div className={cn("w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all",
                                selected ? "border-primary" : "border-white/20")}>
                                {selected && <div className="w-2.5 h-2.5 rounded-full bg-primary" />}
                              </div>
                            </button>
                            {/* Instructions shown when selected */}
                            {selected && method.instructions && (
                              <div className="mt-2 p-3 rounded-xl bg-primary/5 border border-primary/10 text-sm text-on-surface-variant">
                                {method.instructions}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                    {errors.payment && <p className="text-error text-xs mt-2">{errors.payment}</p>}
                  </div>
                )}
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <div className="glass-card rounded-2xl p-6 border border-white/5 sticky top-24">
                  <h2 className="font-bold font-headline mb-5 flex items-center gap-2">
                    <ShoppingBag className="w-5 h-5 text-primary" />
                    Résumé ({items.length})
                  </h2>

                  <div className="space-y-4 mb-6">
                    {items.map((item) => (
                      <div key={item.product.id} className="flex gap-3">
                        <div className="relative w-14 h-14 rounded-xl overflow-hidden flex-shrink-0">
                          <Image src={item.product.images[0] || "/images/placeholder.svg"} alt={item.product.name} fill className="object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold font-headline line-clamp-2 leading-tight">{item.product.name}</p>
                          <div className="flex items-center justify-between mt-1">
                            <span className="text-xs text-on-surface-variant">×{item.quantity}</span>
                            <span className="text-sm font-bold text-primary">{formatDZD(item.product.price * item.quantity)}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-white/5 pt-4 space-y-2 mb-6">
                    <div className="flex justify-between text-sm">
                      <span className="text-on-surface-variant">Sous-total</span>
                      <span>{formatDZD(total)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-on-surface-variant">Livraison</span>
                      {shippingFee === 0
                        ? <span className="text-green-400 font-semibold">Gratuite</span>
                        : <span>{formatDZD(shippingFee)}</span>
                      }
                    </div>
                    {settings.freeShippingAbove > 0 && shippingFee > 0 && (
                      <p className="text-xs text-on-surface-variant">
                        Livraison gratuite à partir de {formatDZD(settings.freeShippingAbove)}
                      </p>
                    )}
                    <div className="flex justify-between font-bold text-lg pt-2 border-t border-white/5">
                      <span>Total</span>
                      <span className="gradient-text font-black">{formatDZD(orderTotal)}</span>
                    </div>
                  </div>

                  {settings.minOrderAmount > 0 && total < settings.minOrderAmount && (
                    <div className="mb-4 p-3 rounded-xl bg-error/5 border border-error/20 text-xs text-error">
                      Commande minimum: {formatDZD(settings.minOrderAmount)}
                    </div>
                  )}

                  <button type="submit" disabled={loading}
                    className="btn-primary w-full flex items-center justify-center gap-2 py-4 text-base disabled:opacity-60 disabled:cursor-not-allowed">
                    {loading ? (
                      <><Loader2 className="w-5 h-5 animate-spin" /> Traitement...</>
                    ) : (
                      <><Truck className="w-5 h-5" /> Confirmer la Commande</>
                    )}
                  </button>

                  <div className="mt-4 space-y-2">
                    <div className="flex items-center gap-2 text-xs text-on-surface-variant">
                      <Shield className="w-3.5 h-3.5 text-primary" />
                      <span>Vos données sont protégées</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-on-surface-variant">
                      <Truck className="w-3.5 h-3.5 text-primary" />
                      <span>Livraison dans toute l&apos;Algérie</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </form>

          {settings.confirmationNote && (
            <p className="text-xs text-center text-on-surface-variant mt-8 max-w-lg mx-auto">
              {settings.confirmationNote}
            </p>
          )}
        </div>
      </main>
    </>
  );
}
