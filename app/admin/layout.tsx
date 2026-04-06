"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard, Package, ShoppingBag, Settings,
  LogOut, Menu, X, Zap, TrendingUp, BarChart3, Upload, Users, Shield, Eye, EyeOff, ShoppingCart,
} from "lucide-react";
import { cn } from "@/lib/utils";

type AdminRole = "super_admin" | "manager" | "support" | "viewer";

interface Session {
  token:    string;
  role:     AdminRole;
  name:     string;
  username: string;
}

const ROLE_LABELS: Record<AdminRole, string> = {
  super_admin: "Super Admin",
  manager:     "Manager",
  support:     "Support",
  viewer:      "Lecteur",
};

const ROLE_COLORS: Record<AdminRole, string> = {
  super_admin: "text-primary bg-primary/10 border-primary/20",
  manager:     "text-orange-400 bg-orange-500/10 border-orange-500/20",
  support:     "text-green-400 bg-green-500/10 border-green-500/20",
  viewer:      "text-secondary bg-secondary/10 border-secondary/20",
};

function navItems(role: AdminRole) {
  const all = [
    { href: "/admin/dashboard", icon: LayoutDashboard, label: "Dashboard",         minRole: "viewer"      },
    { href: "/admin/products",  icon: Package,         label: "Produits",           minRole: "manager"     },
    { href: "/admin/orders",    icon: ShoppingBag,     label: "Commandes",          minRole: "support"     },
    { href: "/admin/analytics", icon: BarChart3,       label: "Analytics",          minRole: "viewer"      },
    { href: "/admin/upload",    icon: Upload,          label: "Upload Fichiers",    minRole: "manager"     },
    { href: "/admin/checkout",  icon: ShoppingCart,    label: "Paramètres Checkout", minRole: "manager"    },
    { href: "/admin/users",     icon: Users,           label: "Administrateurs",    minRole: "super_admin" },
    { href: "/admin/settings",  icon: Settings,        label: "Paramètres",         minRole: "super_admin" },
  ];
  const hierarchy: Record<AdminRole, number> = { viewer: 1, support: 2, manager: 3, super_admin: 4 };
  return all.filter((item) => hierarchy[role] >= hierarchy[item.minRole as AdminRole]);
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router   = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [session, setSession]         = useState<Session | null>(null);
  const [loading, setLoading]         = useState(true);

  // Login form state
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd]   = useState(false);
  const [error, setError]       = useState("");
  const [loggingIn, setLoggingIn] = useState(false);

  useEffect(() => {
    const raw = sessionStorage.getItem("evo_admin_session");
    if (raw) {
      try { setSession(JSON.parse(raw)); } catch {}
    }
    setLoading(false);
  }, []);

  const handleLogin = async (e: { preventDefault(): void }) => {
    e.preventDefault();
    setError("");
    if (!username || !password) { setError("Identifiants requis"); return; }
    setLoggingIn(true);
    try {
      const res  = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: username.trim().toLowerCase(), password }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Identifiants incorrects"); return; }

      const s: Session = { token: data.token, role: data.role, name: data.name, username: username.trim().toLowerCase() };
      sessionStorage.setItem("evo_admin_session", JSON.stringify(s));
      // Keep legacy keys for backwards compatibility with other components
      sessionStorage.setItem("evo_admin_auth", "true");
      sessionStorage.setItem("evo_admin_key",  data.token);
      sessionStorage.setItem("evo_admin_token", data.token);
      setSession(s);
    } catch {
      setError("Erreur de connexion au serveur");
    } finally {
      setLoggingIn(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("evo_admin_session");
    sessionStorage.removeItem("evo_admin_auth");
    sessionStorage.removeItem("evo_admin_key");
    sessionStorage.removeItem("evo_admin_token");
    setSession(null);
    router.push("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!session) {
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

          <form onSubmit={handleLogin} className="glass-card rounded-2xl p-6 border border-white/5 space-y-4">
            <div>
              <label className="block text-sm font-medium text-on-surface-variant mb-1.5">Nom d&apos;utilisateur</label>
              <input
                type="text"
                value={username}
                onChange={(e) => { setUsername(e.target.value); setError(""); }}
                placeholder="admin"
                className="input-field"
                autoFocus
                autoComplete="username"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-on-surface-variant mb-1.5">Mot de passe</label>
              <div className="relative">
                <input
                  type={showPwd ? "text" : "password"}
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(""); }}
                  placeholder="••••••••"
                  className="input-field pr-10"
                  autoComplete="current-password"
                />
                <button type="button" onClick={() => setShowPwd(!showPwd)} className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-white">
                  {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {error && <p className="text-error text-xs mt-1">{error}</p>}
            </div>
            <button type="submit" disabled={loggingIn} className="btn-primary w-full py-3 flex items-center justify-center gap-2 disabled:opacity-60">
              {loggingIn && <div className="w-4 h-4 border-2 border-on-primary border-t-transparent rounded-full animate-spin" />}
              Se connecter
            </button>
          </form>
        </div>
      </div>
    );
  }

  const items = navItems(session.role);

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

        {/* Current user */}
        <div className="px-4 py-3 mx-3 mt-3 rounded-xl bg-surface-container/50 border border-white/5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full hero-gradient flex items-center justify-center text-xs font-bold text-on-primary flex-shrink-0">
              {session.name.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold truncate">{session.name}</p>
              <span className={cn("inline-flex items-center gap-1 text-xs px-1.5 py-0.5 rounded-full border font-medium mt-0.5", ROLE_COLORS[session.role])}>
                <Shield className="w-2.5 h-2.5" />
                {ROLE_LABELS[session.role]}
              </span>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          {items.map(({ href, icon: Icon, label }) => (
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
