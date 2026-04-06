import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { generateOrderNumber, sanitizeInput, isAdminAuthenticated } from "@/lib/utils";

const orderSchema = z.object({
  customer: z.record(z.string().max(500)),
  items: z.array(z.object({
    productId:    z.string(),
    productName:  z.string(),
    productImage: z.string(),
    price:        z.number().positive(),
    quantity:     z.number().int().positive(),
  })).min(1),
  subtotal:      z.number().nonnegative(),
  shippingFee:   z.number().nonnegative().optional(),
  total:         z.number().positive(),
  paymentMethod: z.string().min(1).max(50),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = orderSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Données invalides", details: parsed.error.issues },
        { status: 400 }
      );
    }

    const data = parsed.data;
    data.customer.name = sanitizeInput(data.customer.name);
    data.customer.address = sanitizeInput(data.customer.address);
    if (data.customer.notes) data.customer.notes = sanitizeInput(data.customer.notes);

    const orderNumber = generateOrderNumber();
    let orderId = `demo-${Date.now()}`;

    // Try to save to Firebase — gracefully degrade if not configured
    try {
      const { getAdminDb } = await import("@/lib/firebase-admin");
      const db = getAdminDb();
      const ref = await db.collection("orders").add({
        orderNumber,
        ...data,
        status: "pending",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      orderId = ref.id;

      // Increment sold counts (non-blocking)
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const { FieldValue } = require("firebase-admin/firestore");
      for (const item of data.items) {
        db.collection("products").doc(item.productId)
          .update({ sold: FieldValue.increment(item.quantity) })
          .catch(() => {});
      }
    } catch {
      // Firebase not configured — order still confirmed in demo mode
      console.info("[Evo Digital] Order saved in demo mode (Firebase not configured):", orderNumber);
    }

    // Send notifications (non-blocking, never crash the response)
    (async () => {
      try {
        const { sendOrderConfirmationEmail, sendAdminOrderNotification, triggerDeliveryWebhook, triggerN8nWebhook } =
          await import("@/lib/email");
        const orderObj = {
          id: orderId, orderNumber, ...data,
          status: "pending" as const,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        await Promise.allSettled([
          sendOrderConfirmationEmail(orderObj),
          sendAdminOrderNotification(orderObj),
          triggerDeliveryWebhook(orderObj),
          triggerN8nWebhook(orderObj),
        ]);
      } catch {}
    })();

    return NextResponse.json({ orderId, orderNumber, status: "pending" }, { status: 201 });
  } catch (error) {
    console.error("Order creation error:", error);
    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  if (!isAdminAuthenticated(request)) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }
  try {
    const { getAdminDb } = await import("@/lib/firebase-admin");
    const db = getAdminDb();
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");

    let q: any = db.collection("orders").orderBy("createdAt", "desc");
    if (status) q = q.where("status", "==", status);

    const snap = await q.limit(100).get();
    const orders = snap.docs.map((d: any) => ({ id: d.id, ...d.data() }));
    return NextResponse.json({ orders });
  } catch {
    return NextResponse.json({ orders: [] });
  }
}
