import Link from "next/link";
import {
  Code2, FileText, BookOpen, Video, Package, Wrench, Layers
} from "lucide-react";

const categories = [
  {
    id: "software",
    label: "Logiciels",
    description: "Automatisation & productivité",
    icon: Code2,
    color: "from-blue-500/20 to-cyan-500/20",
    accent: "#61cdff",
    span: "md:col-span-2 md:row-span-2",
  },
  {
    id: "templates",
    label: "Templates UI",
    description: "Designs prêts à l'emploi",
    icon: Layers,
    color: "from-purple-500/20 to-pink-500/20",
    accent: "#aa8bff",
    span: "",
  },
  {
    id: "ebooks",
    label: "Ebooks",
    description: "Guides & formations",
    icon: BookOpen,
    color: "from-emerald-500/20 to-teal-500/20",
    accent: "#34d399",
    span: "",
  },
  {
    id: "courses",
    label: "Cours Vidéo",
    description: "Apprenez à votre rythme",
    icon: Video,
    color: "from-orange-500/20 to-red-500/20",
    accent: "#fb923c",
    span: "",
  },
  {
    id: "scripts",
    label: "Scripts & Outils",
    description: "Automatisez votre workflow",
    icon: Wrench,
    color: "from-yellow-500/20 to-amber-500/20",
    accent: "#fbbf24",
    span: "",
  },
  {
    id: "assets",
    label: "Assets 3D",
    description: "Ressources créatives",
    icon: Package,
    color: "from-pink-500/20 to-rose-500/20",
    accent: "#f472b6",
    span: "",
  },
];

export default function CategoriesGrid() {
  return (
    <section className="px-6 py-24 bg-surface-container-low/30">
      <div className="max-w-screen-xl mx-auto">
        <div className="mb-12">
          <span className="section-label mb-3 block">Explorez</span>
          <h2 className="text-3xl md:text-4xl font-black font-headline">
            Toutes les Catégories
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 auto-rows-[180px]">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/shop?category=${cat.id}`}
              className={`group relative overflow-hidden rounded-3xl glass-card border border-white/5 hover:border-white/10 transition-all duration-500 ${cat.span}`}
            >
              {/* Background gradient */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${cat.color} opacity-60 group-hover:opacity-100 transition-opacity duration-500`}
              />

              {/* Hover glow */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl"
                style={{ boxShadow: `inset 0 0 60px ${cat.accent}20` }}
              />

              <div className="relative z-10 p-6 h-full flex flex-col justify-between">
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
                  style={{ background: `${cat.accent}20` }}
                >
                  <cat.icon
                    className="w-6 h-6"
                    style={{ color: cat.accent }}
                  />
                </div>
                <div>
                  <h3
                    className={`font-bold font-headline group-hover:opacity-100 transition-colors ${
                      cat.span ? "text-xl md:text-2xl" : "text-base"
                    }`}
                    style={{ color: cat.span ? cat.accent : "white" }}
                  >
                    {cat.label}
                  </h3>
                  <p className="text-sm text-on-surface-variant mt-1 line-clamp-1">
                    {cat.description}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
