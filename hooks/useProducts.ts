"use client";

import { useState, useEffect, useCallback } from "react";
import { Product, ProductCategory } from "@/types";

interface UseProductsOptions {
  category?: ProductCategory | "";
  featured?: boolean;
  bestSeller?: boolean;
  limit?: number;
  initialData?: Product[];
}

interface UseProductsReturn {
  products: Product[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useProducts(options: UseProductsOptions = {}): UseProductsReturn {
  const { category, featured, bestSeller, limit, initialData } = options;
  const [products, setProducts] = useState<Product[]>(initialData || []);
  const [loading, setLoading] = useState(!initialData);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (category) params.set("category", category);
      if (featured) params.set("featured", "true");
      if (bestSeller) params.set("bestSeller", "true");
      if (limit) params.set("limit", String(limit));

      const res = await fetch(`/api/products?${params.toString()}`);
      if (!res.ok) throw new Error("Erreur de chargement");
      const data = await res.json();
      setProducts(data.products || []);
    } catch (err: any) {
      setError(err.message || "Erreur inconnue");
    } finally {
      setLoading(false);
    }
  }, [category, featured, bestSeller, limit]);

  useEffect(() => {
    if (!initialData) {
      fetchProducts();
    }
  }, [fetchProducts, initialData]);

  return { products, loading, error, refetch: fetchProducts };
}

export function useProduct(id: string): {
  product: Product | null;
  loading: boolean;
  error: string | null;
} {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    fetch(`/api/products/${id}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.error) throw new Error(data.error);
        setProduct(data);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  return { product, loading, error };
}
