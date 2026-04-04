"use client";

import { useState, useEffect } from "react";
import {
  Search, Eye, ShoppingBag,
  Phone, Mail, MapPin, Package, X, CheckCircle,
  Clock, Truck, XCircle, RefreshCw, Loader2, Download,
} from "lucide-react";
import { Order, OrderStatus } from "@/types";
import { formatDZD } from "@/lib/utils";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";

const demoOrders: Order[] = [
  {
    id: "ord-1", orderNumber: "EVO-M8X2-K9PQ",
    items: [{ productId: "demo-1", productName: "Dashboard Admin Pro", productImage: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=200", price: 2500, quantity: 1 }],
    customer: { name: "Karim Benali", email: "karim@example.com", phone: "0555 123 456", city: "Alger", wilaya: "Alger", address: "12 Rue Didouche Mourad, Alger Centre" },
    subtotal: 2500, total: 2500, status: "confirmed", paymentMethod: "cod",
    createdAt: new Date(Date.now() - 3600000).toISOString(), updatedAt: new Date().toISOString(),
  },
  {
    id: "ord-2", orderNumber: "EVO-N4Y7-W2RT",
    items: [{ productId: "demo-2", productName: "Pack Logiciels Productivité", productImage: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=200", price: 3800, quantity: 1 }],
    customer: { name: "Sara Lakhdar", email: "sara@example.com", phone: "0661 987 654", city: "Oran", wilaya: "Oran", address: "5 Avenue Khemisti, Oran" },
    subtotal: 3800, total: 3800, status: "pending", paymentMethod: "cod",
    createdAt: new Date(Date.now() - 7200000).toISOString(), updatedAt: new Date().toISOString(),
  },
  {
    id: "ord-3", orderNumber: "EVO-P6Z1-L5MN",
    items: [
      { productId: "demo-3", productName: "Ebook Marketing Digital", productImage: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=200", price: 1200, quantity: 1 },
      { productId: "demo-4", productName: "UI Kit Figma Premium", productImage: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=200", price: 1800, quantity: 1 },
    ],
    customer: { name: "Anis Touati", email: "anis@example.com", phone: "0770 456 789", city: "Constantine", wilaya: "Constantine", address: "Rue Ben M'hidi, Constantine" },
    subtotal: 3000, total: 3000, status: "delivered", paymentMethod: "cod",
    createdAt: new Date(Date.now() - 86400000).toISOString(), updatedAt: new Date().toISOString(),
  },
];

const STATUS_CONFIG: Record<OrderStatus, { label: string; color: string; icon: any }> = {
  pending: { label: "En attente", color: "text-yellow-400 bg-yellow-400/10 border-yellow-400/20", icon: Clock },
  confirmed: { label: "Confirmée", color: "text-blue-400 bg-blue-400/10 border-blue-400/20", icon: CheckCircle },
  processing: { label: "En traitement", color: "text-purple-400 bg-purple-400/10 border-purple-400/20", icon: RefreshCw },
  delivered: { label: "Livrée", color: "text-green-400 bg-green-400/10 border-green-400/20", icon: Truck },
  cancelled: { label: "Annulée", color: "text-error bg-error/10 border-error/20", icon: XCircle },
};

const STATUS_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  pending: ["confirmed", "cancelled"],
  confirmed: ["processing", "cancelled"],
  processing: ["delivered", "cancelled"],
  delivered: [],
  cancelled: [],
};

function getAdminKey(): string {
  if (typeof window === "undefined") return "";
  return sessionStorage.getItem("evo_admin_key") || "";
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>(demoOrders);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const adminKey = getAdminKey();
      const res = await fetch("/api/orders", {
        headers: { Authorization: `Bearer ${adminKey}` },
      });
      if (res.ok) {
        const data = await res.json();
        if (data.orders?.length > 0) {
          setOrders(data.orders);
        }
      }
    } catch {
      // Keep demo orders
    } finally {
      setLoading(false);
    }
  };

  const filtered = orders
    .filter((o) => !statusFilter || o.status === statusFilter)
    .filter(
      (o) =>
        !search ||
        o.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
        o.customer.name.toLowerCase().includes(search.toLowerCase()) ||
        o.customer.phone.includes(search)
    );

  const updateStatus = async (orderId: string, newStatus: OrderStatus) => {
    setUpdatingStatus(true);
    try {
      const adminKey = getAdminKey();
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${adminKey}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) throw new Error();
    } catch {
      // Update locally even if API fails
    }

    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? { ...o, status: newStatus, updatedAt: new Date().toISOString() }
          : o
      )
    );
    if (selectedOrder?.id === orderId) {
      setSelectedOrder((prev) => prev ? { ...prev, status: newStatus } : null);
    }
    toast.success(`Statut mis à jour: ${STATUS_CONFIG[newStatus].label}`);
    setUpdatingStatus(false);
  };

  const stats = {
    total: orders.length,
    pending: orders.filter((o) => o.status === "pending").length,
    confirmed: orders.filter((o) => o.status === "confirmed").length,
    delivered: orders.filter((o) => o.status === "delivered").length,
    revenue: orders
      .filter((o) => ["confirmed", "processing", "delivered"].includes(o.status))
      .reduce((s, o) => s + o.total, 0),
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black font-headline">Commandes</h1>
          <p className="text-on-surface-variant text-sm mt-1">
            Gérez et suivez toutes les commandes
          </p>
        </div>
        <button
          onClick={fetchOrders}
          disabled={loading}
          className="btn-secondary flex items-center gap-2 py-2.5 px-4 text-sm"
        >
          <RefreshCw className={cn("w-4 h-4", loading && "animate-spin")} />
          Actualiser
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
          { label: "Total", value: stats.total, color: "#61cdff" },
          { label: "En attente", value: stats.pending, color: "#fbbf24" },
          { label: "Confirmées", value: stats.confirmed, color: "#60a5fa" },
          { label: "Livrées", value: stats.delivered, color: "#34d399" },
          { label: "Revenus", value: formatDZD(stats.revenue), color: "#aa8bff" },
        ].map(({ label, value, color }) => (
          <div key={label} className="glass-card rounded-xl p-4 border border-white/5">
            <div className="text-2xl font-black font-headline" style={{ color }}>{value}</div>
            <div className="text-xs text-on-surface-variant mt-1">{label}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
          <input
            type="text"
            placeholder="Numéro, nom, téléphone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field pl-10"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {["", "pending", "confirmed", "processing", "delivered", "cancelled"].map((s) => {
            const config = s ? STATUS_CONFIG[s as OrderStatus] : null;
            return (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={cn(
                  "px-3 py-2 rounded-xl text-xs font-medium transition-all",
                  statusFilter === s
                    ? "hero-gradient text-on-primary"
                    : "bg-surface-container text-on-surface-variant hover:bg-surface-container-high"
                )}
              >
                {config ? config.label : "Toutes"}
              </button>
            );
          })}
        </div>
      </div>

      {/* Orders table */}
      <div className="glass-card rounded-2xl border border-white/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-white/5 bg-surface-container/50">
              <tr>
                {["Commande", "Client", "Produits", "Total", "Statut", "Date", "Actions"].map((h) => (
                  <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-on-surface-variant uppercase tracking-wide whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center text-on-surface-variant">
                    <ShoppingBag className="w-8 h-8 mx-auto mb-2 opacity-40" />
                    <p>Aucune commande trouvée</p>
                  </td>
                </tr>
              ) : (
                filtered.map((order) => {
                  const statusConf = STATUS_CONFIG[order.status];
                  const StatusIcon = statusConf.icon;
                  return (
                    <tr key={order.id} className="border-b border-white/5 hover:bg-surface-container/30 transition-colors group">
                      <td className="px-5 py-4">
                        <span className="text-sm font-mono text-primary font-bold">{order.orderNumber}</span>
                      </td>
                      <td className="px-5 py-4">
                        <div>
                          <p className="text-sm font-medium">{order.customer.name}</p>
                          <p className="text-xs text-on-surface-variant">{order.customer.wilaya}</p>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <span className="text-sm text-on-surface-variant">
                          {order.items.length} produit{order.items.length > 1 ? "s" : ""}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <span className="font-bold text-sm">{formatDZD(order.total)}</span>
                      </td>
                      <td className="px-5 py-4">
                        <span className={cn("px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1 w-fit border", statusConf.color)}>
                          <StatusIcon className="w-3 h-3" />
                          {statusConf.label}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <span className="text-xs text-on-surface-variant whitespace-nowrap">
                          {new Date(order.createdAt).toLocaleDateString("fr-DZ")}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-primary/10 text-primary hover:bg-primary/20 transition-all opacity-0 group-hover:opacity-100"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          Détails
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order detail drawer */}
      {selectedOrder && (
        <>
          <div className="fixed inset-0 z-50 bg-black/60" onClick={() => setSelectedOrder(null)} />
          <div
            className="fixed right-0 top-0 h-full w-full max-w-lg z-50 overflow-y-auto"
            style={{ background: "rgba(14,14,14,0.98)", backdropFilter: "blur(24px)", borderLeft: "1px solid rgba(255,255,255,0.06)" }}
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="font-black font-headline text-lg">{selectedOrder.orderNumber}</h2>
                  <span className={cn("px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1 w-fit border mt-2", STATUS_CONFIG[selectedOrder.status].color)}>
                    {STATUS_CONFIG[selectedOrder.status].label}
                  </span>
                </div>
                <button onClick={() => setSelectedOrder(null)} className="p-2 rounded-xl hover:bg-white/5 text-on-surface-variant hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Customer */}
              <div className="glass-card rounded-xl p-4 border border-white/5 mb-4">
                <h3 className="font-bold font-headline text-sm mb-3">Client</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-on-surface-variant">
                    <Package className="w-4 h-4 text-primary" />
                    <span className="font-medium text-white">{selectedOrder.customer.name}</span>
                  </div>
                  <div className="flex items-center gap-2 text-on-surface-variant">
                    <Mail className="w-4 h-4 text-primary" />
                    <a href={`mailto:${selectedOrder.customer.email}`} className="hover:text-primary transition-colors">{selectedOrder.customer.email}</a>
                  </div>
                  <div className="flex items-center gap-2 text-on-surface-variant">
                    <Phone className="w-4 h-4 text-primary" />
                    <a href={`tel:${selectedOrder.customer.phone}`} className="hover:text-primary transition-colors">{selectedOrder.customer.phone}</a>
                  </div>
                  <div className="flex items-start gap-2 text-on-surface-variant">
                    <MapPin className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    <span>{selectedOrder.customer.address}, {selectedOrder.customer.city}, {selectedOrder.customer.wilaya}</span>
                  </div>
                </div>
              </div>

              {/* Items */}
              <div className="glass-card rounded-xl p-4 border border-white/5 mb-4">
                <h3 className="font-bold font-headline text-sm mb-3">Produits</h3>
                <div className="space-y-3">
                  {selectedOrder.items.map((item, i) => (
                    <div key={i} className="flex justify-between items-center text-sm">
                      <div>
                        <p className="font-medium">{item.productName}</p>
                        <p className="text-xs text-on-surface-variant">×{item.quantity}</p>
                      </div>
                      <span className="font-bold">{formatDZD(item.price * item.quantity)}</span>
                    </div>
                  ))}
                  <div className="border-t border-white/5 pt-3 flex justify-between font-bold">
                    <span>Total</span>
                    <span className="gradient-text">{formatDZD(selectedOrder.total)}</span>
                  </div>
                </div>
              </div>

              {/* Download links */}
              {selectedOrder.downloadLinks && selectedOrder.downloadLinks.length > 0 && (
                <div className="glass-card rounded-xl p-4 border border-white/5 mb-4">
                  <h3 className="font-bold font-headline text-sm mb-3 flex items-center gap-2">
                    <Download className="w-4 h-4 text-primary" />
                    Téléchargements
                  </h3>
                  <div className="space-y-2">
                    {selectedOrder.downloadLinks.map((dl, i) => (
                      <div key={i} className="flex justify-between items-center text-sm p-2 rounded-lg bg-surface-container">
                        <span className="text-on-surface-variant">{dl.productName}</span>
                        <span className="text-xs text-primary font-mono">{dl.downloadCount}/{dl.maxDownloads}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Status actions */}
              {STATUS_TRANSITIONS[selectedOrder.status].length > 0 && (
                <div className="glass-card rounded-xl p-4 border border-white/5 mb-4">
                  <h3 className="font-bold font-headline text-sm mb-3">Changer le statut</h3>
                  <div className="flex gap-2 flex-wrap">
                    {STATUS_TRANSITIONS[selectedOrder.status].map((nextStatus) => {
                      const conf = STATUS_CONFIG[nextStatus];
                      return (
                        <button
                          key={nextStatus}
                          onClick={() => updateStatus(selectedOrder.id, nextStatus)}
                          disabled={updatingStatus}
                          className={cn(
                            "px-4 py-2 rounded-xl text-sm font-bold border transition-all hover:brightness-110 disabled:opacity-50 flex items-center gap-2",
                            conf.color
                          )}
                        >
                          {updatingStatus && <Loader2 className="w-3 h-3 animate-spin" />}
                          → {conf.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* WhatsApp */}
              <a
                href={`https://wa.me/${selectedOrder.customer.phone.replace(/\D/g, "")}?text=Bonjour ${selectedOrder.customer.name}, concernant votre commande ${selectedOrder.orderNumber}...`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-green-500/10 text-green-400 border border-green-500/20 hover:bg-green-500/20 transition-all text-sm font-bold"
              >
                <Phone className="w-4 h-4" />
                Contacter via WhatsApp
              </a>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
