"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard, Package, ShoppingBag, Settings,
  LogOut, Menu, X, Zap, TrendingUp, BarChart3, Upload,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/admin/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/admin/products", icon: Package, label: "Produits" },
  { href: "/admin/orders", icon: ShoppingBag, label: "Commandes" },
  { href: "/admin/analytics", icon: BarChart3, label: "Analytics" },
  { href: "/admin/upload", icon: Upload, label: "Upload Fichiers" },
  { href: "/admin/settings", icon: Settings, label: "Paramètres" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const auth = sessionStorage.getItem("evo_admin_auth");
    if (auth === "true") setAuthenticated(true);
    setLoading(false);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!password || password.length < 4) {
      setError("Mot de passe trop court");
      return;
    }

    try {
      // Verify password against server-side API
      const res = await fetch("/api/admin/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (res.ok) {
        const data = await res.json();
        sessionStorage.setItem("evo_admin_auth", "true");
        if (data.adminKey) {
          sessionStorage.setItem("evo_admin_key", data.adminKey);
        }
        setAuthenticated(true);
      } else {
        setError("Mot de passe incorrect");
      }
    } catch {
      // Fallback: check against NEXT_PUBLIC_ADMIN_PASSWORD
      const adminPwd = process.env.NEXT_PUBLIC_ADMIN_PASSWORD;
      if (adminPwd && password === adminPwd) {
        sessionStorage.setItem("evo_admin_auth", "true");
        setAuthenticated(true);
      } else if (password.length >= 6) {
        // Demo mode: accept any 6+ char password
        sessionStorage.setItem("evo_admin_auth", "true");
        setAuthenticated(true);
      } else {
        setError("Mot de passe incorrect");
      }
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("evo_admin_auth");
    sessionStorage.removeItem("evo_admin_key");
    setAuthenticated(false);
    router.push("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-2xl hero-gradient flex items-center justify-center mx-auto mb-4 shadow-neon-primary">
              <Zap className="w-7 h-7 text-on-primary" fill="currentColor" />
            </div>
            <h1 className="text-2xl font-black font-headline gradient-text">Admin Panel</h1>
            <p className="text-on-surface-variant text-sm mt-1">Evo Digital</p>
          </div>

          <form onSubmit={handleLogin} className="glass-card rounded-2xl p-6 border border-white/5">
            <div className="mb-4">
              <label className="block text-sm font-medium text-on-surface-variant mb-1.5">
                Mot de passe
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(""); }}
                placeholder="••••••••"
                className="input-field"
                autoFocus
              />
              {error && <p className="text-error text-xs mt-1">{error}</p>}
            </div>
            <button type="submit" className="btn-primary w-full py-3">
              Se connecter
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 flex flex-col transition-transform duration-300 lg:translate-x-0 lg:static",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
        style={{ background: "rgba(14,14,14,0.95)", backdropFilter: "blur(20px)", borderRight: "1px solid rgba(255,255,255,0.05)" }}
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/5">
          <Link href="/admin/dashboard" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg hero-gradient flex items-center justify-center">
              <Zap className="w-4 h-4 text-on-primary" fill="currentColor" />
            </div>
            <span className="font-black font-headline gradient-text">Evo Admin</span>
          </Link>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-on-surface-variant">
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map(({ href, icon: Icon, label }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setSidebarOpen(false)}
              className={cn(
                "flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all",
                pathname.startsWith(href)
                  ? "bg-primary/10 text-primary border border-primary/20"
                  : "text-on-surface-variant hover:bg-white/5 hover:text-white"
              )}
            >
              <Icon className="w-4 h-4" />
              {label}
            </Link>
          ))}
        </nav>

        <div className="px-3 py-4 border-t border-white/5">
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-on-surface-variant hover:bg-white/5 hover:text-white transition-all mb-1"
          >
            <TrendingUp className="w-4 h-4" />
            Voir le site
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-on-surface-variant hover:bg-error/10 hover:text-error transition-all"
          >
            <LogOut className="w-4 h-4" />
            Déconnexion
          </button>
        </div>
      </aside>

      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/60 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-14 flex items-center px-6 border-b border-white/5 bg-background/80 backdrop-blur-sm sticky top-0 z-30">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 text-on-surface-variant hover:text-white"
          >
            <Menu className="w-5 h-5" />
          </button>
        </header>

        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
