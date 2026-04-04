# Evo Digital — Premium Digital Store

A production-ready digital products store built for the Algerian market. Sell software, templates, ebooks, courses, scripts, and digital assets with built-in secure delivery, admin dashboard, and marketing integrations.

---

## Tech Stack

| Layer        | Technology                                              |
| ------------ | ------------------------------------------------------- |
| Framework    | Next.js 15 (App Router, React 19)                       |
| Styling      | Tailwind CSS 3 + custom design system                   |
| Database     | Firebase Firestore                                      |
| File Storage | Firebase Storage (private, signed URLs)                  |
| Auth         | Session-based admin auth (password)                      |
| Email        | Nodemailer (SMTP — Gmail, Resend, etc.)                  |
| Validation   | Zod + React Hook Form                                   |
| Animations   | Framer Motion                                            |
| Deployment   | Vercel (recommended) or any Node.js host                 |
| Analytics    | Google Analytics 4, Facebook Pixel, Google Tag Manager   |
| Automation   | Webhook system (n8n, Zapier, Make)                       |

---

## Features

- Responsive storefront with dark-mode design
- Product catalog with categories, search, and filters
- Shopping cart with checkout flow (Cash on Delivery)
- Secure digital file delivery with signed, expiring download links
- Admin dashboard with analytics, product CRUD, and order management
- Webhook integration for automation (n8n, Zapier)
- SMTP email delivery (order confirmation + admin notifications)
- SEO optimized (meta tags, Open Graph, JSON-LD, sitemap)
- Security headers, CSP, input validation, and route protection
- Demo mode — runs without Firebase for previewing

---

## Getting Started

### Prerequisites

- **Node.js** 18.17+ (LTS recommended)
- **npm** or **yarn** or **pnpm**
- A **Firebase** project (free tier works)
- (Optional) An SMTP email account

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/evo-digital.git
cd evo-digital
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

Copy the example file and fill in your values:

```bash
cp .env.example .env.local
```

Open `.env.local` and configure each variable. See the **Environment Variables** section below for details.

### 4. Run Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

> **Demo mode:** If Firebase credentials are not configured, the app automatically runs with demo products and placeholder data. Everything works — you can preview the full UI, cart, checkout, and admin panel.

### 5. Seed Demo Data (Optional)

If you've connected Firebase and want to populate it with demo products:

```bash
npm run seed
```

### 6. Build for Production

```bash
npm run build
npm start
```

---

## Environment Variables

All configuration is loaded from `.env.local`. See `.env.example` for the full list.

### Required for Production

| Variable                              | Description                                      |
| ------------------------------------- | ------------------------------------------------ |
| `NEXT_PUBLIC_APP_URL`                 | Your live site URL (e.g. `https://evodigital.dz`) |
| `ADMIN_SECRET_KEY`                    | Secret key to protect admin API routes            |
| `NEXT_PUBLIC_ADMIN_PASSWORD`          | Password to access the admin panel                |
| `DOWNLOAD_TOKEN_SECRET`              | Secret used to sign download links                |

### Firebase

| Variable                                    | Description                    |
| ------------------------------------------- | ------------------------------ |
| `NEXT_PUBLIC_FIREBASE_API_KEY`              | Firebase Web API key           |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`          | Firebase auth domain           |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID`           | Firebase project ID            |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`       | Firebase Storage bucket        |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`  | FCM sender ID                  |
| `NEXT_PUBLIC_FIREBASE_APP_ID`               | Firebase app ID                |
| `FIREBASE_ADMIN_PROJECT_ID`                 | Same as project ID             |
| `FIREBASE_ADMIN_CLIENT_EMAIL`              | Service account email          |
| `FIREBASE_ADMIN_PRIVATE_KEY`               | Service account private key    |

### Email (SMTP)

| Variable       | Description                                            |
| -------------- | ------------------------------------------------------ |
| `SMTP_HOST`    | SMTP server host (e.g. `smtp.gmail.com`)               |
| `SMTP_PORT`    | SMTP port (typically `587`)                             |
| `SMTP_USER`    | SMTP username / email                                  |
| `SMTP_PASS`    | SMTP password or app password                          |
| `EMAIL_FROM`   | Sender name + email (e.g. `"Evo Digital" <noreply@…>`) |
| `ADMIN_EMAIL`  | Email to receive admin notifications                   |

### Webhook (Automation)

| Variable                      | Description                                 |
| ----------------------------- | ------------------------------------------- |
| `N8N_WEBHOOK_URL`            | n8n / Zapier / Make webhook endpoint         |
| `N8N_WEBHOOK_SECRET`         | Shared secret for webhook verification       |
| `DELIVERY_WEBHOOK_URL`       | Secondary webhook for delivery automation    |
| `DELIVERY_WEBHOOK_SECRET`    | Secret for delivery webhook                  |

### Analytics & Marketing

| Variable                           | Description                |
| ---------------------------------- | -------------------------- |
| `NEXT_PUBLIC_GA_ID`               | Google Analytics 4 ID      |
| `NEXT_PUBLIC_FACEBOOK_PIXEL_ID`   | Facebook Pixel ID          |
| `NEXT_PUBLIC_GTM_ID`             | Google Tag Manager ID      |

---

## Deployment

### Deploy on Vercel (Recommended)

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com) → **Add New Project**
3. Import your GitHub repository
4. Set the **Framework Preset** to `Next.js`
5. Add all environment variables from `.env.local` into Vercel's **Environment Variables** section
6. Click **Deploy**

The project includes a `vercel.json` with optimal settings (CDG1 region for Europe/Algeria, security headers, sitemap rewrite).

### Deploy via GitHub

1. Create a new repository on GitHub
2. Push the project:

```bash
git init
git add .
git commit -m "Initial commit — Evo Digital Store"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/evo-digital.git
git push -u origin main
```

3. Connect the repo to Vercel, Netlify, or any hosting platform that supports Next.js.

### Deploy on Other Platforms

The project builds as a standard Next.js app:

```bash
npm run build    # Creates .next/ output
npm start        # Starts production server on port 3000
```

For Docker or self-hosted deployments, set `PORT` and all env vars accordingly.

---

## Admin Panel

### Access

Navigate to `/admin` on your deployed site or `http://localhost:3000/admin` locally.

Enter the password defined in `NEXT_PUBLIC_ADMIN_PASSWORD`.

### Features

| Section       | What You Can Do                                                |
| ------------- | -------------------------------------------------------------- |
| **Dashboard** | View revenue, orders, products count, conversion rate, charts  |
| **Products**  | Add, edit, delete products; set featured/bestseller/new flags  |
| **Orders**    | View all orders, filter by status, change status, contact via WhatsApp |
| **Analytics** | View visitors, revenue trends, top products, traffic sources   |
| **Upload**    | Upload digital files to Firebase Storage, link to products     |
| **Settings**  | Store info, notifications, webhook config, analytics IDs       |

### Adding a Product

1. Go to **Admin → Products → Ajouter**
2. Fill in the product details (name, description, price, category, image URL)
3. Save the product
4. Go to **Admin → Upload** and upload the digital file for this product
5. The file is automatically linked to the product with a secure download URL

### Managing Orders

1. Go to **Admin → Orders**
2. Click an order to see full details
3. Change status: Pending → Confirmed → Processing → Delivered
4. Contact the customer via WhatsApp or email directly from the panel

---

## Webhook Integration (n8n / Zapier / Make)

When an order is created, the system sends a POST request to your configured webhook URLs with this payload:

```json
{
  "event": "order.created",
  "timestamp": "2025-01-15T10:30:00.000Z",
  "order": {
    "id": "abc123",
    "orderNumber": "EVO-M8X2-K9PQ",
    "customer": {
      "name": "Karim B.",
      "email": "karim@example.com",
      "phone": "0555 123 456"
    },
    "items": [
      {
        "productId": "prod-1",
        "productName": "Dashboard Admin Pro",
        "price": 2500,
        "quantity": 1
      }
    ],
    "total": 2500,
    "status": "pending"
  }
}
```

The request includes an `X-Webhook-Secret` header for verification.

**Use cases:**
- Auto-send download links via email
- Notify a Telegram/Discord channel
- Add customer to a CRM or mailing list
- Trigger a Google Sheets log

---

## Security

- **Admin routes** protected by `ADMIN_SECRET_KEY` (API) and password (UI)
- **Download links** are HMAC-signed, time-limited (72h), and count-limited (3 downloads)
- **Input validation** with Zod schemas on all API endpoints
- **Security headers**: CSP, X-Frame-Options, X-Content-Type-Options, Referrer-Policy
- **File uploads** validated by type and size (max 500MB)
- **Firebase Storage** files are private — never publicly accessible
- **HTML sanitization** on user inputs to prevent XSS

---

## Project Structure

```
evo-digital/
├── app/
│   ├── admin/           # Admin panel pages
│   ├── api/             # API routes (orders, products, download, upload, etc.)
│   ├── checkout/        # Checkout page
│   ├── order-confirmation/
│   ├── products/[id]/   # Product detail page
│   ├── shop/            # Shop / catalog page
│   ├── layout.tsx       # Root layout (fonts, analytics, meta)
│   └── page.tsx         # Homepage
├── components/
│   ├── admin/           # Admin UI components
│   ├── layout/          # Navbar, Footer, CartDrawer
│   ├── sections/        # Homepage sections
│   └── ui/              # Shared UI components
├── hooks/               # Custom React hooks
├── lib/
│   ├── db.ts            # Firestore data access layer
│   ├── email.ts         # Email + webhook delivery
│   ├── firebase.ts      # Firebase client SDK
│   ├── firebase-admin.ts # Firebase Admin SDK
│   └── utils.ts         # Utility functions
├── types/               # TypeScript type definitions
├── scripts/             # Database seeding
├── public/              # Static assets
├── .env.example         # Environment variables template
├── middleware.ts         # Security headers + admin route protection
├── next.config.ts       # Next.js configuration
├── vercel.json          # Vercel deployment config
└── firestore.rules      # Firestore security rules
```

---

## Troubleshooting

### "Firebase not configured" / Demo mode

The app runs in demo mode when Firebase credentials are missing or invalid. To connect to a real database, fill in all `FIREBASE_*` and `FIREBASE_ADMIN_*` variables in `.env.local`.

### Build fails with type errors

Run `npm run type-check` to see specific errors. Common fixes:
- Ensure all dependencies are installed: `rm -rf node_modules && npm install`
- Check that your Node.js version is 18.17+

### Emails not sending

- Verify `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS` in `.env.local`
- For Gmail: enable "App Passwords" in your Google account (2FA must be on)
- Check server logs for detailed error messages

### Upload fails

- Ensure Firebase Storage is enabled in your Firebase project
- Verify `FIREBASE_ADMIN_PRIVATE_KEY` is correctly formatted (replace `\\n` with actual newlines)
- Check that the Firebase service account has Storage Admin permissions

### Admin panel won't load

- Make sure `NEXT_PUBLIC_ADMIN_PASSWORD` is set in `.env.local`
- Clear browser session storage and try again
- Verify the `ADMIN_SECRET_KEY` matches in your environment

### Webhook not triggering

- Ensure `N8N_WEBHOOK_URL` is set and the endpoint is publicly accessible
- Check server logs for webhook delivery errors
- Verify the receiving service accepts POST requests with JSON body

---

## Scripts

| Command              | Description                       |
| -------------------- | --------------------------------- |
| `npm run dev`        | Start development server          |
| `npm run build`      | Build for production               |
| `npm start`          | Start production server            |
| `npm run lint`       | Run ESLint                         |
| `npm run type-check` | Run TypeScript type checking       |
| `npm run seed`       | Seed Firestore with demo products  |

---

## License

Private project. All rights reserved.
