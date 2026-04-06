"use client";

import { useState, useEffect, useRef } from "react";
import {
  Plus, Search, Edit, Trash2, Eye, Package,
  Star, Flame, Zap, X, Loader2, Upload, RefreshCw, ImagePlus,
} from "lucide-react";
import { Product, ProductCategory } from "@/types";
import { formatDZD, getDiscountPercentage } from "@/lib/utils";
import Image from "next/image";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";

const DEMO_PRODUCTS: Product[] = [
  {
    id: "demo-1", name: "Dashboard Admin Pro — Template Next.js", slug: "dashboard-admin-pro",
    description: "Template admin moderne avec graphiques interactifs, tableaux et dark mode.",
    price: 2500, originalPrice: 4500, category: "templates", tags: ["nextjs", "admin"],
    images: ["https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&auto=format"],
    featured: true, bestSeller: true, isNew: false, stock: -1, sold: 234, rating: 4.9, reviewCount: 87,
    fileType: "ZIP", fileSize: "12.4 MB", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
  },
  {
    id: "demo-2", name: "Pack Logiciels Productivité 2025", slug: "pack-logiciels-productivite",
    description: "Suite complète d'outils pour automatiser votre travail quotidien.",
    price: 3800, originalPrice: 7000, category: "software", tags: ["productivité", "automation"],
    images: ["https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&auto=format"],
    featured: true, bestSeller: true, isNew: true, stock: -1, sold: 156, rating: 4.8, reviewCount: 62,
    fileType: "EXE", fileSize: "345 MB", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
  },
  {
    id: "demo-3", name: "Ebook Marketing Digital Algérie", slug: "ebook-marketing-digital",
    description: "Guide pratique 200 pages pour lancer votre business digital.",
    price: 1200, originalPrice: 2000, category: "ebooks", tags: ["marketing", "algérie"],
    images: ["https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&auto=format"],
    featured: false, bestSeller: false, isNew: true, stock: -1, sold: 421, rating: 4.7, reviewCount: 133,
    fileType: "PDF", fileSize: "8.2 MB", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
  },
];

const CATEGORIES: { value: string; label: string }[] = [
  { value: "", label: "Toutes" },
  { value: "software", label: "Logiciels" },
  { value: "templates", label: "Templates" },
  { value: "ebooks", label: "Ebooks" },
  { value: "courses", label: "Cours" },
  { value: "scripts", label: "Scripts" },
  { value: "assets", label: "Assets" },
];

interface ProductFormData {
  name: string;
  description: string;
  longDescription: string;
  price: string;
  originalPrice: string;
  category: ProductCategory;
  tags: string;
  imageUrl: string;
  fileType: string;
  fileSize: string;
  featured: boolean;
  bestSeller: boolean;
  isNew: boolean;
  seoTitle: string;
  seoDescription: string;
}

const emptyForm: ProductFormData = {
  name: "", description: "", longDescription: "", price: "", originalPrice: "",
  category: "templates", tags: "", imageUrl: "", fileType: "", fileSize: "",
  featured: false, bestSeller: false, isNew: true, seoTitle: "", seoDescription: "",
};

function getAdminKey(): string {
  if (typeof window === "undefined") return "";
  return sessionStorage.getItem("evo_admin_key") || "";
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>(DEMO_PRODUCTS);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [form, setForm] = useState<ProductFormData>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const imageInputRef = useRef<HTMLInputElement>(null);

  // Fetch products from API on mount
  useEffect(() => {
    fetchProducts();
  }, []);

  const handleImageUpload = async (file: File) => {
    setUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const adminKey = getAdminKey();
      const res = await fetch("/api/upload-image", {
        method: "POST",
        headers: { Authorization: `Bearer ${adminKey}` },
        body: formData,
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Erreur upload");
      }
      const data = await res.json();
      setForm((prev) => ({ ...prev, imageUrl: data.url }));
      toast.success("Image uploadée!");
    } catch (err: any) {
      toast.error(err.message || "Erreur lors de l'upload de l'image");
    } finally {
      setUploadingImage(false);
    }
  };

  const fetchProducts = async () => {
    setLoadingProducts(true);
    try {
      const res = await fetch("/api/products");
      const data = await res.json();
      if (data.products?.length > 0) {
        setProducts(data.products);
      }
    } catch {
      // Keep demo products
    } finally {
      setLoadingProducts(false);
    }
  };

  const filtered = products
    .filter((p) => !category || p.category === category)
    .filter(
      (p) =>
        !search ||
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.category.toLowerCase().includes(search.toLowerCase())
    );

  const openAddForm = () => {
    setEditingProduct(null);
    setForm(emptyForm);
    setShowForm(true);
  };

  const openEditForm = (product: Product) => {
    setEditingProduct(product);
    setForm({
      name: product.name,
      description: product.description,
      longDescription: product.longDescription || "",
      price: product.price.toString(),
      originalPrice: product.originalPrice?.toString() || "",
      category: product.category,
      tags: product.tags.join(", "),
      imageUrl: product.images[0] || "",
      fileType: product.fileType || "",
      fileSize: product.fileSize || "",
      featured: product.featured,
      bestSeller: product.bestSeller,
      isNew: product.isNew,
      seoTitle: product.seoTitle || "",
      seoDescription: product.seoDescription || "",
    });
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!form.name || !form.description || !form.price) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }

    if (Number(form.price) <= 0) {
      toast.error("Le prix doit être supérieur à 0");
      return;
    }

    setSaving(true);
    const adminKey = getAdminKey();

    const productData = {
      name: form.name.trim(),
      description: form.description.trim(),
      longDescription: form.longDescription.trim() || undefined,
      price: Number(form.price),
      originalPrice: form.originalPrice ? Number(form.originalPrice) : undefined,
      category: form.category,
      tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
      images: form.imageUrl ? [form.imageUrl.trim()] : [],
      fileType: form.fileType.trim() || undefined,
      fileSize: form.fileSize.trim() || undefined,
      featured: form.featured,
      bestSeller: form.bestSeller,
      isNew: form.isNew,
      seoTitle: form.seoTitle.trim() || undefined,
      seoDescription: form.seoDescription.trim() || undefined,
    };

    try {
      if (editingProduct) {
        // Update existing product
        const res = await fetch(`/api/products/${editingProduct.id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${adminKey}`,
          },
          body: JSON.stringify(productData),
        });

        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(err.error || `Erreur ${res.status}`);
        }
        setProducts((prev) =>
          prev.map((p) =>
            p.id === editingProduct.id ? { ...p, ...productData, updatedAt: new Date().toISOString() } : p
          )
        );
        toast.success("Produit mis à jour!");
      } else {
        // Create new product
        const res = await fetch("/api/products", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${adminKey}`,
          },
          body: JSON.stringify(productData),
        });

        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(err.error || `Erreur ${res.status}`);
        }

        const result = await res.json();
        const newProduct: Product = {
          id: result.id || `new-${Date.now()}`,
          slug: result.slug || form.name.toLowerCase().replace(/\s+/g, "-"),
          sold: 0, rating: 0, reviewCount: 0, stock: -1,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          ...productData,
          images: productData.images,
        } as Product;
        setProducts((prev) => [newProduct, ...prev]);
        toast.success("Produit ajouté!");
      }

      setShowForm(false);
    } catch (err: any) {
      toast.error(err.message || "Erreur lors de la sauvegarde");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    const adminKey = getAdminKey();

    try {
      const res = await fetch(`/api/products/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${adminKey}` },
      });

      if (res.ok) {
        setProducts((prev) => prev.filter((p) => p.id !== id));
        toast.success("Produit supprimé");
      } else {
        setProducts((prev) => prev.filter((p) => p.id !== id));
        toast.success("Produit supprimé (local)");
      }
    } catch {
      setProducts((prev) => prev.filter((p) => p.id !== id));
      toast.success("Produit supprimé (local)");
    }

    setDeleteConfirm(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black font-headline">Produits</h1>
          <p className="text-on-surface-variant text-sm mt-1">
            {products.length} produit{products.length !== 1 ? "s" : ""} en catalogue
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={fetchProducts}
            disabled={loadingProducts}
            className="btn-secondary flex items-center gap-2 py-2.5 px-4 text-sm"
          >
            <RefreshCw className={cn("w-4 h-4", loadingProducts && "animate-spin")} />
            Actualiser
          </button>
          <button onClick={openAddForm} className="btn-primary flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Ajouter
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
          <input
            type="text"
            placeholder="Rechercher un produit..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field pl-10"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setCategory(cat.value)}
              className={cn(
                "px-3 py-2 rounded-xl text-xs font-medium transition-all",
                category === cat.value
                  ? "hero-gradient text-on-primary"
                  : "bg-surface-container text-on-surface-variant hover:bg-surface-container-high"
              )}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Products table */}
      <div className="glass-card rounded-2xl border border-white/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-white/5 bg-surface-container/50">
              <tr>
                {["Produit", "Catégorie", "Prix", "Vendus", "Statut", "Actions"].map((h) => (
                  <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-on-surface-variant uppercase tracking-wide">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-on-surface-variant">
                    <Package className="w-8 h-8 mx-auto mb-2 opacity-40" />
                    <p>Aucun produit trouvé</p>
                  </td>
                </tr>
              ) : (
                filtered.map((product) => (
                  <tr key={product.id} className="border-b border-white/5 hover:bg-surface-container/30 transition-colors group">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="relative w-10 h-10 rounded-xl overflow-hidden flex-shrink-0 bg-surface-container-high">
                          {product.images[0] ? (
                            <Image src={product.images[0]} alt={product.name} fill className="object-cover" sizes="40px" />
                          ) : (
                            <Package className="w-5 h-5 m-2.5 text-on-surface-variant" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-sm truncate max-w-[200px]">{product.name}</p>
                          {product.fileType && (
                            <span className="text-xs font-mono text-on-surface-variant">{product.fileType} · {product.fileSize}</span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className="px-2.5 py-1 rounded-full text-xs bg-surface-container capitalize text-on-surface-variant">
                        {product.category}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div>
                        <span className="font-bold text-sm gradient-text">{formatDZD(product.price)}</span>
                        {product.originalPrice && (
                          <div className="text-xs text-on-surface-variant line-through">{formatDZD(product.originalPrice)}</div>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-sm font-semibold">{product.sold}</span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex gap-1.5 flex-wrap">
                        {product.featured && (
                          <span className="px-1.5 py-0.5 rounded text-xs bg-primary/10 text-primary flex items-center gap-1">
                            <Star className="w-2.5 h-2.5" /> Vedette
                          </span>
                        )}
                        {product.bestSeller && (
                          <span className="px-1.5 py-0.5 rounded text-xs bg-orange-500/10 text-orange-400 flex items-center gap-1">
                            <Flame className="w-2.5 h-2.5" /> Best
                          </span>
                        )}
                        {product.isNew && (
                          <span className="px-1.5 py-0.5 rounded text-xs bg-secondary/10 text-secondary flex items-center gap-1">
                            <Zap className="w-2.5 h-2.5" /> Nouveau
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <a
                          href={`/products/${product.slug}`}
                          target="_blank"
                          className="p-1.5 rounded-lg text-on-surface-variant hover:text-primary hover:bg-primary/10 transition-all"
                        >
                          <Eye className="w-4 h-4" />
                        </a>
                        <button
                          onClick={() => openEditForm(product)}
                          className="p-1.5 rounded-lg text-on-surface-variant hover:text-secondary hover:bg-secondary/10 transition-all"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(product.id)}
                          className="p-1.5 rounded-lg text-on-surface-variant hover:text-error hover:bg-error/10 transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete confirmation modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className="glass-card rounded-2xl p-6 border border-white/5 max-w-sm w-full">
            <h3 className="font-bold font-headline mb-2">Supprimer le produit?</h3>
            <p className="text-on-surface-variant text-sm mb-5">
              Cette action est irréversible. Le produit sera définitivement supprimé.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="btn-secondary flex-1 py-2.5 text-sm"
              >
                Annuler
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="flex-1 py-2.5 text-sm rounded-full font-bold bg-error/20 text-error hover:bg-error/30 transition-all border border-error/30"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Product form modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-start justify-center p-4 overflow-y-auto">
          <div className="glass-card rounded-2xl border border-white/5 w-full max-w-2xl my-8">
            <div className="flex items-center justify-between p-6 border-b border-white/5">
              <h2 className="font-bold font-headline flex items-center gap-2">
                <Package className="w-5 h-5 text-primary" />
                {editingProduct ? "Modifier le produit" : "Nouveau produit"}
              </h2>
              <button onClick={() => setShowForm(false)} className="p-2 text-on-surface-variant hover:text-white hover:bg-white/5 rounded-lg transition-all">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-on-surface-variant mb-1.5">Nom du produit *</label>
                  <input
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Dashboard Admin Pro..."
                    className="input-field"
                    maxLength={200}
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-on-surface-variant mb-1.5">Description courte *</label>
                  <textarea
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    placeholder="Description du produit..."
                    rows={2}
                    className="input-field resize-none"
                    maxLength={5000}
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-on-surface-variant mb-1.5">Description longue</label>
                  <textarea
                    value={form.longDescription}
                    onChange={(e) => setForm({ ...form, longDescription: e.target.value })}
                    placeholder="Description détaillée du produit..."
                    rows={4}
                    className="input-field resize-none"
                    maxLength={10000}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-on-surface-variant mb-1.5">Prix (DZD) *</label>
                  <input
                    type="number"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    placeholder="2500"
                    className="input-field"
                    min={0}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-on-surface-variant mb-1.5">Prix original (DZD)</label>
                  <input
                    type="number"
                    value={form.originalPrice}
                    onChange={(e) => setForm({ ...form, originalPrice: e.target.value })}
                    placeholder="4500 (optionnel)"
                    className="input-field"
                    min={0}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-on-surface-variant mb-1.5">Catégorie *</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value as ProductCategory })}
                    className="input-field"
                  >
                    {CATEGORIES.filter(c => c.value).map((c) => (
                      <option key={c.value} value={c.value} className="bg-surface-container">{c.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-on-surface-variant mb-1.5">Tags</label>
                  <input
                    value={form.tags}
                    onChange={(e) => setForm({ ...form, tags: e.target.value })}
                    placeholder="nextjs, admin, dashboard"
                    className="input-field"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-on-surface-variant mb-1.5">Image du produit</label>
                  <div className="flex gap-2">
                    <input
                      value={form.imageUrl}
                      onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                      placeholder="URL ou uploadez depuis votre appareil →"
                      className="input-field flex-1"
                    />
                    <button
                      type="button"
                      onClick={() => imageInputRef.current?.click()}
                      disabled={uploadingImage}
                      className="btn-secondary flex items-center gap-1.5 px-4 py-2 text-sm whitespace-nowrap disabled:opacity-60"
                    >
                      {uploadingImage ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <ImagePlus className="w-4 h-4" />
                      )}
                      {uploadingImage ? "Upload..." : "Depuis l'appareil"}
                    </button>
                    <input
                      ref={imageInputRef}
                      type="file"
                      accept="image/jpeg,image/png,image/webp,image/gif"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleImageUpload(file);
                        e.target.value = "";
                      }}
                    />
                  </div>
                  <p className="text-xs text-on-surface-variant mt-1">JPG, PNG, WebP ou GIF — max 5 MB</p>
                  {form.imageUrl && (
                    <div className="mt-2 relative w-20 h-20 rounded-xl overflow-hidden bg-surface-container-high">
                      <Image src={form.imageUrl} alt="Preview" fill className="object-cover" sizes="80px" />
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-on-surface-variant mb-1.5">Type de fichier</label>
                  <input
                    value={form.fileType}
                    onChange={(e) => setForm({ ...form, fileType: e.target.value })}
                    placeholder="ZIP, PDF, EXE..."
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-on-surface-variant mb-1.5">Taille du fichier</label>
                  <input
                    value={form.fileSize}
                    onChange={(e) => setForm({ ...form, fileSize: e.target.value })}
                    placeholder="12.4 MB"
                    className="input-field"
                  />
                </div>

                {/* SEO Fields */}
                <div className="md:col-span-2 border-t border-white/5 pt-4 mt-2">
                  <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wide mb-3">SEO</p>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-on-surface-variant mb-1.5">Titre SEO</label>
                  <input
                    value={form.seoTitle}
                    onChange={(e) => setForm({ ...form, seoTitle: e.target.value })}
                    placeholder="Titre optimisé pour Google (max 60 car.)"
                    className="input-field"
                    maxLength={60}
                  />
                  <p className="text-xs text-on-surface-variant mt-1">{form.seoTitle.length}/60</p>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-on-surface-variant mb-1.5">Description SEO</label>
                  <textarea
                    value={form.seoDescription}
                    onChange={(e) => setForm({ ...form, seoDescription: e.target.value })}
                    placeholder="Description pour les résultats Google (max 160 car.)"
                    className="input-field resize-none"
                    rows={2}
                    maxLength={160}
                  />
                  <p className="text-xs text-on-surface-variant mt-1">{form.seoDescription.length}/160</p>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-on-surface-variant mb-2">Options</label>
                  <div className="flex gap-4 flex-wrap">
                    {[
                      { key: "featured", label: "⭐ En vedette" },
                      { key: "bestSeller", label: "🔥 Best Seller" },
                      { key: "isNew", label: "⚡ Nouveau" },
                    ].map(({ key, label }) => (
                      <label key={key} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={form[key as keyof ProductFormData] as boolean}
                          onChange={(e) => setForm({ ...form, [key]: e.target.checked })}
                          className="w-4 h-4 rounded accent-primary"
                        />
                        <span className="text-sm">{label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {editingProduct && (
                  <div className="md:col-span-2 p-3 rounded-xl bg-primary/5 border border-primary/10">
                    <p className="text-xs text-on-surface-variant flex items-center gap-2">
                      <Upload className="w-3.5 h-3.5 text-primary" />
                      Pour uploader le fichier numérique, allez dans{" "}
                      <a href="/admin/upload" className="text-primary font-bold hover:underline">
                        Admin → Upload
                      </a>{" "}
                      et utilisez l&apos;ID: <code className="text-primary font-mono">{editingProduct.id}</code>
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-3 p-6 border-t border-white/5">
              <button onClick={() => setShowForm(false)} className="btn-secondary flex-1 py-3">
                Annuler
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="btn-primary flex-1 py-3 flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                {editingProduct ? "Sauvegarder" : "Ajouter"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
