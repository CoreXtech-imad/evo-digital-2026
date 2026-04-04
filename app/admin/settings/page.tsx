"use client";

import { useState } from "react";
import { Save, Store, Mail, Phone, Globe, Shield, Zap, Loader2, Bell } from "lucide-react";
import toast from "react-hot-toast";

export default function AdminSettingsPage() {
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState({
    storeName: "Evo Digital",
    storeDescription: "La boutique numérique premium d'Algérie",
    contactEmail: "contact@evodigital.dz",
    contactPhone: "+213 XXX XXX XXX",
    whatsapp: "+213 XXX XXX XXX",
    address: "Alger, Algérie",
    socialFacebook: "",
    socialInstagram: "",
    heroTitle: "Votre Boutique Numérique Premium",
    heroSubtitle: "Téléchargez des logiciels premium, templates, outils et plus encore.",
    emailNotifications: true,
    whatsappNotifications: false,
    webhookEnabled: false,
    webhookUrl: "",
    gaId: "",
    fbPixelId: "",
    maxDownloads: "3",
    downloadExpiry: "72",
  });

  const handleSave = async () => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 800));
    toast.success("Paramètres sauvegardés!");
    setSaving(false);
  };

  const Section = ({ title, icon: Icon, children }: { title: string; icon: any; children: React.ReactNode }) => (
    <div className="glass-card rounded-2xl border border-white/5 overflow-hidden">
      <div className="flex items-center gap-2 px-6 py-4 border-b border-white/5 bg-surface-container/30">
        <Icon className="w-5 h-5 text-primary" />
        <h2 className="font-bold font-headline">{title}</h2>
      </div>
      <div className="p-6 space-y-4">{children}</div>
    </div>
  );

  const Field = ({ label, type = "text", value, onChange, placeholder, hint }: any) => (
    <div>
      <label className="block text-sm font-medium text-on-surface-variant mb-1.5">{label}</label>
      {type === "textarea" ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={3}
          className="input-field resize-none"
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="input-field"
        />
      )}
      {hint && <p className="text-xs text-on-surface-variant mt-1">{hint}</p>}
    </div>
  );

  const Toggle = ({ label, desc, checked, onChange }: any) => (
    <div className="flex items-center justify-between p-4 rounded-xl bg-surface-container">
      <div>
        <p className="text-sm font-medium">{label}</p>
        {desc && <p className="text-xs text-on-surface-variant mt-0.5">{desc}</p>}
      </div>
      <button
        onClick={() => onChange(!checked)}
        className={`relative w-11 h-6 rounded-full transition-all duration-300 ${
          checked ? "bg-primary" : "bg-surface-container-high"
        }`}
      >
        <span
          className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform duration-300 ${
            checked ? "translate-x-6" : "translate-x-1"
          }`}
        />
      </button>
    </div>
  );

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-black font-headline">Paramètres</h1>
        <p className="text-on-surface-variant text-sm mt-1">Configuration de votre boutique</p>
      </div>

      <Section title="Informations de la Boutique" icon={Store}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Nom de la boutique" value={settings.storeName} onChange={(v: string) => setSettings({ ...settings, storeName: v })} placeholder="Evo Digital" />
          <Field label="Email de contact" type="email" value={settings.contactEmail} onChange={(v: string) => setSettings({ ...settings, contactEmail: v })} placeholder="contact@evodigital.dz" />
          <Field label="Téléphone" value={settings.contactPhone} onChange={(v: string) => setSettings({ ...settings, contactPhone: v })} placeholder="+213 XXX XXX XXX" />
          <Field label="WhatsApp" value={settings.whatsapp} onChange={(v: string) => setSettings({ ...settings, whatsapp: v })} placeholder="+213 XXX XXX XXX" />
          <div className="md:col-span-2">
            <Field label="Description" type="textarea" value={settings.storeDescription} onChange={(v: string) => setSettings({ ...settings, storeDescription: v })} placeholder="Description de la boutique..." />
          </div>
          <div className="md:col-span-2">
            <Field label="Adresse" value={settings.address} onChange={(v: string) => setSettings({ ...settings, address: v })} placeholder="Alger, Algérie" />
          </div>
        </div>
      </Section>

      <Section title="Page d'Accueil (Hero)" icon={Globe}>
        <Field label="Titre principal" value={settings.heroTitle} onChange={(v: string) => setSettings({ ...settings, heroTitle: v })} />
        <Field label="Sous-titre" type="textarea" value={settings.heroSubtitle} onChange={(v: string) => setSettings({ ...settings, heroSubtitle: v })} />
      </Section>

      <Section title="Réseaux Sociaux" icon={Globe}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Facebook" value={settings.socialFacebook} onChange={(v: string) => setSettings({ ...settings, socialFacebook: v })} placeholder="https://facebook.com/..." />
          <Field label="Instagram" value={settings.socialInstagram} onChange={(v: string) => setSettings({ ...settings, socialInstagram: v })} placeholder="https://instagram.com/..." />
        </div>
      </Section>

      <Section title="Notifications" icon={Bell}>
        <Toggle
          label="Notifications Email"
          desc="Recevoir un email pour chaque nouvelle commande"
          checked={settings.emailNotifications}
          onChange={(v: boolean) => setSettings({ ...settings, emailNotifications: v })}
        />
        <Toggle
          label="Notifications WhatsApp"
          desc="Recevoir un message WhatsApp pour chaque commande"
          checked={settings.whatsappNotifications}
          onChange={(v: boolean) => setSettings({ ...settings, whatsappNotifications: v })}
        />
        <Toggle
          label="Webhook (n8n / Zapier)"
          desc="Envoyer les données de commande vers un webhook externe"
          checked={settings.webhookEnabled}
          onChange={(v: boolean) => setSettings({ ...settings, webhookEnabled: v })}
        />
        {settings.webhookEnabled && (
          <Field label="URL du Webhook" value={settings.webhookUrl} onChange={(v: string) => setSettings({ ...settings, webhookUrl: v })} placeholder="https://your-n8n-instance.com/webhook/..." hint="L'URL recevra un POST avec les données de la commande au format JSON" />
        )}
      </Section>

      <Section title="Analytics & Tracking" icon={Globe}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Google Analytics ID" value={settings.gaId} onChange={(v: string) => setSettings({ ...settings, gaId: v })} placeholder="G-XXXXXXXXXX" hint="Insérez votre ID Google Analytics 4" />
          <Field label="Facebook Pixel ID" value={settings.fbPixelId} onChange={(v: string) => setSettings({ ...settings, fbPixelId: v })} placeholder="XXXXXXXXXXXXXXXX" hint="Insérez votre Facebook Pixel ID pour les conversions" />
        </div>
      </Section>

      <Section title="Téléchargements Sécurisés" icon={Shield}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field
            label="Téléchargements max par lien"
            type="number"
            value={settings.maxDownloads}
            onChange={(v: string) => setSettings({ ...settings, maxDownloads: v })}
            hint="Nombre de fois qu'un lien de téléchargement peut être utilisé"
          />
          <Field
            label="Expiration du lien (heures)"
            type="number"
            value={settings.downloadExpiry}
            onChange={(v: string) => setSettings({ ...settings, downloadExpiry: v })}
            hint="Durée de validité du lien de téléchargement après création"
          />
        </div>
        <div className="p-4 rounded-xl bg-primary/5 border border-primary/10">
          <div className="flex items-start gap-2">
            <Shield className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
            <div className="text-xs text-on-surface-variant">
              <p className="font-medium text-primary mb-1">Protection anti-piratage active</p>
              <p>Les liens de téléchargement sont signés cryptographiquement et expireront automatiquement. Les tentatives d&apos;accès non autorisé sont bloquées.</p>
            </div>
          </div>
        </div>
      </Section>

      <button
        onClick={handleSave}
        disabled={saving}
        className="btn-primary flex items-center gap-2 py-3.5 px-8 disabled:opacity-60"
      >
        {saving ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Save className="w-4 h-4" />
        )}
        Sauvegarder les paramètres
      </button>
    </div>
  );
}
