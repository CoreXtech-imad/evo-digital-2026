"use client";

import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, X, Loader2, Users, Shield, Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";
import { cn } from "@/lib/utils";

type AdminRole = "super_admin" | "manager" | "support" | "viewer";

interface AdminUser {
  id:        string;
  username:  string;
  name:      string;
  role:      AdminRole;
  active:    boolean;
  createdAt: string;
}

const ROLES: { value: AdminRole; label: string; color: string; desc: string }[] = [
  { value: "super_admin", label: "Super Admin", color: "text-primary bg-primary/10 border-primary/20",       desc: "Accès complet — gestion des admins, produits, commandes et paramètres" },
  { value: "manager",     label: "Manager",     color: "text-orange-400 bg-orange-500/10 border-orange-500/20", desc: "Gestion des produits et commandes" },
  { value: "support",     label: "Support",     color: "text-green-400 bg-green-500/10 border-green-500/20",   desc: "Voir et mettre à jour les commandes uniquement" },
  { value: "viewer",      label: "Lecteur",     color: "text-secondary bg-secondary/10 border-secondary/20",   desc: "Accès lecture seule — dashboard et analytics" },
];

function getRoleStyle(role: AdminRole) {
  return ROLES.find((r) => r.value === role)?.color ?? "";
}
function getRoleLabel(role: AdminRole) {
  return ROLES.find((r) => r.value === role)?.label ?? role;
}

function getAdminToken(): string {
  if (typeof window === "undefined") return "";
  return sessionStorage.getItem("evo_admin_token") || sessionStorage.getItem("evo_admin_key") || "";
}

export default function AdminUsersPage() {
  const [users, setUsers]           = useState<AdminUser[]>([]);
  const [loading, setLoading]       = useState(true);
  const [showForm, setShowForm]     = useState(false);
  const [editing, setEditing]       = useState<AdminUser | null>(null);
  const [deleteId, setDeleteId]     = useState<string | null>(null);
  const [saving, setSaving]         = useState(false);
  const [showPwd, setShowPwd]       = useState(false);

  const [form, setForm] = useState({
    username: "", name: "", role: "viewer" as AdminRole, password: "", active: true,
  });

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/users", {
        headers: { Authorization: `Bearer ${getAdminToken()}` },
      });
      const data = await res.json();
      if (res.ok) setUsers(data.users);
      else toast.error(data.error || "Erreur lors du chargement");
    } catch {
      toast.error("Erreur de connexion");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const openAdd = () => {
    setEditing(null);
    setForm({ username: "", name: "", role: "viewer", password: "", active: true });
    setShowPwd(false);
    setShowForm(true);
  };

  const openEdit = (user: AdminUser) => {
    setEditing(user);
    setForm({ username: user.username, name: user.name, role: user.role, password: "", active: user.active });
    setShowPwd(false);
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!form.name.trim()) { toast.error("Nom requis"); return; }
    if (!editing && !form.username.trim()) { toast.error("Nom d'utilisateur requis"); return; }
    if (!editing && form.password.length < 8) { toast.error("Mot de passe: 8 caractères minimum"); return; }
    if (editing && form.password && form.password.length < 8) { toast.error("Mot de passe: 8 caractères minimum"); return; }

    setSaving(true);
    try {
      const body: any = { name: form.name, role: form.role, active: form.active };
      if (!editing) { body.username = form.username.toLowerCase(); body.password = form.password; }
      else if (form.password) { body.password = form.password; }

      const url    = editing ? `/api/admin/users/${editing.id}` : "/api/admin/users";
      const method = editing ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${getAdminToken()}` },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erreur");

      toast.success(editing ? "Admin mis à jour!" : "Admin créé!");
      setShowForm(false);
      fetchUsers();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/users/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${getAdminToken()}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erreur");
      toast.success("Admin supprimé");
      setUsers((prev) => prev.filter((u) => u.id !== id));
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setDeleteId(null);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black font-headline">Administrateurs</h1>
          <p className="text-on-surface-variant text-sm mt-1">Gérez les accès et les rôles de votre équipe</p>
        </div>
        <button onClick={openAdd} className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" /> Ajouter
        </button>
      </div>

      {/* Roles legend */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {ROLES.map((r) => (
          <div key={r.value} className="glass-card rounded-xl p-4 border border-white/5">
            <span className={cn("inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border mb-2", r.color)}>
              <Shield className="w-3 h-3" /> {r.label}
            </span>
            <p className="text-xs text-on-surface-variant">{r.desc}</p>
          </div>
        ))}
      </div>

      {/* Users list */}
      <div className="glass-card rounded-2xl border border-white/5 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          </div>
        ) : users.length === 0 ? (
          <div className="text-center py-16 text-on-surface-variant">
            <Users className="w-8 h-8 mx-auto mb-2 opacity-40" />
            <p>Aucun administrateur</p>
          </div>
        ) : (
          <table className="w-full">
            <thead className="border-b border-white/5 bg-surface-container/50">
              <tr>
                {["Nom", "Identifiant", "Rôle", "Statut", "Actions"].map((h) => (
                  <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-on-surface-variant uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b border-white/5 hover:bg-surface-container/30 transition-colors group">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full hero-gradient flex items-center justify-center text-sm font-bold text-on-primary flex-shrink-0">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <span className="font-semibold text-sm">{user.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-sm font-mono text-on-surface-variant">@{user.username}</span>
                  </td>
                  <td className="px-5 py-4">
                    <span className={cn("inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold border", getRoleStyle(user.role))}>
                      <Shield className="w-3 h-3" />
                      {getRoleLabel(user.role)}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <span className={cn("px-2.5 py-1 rounded-full text-xs font-medium", user.active ? "bg-green-500/10 text-green-400" : "bg-error/10 text-error")}>
                      {user.active ? "Actif" : "Désactivé"}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => openEdit(user)} className="p-1.5 rounded-lg text-on-surface-variant hover:text-secondary hover:bg-secondary/10 transition-all">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button onClick={() => setDeleteId(user.id)} className="p-1.5 rounded-lg text-on-surface-variant hover:text-error hover:bg-error/10 transition-all">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Delete confirmation */}
      {deleteId && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className="glass-card rounded-2xl p-6 border border-white/5 max-w-sm w-full">
            <h3 className="font-bold font-headline mb-2">Supprimer cet admin?</h3>
            <p className="text-on-surface-variant text-sm mb-5">Cette action est irréversible.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteId(null)} className="btn-secondary flex-1 py-2.5 text-sm">Annuler</button>
              <button onClick={() => handleDelete(deleteId)} className="flex-1 py-2.5 text-sm rounded-full font-bold bg-error/20 text-error hover:bg-error/30 border border-error/30 transition-all">Supprimer</button>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit form */}
      {showForm && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className="glass-card rounded-2xl border border-white/5 w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b border-white/5">
              <h2 className="font-bold font-headline flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" />
                {editing ? "Modifier l'admin" : "Nouvel admin"}
              </h2>
              <button onClick={() => setShowForm(false)} className="p-2 text-on-surface-variant hover:text-white hover:bg-white/5 rounded-lg transition-all">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {!editing && (
                <div>
                  <label className="block text-sm font-medium text-on-surface-variant mb-1.5">Nom d&apos;utilisateur *</label>
                  <input
                    value={form.username}
                    onChange={(e) => setForm({ ...form, username: e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, "") })}
                    placeholder="ex: ahmed_admin"
                    className="input-field"
                    maxLength={30}
                  />
                  <p className="text-xs text-on-surface-variant mt-1">Lettres minuscules, chiffres et _ uniquement</p>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-on-surface-variant mb-1.5">Nom complet *</label>
                <input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Ahmed Benali"
                  className="input-field"
                  maxLength={60}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-on-surface-variant mb-1.5">Rôle *</label>
                <div className="space-y-2">
                  {ROLES.map((r) => (
                    <label key={r.value} className={cn("flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all", form.role === r.value ? "border-primary/40 bg-primary/5" : "border-white/5 hover:border-white/10")}>
                      <input type="radio" name="role" value={r.value} checked={form.role === r.value} onChange={() => setForm({ ...form, role: r.value })} className="mt-0.5 accent-primary" />
                      <div>
                        <span className={cn("inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full border", r.color)}>
                          <Shield className="w-2.5 h-2.5" /> {r.label}
                        </span>
                        <p className="text-xs text-on-surface-variant mt-1">{r.desc}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-on-surface-variant mb-1.5">
                  {editing ? "Nouveau mot de passe (laisser vide pour ne pas changer)" : "Mot de passe *"}
                </label>
                <div className="relative">
                  <input
                    type={showPwd ? "text" : "password"}
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    placeholder={editing ? "••••••••" : "8 caractères minimum"}
                    className="input-field pr-10"
                    maxLength={100}
                  />
                  <button type="button" onClick={() => setShowPwd(!showPwd)} className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-white">
                    {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {editing && (
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })} className="w-4 h-4 rounded accent-primary" />
                  <span className="text-sm">Compte actif</span>
                </label>
              )}
            </div>

            <div className="flex gap-3 p-6 border-t border-white/5">
              <button onClick={() => setShowForm(false)} className="btn-secondary flex-1 py-3">Annuler</button>
              <button onClick={handleSave} disabled={saving} className="btn-primary flex-1 py-3 flex items-center justify-center gap-2 disabled:opacity-60">
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                {editing ? "Sauvegarder" : "Créer"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
