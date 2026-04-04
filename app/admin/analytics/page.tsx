"use client";

import { useState } from "react";
import {
  TrendingUp, Users, ShoppingBag, DollarSign,
  Eye, MousePointer, ArrowUpRight, BarChart3,
  Package, Star, Download,
} from "lucide-react";
import { formatDZD, formatNumber } from "@/lib/utils";

// Demo analytics data
const analyticsData = {
  visitors: 8420,
  visitorsChange: 12.5,
  pageViews: 23150,
  pageViewsChange: 8.3,
  orders: 124,
  ordersChange: 23.1,
  revenue: 458500,
  revenueChange: 18.7,
  conversionRate: 1.47,
  avgOrderValue: 3698,
  topProducts: [
    { name: "Cours Vidéo React.js", sold: 67, revenue: 301500, rating: 5.0 },
    { name: "Pack Logiciels Productivité", sold: 45, revenue: 171000, rating: 4.8 },
    { name: "Dashboard Admin Pro", sold: 38, revenue: 95000, rating: 4.9 },
    { name: "Ebook Marketing Digital", sold: 89, revenue: 106800, rating: 4.7 },
    { name: "Script Python Automation", sold: 52, revenue: 46800, rating: 4.6 },
  ],
  trafficSources: [
    { source: "Organique (Google)", visits: 3200, pct: 38 },
    { source: "Facebook Ads", visits: 2100, pct: 25 },
    { source: "Direct", visits: 1680, pct: 20 },
    { source: "Instagram", visits: 840, pct: 10 },
    { source: "Autres", visits: 600, pct: 7 },
  ],
  revenueByMonth: [
    { month: "Jan", revenue: 28000 },
    { month: "Fév", revenue: 42000 },
    { month: "Mar", revenue: 38000 },
    { month: "Avr", revenue: 65000 },
    { month: "Mai", revenue: 71000 },
    { month: "Jui", revenue: 58000 },
    { month: "Jul", revenue: 92000 },
    { month: "Aoû", revenue: 78000 },
    { month: "Sep", revenue: 115000 },
    { month: "Oct", revenue: 134000 },
    { month: "Nov", revenue: 158000 },
    { month: "Déc", revenue: 180000 },
  ],
  revenueByCategory: [
    { cat: "Cours", pct: 38, color: "#61cdff" },
    { cat: "Logiciels", pct: 24, color: "#aa8bff" },
    { cat: "Templates", pct: 18, color: "#34d399" },
    { cat: "Ebooks", pct: 12, color: "#fbbf24" },
    { cat: "Scripts", pct: 8, color: "#f472b6" },
  ],
};

function StatCard({
  label, value, change, icon: Icon, color, positive,
}: {
  label: string; value: string; change: string; icon: any; color: string; positive: boolean;
}) {
  return (
    <div className="glass-card rounded-2xl p-5 border border-white/5 hover:border-white/10 transition-all group">
      <div className="flex items-center justify-between mb-4">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${color}15` }}>
          <Icon className="w-5 h-5" style={{ color }} />
        </div>
        <span className={`text-xs font-bold flex items-center gap-1 ${positive ? "text-green-400" : "text-error"}`}>
          <ArrowUpRight className={`w-3 h-3 ${!positive && "rotate-90"}`} />
          {change}
        </span>
      </div>
      <div className="text-2xl font-black font-headline mb-1" style={{ color }}>{value}</div>
      <div className="text-sm text-on-surface-variant">{label}</div>
    </div>
  );
}

export default function AdminAnalyticsPage() {
  const [period, setPeriod] = useState<"7d" | "30d" | "90d" | "1y">("30d");
  const maxRevenue = Math.max(...analyticsData.revenueByMonth.map((d) => d.revenue));

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-black font-headline">Analytics</h1>
          <p className="text-on-surface-variant text-sm mt-1">
            Performance et statistiques de votre boutique
          </p>
        </div>

        {/* Period selector */}
        <div className="flex gap-1 p-1 rounded-xl bg-surface-container">
          {(["7d", "30d", "90d", "1y"] as const).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                period === p
                  ? "hero-gradient text-on-primary"
                  : "text-on-surface-variant hover:text-white"
              }`}
            >
              {p === "7d" ? "7 jours" : p === "30d" ? "30 jours" : p === "90d" ? "90 jours" : "1 an"}
            </button>
          ))}
        </div>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard label="Visiteurs" value={formatNumber(analyticsData.visitors)} change={`+${analyticsData.visitorsChange}%`} icon={Users} color="#61cdff" positive />
        <StatCard label="Pages vues" value={formatNumber(analyticsData.pageViews)} change={`+${analyticsData.pageViewsChange}%`} icon={Eye} color="#aa8bff" positive />
        <StatCard label="Commandes" value={formatNumber(analyticsData.orders)} change={`+${analyticsData.ordersChange}%`} icon={ShoppingBag} color="#34d399" positive />
        <StatCard label="Revenus" value={formatDZD(analyticsData.revenue)} change={`+${analyticsData.revenueChange}%`} icon={DollarSign} color="#fbbf24" positive />
      </div>

      {/* Secondary metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "Taux de conversion", value: `${analyticsData.conversionRate}%`, icon: MousePointer, color: "#f472b6", desc: "Visiteurs → Acheteurs" },
          { label: "Panier moyen", value: formatDZD(analyticsData.avgOrderValue), icon: ShoppingBag, color: "#fb923c", desc: "Valeur moyenne par commande" },
          { label: "Produits actifs", value: "32", icon: Package, color: "#60a5fa", desc: "En catalogue" },
        ].map(({ label, value, icon: Icon, color, desc }) => (
          <div key={label} className="glass-card rounded-2xl p-5 border border-white/5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ background: `${color}15` }}>
              <Icon className="w-6 h-6" style={{ color }} />
            </div>
            <div>
              <div className="text-xl font-black font-headline" style={{ color }}>{value}</div>
              <div className="text-sm font-medium">{label}</div>
              <div className="text-xs text-on-surface-variant">{desc}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Revenue chart */}
        <div className="xl:col-span-2 glass-card rounded-2xl p-6 border border-white/5">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-bold font-headline flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-primary" />
              Revenus mensuels
            </h2>
            <span className="text-xs text-on-surface-variant">DZD</span>
          </div>
          <div className="flex items-end gap-2 h-48 relative">
            {/* Y-axis labels */}
            <div className="absolute left-0 top-0 h-full flex flex-col justify-between pr-2 text-right">
              {[formatDZD(maxRevenue), formatDZD(maxRevenue * 0.5), "0"].map((v) => (
                <span key={v} className="text-xs text-on-surface-variant">{v}</span>
              ))}
            </div>
            <div className="flex-1 flex items-end gap-2 pl-12">
              {analyticsData.revenueByMonth.map(({ month, revenue }) => {
                const pct = (revenue / maxRevenue) * 100;
                return (
                  <div key={month} className="flex-1 flex flex-col items-center gap-2 group relative">
                    {/* Tooltip */}
                    <div className="absolute bottom-full mb-2 px-2 py-1 rounded-lg glass-panel text-xs font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                      {formatDZD(revenue)}
                    </div>
                    <div className="w-full relative" style={{ height: 160 }}>
                      <div
                        className="absolute bottom-0 w-full rounded-t-lg transition-all duration-700 cursor-default"
                        style={{
                          height: `${pct}%`,
                          background: "linear-gradient(to top, rgba(97,205,255,0.9), rgba(170,139,255,0.7))",
                        }}
                      />
                    </div>
                    <span className="text-xs text-on-surface-variant">{month}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Revenue by category */}
        <div className="glass-card rounded-2xl p-6 border border-white/5">
          <h2 className="font-bold font-headline mb-6 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            Par catégorie
          </h2>
          <div className="space-y-4">
            {analyticsData.revenueByCategory.map(({ cat, pct, color }) => (
              <div key={cat}>
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-sm font-medium">{cat}</span>
                  <span className="text-sm font-bold" style={{ color }}>{pct}%</span>
                </div>
                <div className="h-2 bg-surface-container rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-1000"
                    style={{ width: `${pct}%`, background: color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Top products */}
        <div className="glass-card rounded-2xl border border-white/5 overflow-hidden">
          <div className="flex items-center gap-2 px-6 py-4 border-b border-white/5 bg-surface-container/30">
            <Star className="w-4 h-4 text-primary" />
            <h2 className="font-bold font-headline text-sm">Produits les Plus Vendus</h2>
          </div>
          <div className="divide-y divide-white/5">
            {analyticsData.topProducts.map((p, i) => (
              <div key={p.name} className="flex items-center gap-4 px-6 py-4 hover:bg-surface-container/30 transition-colors">
                <span className="text-2xl font-black font-headline text-on-surface-variant/30 w-6 text-center">
                  {i + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm truncate">{p.name}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <div className="flex items-center gap-0.5">
                      {[1,2,3,4,5].map((s) => (
                        <Star key={s} className={`w-2.5 h-2.5 ${s <= Math.round(p.rating) ? "text-yellow-400 fill-yellow-400" : "text-white/20"}`} />
                      ))}
                    </div>
                    <span className="text-xs text-on-surface-variant">{p.rating}</span>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="text-sm font-bold gradient-text">{formatDZD(p.revenue)}</div>
                  <div className="text-xs text-on-surface-variant">{p.sold} vendus</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Traffic sources */}
        <div className="glass-card rounded-2xl border border-white/5 overflow-hidden">
          <div className="flex items-center gap-2 px-6 py-4 border-b border-white/5 bg-surface-container/30">
            <Users className="w-4 h-4 text-primary" />
            <h2 className="font-bold font-headline text-sm">Sources de Trafic</h2>
          </div>
          <div className="divide-y divide-white/5">
            {analyticsData.trafficSources.map(({ source, visits, pct }, i) => {
              const colors = ["#61cdff", "#aa8bff", "#34d399", "#fbbf24", "#f472b6"];
              const color = colors[i % colors.length];
              return (
                <div key={source} className="px-6 py-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">{source}</span>
                    <div className="text-right">
                      <span className="text-sm font-bold" style={{ color }}>{formatNumber(visits)}</span>
                      <span className="text-xs text-on-surface-variant ml-1">({pct}%)</span>
                    </div>
                  </div>
                  <div className="h-1.5 bg-surface-container rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${pct}%`, background: color, opacity: 0.7 }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
