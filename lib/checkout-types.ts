export interface FieldConfig {
  key:         string;
  enabled:     boolean;
  required:    boolean;
  label:       string;
  placeholder: string;
  type:        "text" | "email" | "tel" | "textarea" | "select";
}

export interface PaymentMethod {
  id:           string;
  enabled:      boolean;
  label:        string;
  description:  string;
  icon:         string;
  instructions: string;
}

export interface CheckoutSettings {
  fields:            FieldConfig[];
  paymentMethods:    PaymentMethod[];
  shippingFee:       number;
  freeShippingAbove: number;
  minOrderAmount:    number;
  confirmationNote:  string;
  requireAccount:    boolean;
}

export const DEFAULT_SETTINGS: CheckoutSettings = {
  fields: [
    { key: "name",    enabled: true,  required: true,  label: "Nom complet",      placeholder: "Ahmed Benali",              type: "text"     },
    { key: "email",   enabled: true,  required: true,  label: "Email",            placeholder: "ahmed@example.com",         type: "email"    },
    { key: "phone",   enabled: true,  required: true,  label: "Téléphone",        placeholder: "+213 XXX XXX XXX",          type: "tel"      },
    { key: "wilaya",  enabled: true,  required: true,  label: "Wilaya",           placeholder: "Sélectionnez votre wilaya", type: "select"   },
    { key: "city",    enabled: true,  required: true,  label: "Ville",            placeholder: "Alger",                     type: "text"     },
    { key: "address", enabled: true,  required: true,  label: "Adresse complète", placeholder: "Numéro, Rue, Quartier...",  type: "text"     },
    { key: "notes",   enabled: true,  required: false, label: "Notes",            placeholder: "Instructions spéciales...", type: "textarea" },
  ],
  paymentMethods: [
    { id: "cod",       enabled: true,  label: "Paiement à la livraison", description: "Payez en espèces à la réception de votre commande",       icon: "💵", instructions: "" },
    { id: "ccp",       enabled: false, label: "Virement CCP",            description: "Virement via Compte Chèques Postaux (Algérie Poste)",      icon: "🏦", instructions: "Effectuez un virement CCP au compte N° XXXX-XXXXXXXX, puis envoyez le reçu par WhatsApp." },
    { id: "baridimob", enabled: false, label: "BaridiMob",               description: "Paiement mobile via l'application BaridiMob",              icon: "📱", instructions: "Envoyez le montant au numéro BaridiMob : 07XXXXXXXX, puis partagez le reçu." },
    { id: "baridipay", enabled: false, label: "BaridiPay (CIB/Dahabia)", description: "Paiement en ligne par carte CIB ou Dahabia via BaridiPay", icon: "💳", instructions: "" },
    { id: "virement",  enabled: false, label: "Virement Bancaire",       description: "Virement bancaire vers notre compte (RIB fourni par email)",icon: "🏧", instructions: "Vous recevrez notre RIB par email après confirmation de commande." },
  ],
  shippingFee:       0,
  freeShippingAbove: 0,
  minOrderAmount:    0,
  confirmationNote:  "Merci pour votre commande ! Nous vous contacterons dans les plus brefs délais.",
  requireAccount:    false,
};
