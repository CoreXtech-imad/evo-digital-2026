export interface StoreSettings {
  // Identity
  storeName:    string;
  tagline:      string;
  description:  string;
  logoUrl:      string;
  faviconUrl:   string;

  // Contact
  email:        string;
  phone:        string;
  whatsapp:     string;
  address:      string;

  // Social media
  facebook:     string;
  instagram:    string;
  tiktok:       string;
  youtube:      string;

  // Homepage hero
  heroTitle:    string;
  heroSubtitle: string;
  heroBadge:    string;

  // Legal pages (markdown/plain text)
  refundPolicy:   string;
  termsOfService: string;
  privacyPolicy:  string;

  // SEO
  seoTitle:       string;
  seoDescription: string;
  ogImageUrl:     string;

  // Analytics
  gaId:     string;
  fbPixelId: string;
  gtmId:    string;

  // Notifications
  emailNotifications:     boolean;
  adminEmail:             string;
  whatsappNotifications:  boolean;
  webhookEnabled:         boolean;
  webhookUrl:             string;

  // Downloads
  maxDownloads:   number;
  downloadExpiry: number; // hours
}

export const DEFAULT_STORE: StoreSettings = {
  storeName:    "Evo Digital",
  tagline:      "Votre Boutique Numérique Premium",
  description:  "La boutique numérique premium d'Algérie. Logiciels, templates, outils et plus encore.",
  logoUrl:      "",
  faviconUrl:   "",

  email:     "contact@evodigital.dz",
  phone:     "+213 XXX XXX XXX",
  whatsapp:  "+213 XXX XXX XXX",
  address:   "Alger, Algérie",

  facebook:  "",
  instagram: "",
  tiktok:    "",
  youtube:   "",

  heroTitle:    "Votre Boutique Numérique Premium",
  heroSubtitle: "Téléchargez des logiciels premium, templates, outils et plus encore.",
  heroBadge:    "🇩🇿 La boutique digitale #1 en Algérie",

  refundPolicy:   "",
  termsOfService: "",
  privacyPolicy:  "",

  seoTitle:       "Evo Digital — Votre Boutique Numérique Premium",
  seoDescription: "Téléchargez des logiciels premium, templates, outils et plus encore. La boutique numérique #1 en Algérie.",
  ogImageUrl:     "",

  gaId:      "",
  fbPixelId: "",
  gtmId:     "",

  emailNotifications:    true,
  adminEmail:            "admin@evodigital.dz",
  whatsappNotifications: false,
  webhookEnabled:        false,
  webhookUrl:            "",

  maxDownloads:   3,
  downloadExpiry: 72,
};
