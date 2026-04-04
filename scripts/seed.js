/**
 * Evo Digital — Firebase Seed Script
 * =====================================
 * Run this script to populate your Firestore database with demo products.
 *
 * Prerequisites:
 *   1. Set up your .env.local with Firebase Admin credentials
 *   2. npm install dotenv
 *
 * Usage:
 *   node scripts/seed.js
 *   OR
 *   npx tsx scripts/seed.ts
 */

const admin = require("firebase-admin");
const path = require("path");

// Load env
require("dotenv").config({ path: path.join(__dirname, "../.env.local") });

const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, "\n");

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
      clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
      privateKey,
    }),
  });
}

const db = admin.firestore();

const products = [
  {
    name: "Dashboard Admin Pro — Template Next.js",
    slug: "dashboard-admin-pro",
    description:
      "Template admin moderne avec graphiques interactifs, tableaux de données, authentification et dark mode. Compatible Next.js 15 et TailwindCSS.",
    longDescription:
      "Ce template admin professionnel vous offre tout ce dont vous avez besoin pour construire un back-office moderne.\n\n**Inclus:**\n- Dashboard avec graphiques\n- Tables avec tri & pagination\n- Authentification complète\n- Dark mode\n- 15+ pages\n- TypeScript complet\n- Responsive",
    price: 2500,
    originalPrice: 4500,
    category: "templates",
    tags: ["nextjs", "admin", "dashboard", "tailwind", "typescript"],
    images: [
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format",
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format",
    ],
    featured: true,
    bestSeller: true,
    isNew: false,
    stock: -1,
    sold: 234,
    rating: 4.9,
    reviewCount: 87,
    fileType: "ZIP",
    fileSize: "12.4 MB",
    seoTitle: "Dashboard Admin Pro — Template Next.js Premium | Evo Digital",
    seoDescription:
      "Template admin Next.js 15 avec graphiques, dark mode et TypeScript. Prêt à déployer. 2500 DZD.",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    name: "Pack Logiciels Productivité 2025",
    slug: "pack-logiciels-productivite",
    description:
      "Suite complète d'outils pour automatiser votre travail quotidien et booster votre productivité.",
    price: 3800,
    originalPrice: 7000,
    category: "software",
    tags: ["productivité", "automation", "outils", "windows"],
    images: [
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&auto=format",
    ],
    featured: true,
    bestSeller: true,
    isNew: true,
    stock: -1,
    sold: 156,
    rating: 4.8,
    reviewCount: 62,
    fileType: "EXE",
    fileSize: "345 MB",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    name: "Ebook Complet — Marketing Digital Algérie",
    slug: "ebook-marketing-digital-algerie",
    description:
      "Guide pratique 200 pages pour lancer votre business digital en Algérie. Stratégies SEO, réseaux sociaux, et vente en ligne.",
    price: 1200,
    originalPrice: 2000,
    category: "ebooks",
    tags: ["marketing", "algérie", "business", "seo", "réseaux sociaux"],
    images: [
      "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800&auto=format",
    ],
    featured: true,
    bestSeller: false,
    isNew: true,
    stock: -1,
    sold: 421,
    rating: 4.7,
    reviewCount: 133,
    fileType: "PDF",
    fileSize: "8.2 MB",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    name: "UI Kit Figma — Design System Premium",
    slug: "ui-kit-figma-premium",
    description:
      "500+ composants Figma organisés pour accélérer vos projets de design. Compatible Figma 2025.",
    price: 1800,
    category: "assets",
    tags: ["figma", "ui", "design", "components"],
    images: [
      "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&auto=format",
    ],
    featured: true,
    bestSeller: false,
    isNew: false,
    stock: -1,
    sold: 89,
    rating: 4.9,
    reviewCount: 44,
    fileType: "FIG",
    fileSize: "56 MB",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    name: "Script Python — Automation Web Scraping",
    slug: "script-python-web-scraping",
    description:
      "Script Python avancé pour extraire des données web automatiquement. Supporte JavaScript rendering, proxies et export CSV/JSON.",
    price: 900,
    category: "scripts",
    tags: ["python", "scraping", "automation", "data"],
    images: [
      "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=800&auto=format",
    ],
    featured: false,
    bestSeller: true,
    isNew: false,
    stock: -1,
    sold: 312,
    rating: 4.6,
    reviewCount: 98,
    fileType: "ZIP",
    fileSize: "2.1 MB",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    name: "Cours Vidéo Complet — React.js Avancé",
    slug: "cours-react-avance",
    description:
      "Formation complète 40 heures pour maîtriser React.js de zéro à expert. Hooks, Context, Next.js, et déploiement.",
    price: 4500,
    originalPrice: 8000,
    category: "courses",
    tags: ["react", "javascript", "formation", "nextjs", "hooks"],
    images: [
      "https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800&auto=format",
    ],
    featured: false,
    bestSeller: true,
    isNew: false,
    stock: -1,
    sold: 678,
    rating: 5.0,
    reviewCount: 201,
    fileType: "MP4",
    fileSize: "18.5 GB",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    name: "Template Landing Page — SaaS Premium",
    slug: "template-landing-saas",
    description:
      "Template conversion optimisée pour vendre votre SaaS ou service. A/B testing ready, CTA optimisés, animations incluses.",
    price: 1500,
    category: "templates",
    tags: ["landing", "saas", "conversion", "html", "css"],
    images: [
      "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=800&auto=format",
    ],
    featured: false,
    bestSeller: false,
    isNew: true,
    stock: -1,
    sold: 45,
    rating: 4.8,
    reviewCount: 23,
    fileType: "ZIP",
    fileSize: "5.8 MB",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    name: "Pack Assets 3D — Rendus Cinema 4D",
    slug: "pack-assets-3d-cinema4d",
    description:
      "100 rendus 3D haute qualité avec fonds transparents. Parfait pour publicités, réseaux sociaux et présentations.",
    price: 2200,
    originalPrice: 3500,
    category: "assets",
    tags: ["3d", "cinema4d", "créatif", "png", "mockup"],
    images: [
      "https://images.unsplash.com/photo-1617791160505-6f00504e3519?w=800&auto=format",
    ],
    featured: false,
    bestSeller: false,
    isNew: false,
    stock: -1,
    sold: 67,
    rating: 4.5,
    reviewCount: 29,
    fileType: "ZIP",
    fileSize: "2.3 GB",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

async function seed() {
  console.log("🌱 Seeding Firestore with demo products...\n");

  try {
    const batch = db.batch();

    for (const product of products) {
      const ref = db.collection("products").doc();
      batch.set(ref, product);
      console.log(`  ✅ ${product.name}`);
    }

    await batch.commit();
    console.log(`\n✨ Seeded ${products.length} products successfully!`);
    console.log("\n👉 Next steps:");
    console.log("   1. Run: npm run dev");
    console.log("   2. Visit: http://localhost:3000");
    console.log("   3. Admin: http://localhost:3000/admin");
  } catch (error) {
    console.error("❌ Seed failed:", error);
    process.exit(1);
  }

  process.exit(0);
}

seed();
