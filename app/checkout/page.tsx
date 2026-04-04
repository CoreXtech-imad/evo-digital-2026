"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useCart } from "@/hooks/useCart";
import { formatDZD } from "@/lib/utils";
import Navbar from "@/components/layout/Navbar";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import {
  User, Phone, Mail, MapPin, MessageSquare,
  ShoppingBag, Shield, Truck, ChevronRight, Loader2,
} from "lucide-react";
import { ALGERIA_WILAYAS } from "@/types";
import { cn } from "@/lib/utils";

const checkoutSchema = z.object({
  name: z.string().min(3, "Le nom doit contenir au moins 3 caractères"),
  email: z.string().email("Email invalide"),
  phone: z
    .string()
    .min(9, "Numéro de téléphone invalide")
    .regex(/^[0-9+\s-]+$/, "Numéro invalide"),
  wilaya: z.string().min(1, "Veuillez sélectionner votre wilaya"),
  city: z.string().min(2, "Veuillez entrer votre ville"),
  address: z.string().min(10, "Adresse trop courte"),
  notes: z.string().optional(),
});

type CheckoutForm = z.infer<typeof checkoutSchema>;

export default function CheckoutPage() {
  const { items, total, clearCart } = useCart();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckoutForm>({
    resolver: zodResolver(checkoutSchema),
  });

  const onSubmit = async (data: CheckoutForm) => {
    if (items.length === 0) {
      toast.error("Votre panier est vide");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer: data,
          items: items.map((i) => ({
            productId: i.product.id,
            productName: i.product.name,
            productImage: i.product.images[0] || "",
            price: i.product.price,
            quantity: i.quantity,
          })),
          subtotal: total,
          total,
          paymentMethod: "cod",
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
            <p className="text-on-surface-variant mb-6">
              Ajoutez des produits avant de passer commande.
            </p>
            <Link href="/shop" className="btn-primary">
              Explorer la Boutique
            </Link>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="pt-24 min-h-screen">
        {/* Background orbs */}
        <div className="evo-orb" style={{ width: 400, height: 400, top: "10%", right: "-5%", background: "radial-gradient(circle, rgba(97,205,255,0.06) 0%, transparent 70%)" }} />

        <div className="max-w-screen-xl mx-auto px-6 py-8">
          {/* Breadcrumb */}
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

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Form */}
              <div className="lg:col-span-2 space-y-6">
                {/* Personal info */}
                <div className="glass-card rounded-2xl p-6 border border-white/5">
                  <h2 className="font-bold font-headline mb-5 flex items-center gap-2">
                    <User className="w-5 h-5 text-primary" />
                    Informations Personnelles
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-on-surface-variant mb-1.5">
                        Nom complet *
                      </label>
                      <input
                        {...register("name")}
                        placeholder="Ahmed Benali"
                        className={cn("input-field", errors.name && "border-error/50")}
                      />
                      {errors.name && (
                        <p className="text-error text-xs mt-1">{errors.name.message}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-on-surface-variant mb-1.5">
                        Email *
                      </label>
                      <input
                        {...register("email")}
                        type="email"
                        placeholder="ahmed@example.com"
                        className={cn("input-field", errors.email && "border-error/50")}
                      />
                      {errors.email && (
                        <p className="text-error text-xs mt-1">{errors.email.message}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-on-surface-variant mb-1.5">
                        Téléphone *
                      </label>
                      <input
                        {...register("phone")}
                        placeholder="+213 XXX XXX XXX"
                        className={cn("input-field", errors.phone && "border-error/50")}
                      />
                      {errors.phone && (
                        <p className="text-error text-xs mt-1">{errors.phone.message}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Delivery info */}
                <div className="glass-card rounded-2xl p-6 border border-white/5">
                  <h2 className="font-bold font-headline mb-5 flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-primary" />
                    Adresse de Livraison
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-on-surface-variant mb-1.5">
                        Wilaya *
                      </label>
                      <select
                        {...register("wilaya")}
                        className={cn("input-field", errors.wilaya && "border-error/50")}
                      >
                        <option value="" className="bg-surface-container">Sélectionnez votre wilaya</option>
                        {ALGERIA_WILAYAS.map((w) => (
                          <option key={w} value={w} className="bg-surface-container">{w}</option>
                        ))}
                      </select>
                      {errors.wilaya && (
                        <p className="text-error text-xs mt-1">{errors.wilaya.message}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-on-surface-variant mb-1.5">
                        Ville *
                      </label>
                      <input
                        {...register("city")}
                        placeholder="Alger"
                        className={cn("input-field", errors.city && "border-error/50")}
                      />
                      {errors.city && (
                        <p className="text-error text-xs mt-1">{errors.city.message}</p>
                      )}
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-on-surface-variant mb-1.5">
                        Adresse complète *
                      </label>
                      <input
                        {...register("address")}
                        placeholder="Numéro, Rue, Quartier..."
                        className={cn("input-field", errors.address && "border-error/50")}
                      />
                      {errors.address && (
                        <p className="text-error text-xs mt-1">{errors.address.message}</p>
                      )}
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-on-surface-variant mb-1.5">
                        Notes (optionnel)
                      </label>
                      <textarea
                        {...register("notes")}
                        placeholder="Instructions spéciales, préférences de livraison..."
                        rows={3}
                        className="input-field resize-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Payment */}
                <div className="glass-card rounded-2xl p-6 border border-white/5">
                  <h2 className="font-bold font-headline mb-5 flex items-center gap-2">
                    <Shield className="w-5 h-5 text-primary" />
                    Mode de Paiement
                  </h2>
                  <div className="flex items-center gap-4 p-4 rounded-xl bg-primary/5 border border-primary/20">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                      <span className="text-2xl">💵</span>
                    </div>
                    <div>
                      <div className="font-bold font-headline">Paiement à la livraison</div>
                      <div className="text-sm text-on-surface-variant">
                        Cash on Delivery (COD) — Payez en DZD à la réception
                      </div>
                    </div>
                    <div className="ml-auto w-5 h-5 rounded-full border-2 border-primary flex items-center justify-center">
                      <div className="w-2.5 h-2.5 rounded-full bg-primary" />
                    </div>
                  </div>
                </div>
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
                          <Image
                            src={item.product.images[0] || "/images/placeholder.svg"}
                            alt={item.product.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold font-headline line-clamp-2 leading-tight">
                            {item.product.name}
                          </p>
                          <div className="flex items-center justify-between mt-1">
                            <span className="text-xs text-on-surface-variant">×{item.quantity}</span>
                            <span className="text-sm font-bold text-primary">
                              {formatDZD(item.product.price * item.quantity)}
                            </span>
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
                      <span className="text-green-400 font-semibold">Gratuite</span>
                    </div>
                    <div className="flex justify-between font-bold text-lg pt-2 border-t border-white/5">
                      <span>Total</span>
                      <span className="gradient-text font-black">{formatDZD(total)}</span>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary w-full flex items-center justify-center gap-2 py-4 text-base disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Traitement...
                      </>
                    ) : (
                      <>
                        <Truck className="w-5 h-5" />
                        Confirmer la Commande
                      </>
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
        </div>
      </main>
    </>
  );
}
