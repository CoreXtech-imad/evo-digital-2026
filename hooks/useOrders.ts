"use client";

import { useState, useEffect, useCallback } from "react";
import { Order, OrderStatus } from "@/types";
import toast from "react-hot-toast";

function getAdminKey(): string {
  // In production, this would be retrieved securely
  // For demo, using a session-stored value
  return process.env.NEXT_PUBLIC_ADMIN_API_KEY || "";
}

interface UseOrdersReturn {
  orders: Order[];
  loading: boolean;
  error: string | null;
  updateStatus: (orderId: string, status: OrderStatus) => Promise<void>;
  refetch: () => void;
}

export function useOrders(statusFilter?: OrderStatus): UseOrdersReturn {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = statusFilter ? `?status=${statusFilter}` : "";
      const res = await fetch(`/api/orders${params}`, {
        headers: { Authorization: `Bearer ${getAdminKey()}` },
      });
      if (!res.ok) throw new Error("Erreur d'autorisation");
      const data = await res.json();
      setOrders(data.orders || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const updateStatus = async (orderId: string, status: OrderStatus) => {
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getAdminKey()}`,
        },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error("Erreur mise à jour");

      setOrders((prev) =>
        prev.map((o) =>
          o.id === orderId
            ? { ...o, status, updatedAt: new Date().toISOString() }
            : o
        )
      );
      toast.success("Statut mis à jour");
    } catch {
      toast.error("Erreur lors de la mise à jour du statut");
    }
  };

  return { orders, loading, error, updateStatus, refetch: fetchOrders };
}
