import { NextRequest, NextResponse } from "next/server";
import { requireRole } from "@/lib/admin-auth";

// POST /api/webhook — Send a test webhook to verify the integration
export async function POST(request: NextRequest) {
  if (!requireRole(request, "manager")) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const { url, type = "n8n" } = await request.json();

  if (!url) {
    return NextResponse.json({ error: "URL requise" }, { status: 400 });
  }

  const testPayload = {
    event: "webhook.test",
    timestamp: new Date().toISOString(),
    source: "evo-digital",
    order: {
      id: "test-order-123",
      orderNumber: "EVO-TEST-0001",
      customer: {
        name: "Test Client",
        email: "test@example.com",
        phone: "0555 000 000",
        wilaya: "Alger",
        city: "Alger",
      },
      items: [
        {
          productId: "test-prod-1",
          productName: "Produit Test",
          price: 1000,
          quantity: 1,
        },
      ],
      total: 1000,
      status: "pending",
    },
  };

  try {
    const secret = type === "n8n"
      ? process.env.N8N_WEBHOOK_SECRET || ""
      : process.env.DELIVERY_WEBHOOK_SECRET || "";

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Webhook-Secret": secret,
        "X-Webhook-Source": "evo-digital",
      },
      body: JSON.stringify(testPayload),
    });

    return NextResponse.json({
      success: response.ok,
      status: response.status,
      statusText: response.statusText,
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message || "Échec de connexion au webhook",
    }, { status: 502 });
  }
}

// GET /api/webhook — Check webhook configuration status
export async function GET(request: NextRequest) {
  if (!requireRole(request, "manager")) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  return NextResponse.json({
    n8n: {
      configured: !!process.env.N8N_WEBHOOK_URL,
      hasSecret: !!process.env.N8N_WEBHOOK_SECRET,
    },
    delivery: {
      configured: !!process.env.DELIVERY_WEBHOOK_URL,
      hasSecret: !!process.env.DELIVERY_WEBHOOK_SECRET,
    },
    email: {
      configured: !!(process.env.SMTP_USER || process.env.EMAIL_USER),
      adminEmail: !!process.env.ADMIN_EMAIL,
    },
  });
}
