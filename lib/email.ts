import nodemailer from "nodemailer";
import { Order } from "@/types";
import { formatDZD } from "./utils";

// ── SMTP Transporter ─────────────────────────────────────────────────────────
function createTransporter() {
  const host = process.env.SMTP_HOST || process.env.EMAIL_HOST || "smtp.gmail.com";
  const port = parseInt(process.env.SMTP_PORT || process.env.EMAIL_PORT || "587");
  const user = process.env.SMTP_USER || process.env.EMAIL_USER;
  const pass = process.env.SMTP_PASS || process.env.EMAIL_PASS;

  if (!user || !pass) return null;

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });
}

const transporter = createTransporter();

function getSender(): string {
  const user = process.env.SMTP_USER || process.env.EMAIL_USER || "";
  return process.env.EMAIL_FROM || `"Evo Digital" <${user}>`;
}

// ── Order Confirmation Email ─────────────────────────────────────────────────
export async function sendOrderConfirmationEmail(order: Order): Promise<void> {
  if (!transporter) return;

  const itemsList = order.items
    .map(
      (item) =>
        `<tr>
          <td style="padding:8px;border-bottom:1px solid #1a1a1a;">${item.productName}</td>
          <td style="padding:8px;border-bottom:1px solid #1a1a1a;text-align:center;">${item.quantity}</td>
          <td style="padding:8px;border-bottom:1px solid #1a1a1a;text-align:right;">${formatDZD(item.price * item.quantity)}</td>
        </tr>`
    )
    .join("");

  let downloadSection = "";
  if (order.downloadLinks && order.downloadLinks.length > 0) {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const links = order.downloadLinks
      .map(
        (dl) =>
          `<tr>
            <td style="padding:8px;border-bottom:1px solid #1a1a1a;">${dl.productName}</td>
            <td style="padding:8px;border-bottom:1px solid #1a1a1a;text-align:center;">
              <a href="${baseUrl}/api/download?token=${dl.token}&orderId=${order.id}&productId=${dl.productId}"
                 style="color:#61cdff;text-decoration:none;font-weight:bold;">Télécharger</a>
            </td>
            <td style="padding:8px;border-bottom:1px solid #1a1a1a;text-align:right;color:#adaaaa;">
              ${dl.maxDownloads} max
            </td>
          </tr>`
      )
      .join("");

    downloadSection = `
      <div style="background:#1a1a1a;border-radius:16px;padding:32px;margin-bottom:24px;">
        <h3 style="color:#61cdff;margin:0 0 16px;">📦 Vos Téléchargements</h3>
        <table style="width:100%;border-collapse:collapse;">
          <thead><tr style="border-bottom:1px solid #262626;">
            <th style="padding:8px;text-align:left;color:#adaaaa;">Produit</th>
            <th style="padding:8px;text-align:center;color:#adaaaa;">Lien</th>
            <th style="padding:8px;text-align:right;color:#adaaaa;">Limite</th>
          </tr></thead>
          <tbody>${links}</tbody>
        </table>
        <p style="color:#adaaaa;font-size:12px;margin-top:16px;">⏳ Les liens expirent dans 72 heures.</p>
      </div>`;
  }

  const emailHtml = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Confirmation de commande</title></head>
    <body style="margin:0;padding:0;background:#0e0e0e;font-family:Arial,sans-serif;color:#ffffff;">
      <div style="max-width:600px;margin:0 auto;padding:40px 20px;">
        <div style="text-align:center;margin-bottom:40px;">
          <h1 style="background:linear-gradient(45deg,#61cdff,#aa8bff);-webkit-background-clip:text;-webkit-text-fill-color:transparent;font-size:28px;margin:0;">Evo Digital</h1>
        </div>
        <div style="background:#1a1a1a;border-radius:16px;padding:32px;margin-bottom:24px;">
          <h2 style="color:#61cdff;margin:0 0 16px;">✅ Commande Confirmée!</h2>
          <p style="color:#adaaaa;margin:0 0 8px;">Numéro: <strong style="color:#ffffff;">${order.orderNumber}</strong></p>
          <p style="color:#adaaaa;margin:0;">Merci ${order.customer.name} pour votre commande!</p>
        </div>
        <div style="background:#1a1a1a;border-radius:16px;padding:32px;margin-bottom:24px;">
          <h3 style="color:#ffffff;margin:0 0 16px;">Détails</h3>
          <table style="width:100%;border-collapse:collapse;">
            <thead><tr style="border-bottom:1px solid #262626;">
              <th style="padding:8px;text-align:left;color:#adaaaa;">Produit</th>
              <th style="padding:8px;text-align:center;color:#adaaaa;">Qté</th>
              <th style="padding:8px;text-align:right;color:#adaaaa;">Prix</th>
            </tr></thead>
            <tbody>${itemsList}</tbody>
            <tfoot><tr>
              <td colspan="2" style="padding:16px 8px 8px;font-weight:bold;color:#61cdff;">Total</td>
              <td style="padding:16px 8px 8px;font-weight:bold;color:#61cdff;text-align:right;">${formatDZD(order.total)}</td>
            </tr></tfoot>
          </table>
        </div>
        ${downloadSection}
        <div style="background:#1a1a1a;border-radius:16px;padding:32px;margin-bottom:24px;">
          <h3 style="color:#ffffff;margin:0 0 16px;">Mode de paiement</h3>
          <p style="color:#adaaaa;margin:0;">💵 Cash on Delivery</p>
        </div>
        <div style="text-align:center;color:#adaaaa;font-size:14px;">
          <p>Questions? <a href="mailto:${process.env.ADMIN_EMAIL || ""}" style="color:#61cdff;">${process.env.ADMIN_EMAIL || ""}</a></p>
          <p style="margin-top:16px;">© ${new Date().getFullYear()} Evo Digital</p>
        </div>
      </div>
    </body></html>`;

  await transporter.sendMail({
    from: getSender(),
    to: order.customer.email,
    subject: `✅ Commande Confirmée — ${order.orderNumber} | Evo Digital`,
    html: emailHtml,
  });
}

// ── Admin Notification ───────────────────────────────────────────────────────
export async function sendAdminOrderNotification(order: Order): Promise<void> {
  if (!transporter || !process.env.ADMIN_EMAIL) return;

  await transporter.sendMail({
    from: getSender(),
    to: process.env.ADMIN_EMAIL,
    subject: `🛍️ Nouvelle commande: ${order.orderNumber} — ${formatDZD(order.total)}`,
    html: `<h2>Nouvelle commande reçue!</h2>
      <p><strong>Numéro:</strong> ${order.orderNumber}</p>
      <p><strong>Client:</strong> ${order.customer.name}</p>
      <p><strong>Email:</strong> ${order.customer.email}</p>
      <p><strong>Téléphone:</strong> ${order.customer.phone}</p>
      <p><strong>Wilaya:</strong> ${order.customer.wilaya}</p>
      <p><strong>Total:</strong> ${formatDZD(order.total)}</p>
      <p><strong>Produits:</strong> ${order.items.map((i) => i.productName).join(", ")}</p>
      <hr>
      <a href="${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/admin/orders/${order.id}">Voir la commande →</a>`,
  });
}

// ── Digital Product Delivery Email ───────────────────────────────────────────
export async function sendDigitalDeliveryEmail(order: Order): Promise<void> {
  if (!transporter || !order.downloadLinks?.length) return;

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const linksHtml = order.downloadLinks
    .map(
      (dl) => `
      <div style="background:#1a1a1a;border-radius:12px;padding:20px;margin-bottom:12px;">
        <p style="margin:0 0 8px;font-weight:bold;color:#ffffff;">${dl.productName}</p>
        <a href="${baseUrl}/api/download?token=${dl.token}&orderId=${order.id}&productId=${dl.productId}"
           style="display:inline-block;padding:10px 24px;background:linear-gradient(45deg,#61cdff,#aa8bff);color:#000;border-radius:8px;text-decoration:none;font-weight:bold;">
          📥 Télécharger
        </a>
        <p style="color:#adaaaa;font-size:12px;margin-top:8px;">
          ${dl.maxDownloads} téléchargements max · Expire le ${new Date(dl.expiresAt).toLocaleDateString("fr-DZ")}
        </p>
      </div>`
    )
    .join("");

  await transporter.sendMail({
    from: getSender(),
    to: order.customer.email,
    subject: `📦 Vos fichiers sont prêts — ${order.orderNumber} | Evo Digital`,
    html: `<!DOCTYPE html><html>
      <body style="margin:0;padding:0;background:#0e0e0e;font-family:Arial,sans-serif;color:#ffffff;">
        <div style="max-width:600px;margin:0 auto;padding:40px 20px;">
          <div style="text-align:center;margin-bottom:40px;">
            <h1 style="background:linear-gradient(45deg,#61cdff,#aa8bff);-webkit-background-clip:text;-webkit-text-fill-color:transparent;font-size:28px;margin:0;">Evo Digital</h1>
          </div>
          <div style="background:#1a1a1a;border-radius:16px;padding:32px;margin-bottom:24px;">
            <h2 style="color:#61cdff;margin:0 0 16px;">📦 Vos produits numériques sont prêts!</h2>
            <p style="color:#adaaaa;">Bonjour ${order.customer.name}, vos fichiers sont disponibles au téléchargement.</p>
          </div>
          ${linksHtml}
          <div style="text-align:center;color:#adaaaa;font-size:12px;margin-top:32px;">
            <p>⏳ Les liens expirent dans 72 heures.</p>
            <p>© ${new Date().getFullYear()} Evo Digital</p>
          </div>
        </div>
      </body></html>`,
  });
}

// ── Webhook — Delivery Automation ────────────────────────────────────────────
export async function triggerDeliveryWebhook(order: Order): Promise<void> {
  const webhookUrl = process.env.DELIVERY_WEBHOOK_URL;
  if (!webhookUrl) return;

  try {
    await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Webhook-Secret": process.env.DELIVERY_WEBHOOK_SECRET || "",
      },
      body: JSON.stringify({
        event: "order.confirmed",
        order,
        timestamp: new Date().toISOString(),
      }),
    });
  } catch (error) {
    console.error("Delivery webhook failed:", error);
  }
}

// ── Webhook — n8n / Zapier / Make ────────────────────────────────────────────
export async function triggerN8nWebhook(order: Order): Promise<void> {
  const webhookUrl = process.env.N8N_WEBHOOK_URL;
  if (!webhookUrl) return;

  const payload = {
    event: "order.created",
    timestamp: new Date().toISOString(),
    order: {
      id: order.id,
      orderNumber: order.orderNumber,
      customer: {
        name: order.customer.name,
        email: order.customer.email,
        phone: order.customer.phone,
        wilaya: order.customer.wilaya,
        city: order.customer.city,
      },
      items: order.items.map((item) => ({
        productId: item.productId,
        productName: item.productName,
        price: item.price,
        quantity: item.quantity,
      })),
      subtotal: order.subtotal,
      total: order.total,
      status: order.status,
      paymentMethod: order.paymentMethod,
      createdAt: order.createdAt,
    },
  };

  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Webhook-Secret": process.env.N8N_WEBHOOK_SECRET || "",
        "X-Webhook-Source": "evo-digital",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      console.error(`n8n webhook responded with ${response.status}`);
    }
  } catch (error) {
    console.error("n8n webhook failed:", error);
  }
}
