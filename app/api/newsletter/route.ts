import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const schema = z.object({
  email: z.string().email("Email invalide"),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = schema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Email invalide" }, { status: 400 });
    }

    const { email } = parsed.data;

    // Save to Firestore
    try {
      const { getAdminDb } = await import("@/lib/firebase-admin");
      const db = getAdminDb();

      // Check if already subscribed
      const existing = await db
        .collection("subscribers")
        .where("email", "==", email)
        .limit(1)
        .get();

      if (!existing.empty) {
        return NextResponse.json(
          { message: "Déjà inscrit!" },
          { status: 200 }
        );
      }

      await db.collection("subscribers").add({
        email,
        subscribedAt: new Date().toISOString(),
        source: "homepage-newsletter",
      });
    } catch {
      // Firebase not configured — still return success
      console.log("Newsletter subscriber (Firebase not configured):", email);
    }

    // Send welcome email
    try {
      const nodemailer = await import("nodemailer");
      const transporter = nodemailer.default.createTransport({
        host: process.env.EMAIL_HOST,
        port: parseInt(process.env.EMAIL_PORT || "587"),
        auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
      });

      await transporter.sendMail({
        from: process.env.EMAIL_FROM,
        to: email,
        subject: "🎉 Bienvenue dans la newsletter Evo Digital!",
        html: `
          <div style="background:#0e0e0e;color:#fff;padding:40px;font-family:Arial,sans-serif;max-width:500px;margin:0 auto;border-radius:16px;">
            <h1 style="background:linear-gradient(45deg,#61cdff,#aa8bff);-webkit-background-clip:text;-webkit-text-fill-color:transparent;margin:0 0 16px;">
              Bienvenue chez Evo Digital! 🇩🇿
            </h1>
            <p style="color:#adaaaa;line-height:1.6;">
              Merci de vous être inscrit! Vous recevrez en avant-première nos nouveaux produits et offres exclusives.
            </p>
            <div style="margin:24px 0;padding:16px;background:#1a1a1a;border-radius:12px;border:1px solid rgba(97,205,255,0.1);">
              <p style="margin:0;color:#61cdff;font-weight:700;">🎁 Cadeau de bienvenue</p>
              <p style="margin:8px 0 0;color:#adaaaa;font-size:14px;">
                Utilisez le code <strong style="color:#fff;">WELCOME10</strong> pour -10% sur votre première commande!
              </p>
            </div>
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/shop" 
               style="display:inline-block;padding:12px 32px;background:linear-gradient(45deg,#61cdff,#aa8bff);color:#004259;font-weight:900;text-decoration:none;border-radius:50px;margin-top:8px;">
              Explorer la Boutique →
            </a>
            <p style="color:#484847;font-size:12px;margin-top:24px;">
              Se désabonner: <a href="${process.env.NEXT_PUBLIC_APP_URL}/api/newsletter/unsubscribe?email=${encodeURIComponent(email)}" style="color:#484847;">cliquez ici</a>
            </p>
          </div>
        `,
      });
    } catch {
      // Email sending failed — not critical
    }

    return NextResponse.json({ success: true }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
