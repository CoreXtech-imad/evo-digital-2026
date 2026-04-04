"use client";

import { useState, useEffect, useCallback } from "react";
import { CartItem, Product } from "@/types";

const CART_KEY = "evo_digital_cart";

export function useCart() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem(CART_KEY);
    if (stored) {
      try {
        setItems(JSON.parse(stored));
      } catch {
        localStorage.removeItem(CART_KEY);
      }
    }
  }, []);

  const save = (newItems: CartItem[]) => {
    setItems(newItems);
    localStorage.setItem(CART_KEY, JSON.stringify(newItems));
  };

  const addItem = useCallback(
    (product: Product, quantity: number = 1) => {
      const existing = items.find((i) => i.product.id === product.id);
      if (existing) {
        save(
          items.map((i) =>
            i.product.id === product.id
              ? { ...i, quantity: i.quantity + quantity }
              : i
          )
        );
      } else {
        save([...items, { product, quantity }]);
      }
    },
    [items]
  );

  const removeItem = useCallback(
    (productId: string) => {
      save(items.filter((i) => i.product.id !== productId));
    },
    [items]
  );

  const updateQuantity = useCallback(
    (productId: string, quantity: number) => {
      if (quantity <= 0) {
        removeItem(productId);
        return;
      }
      save(
        items.map((i) =>
          i.product.id === productId ? { ...i, quantity } : i
        )
      );
    },
    [items, removeItem]
  );

  const clearCart = useCallback(() => {
    save([]);
  }, []);

  const total = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  const count = items.reduce((sum, item) => sum + item.quantity, 0);

  return {
    items,
    total,
    count,
    mounted,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
  };
}
