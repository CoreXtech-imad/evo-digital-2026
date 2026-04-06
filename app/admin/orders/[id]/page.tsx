"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft, CheckCircle, Clock, Truck, XCircle, RefreshCw,
  Phone, Mail, MapPin, Package, Download, ExternalLink,
  Copy, ChevronRight,
} from "lucide-react";
import { Order, OrderStatus } from "@/types";
import { formatDZD } from "@/lib/utils";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";

// Demo order for display — in production fetched from Firestore
const demoOrder: Order = {
  id: "ord-1",
  orderNumber: "EVO-M8X2-K9PQ",
  items: [
    {
      productId: "demo-1",
      productName: "Dashboard Admin Pro — Template Next.js",
      productImage: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=200&auto=format",
      price: 2500,
      quantity: 1,
    },
    {
      productId: "demo-3",
      productName: "Ebook Marketing Digital Algérie",
      productImage: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=200&auto=format",
      price: 1200,
      quantity: 1,
    },
  ],
  customer: {
    name: "Karim Benali",
    email: "karim@example.com",
    phone: "0555 123 456",
    city: "Alger",
    wilaya: "Alger",
    address: "12 Rue Didouche Mourad, Alger Centre",
    notes: "Appelez avant livraison svp.",
  },
  subtotal: 3700,
  total: 3700,
  status: "confirmed",
  paymentMethod: "cod",
  downloadLinks: [
    {
      productId: "demo-1",
      productName: "Dashboard Admin Pro",
      token: "abc123def456abc123def456abc12345",
      expiresAt: new Date(Date.now() + 72 * 3600 * 1000).toISOString(),
      downloadCount: 1,
      maxDownloads: 3,
    },
  ],
  createdAt: new Date(Date.now() - 3600000).toISOString(),
  updatedAt: new Date().toISOString(),
};

const STATUS_CONFIG: Record<OrderStatus, { label: string; color: string; icon: any; bgColor: string }> = {
  pending: { label: "En attente", color: "text-yellow-400", bgColor: "bg-yellow-400/10 border-yellow-400/20", icon: Clock },
  confirmed: { label: "Confirmée", color: "text-blue-400", bgColor: "bg-blue-400/10 border-blue-400/20", icon: CheckCircle },
  processing: { label: "En traitement", color: "text-purple-400", bgColor: "bg-purple-400/10 border-purple-400/20", icon: RefreshCw },
  delivered: { label: "Livrée", color: "text-green-400", bgColor: "bg-green-400/10 border-green-400/20", icon: Truck },
  cancelled: { label: "Annulée", color: "text-red-400", bgColor: "bg-red-400/10 border-red-400/20", icon: XCircle },
};

const STATUS_FLOW: OrderStatus[] = ["pending", "confirmed", "processing", "delivered"];

const STATUS_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  pending: ["confirmed", "cancelled"],
  confirmed: ["processing", "cancelled"],
  processing: ["delivered", "cancelled"],
  delivered: [],
  cancelled: ["pending"],
};

export default function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [order, setOrder] = useState<Order>(demoOrder);
  const [updating, setUpdating] = useState(false);

  const statusConf = STATUS_CONFIG[order.status];
  const StatusIcon = statusConf.icon;

  const updateStatus = async (newStatus: OrderStatus) => {
    setUpdating(true);
    try {
      // In production: call PATCH /api/admin/orders/[id]
      await new Promise((r) => setTimeout(r, 600));
      setOrder((prev) => ({
        ...prev,
        status: newStatus,
        updatedAt: new Date().toISOString(),
      }));
      toast.success(`Statut mis à jour: ${STATUS_CONFIG[newStatus].label}`);
    } catch {
      toast.error("Erreur lors de la mise à jour");
    } finally {
      setUpdating(false);
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copié!`);
  };

  const currentStep = STATUS_FLOW.indexOf(order.status);

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Back + Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <Link
            href="/admin/orders"
            className="flex items-center gap-1.5 text-sm text-on-surface-variant hover:text-primary transition-colors mb-3"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour aux commandes
          </Link>
          <h1 className="text-2xl font-black font-headline flex items-center gap-3">
            {order.orderNumber}
            <span
              className={cn(
                "px-3 py-1 rounded-full text-xs font-bold border flex items-center gap-1.5",
                statusConf.bgColor,
                statusConf.color
              )}
            >
              <StatusIcon className="w-3.5 h-3.5" />
              {statusConf.label}
            </span>
          </h1>
          <p className="text-on-surface-variant text-sm mt-1">
            Commande du{" "}
            {new Date(order.createdAt).toLocaleDateString("fr-DZ", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>

        <div className="flex gap-2">
          <a
            href={`https://wa.me/${(order.customer.phone ?? "").replace(/\D/g, "")}?text=Bonjour ${order.customer.name ?? ""}, concernant votre commande ${order.orderNumber} sur Evo Digital...`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-green-500/10 text-green-400 border border-green-500/20 hover:bg-green-500/20 transition-all text-sm font-bold"
          >
            <Phone className="w-4 h-4" />
            WhatsApp
          </a>
          <a
            href={`mailto:${order.customer.email}?subject=Votre commande ${order.orderNumber} — Evo Digital`}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 transition-all text-sm font-bold"
          >
            <Mail className="w-4 h-4" />
            Email
          </a>
        </div>
      </div>

      {/* Progress bar */}
      {order.status !== "cancelled" && (
        <div className="glass-card rounded-2xl p-6 border border-white/5">
          <h2 className="font-bold font-headline text-sm mb-5 text-on-surface-variant uppercase tracking-wide">
            Progression de la commande
          </h2>
          <div className="flex items-center">
            {STATUS_FLOW.map((step, i) => {
              const conf = STATUS_CONFIG[step];
              const StepIcon = conf.icon;
              const isCompleted = i <= currentStep;
              const isCurrent = i === currentStep;
              return (
                <div key={step} className="flex items-center flex-1">
                  <div className="flex flex-col items-center">
                    <div
                      className={cn(
                        "w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all",
                        isCompleted
                          ? "border-primary bg-primary/20"
                          : "border-white/10 bg-surface-container",
                        isCurrent && "shadow-neon-primary"
                      )}
                    >
                      <StepIcon
                        className={cn(
                          "w-4 h-4",
                          isCompleted ? "text-primary" : "text-on-surface-variant"
                        )}
                      />
                    </div>
                    <span
                      className={cn(
                        "text-xs mt-2 font-medium whitespace-nowrap",
                        isCompleted ? "text-primary" : "text-on-surface-variant"
                      )}
                    >
                      {conf.label}
                    </span>
                  </div>
                  {i < STATUS_FLOW.length - 1 && (
                    <div
                      className={cn(
                        "flex-1 h-0.5 mx-2 transition-all",
                        i < currentStep ? "bg-primary" : "bg-white/10"
                      )}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Products */}
          <div className="glass-card rounded-2xl border border-white/5 overflow-hidden">
            <div className="flex items-center gap-2 px-6 py-4 border-b border-white/5 bg-surface-container/30">
              <Package className="w-4 h-4 text-primary" />
              <h2 className="font-bold font-headline text-sm">
                Produits ({order.items.length})
              </h2>
            </div>
            <div className="divide-y divide-white/5">
              {order.items.map((item, i) => {
                const dlLink = order.downloadLinks?.find(
                  (l) => l.productId === item.productId
                );
                return (
                  <div key={i} className="flex items-start gap-4 p-5">
                    <div className="relative w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 bg-surface-container-high">
                      <Image
                        src={item.productImage || "/images/placeholder.svg"}
                        alt={item.productName}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold font-headline text-sm">
                        {item.productName}
                      </p>
                      <p className="text-xs text-on-surface-variant mt-0.5">
                        Quantité: {item.quantity} · {formatDZD(item.price)} / unité
                      </p>
                      {dlLink && (
                        <div className="mt-2 flex items-center gap-2">
                          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-primary/10 border border-primary/20 text-xs text-primary">
                            <Download className="w-3 h-3" />
                            <span>{dlLink.downloadCount}/{dlLink.maxDownloads} téléchargements</span>
                          </div>
                          <button
                            onClick={() =>
                              copyToClipboard(
                                `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/download?token=${dlLink.token}&orderId=${order.id}&productId=${item.productId}`,
                                "Lien"
                              )
                            }
                            className="flex items-center gap-1 text-xs text-on-surface-variant hover:text-primary transition-colors"
                          >
                            <Copy className="w-3 h-3" />
                            Copier lien
                          </button>
                        </div>
                      )}
                      {dlLink && (
                        <p className="text-xs text-on-surface-variant mt-1">
                          Expire:{" "}
                          {new Date(dlLink.expiresAt).toLocaleDateString("fr-DZ", {
                            day: "numeric",
                            month: "short",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      )}
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="font-bold">{formatDZD(item.price * item.quantity)}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Total */}
            <div className="px-5 py-4 bg-surface-container/30 border-t border-white/5">
              <div className="flex justify-between items-center text-sm text-on-surface-variant mb-1.5">
                <span>Sous-total</span>
                <span>{formatDZD(order.subtotal)}</span>
              </div>
              <div className="flex justify-between items-center text-sm text-on-surface-variant mb-1.5">
                <span>Mode de paiement</span>
                <span className="font-medium text-white">💵 Cash on Delivery</span>
              </div>
              <div className="flex justify-between items-center font-bold mt-2 pt-2 border-t border-white/5">
                <span className="font-headline">Total</span>
                <span className="gradient-text text-lg">{formatDZD(order.total)}</span>
              </div>
            </div>
          </div>

          {/* Customer notes */}
          {order.customer.notes && (
            <div className="glass-card rounded-2xl p-5 border border-yellow-500/10 bg-yellow-500/5">
              <p className="text-xs font-bold text-yellow-400 uppercase tracking-wide mb-2">
                📝 Note du client
              </p>
              <p className="text-sm text-on-surface-variant">{order.customer.notes}</p>
            </div>
          )}

          {/* Status change */}
          {STATUS_TRANSITIONS[order.status].length > 0 && (
            <div className="glass-card rounded-2xl p-6 border border-white/5">
              <h2 className="font-bold font-headline text-sm mb-4">
                Mettre à jour le statut
              </h2>
              <div className="flex gap-3 flex-wrap">
                {STATUS_TRANSITIONS[order.status].map((nextStatus) => {
                  const conf = STATUS_CONFIG[nextStatus];
                  const NextIcon = conf.icon;
                  return (
                    <button
                      key={nextStatus}
                      onClick={() => updateStatus(nextStatus)}
                      disabled={updating}
                      className={cn(
                        "flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm border transition-all hover:brightness-110 disabled:opacity-50",
                        conf.bgColor,
                        conf.color
                      )}
                    >
                      <NextIcon className="w-4 h-4" />
                      Marquer comme: {conf.label}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Right column */}
        <div className="space-y-6">
          {/* Customer info */}
          <div className="glass-card rounded-2xl border border-white/5 overflow-hidden">
            <div className="flex items-center gap-2 px-5 py-4 border-b border-white/5 bg-surface-container/30">
              <Package className="w-4 h-4 text-primary" />
              <h2 className="font-bold font-headline text-sm">Client</h2>
            </div>
            <div className="p-5 space-y-3">
              <div>
                <p className="font-bold font-headline">{order.customer.name}</p>
              </div>
              <div className="flex items-center gap-2 text-sm text-on-surface-variant group">
                <Mail className="w-4 h-4 text-primary flex-shrink-0" />
                <a
                  href={`mailto:${order.customer.email}`}
                  className="hover:text-primary transition-colors truncate"
                >
                  {order.customer.email}
                </a>
                <button
                  onClick={() => copyToClipboard(order.customer.email ?? "", "Email")}
                  className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Copy className="w-3.5 h-3.5 text-on-surface-variant hover:text-primary" />
                </button>
              </div>
              <div className="flex items-center gap-2 text-sm text-on-surface-variant group">
                <Phone className="w-4 h-4 text-primary flex-shrink-0" />
                <a
                  href={`tel:${order.customer.phone}`}
                  className="hover:text-primary transition-colors"
                >
                  {order.customer.phone}
                </a>
                <button
                  onClick={() => copyToClipboard(order.customer.phone ?? "", "Téléphone")}
                  className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Copy className="w-3.5 h-3.5 text-on-surface-variant hover:text-primary" />
                </button>
              </div>
              <div className="flex items-start gap-2 text-sm text-on-surface-variant">
                <MapPin className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <p>{order.customer.address}</p>
                  <p className="font-medium text-white mt-0.5">
                    {order.customer.city}, {order.customer.wilaya}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Order meta */}
          <div className="glass-card rounded-2xl p-5 border border-white/5 space-y-3">
            <h2 className="font-bold font-headline text-sm">Informations</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-on-surface-variant">ID commande</span>
                <button
                  onClick={() => copyToClipboard(order.id, "ID")}
                  className="font-mono text-xs text-primary hover:text-secondary transition-colors flex items-center gap-1"
                >
                  {order.id.substring(0, 12)}...
                  <Copy className="w-3 h-3" />
                </button>
              </div>
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Créée le</span>
                <span className="text-right text-xs">
                  {new Date(order.createdAt).toLocaleDateString("fr-DZ")}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Mise à jour</span>
                <span className="text-right text-xs">
                  {new Date(order.updatedAt).toLocaleDateString("fr-DZ")}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Paiement</span>
                <span className="font-medium">Cash on Delivery</span>
              </div>
            </div>
          </div>

          {/* Quick actions */}
          <div className="glass-card rounded-2xl p-5 border border-white/5">
            <h2 className="font-bold font-headline text-sm mb-3">Actions rapides</h2>
            <div className="space-y-2">
              <a
                href={`https://wa.me/${(order.customer.phone ?? "").replace(/\D/g, "")}?text=Bonjour ${order.customer.name ?? ""}! Votre commande ${order.orderNumber} a été confirmée. Merci pour votre achat sur Evo Digital! 🎉`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 p-3 rounded-xl bg-green-500/10 text-green-400 border border-green-500/20 hover:bg-green-500/20 transition-all text-sm font-medium"
              >
                <Phone className="w-4 h-4" />
                Envoyer confirmation WhatsApp
                <ExternalLink className="w-3.5 h-3.5 ml-auto" />
              </a>
              <button
                onClick={() => copyToClipboard(order.orderNumber, "Numéro de commande")}
                className="flex items-center gap-2.5 p-3 rounded-xl bg-surface-container text-on-surface-variant hover:bg-surface-container-high hover:text-white transition-all text-sm font-medium w-full"
              >
                <Copy className="w-4 h-4" />
                Copier le numéro de commande
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
