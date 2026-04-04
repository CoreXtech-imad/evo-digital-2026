"use client";

import { useCart } from "@/hooks/useCart";
import { formatDZD } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { X, ShoppingBag, Trash2, Plus, Minus } from "lucide-react";

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
}

export default function CartDrawer({ open, onClose }: CartDrawerProps) {
  const { items, total, removeItem, updateQuantity } = useCart();

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-50 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
          open ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className={`fixed right-0 top-0 h-full w-full max-w-md z-50 flex flex-col transition-transform duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
        style={{
          background: "rgba(20,20,20,0.95)",
          backdropFilter: "blur(24px)",
          borderLeft: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/5">
          <div className="flex items-center gap-3">
            <ShoppingBag className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-bold font-headline">Mon Panier</h2>
            {items.length > 0 && (
              <span className="px-2 py-0.5 bg-primary/10 text-primary text-xs font-bold rounded-full">
                {items.length}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-2 text-on-surface-variant hover:text-white transition-colors rounded-lg hover:bg-white/5"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto py-4 px-6 space-y-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-20">
              <ShoppingBag className="w-16 h-16 text-on-surface-variant/30 mb-4" />
              <p className="text-on-surface-variant font-medium mb-2">
                Votre panier est vide
              </p>
              <p className="text-sm text-on-surface-variant/60 mb-6">
                Ajoutez des produits pour commencer
              </p>
              <button onClick={onClose}>
                <Link href="/shop" className="btn-primary text-sm">
                  Explorer la Boutique
                </Link>
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.product.id}
                className="flex gap-4 p-4 rounded-2xl bg-surface-container hover:bg-surface-container-high transition-colors"
              >
                <div className="relative w-16 h-16 rounded-xl overflow-hidden flex-shrink-0">
                  <Image
                    src={item.product.images[0] || "/images/placeholder.svg"}
                    alt={item.product.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-sm font-headline truncate">
                    {item.product.name}
                  </h3>
                  <p className="text-primary font-bold text-sm mt-1">
                    {formatDZD(item.product.price)}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <button
                      onClick={() =>
                        updateQuantity(item.product.id, item.quantity - 1)
                      }
                      className="w-6 h-6 rounded-full bg-surface-container-high flex items-center justify-center hover:bg-primary/20 transition-colors"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="text-sm font-bold w-4 text-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() =>
                        updateQuantity(item.product.id, item.quantity + 1)
                      }
                      className="w-6 h-6 rounded-full bg-surface-container-high flex items-center justify-center hover:bg-primary/20 transition-colors"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>
                <button
                  onClick={() => removeItem(item.product.id)}
                  className="p-1.5 text-on-surface-variant hover:text-error transition-colors rounded-lg hover:bg-error/10 self-start"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="p-6 border-t border-white/5 space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-on-surface-variant">Sous-total</span>
              <span className="font-bold text-lg font-headline gradient-text">
                {formatDZD(total)}
              </span>
            </div>
            <Link
              href="/checkout"
              onClick={onClose}
              className="btn-primary w-full text-center block text-base py-4"
            >
              Passer la Commande →
            </Link>
            <p className="text-center text-xs text-on-surface-variant">
              💵 Paiement à la livraison (Cash on Delivery)
            </p>
          </div>
        )}
      </div>
    </>
  );
}
