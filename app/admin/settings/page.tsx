"use client";

import { useState, useEffect, useRef } from "react";
import {
  Save, Loader2, Store, Globe, Shield, Bell,
  Image as ImageIcon, Search, Palette, Upload, X,
} from "lucide-react";


const FacebookIcon = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
  </svg>
);
const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
  </svg>
);
const YoutubeIcon = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/><polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="white"/>
  </svg>
);
import toast from "react-hot-toast";
import Image from "next/image";
import { cn } from "@/lib/utils";
import type { StoreSettings } from "@/lib/store-types";
import { DEFAULT_STORE } from "@/lib/store-types";

function getToken() {
  if (typeof window === "undefined") return "";
  return sessionStorage.getItem("evo_admin_token") || sessionStorage.getItem("evo_admin_key") || "";
}

const TABS = [
  { id: "identity",      label: "Boutique",       icon: Store    },
  { id: "contact",       label: "Contact",         icon: Bell     },
  { id: "social",        label: "Réseaux Sociaux", icon: Globe    },
  { id: "hero",          label: "Page d'Accueil",  icon: Palette  },
  { id: "seo",           label: "SEO",             icon: Search   },
  { id: "analytics",     label: "Analytics",       icon: Globe    },
  { id: "notifications", label: "Notifications",   icon: Bell     },
  { id: "downloads",     label: "Téléchargements", icon: Shield   },
  { id: "legal",         label: "Pages légales",   icon: Shield   },
];

// ── Reusable field components ────────────────────────────────────────────────
function Field({ label, type = "text", value, onChange, placeholder, hint, rows }: {
  label: string; type?: string; value: string; onChange: (v: string) => void;
  placeholder?: string; hint?: string; rows?: number;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-on-surface-variant mb-1.5">{label}</label>
      {type === "textarea" ? (
        <textarea value={value} onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder} rows={rows || 3} className="input-field resize-none" />
      ) : (
        <input type={type} value={value} onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder} className="input-field" />
      )}
      {hint && <p className="text-xs text-on-surface-variant mt-1">{hint}</p>}
    </div>
  );
}

function Toggle({ label, desc, checked, onChange }: {
  label: string; desc?: string; checked: boolean; onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between p-4 rounded-xl bg-surface-container border border-white/5">
      <div>
        <p className="text-sm font-medium">{label}</p>
        {desc && <p className="text-xs text-on-surface-variant mt-0.5">{desc}</p>}
      </div>
      <button onClick={() => onChange(!checked)}
        className={cn("relative w-11 h-6 rounded-full transition-all duration-300 flex-shrink-0",
          checked ? "bg-primary" : "bg-surface-container-high")}>
        <span className={cn("absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform duration-300",
          checked ? "translate-x-6" : "translate-x-1")} />
      </button>
    </div>
  );
}

// ── Logo/image uploader ──────────────────────────────────────────────────────
function ImageUploader({ label, hint, value, type, onChange }: {
  label: string; hint: string; value: string;
  type: "logo" | "favicon" | "og"; onChange: (url: string) => void;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const upload = async (file: File) => {
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("type", type);
      const res  = await fetch("/api/upload-logo", {
        method: "POST",
        headers: { Authorization: `Bearer ${getToken()}` },
        body: fd,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erreur upload");
      onChange(data.url);
      toast.success("Image uploadée!");
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium text-on-surface-variant mb-1.5">{label}</label>
      <div className="flex items-start gap-4">
        {/* Preview */}
        <div className="w-20 h-20 rounded-xl border border-white/10 bg-surface-container flex items-center justify-center overflow-hidden flex-shrink-0">
          {value ? (
            <div className="relative w-full h-full">
              <Image src={value} alt={label} fill className="object-contain p-1" sizes="80px"
                onError={() => onChange("")} />
            </div>
          ) : (
            <ImageIcon className="w-7 h-7 text-on-surface-variant/30" />
          )}
        </div>
        <div className="flex-1 space-y-2">
          <div className="flex gap-2">
            <button type="button" onClick={() => fileRef.current?.click()}
              disabled={uploading}
              className="btn-secondary text-sm flex items-center gap-1.5 py-2 px-3 disabled:opacity-60">
              {uploading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
              {uploading ? "Upload..." : "Uploader"}
            </button>
            {value && (
              <button type="button" onClick={() => onChange("")}
                className="p-2 text-on-surface-variant hover:text-error hover:bg-error/10 rounded-lg transition-all">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          <input
            type="text" value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Ou collez une URL..."
            className="input-field text-sm py-2"
          />
          <p className="text-xs text-on-surface-variant">{hint}</p>
          <input ref={fileRef} type="file" className="hidden"
            accept="image/jpeg,image/png,image/webp,image/svg+xml"
            onChange={(e) => { const f = e.target.files?.[0]; if (f) upload(f); e.target.value = ""; }}
          />
        </div>
      </div>
    </div>
  );
}

// ── Main page ────────────────────────────────────────────────────────────────
export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<StoreSettings>(DEFAULT_STORE);
  const [loading, setLoading]   = useState(true);
  const [saving, setSaving]     = useState(false);
  const [tab, setTab]           = useState("identity");

  useEffect(() => {
    fetch("/api/settings/store")
      .then((r) => r.json())
      .then((data) => setSettings({ ...DEFAULT_STORE, ...data }))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const set = (key: keyof StoreSettings, value: any) =>
    setSettings((s) => ({ ...s, [key]: value }));

  const save = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/settings/store", {
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

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <Loader2 className="w-6 h-6 animate-spin text-primary" />
    </div>
  );

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black font-headline">Paramètres de la Boutique</h1>
          <p className="text-on-surface-variant text-sm mt-1">Personnalisez votre boutique de A à Z</p>
        </div>
        <button onClick={save} disabled={saving}
          className="btn-primary flex items-center gap-2 disabled:opacity-60">
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Sauvegarder
        </button>
      </div>

      {/* Tabs — scrollable on mobile */}
      <div className="flex gap-1 overflow-x-auto pb-1 scrollbar-none">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button key={id} onClick={() => setTab(id)}
            className={cn("flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all flex-shrink-0",
              tab === id ? "bg-primary/10 text-primary border border-primary/20" : "text-on-surface-variant hover:text-white hover:bg-white/5")}>
            <Icon className="w-3.5 h-3.5" />
            {label}
          </button>
        ))}
      </div>

      {/* ── IDENTITY ─────────────────────────────────────────────────────── */}
      {tab === "identity" && (
        <div className="space-y-6">
          <div className="glass-card rounded-2xl border border-white/5 p-6 space-y-5">
            <h3 className="font-bold font-headline text-sm uppercase tracking-wide text-on-surface-variant">Identité de la boutique</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="Nom de la boutique *" value={settings.storeName} onChange={(v) => set("storeName", v)} placeholder="Evo Digital" />
              <Field label="Slogan (tagline)" value={settings.tagline} onChange={(v) => set("tagline", v)} placeholder="Votre Boutique Numérique Premium" />
              <div className="md:col-span-2">
                <Field label="Description" type="textarea" value={settings.description} onChange={(v) => set("description", v)} placeholder="Description de la boutique..." rows={2} />
              </div>
            </div>
          </div>

          <div className="glass-card rounded-2xl border border-white/5 p-6 space-y-6">
            <h3 className="font-bold font-headline text-sm uppercase tracking-wide text-on-surface-variant">Identité visuelle</h3>
            <ImageUploader
              label="Logo principal"
              hint="Recommandé : PNG transparent, min 200×60px, max 2 MB"
              value={settings.logoUrl}
              type="logo"
              onChange={(v) => set("logoUrl", v)}
            />
            <div className="border-t border-white/5 pt-5">
              <ImageUploader
                label="Favicon (icône de l'onglet)"
                hint="Recommandé : 32×32px ou 64×64px, format PNG ou ICO"
                value={settings.faviconUrl}
                type="favicon"
                onChange={(v) => set("faviconUrl", v)}
              />
            </div>
          </div>
        </div>
      )}

      {/* ── CONTACT ──────────────────────────────────────────────────────── */}
      {tab === "contact" && (
        <div className="glass-card rounded-2xl border border-white/5 p-6 space-y-4">
          <h3 className="font-bold font-headline text-sm uppercase tracking-wide text-on-surface-variant mb-1">Informations de contact</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Email de contact" type="email" value={settings.email} onChange={(v) => set("email", v)} placeholder="contact@evodigital.dz" />
            <Field label="Téléphone" type="tel" value={settings.phone} onChange={(v) => set("phone", v)} placeholder="+213 XXX XXX XXX" />
            <Field label="WhatsApp" type="tel" value={settings.whatsapp} onChange={(v) => set("whatsapp", v)} placeholder="+213 XXX XXX XXX" hint="Numéro WhatsApp affiché sur le site" />
            <div className="md:col-span-2">
              <Field label="Adresse" value={settings.address} onChange={(v) => set("address", v)} placeholder="Alger, Algérie" />
            </div>
          </div>
        </div>
      )}

      {/* ── SOCIAL ───────────────────────────────────────────────────────── */}
      {tab === "social" && (
        <div className="glass-card rounded-2xl border border-white/5 p-6 space-y-4">
          <h3 className="font-bold font-headline text-sm uppercase tracking-wide text-on-surface-variant mb-1">Réseaux sociaux</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-on-surface-variant mb-1.5">
                <span className="text-blue-400"><FacebookIcon /></span> Facebook
              </label>
              <input value={settings.facebook} onChange={(e) => set("facebook", e.target.value)}
                placeholder="https://facebook.com/votrepage" className="input-field" />
            </div>
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-on-surface-variant mb-1.5">
                <span className="text-pink-400"><InstagramIcon /></span> Instagram
              </label>
              <input value={settings.instagram} onChange={(e) => set("instagram", e.target.value)}
                placeholder="https://instagram.com/votrecompte" className="input-field" />
            </div>
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-on-surface-variant mb-1.5">
                <span className="text-base">🎵</span> TikTok
              </label>
              <input value={settings.tiktok} onChange={(e) => set("tiktok", e.target.value)}
                placeholder="https://tiktok.com/@votrecompte" className="input-field" />
            </div>
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-on-surface-variant mb-1.5">
                <span className="text-red-400"><YoutubeIcon /></span> YouTube
              </label>
              <input value={settings.youtube} onChange={(e) => set("youtube", e.target.value)}
                placeholder="https://youtube.com/@votrechaine" className="input-field" />
            </div>
          </div>
        </div>
      )}

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      {tab === "hero" && (
        <div className="space-y-4">
          <div className="glass-card rounded-2xl border border-white/5 p-6 space-y-4">
            <h3 className="font-bold font-headline text-sm uppercase tracking-wide text-on-surface-variant">Section principale (Hero)</h3>
            <Field label="Badge / étiquette" value={settings.heroBadge} onChange={(v) => set("heroBadge", v)} placeholder="🇩🇿 La boutique digitale #1 en Algérie" hint="Petite étiquette affichée au-dessus du titre" />
            <Field label="Titre principal" value={settings.heroTitle} onChange={(v) => set("heroTitle", v)} placeholder="Votre Boutique Numérique Premium" />
            <Field label="Sous-titre" type="textarea" value={settings.heroSubtitle} onChange={(v) => set("heroSubtitle", v)} placeholder="Téléchargez des logiciels premium..." rows={2} />
          </div>
          {/* Preview */}
          <div className="glass-card rounded-2xl border border-primary/10 p-6 bg-primary/3">
            <p className="text-xs text-on-surface-variant mb-3 uppercase tracking-wide font-bold">Aperçu</p>
            <div className="text-center space-y-2">
              {settings.heroBadge && (
                <span className="inline-block text-xs px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">{settings.heroBadge}</span>
              )}
              <h2 className="text-2xl font-black font-headline gradient-text">{settings.heroTitle || "Titre principal"}</h2>
              <p className="text-on-surface-variant text-sm">{settings.heroSubtitle || "Sous-titre..."}</p>
            </div>
          </div>
        </div>
      )}

      {/* ── SEO ──────────────────────────────────────────────────────────── */}
      {tab === "seo" && (
        <div className="space-y-4">
          <div className="glass-card rounded-2xl border border-white/5 p-6 space-y-4">
            <h3 className="font-bold font-headline text-sm uppercase tracking-wide text-on-surface-variant">Référencement (SEO)</h3>
            <div>
              <Field label="Titre SEO" value={settings.seoTitle} onChange={(v) => set("seoTitle", v)}
                placeholder="Evo Digital — Votre Boutique Numérique Premium"
                hint={`${settings.seoTitle.length}/60 caractères recommandés`} />
              <div className="mt-1 h-1 rounded-full bg-surface-container overflow-hidden">
                <div className={cn("h-full rounded-full transition-all", settings.seoTitle.length > 60 ? "bg-error" : "bg-primary")}
                  style={{ width: `${Math.min((settings.seoTitle.length / 60) * 100, 100)}%` }} />
              </div>
            </div>
            <div>
              <Field label="Description SEO" type="textarea" value={settings.seoDescription} onChange={(v) => set("seoDescription", v)}
                placeholder="Description pour les résultats de recherche Google..."
                hint={`${settings.seoDescription.length}/160 caractères recommandés`} rows={2} />
              <div className="mt-1 h-1 rounded-full bg-surface-container overflow-hidden">
                <div className={cn("h-full rounded-full transition-all", settings.seoDescription.length > 160 ? "bg-error" : "bg-primary")}
                  style={{ width: `${Math.min((settings.seoDescription.length / 160) * 100, 100)}%` }} />
              </div>
            </div>
            <ImageUploader
              label="Image Open Graph (réseaux sociaux)"
              hint="Recommandé : 1200×630px, PNG ou JPG, max 2 MB. Affichée lors du partage sur Facebook/WhatsApp."
              value={settings.ogImageUrl}
              type="og"
              onChange={(v) => set("ogImageUrl", v)}
            />
          </div>
          {/* Google preview */}
          <div className="glass-card rounded-2xl border border-white/5 p-5">
            <p className="text-xs text-on-surface-variant mb-3 uppercase tracking-wide font-bold">Aperçu Google</p>
            <div className="space-y-0.5">
              <p className="text-sm text-green-400 truncate">{typeof window !== "undefined" ? window.location.origin : "https://votre-site.dz"}</p>
              <p className="text-blue-400 text-base font-medium truncate">{settings.seoTitle || "Titre SEO"}</p>
              <p className="text-on-surface-variant text-xs line-clamp-2">{settings.seoDescription || "Description SEO..."}</p>
            </div>
          </div>
        </div>
      )}

      {/* ── ANALYTICS ────────────────────────────────────────────────────── */}
      {tab === "analytics" && (
        <div className="glass-card rounded-2xl border border-white/5 p-6 space-y-4">
          <h3 className="font-bold font-headline text-sm uppercase tracking-wide text-on-surface-variant">Analytics & Tracking</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Google Analytics 4 (ID)" value={settings.gaId} onChange={(v) => set("gaId", v)} placeholder="G-XXXXXXXXXX" hint="ID de mesure GA4 (commence par G-)" />
            <Field label="Facebook Pixel (ID)" value={settings.fbPixelId} onChange={(v) => set("fbPixelId", v)} placeholder="1234567890123456" hint="Pixel ID pour les conversions Facebook Ads" />
            <div className="md:col-span-2">
              <Field label="Google Tag Manager (ID)" value={settings.gtmId} onChange={(v) => set("gtmId", v)} placeholder="GTM-XXXXXXX" hint="ID GTM pour centraliser tous vos tags en un seul endroit" />
            </div>
          </div>
          <div className="p-4 rounded-xl bg-surface-container border border-white/5 text-xs text-on-surface-variant">
            <p className="font-medium text-white mb-1">💡 Comment appliquer les changements analytics ?</p>
            <p>Après sauvegarde, redémarrez le serveur (ou redéployez) pour que les nouveaux IDs soient pris en compte dans les balises script.</p>
          </div>
        </div>
      )}

      {/* ── NOTIFICATIONS ────────────────────────────────────────────────── */}
      {tab === "notifications" && (
        <div className="space-y-4">
          <div className="glass-card rounded-2xl border border-white/5 p-6 space-y-3">
            <h3 className="font-bold font-headline text-sm uppercase tracking-wide text-on-surface-variant mb-2">Alertes commandes</h3>
            <Toggle label="Notifications Email" desc="Recevoir un email pour chaque nouvelle commande"
              checked={settings.emailNotifications} onChange={(v) => set("emailNotifications", v)} />
            {settings.emailNotifications && (
              <Field label="Email admin (destinataire)" type="email" value={settings.adminEmail}
                onChange={(v) => set("adminEmail", v)} placeholder="admin@evodigital.dz" hint="Toutes les alertes de commande seront envoyées ici" />
            )}
            <Toggle label="Notifications WhatsApp" desc="Recevoir un message WhatsApp pour chaque commande"
              checked={settings.whatsappNotifications} onChange={(v) => set("whatsappNotifications", v)} />
          </div>
          <div className="glass-card rounded-2xl border border-white/5 p-6 space-y-3">
            <h3 className="font-bold font-headline text-sm uppercase tracking-wide text-on-surface-variant mb-2">Webhook (n8n / Zapier / Make)</h3>
            <Toggle label="Activer le Webhook" desc="Envoyer les données de commande vers un webhook externe"
              checked={settings.webhookEnabled} onChange={(v) => set("webhookEnabled", v)} />
            {settings.webhookEnabled && (
              <Field label="URL du Webhook" value={settings.webhookUrl} onChange={(v) => set("webhookUrl", v)}
                placeholder="https://hooks.n8n.cloud/webhook/..." hint="Recevra un POST JSON avec toutes les données de la commande" />
            )}
          </div>
        </div>
      )}

      {/* ── DOWNLOADS ────────────────────────────────────────────────────── */}
      {tab === "downloads" && (
        <div className="glass-card rounded-2xl border border-white/5 p-6 space-y-4">
          <h3 className="font-bold font-headline text-sm uppercase tracking-wide text-on-surface-variant">Liens de téléchargement sécurisés</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Téléchargements max par lien" type="number" value={String(settings.maxDownloads)}
              onChange={(v) => set("maxDownloads", Number(v))} hint="Nombre d'utilisations avant expiration du lien" />
            <Field label="Durée de validité (heures)" type="number" value={String(settings.downloadExpiry)}
              onChange={(v) => set("downloadExpiry", Number(v))} hint="Ex: 72 = 3 jours après la commande" />
          </div>
          <div className="p-4 rounded-xl bg-primary/5 border border-primary/10 flex items-start gap-3">
            <Shield className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
            <div className="text-xs text-on-surface-variant">
              <p className="font-bold text-primary mb-1">Protection anti-piratage active</p>
              <p>Les liens sont signés cryptographiquement et expirent automatiquement après le délai configuré ou le nombre de téléchargements atteint.</p>
            </div>
          </div>
        </div>
      )}

      {/* ── LEGAL ────────────────────────────────────────────────────────── */}
      {tab === "legal" && (
        <div className="space-y-4">
          <div className="p-3 rounded-xl bg-surface-container border border-white/5 text-xs text-on-surface-variant">
            💡 Ces textes sont affichés sur les pages légales de votre boutique. Vous pouvez utiliser du texte simple ou du Markdown.
          </div>
          {[
            { key: "refundPolicy",   label: "Politique de remboursement" },
            { key: "termsOfService", label: "Conditions d'utilisation" },
            { key: "privacyPolicy",  label: "Politique de confidentialité" },
          ].map(({ key, label }) => (
            <div key={key} className="glass-card rounded-2xl border border-white/5 p-6">
              <Field label={label} type="textarea" rows={8}
                value={(settings as any)[key]} onChange={(v) => set(key as keyof StoreSettings, v)}
                placeholder={`Rédigez votre ${label.toLowerCase()}...`} />
            </div>
          ))}
        </div>
      )}

      {/* Save bottom */}
      <div className="flex justify-end pt-2">
        <button onClick={save} disabled={saving}
          className="btn-primary flex items-center gap-2 disabled:opacity-60 py-3 px-8">
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Sauvegarder les paramètres
        </button>
      </div>
    </div>
  );
}
