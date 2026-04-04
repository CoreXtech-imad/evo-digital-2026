import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./hooks/**/*.{js,ts,jsx,tsx}",
    "./lib/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "secondary-dim":             "#834fff",
        "error-container":           "#9f0519",
        "error-dim":                 "#d7383b",
        "surface-variant":           "#262626",
        "tertiary":                  "#969dff",
        "tertiary-dim":              "#8c94ff",
        "primary-fixed":             "#00c1fd",
        "surface-container-highest": "#262626",
        "outline-variant":           "#484847",
        "surface-dim":               "#0e0e0e",
        "surface-container-low":     "#131313",
        "primary-dim":               "#00b2eb",
        "surface-container":         "#1a1a1a",
        "surface":                   "#0e0e0e",
        "primary":                   "#61cdff",
        "surface-bright":            "#2c2c2c",
        "background":                "#0e0e0e",
        "surface-container-lowest":  "#000000",
        "on-surface":                "#ffffff",
        "primary-container":         "#00c1fd",
        "surface-container-high":    "#20201f",
        "on-primary":                "#004259",
        "on-surface-variant":        "#adaaaa",
        "secondary":                 "#aa8bff",
        "on-background":             "#ffffff",
        "error":                     "#ff716c",
        "secondary-container":       "#6900fd",
        "on-secondary-container":    "#f4ecff",
        "surface-tint":              "#61cdff",
      },
      fontFamily: {
        headline: ["var(--font-plus-jakarta)", "Plus Jakarta Sans", "sans-serif"],
        body:     ["var(--font-manrope)", "Manrope", "sans-serif"],
        label:    ["var(--font-manrope)", "Manrope", "sans-serif"],
      },
      borderRadius: {
        DEFAULT: "0.25rem",
        lg:      "0.5rem",
        xl:      "0.75rem",
        "2xl":   "1rem",
        "3xl":   "1.5rem",
        full:    "9999px",
      },
      backgroundImage: {
        "gradient-evo":  "linear-gradient(45deg, #61cdff, #aa8bff)",
        "gradient-evo-v":"linear-gradient(180deg, #61cdff, #aa8bff)",
        "gradient-card": "linear-gradient(135deg, rgba(97,205,255,0.05), rgba(170,139,255,0.05))",
      },
      boxShadow: {
        "neon-primary":    "0 0 20px rgba(97,205,255,0.3)",
        "neon-primary-lg": "0 0 40px rgba(97,205,255,0.4)",
        "neon-secondary":  "0 0 20px rgba(170,139,255,0.3)",
        "glass":           "0 8px 32px rgba(0,0,0,0.5)",
        "card-hover":      "0 20px 60px rgba(0,0,0,0.4), 0 0 30px rgba(97,205,255,0.1)",
      },
      animation: {
        "orb-float":  "orbFloat 8s ease-in-out infinite",
        "fade-up":    "fadeUp 0.6s ease-out forwards",
        "shimmer":    "shimmer 2s infinite",
        "pulse-glow": "pulseGlow 2s ease-in-out infinite",
      },
      keyframes: {
        orbFloat: {
          "0%, 100%": { transform: "translateY(0px) scale(1)" },
          "50%":      { transform: "translateY(-20px) scale(1.05)" },
        },
        fadeUp: {
          "0%":   { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "0%":   { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        pulseGlow: {
          "0%, 100%": { boxShadow: "0 0 20px rgba(97,205,255,0.3)" },
          "50%":      { boxShadow: "0 0 40px rgba(97,205,255,0.6)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
