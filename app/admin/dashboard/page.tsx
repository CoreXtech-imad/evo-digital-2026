"use client";

import { useState, useEffect } from "react";
import {
  TrendingUp, ShoppingBag, Package,
  DollarSign, Clock, ArrowUpRight, Eye,
} from "lucide-react";
import { formatDZD, formatNumber } from "@/lib/utils";
import Link from "next/link";

const demoStats = {
  totalRevenue: 458500,
  totalOrders: 124,
  pendingOrders: 8,
  totalProducts: 32,
  conversionRate: 68,
  revenueGrowth: 23,
  recentOrders: [
    { id: "1", orderNumber: "EVO-ABC123", customer: { name: "Karim B.", city: "Alger", wilaya: "Alger", email: "k@ex.com", phone: "0555", address: "Rue" }, total: 3800, status: "confirmed", createdAt: new Date(Date.now() - 3600000).toISOString(), items: [], subtotal: 3800, paymentMethod: "cod" as const, updatedAt: new Date().toISOString() },
    { id: "2", orderNumber: "EVO-DEF456", customer: { name: "Sara L.", city: "Oran", wilaya: "Oran", email: "s@ex.com", phone: "0666", address: "Rue" }, total: 1200, status: "pending", createdAt: new Date(Date.now() - 7200000).toISOString(), items: [], subtotal: 1200, paymentMethod: "cod" as const, updatedAt: new Date().toISOString() },
    { id: "3", orderNumber: "EVO-GHI789", customer: { name: "Anis T.", city: "Constantine", wilaya: "Constantine", email: "a@ex.com", phone: "0777", address: "Rue" }, total: 4500, status: "delivered", createdAt: new Date(Date.now() - 86400000).toISOString(), items: [], subtotal: 4500, paymentMethod: "cod" as const, updatedAt: new Date().toISOString() },
  ],
  revenueByDay: [
    { date: "Lun", revenue: 45000 },
    { date: "Mar", revenue: 72000 },
    { date: "Mer", revenue: 38000 },
    { date: "Jeu", revenue: 91000 },
    { date: "Ven", revenue: 64000 },
    { date: "Sam", revenue: 120000 },
    { date: "Dim", revenue: 28500 },
  ],
};

const statusColors: Record<string, string> = {
  pending: "text-yellow-400 bg-yellow-400/10",
  confirmed: "text-blue-400 bg-blue-400/10",
  processing: "text-purple-400 bg-purple-400/10",
  delivered: "text-green-400 bg-green-400/10",
  cancelled: "text-error bg-error/10",
};

const statusLabels: Record<string, string> = {
  pending: "En attente",
  confirmed: "Confirmée",
  processing: "En cours",
  delivered: "Livrée",
  cancelled: "Annulée",
};

export default function AdminDashboard() {
  const [stats, setStats] = useState(demoStats);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const adminKey = sessionStorage.getItem("evo_admin_key") || "";
        const [ordersRes, productsRes] = await Promise.allSettled([
          fetch("/api/orders", { headers: { Authorization: `Bearer ${adminKey}` } }),
          fetch("/api/products"),
        ]);

        let orders: any[] = [];
        let products: any[] = [];

        if (ordersRes.status === "fulfilled" && ordersRes.value.ok) {
          const d = await ordersRes.value.json();
          orders = d.orders || [];
        }
        if (productsRes.status === "fulfilled" && productsRes.value.ok) {
          const d = await productsRes.value.json();
          products = d.products || [];
        }

        if (orders.length > 0 || products.length > 0) {
          const confirmed = orders.filter((o: any) => ["confirmed", "processing", "delivered"].includes(o.status));
          const pending = orders.filter((o: any) => o.status === "pending");
          const totalRevenue = confirmed.reduce((s: number, o: any) => s + (o.total || 0), 0);

          setStats({
            totalRevenue,
            totalOrders: orders.length,
            pendingOrders: pending.length,
            totalProducts: products.length,
            conversionRate: orders.length > 0 ? Math.round((confirmed.length / orders.length) * 100) : 0,
            revenueGrowth: 23,
            recentOrders: orders.slice(0, 5),
            revenueByDay: demoStats.revenueByDay, // Keep demo chart data
          });
        }
      } catch {
        // Keep demo stats
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const maxRevenue = Math.max(...stats.revenueByDay.map((d) => d.revenue));

  const statCards = [
    {
      label: "Revenus Total",
      value: formatDZD(stats.totalRevenue),
      icon: DollarSign,
      color: "#61cdff",
      change: `+${stats.revenueGrowth}% ce mois`,
      positive: true,
    },
    {
      label: "Commandes",
      value: formatNumber(stats.totalOrders),
      icon: ShoppingBag,
      color: "#aa8bff",
      change: `${stats.pendingOrders} en attente`,
      positive: stats.pendingOrders === 0,
    },
    {
      label: "Produits",
      value: formatNumber(stats.totalProducts),
      icon: Package,
      color: "#34d399",
      change: "En catalogue",
      positive: true,
    },
    {
      label: "Taux Conv.",
      value: `${stats.conversionRate}%`,
      icon: TrendingUp,
      color: "#fbbf24",
      change: "Commandes/visites",
      positive: true,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black font-headline">Dashboard</h1>
          <p className="text-on-surface-variant text-sm mt-1">
            Vue d&apos;ensemble de votre boutique
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-on-surface-variant">
          <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          En ligne
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {statCards.map(({ label, value, icon: Icon, color, change, positive }) => (
          <div
            key={label}
            className="glass-card rounded-2xl p-5 border border-white/5 hover:border-white/10 transition-all group"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${color}15` }}>
                <Icon className="w-5 h-5" style={{ color }} />
              </div>
              <ArrowUpRight className="w-4 h-4 text-on-surface-variant group-hover:text-primary transition-colors" />
            </div>
            <div className="text-2xl font-black font-headline mb-1" style={{ color }}>{value}</div>
            <div className="text-sm text-on-surface-variant">{label}</div>
            <div className={`text-xs mt-1 ${positive ? "text-green-400" : "text-yellow-400"}`}>{change}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Revenue chart */}
        <div className="xl:col-span-2 glass-card rounded-2xl p-6 border border-white/5">
          <h2 className="font-bold font-headline mb-6 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            Revenus — 7 derniers jours
          </h2>
          <div className="flex items-end gap-3 h-40">
            {stats.revenueByDay.map(({ date, revenue }) => {
              const height = (revenue / maxRevenue) * 100;
              return (
                <div key={date} className="flex-1 flex flex-col items-center gap-2 group">
                  <div className="w-full relative" style={{ height: 120 }}>
                    <div
                      className="absolute bottom-0 w-full rounded-t-lg transition-all duration-500 group-hover:brightness-125 cursor-default"
                      style={{ height: `${height}%`, background: "linear-gradient(to top, #61cdff, #aa8bff)", opacity: 0.8 }}
                      title={formatDZD(revenue)}
                    />
                  </div>
                  <span className="text-xs text-on-surface-variant">{date}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick actions */}
        <div className="glass-card rounded-2xl p-6 border border-white/5">
          <h2 className="font-bold font-headline mb-4">Actions Rapides</h2>
          <div className="space-y-3">
            {[
              { href: "/admin/products", label: "Ajouter un produit", icon: Package, color: "#61cdff" },
              { href: "/admin/orders", label: `Commandes en attente (${stats.pendingOrders})`, icon: Clock, color: "#fbbf24" },
              { href: "/shop", label: "Voir la boutique", icon: Eye, color: "#aa8bff" },
            ].map(({ href, label, icon: Icon, color }) => (
              <Link
                key={href}
                href={href}
                className="flex items-center gap-3 p-3 rounded-xl bg-surface-container hover:bg-surface-container-high transition-all group"
              >
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${color}15` }}>
                  <Icon className="w-4 h-4" style={{ color }} />
                </div>
                <span className="text-sm font-medium group-hover:text-primary transition-colors">{label}</span>
                <ArrowUpRight className="w-4 h-4 text-on-surface-variant ml-auto" />
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Recent orders */}
      <div className="glass-card rounded-2xl border border-white/5 overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-white/5">
          <h2 className="font-bold font-headline flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-primary" />
            Commandes Récentes
          </h2>
          <Link href="/admin/orders" className="text-xs text-primary hover:text-secondary transition-colors">
            Voir tout →
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-white/5">
              <tr>
                {["Commande", "Client", "Ville", "Total", "Statut", "Date"].map((h) => (
                  <th key={h} className="px-6 py-3 text-left text-xs font-semibold text-on-surface-variant uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {stats.recentOrders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-on-surface-variant">
                    <ShoppingBag className="w-8 h-8 mx-auto mb-2 opacity-40" />
                    <p>Aucune commande pour le moment</p>
                  </td>
                </tr>
              ) : (
                stats.recentOrders.map((order: any) => (
                  <tr key={order.id} className="border-b border-white/5 hover:bg-surface-container transition-colors">
                    <td className="px-6 py-4">
                      <span className="text-sm font-mono text-primary">{order.orderNumber}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-medium">{order.customer?.name || "—"}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-on-surface-variant">{order.customer?.city || "—"}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-bold">{formatDZD(order.total)}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${statusColors[order.status] || ""}`}>
                        {statusLabels[order.status] || order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-on-surface-variant">
                        {new Date(order.createdAt).toLocaleDateString("fr-DZ")}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
