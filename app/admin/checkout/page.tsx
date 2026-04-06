"use client";

import { useState, useEffect } from "react";
import {
  Save, Loader2, ShoppingCart, CreditCard, Settings2,
  ChevronUp, ChevronDown, Plus, Trash2, GripVertical,
} from "lucide-react";
import toast from "react-hot-toast";
import { cn } from "@/lib/utils";
import type { CheckoutSettings, FieldConfig, PaymentMethod } from "@/lib/checkout-types";
import { DEFAULT_SETTINGS } from "@/lib/checkout-types";

function getToken() {
  if (typeof window === "undefined") return "";
  return sessionStorage.getItem("evo_admin_token") || sessionStorage.getItem("evo_admin_key") || "";
}

const TAB_ICONS: Record<string, any> = {
  fields: Settings2,
  payments: CreditCard,
  general: ShoppingCart,
};

export default function CheckoutSettingsPage() {
  const [settings, setSettings] = useState<CheckoutSettings>(DEFAULT_SETTINGS);
  const [loading, setLoading]   = useState(true);
  const [saving, setSaving]     = useState(false);
  const [tab, setTab]           = useState<"fields" | "payments" | "general">("fields");
  const [newPayment, setNewPayment] = useState<PaymentMethod | null>(null);

  useEffect(() => {
    fetch("/api/settings/checkout")
      .then((r) => r.json())
      .then((data) => setSettings(data))
      .catch(() => setSettings(DEFAULT_SETTINGS))
      .finally(() => setLoading(false));
  }, []);

  const save = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/settings/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` },
        body: JSON.stringify(settings),
      });
      if (!res.ok) throw new Error("Erreur");
      toast.success("Paramètres sauvegardés!");
    } catch {
      toast.error("Erreur lors de la sauvegarde");
    } finally {
      setSaving(false);
    }
  };

  // ── Field helpers ──────────────────────────────────────────────────────────
  const updateField = (key: string, patch: Partial<FieldConfig>) =>
    setSettings((s) => ({ ...s, fields: s.fields.map((f) => f.key === key ? { ...f, ...patch } : f) }));

  const moveField = (idx: number, dir: -1 | 1) => {
    const fields = [...settings.fields];
    const target = idx + dir;
    if (target < 0 || target >= fields.length) return;
    [fields[idx], fields[target]] = [fields[target], fields[idx]];
    setSettings((s) => ({ ...s, fields }));
  };

  // ── Payment helpers ────────────────────────────────────────────────────────
  const updatePayment = (id: string, patch: Partial<PaymentMethod>) =>
    setSettings((s) => ({ ...s, paymentMethods: s.paymentMethods.map((p) => p.id === id ? { ...p, ...patch } : p) }));

  const movePayment = (idx: number, dir: -1 | 1) => {
    const methods = [...settings.paymentMethods];
    const target = idx + dir;
    if (target < 0 || target >= methods.length) return;
    [methods[idx], methods[target]] = [methods[target], methods[idx]];
    setSettings((s) => ({ ...s, paymentMethods: methods }));
  };

  const deletePayment = (id: string) =>
    setSettings((s) => ({ ...s, paymentMethods: s.paymentMethods.filter((p) => p.id !== id) }));

  const addCustomPayment = () => {
    setNewPayment({ id: `custom_${Date.now()}`, enabled: true, label: "", description: "", icon: "💰", instructions: "" });
  };

  const confirmAddPayment = () => {
    if (!newPayment || !newPayment.label.trim()) { toast.error("Le nom du mode de paiement est requis"); return; }
    setSettings((s) => ({ ...s, paymentMethods: [...s.paymentMethods, newPayment] }));
    setNewPayment(null);
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <Loader2 className="w-6 h-6 animate-spin text-primary" />
    </div>
  );

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black font-headline">Paramètres Checkout</h1>
          <p className="text-on-surface-variant text-sm mt-1">Configurez le formulaire de commande et les modes de paiement</p>
        </div>
        <button onClick={save} disabled={saving} className="btn-primary flex items-center gap-2 disabled:opacity-60">
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Sauvegarder
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 rounded-xl bg-surface-container border border-white/5">
        {(["fields", "payments", "general"] as const).map((t) => {
          const labels = { fields: "Champs du formulaire", payments: "Modes de paiement", general: "Général" };
          const Icon = TAB_ICONS[t];
          return (
            <button key={t} onClick={() => setTab(t)}
              className={cn("flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-medium transition-all",
                tab === t ? "bg-primary/10 text-primary border border-primary/20" : "text-on-surface-variant hover:text-white hover:bg-white/5"
              )}>
              <Icon className="w-4 h-4" />
              <span className="hidden sm:inline">{labels[t]}</span>
            </button>
          );
        })}
      </div>

      {/* ── FIELDS TAB ─────────────────────────────────────────────────────── */}
      {tab === "fields" && (
        <div className="space-y-3">
          <p className="text-sm text-on-surface-variant">Réorganisez, activez/désactivez et configurez chaque champ du formulaire de commande.</p>
          {settings.fields.map((field, idx) => (
            <div key={field.key} className={cn("glass-card rounded-2xl border transition-all", field.enabled ? "border-white/5" : "border-white/5 opacity-60")}>
              <div className="flex items-center gap-3 p-4">
                {/* Reorder */}
                <div className="flex flex-col gap-0.5">
                  <button onClick={() => moveField(idx, -1)} disabled={idx === 0} className="p-0.5 text-on-surface-variant hover:text-white disabled:opacity-20 transition-colors">
                    <ChevronUp className="w-3.5 h-3.5" />
                  </button>
                  <GripVertical className="w-3.5 h-3.5 text-on-surface-variant/40 mx-auto" />
                  <button onClick={() => moveField(idx, 1)} disabled={idx === settings.fields.length - 1} className="p-0.5 text-on-surface-variant hover:text-white disabled:opacity-20 transition-colors">
                    <ChevronDown className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Enable toggle */}
                <button onClick={() => updateField(field.key, { enabled: !field.enabled })}
                  className={cn("w-10 h-6 rounded-full flex-shrink-0 transition-all duration-300 relative", field.enabled ? "bg-primary" : "bg-surface-container-high")}>
                  <span className={cn("absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform duration-300", field.enabled ? "translate-x-5" : "translate-x-1")} />
                </button>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-sm">{field.label}</span>
                    <span className="text-xs font-mono text-on-surface-variant bg-surface-container px-1.5 py-0.5 rounded">{field.key}</span>
                    {field.type === "select" && <span className="text-xs text-secondary">wilayas</span>}
                  </div>
                </div>

                {/* Required toggle — only when enabled */}
                {field.enabled && field.key !== "notes" && (
                  <button onClick={() => updateField(field.key, { required: !field.required })}
                    className={cn("text-xs px-2.5 py-1 rounded-full border font-medium transition-all flex-shrink-0",
                      field.required ? "bg-error/10 text-error border-error/20" : "bg-surface-container text-on-surface-variant border-white/10 hover:border-white/20"
                    )}>
                    {field.required ? "Requis" : "Optionnel"}
                  </button>
                )}
              </div>

              {/* Edit label/placeholder — expanded when enabled */}
              {field.enabled && (
                <div className="px-4 pb-4 pt-1 border-t border-white/5 grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-on-surface-variant mb-1">Label</label>
                    <input value={field.label} onChange={(e) => updateField(field.key, { label: e.target.value })}
                      className="input-field text-sm py-2" placeholder="Nom du champ" />
                  </div>
                  {field.type !== "select" && (
                    <div>
                      <label className="block text-xs text-on-surface-variant mb-1">Placeholder</label>
                      <input value={field.placeholder} onChange={(e) => updateField(field.key, { placeholder: e.target.value })}
                        className="input-field text-sm py-2" placeholder="Texte indicatif" />
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* ── PAYMENTS TAB ───────────────────────────────────────────────────── */}
      {tab === "payments" && (
        <div className="space-y-3">
          <p className="text-sm text-on-surface-variant">Activez les modes de paiement, personnalisez leurs descriptions et ajoutez des instructions pour le client.</p>

          {settings.paymentMethods.map((method, idx) => (
            <div key={method.id} className={cn("glass-card rounded-2xl border transition-all", method.enabled ? "border-primary/10" : "border-white/5 opacity-60")}>
              <div className="flex items-center gap-3 p-4">
                {/* Reorder */}
                <div className="flex flex-col gap-0.5">
                  <button onClick={() => movePayment(idx, -1)} disabled={idx === 0} className="p-0.5 text-on-surface-variant hover:text-white disabled:opacity-20 transition-colors">
                    <ChevronUp className="w-3.5 h-3.5" />
                  </button>
                  <GripVertical className="w-3.5 h-3.5 text-on-surface-variant/40 mx-auto" />
                  <button onClick={() => movePayment(idx, 1)} disabled={idx === settings.paymentMethods.length - 1} className="p-0.5 text-on-surface-variant hover:text-white disabled:opacity-20 transition-colors">
                    <ChevronDown className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Enable toggle */}
                <button onClick={() => updatePayment(method.id, { enabled: !method.enabled })}
                  className={cn("w-10 h-6 rounded-full flex-shrink-0 transition-all duration-300 relative", method.enabled ? "bg-primary" : "bg-surface-container-high")}>
                  <span className={cn("absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform duration-300", method.enabled ? "translate-x-5" : "translate-x-1")} />
                </button>

                {/* Icon picker */}
                <input value={method.icon} onChange={(e) => updatePayment(method.id, { icon: e.target.value })}
                  className="w-10 text-center bg-surface-container border border-white/5 rounded-lg py-1 text-xl flex-shrink-0" maxLength={2} />

                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm">{method.label || "Sans nom"}</p>
                  <p className="text-xs text-on-surface-variant truncate">{method.description}</p>
                </div>

                {/* Delete custom payment */}
                {!["cod", "ccp", "baridimob", "baridipay", "virement"].includes(method.id) && (
                  <button onClick={() => deletePayment(method.id)} className="p-1.5 text-on-surface-variant hover:text-error hover:bg-error/10 rounded-lg transition-all flex-shrink-0">
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Edit details */}
              {method.enabled && (
                <div className="px-4 pb-4 pt-1 border-t border-white/5 space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-on-surface-variant mb-1">Nom affiché</label>
                      <input value={method.label} onChange={(e) => updatePayment(method.id, { label: e.target.value })}
                        className="input-field text-sm py-2" placeholder="Nom du mode de paiement" />
                    </div>
                    <div>
                      <label className="block text-xs text-on-surface-variant mb-1">Description courte</label>
                      <input value={method.description} onChange={(e) => updatePayment(method.id, { description: e.target.value })}
                        className="input-field text-sm py-2" placeholder="Description courte affichée sous le nom" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs text-on-surface-variant mb-1">Instructions (affichées quand ce mode est sélectionné)</label>
                    <textarea value={method.instructions} onChange={(e) => updatePayment(method.id, { instructions: e.target.value })}
                      rows={2} className="input-field text-sm py-2 resize-none" placeholder="Ex: Envoyez le montant au numéro CCP XXXXXX, puis partagez le reçu..." />
                  </div>
                </div>
              )}
            </div>
          ))}

          {/* Add custom payment */}
          {newPayment ? (
            <div className="glass-card rounded-2xl border border-primary/20 p-4 space-y-3">
              <p className="font-semibold text-sm text-primary">Nouveau mode de paiement</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs text-on-surface-variant mb-1">Emoji</label>
                  <input value={newPayment.icon} onChange={(e) => setNewPayment({ ...newPayment, icon: e.target.value })}
                    className="input-field text-sm py-2 text-center text-xl" maxLength={2} />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs text-on-surface-variant mb-1">Nom *</label>
                  <input value={newPayment.label} onChange={(e) => setNewPayment({ ...newPayment, label: e.target.value })}
                    className="input-field text-sm py-2" placeholder="Ex: PayPal, Crypto..." />
                </div>
              </div>
              <div>
                <label className="block text-xs text-on-surface-variant mb-1">Description</label>
                <input value={newPayment.description} onChange={(e) => setNewPayment({ ...newPayment, description: e.target.value })}
                  className="input-field text-sm py-2" placeholder="Description courte" />
              </div>
              <div>
                <label className="block text-xs text-on-surface-variant mb-1">Instructions client</label>
                <textarea value={newPayment.instructions} onChange={(e) => setNewPayment({ ...newPayment, instructions: e.target.value })}
                  rows={2} className="input-field text-sm py-2 resize-none" placeholder="Instructions affichées au client quand il choisit ce mode..." />
              </div>
              <div className="flex gap-2">
                <button onClick={() => setNewPayment(null)} className="btn-secondary flex-1 py-2 text-sm">Annuler</button>
                <button onClick={confirmAddPayment} className="btn-primary flex-1 py-2 text-sm">Ajouter</button>
              </div>
            </div>
          ) : (
            <button onClick={addCustomPayment} className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl border border-dashed border-white/10 text-on-surface-variant hover:border-primary/40 hover:text-primary transition-all text-sm">
              <Plus className="w-4 h-4" />
              Ajouter un mode de paiement personnalisé
            </button>
          )}
        </div>
      )}

      {/* ── GENERAL TAB ────────────────────────────────────────────────────── */}
      {tab === "general" && (
        <div className="space-y-4">
          <div className="glass-card rounded-2xl border border-white/5 p-6 space-y-5">
            <h3 className="font-bold font-headline text-sm uppercase tracking-wide text-on-surface-variant">Livraison & Frais</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-on-surface-variant mb-1.5">Frais de livraison (DZD)</label>
                <input type="number" min={0} value={settings.shippingFee}
                  onChange={(e) => setSettings((s) => ({ ...s, shippingFee: Number(e.target.value) }))}
                  className="input-field" placeholder="0 = Gratuit" />
                <p className="text-xs text-on-surface-variant mt-1">Mettez 0 pour la livraison gratuite</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-on-surface-variant mb-1.5">Livraison gratuite à partir de (DZD)</label>
                <input type="number" min={0} value={settings.freeShippingAbove}
                  onChange={(e) => setSettings((s) => ({ ...s, freeShippingAbove: Number(e.target.value) }))}
                  className="input-field" placeholder="0 = Toujours gratuit" />
                <p className="text-xs text-on-surface-variant mt-1">0 = la livraison est toujours au tarif fixe ci-dessus</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-on-surface-variant mb-1.5">Commande minimum (DZD)</label>
                <input type="number" min={0} value={settings.minOrderAmount}
                  onChange={(e) => setSettings((s) => ({ ...s, minOrderAmount: Number(e.target.value) }))}
                  className="input-field" placeholder="0 = Aucun minimum" />
                <p className="text-xs text-on-surface-variant mt-1">0 = pas de montant minimum</p>
              </div>
            </div>
          </div>

          <div className="glass-card rounded-2xl border border-white/5 p-6 space-y-4">
            <h3 className="font-bold font-headline text-sm uppercase tracking-wide text-on-surface-variant">Message de confirmation</h3>
            <div>
              <label className="block text-sm font-medium text-on-surface-variant mb-1.5">Message affiché après la commande</label>
              <textarea value={settings.confirmationNote}
                onChange={(e) => setSettings((s) => ({ ...s, confirmationNote: e.target.value }))}
                rows={3} className="input-field resize-none"
                placeholder="Merci pour votre commande ! Nous vous contacterons..." />
            </div>
          </div>
        </div>
      )}

      {/* Save button (bottom) */}
      <div className="flex justify-end pt-2">
        <button onClick={save} disabled={saving} className="btn-primary flex items-center gap-2 disabled:opacity-60 py-3 px-8">
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Sauvegarder les paramètres
        </button>
      </div>
    </div>
  );
}
