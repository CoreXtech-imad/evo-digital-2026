import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Manrope } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { Toaster } from "react-hot-toast";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-plus-jakarta",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-manrope",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Evo Digital — Votre Boutique Numérique Premium",
    template: "%s | Evo Digital",
  },
  description:
    "Téléchargez des logiciels premium, templates, outils et plus encore. La boutique numérique #1 en Algérie.",
  keywords: [
    "boutique digitale algérie",
    "logiciels premium",
    "templates",
    "outils numériques",
    "evo digital",
    "produits numériques dzd",
  ],
  openGraph: {
    type: "website",
    locale: "fr_DZ",
    siteName: "Evo Digital",
    title: "Evo Digital — Votre Boutique Numérique Premium",
    description: "Téléchargez des logiciels premium, templates, outils et plus encore.",
  },
  robots: { index: true, follow: true },
  themeColor: "#0e0e0e",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const gaId = process.env.NEXT_PUBLIC_GA_ID;
  const fbPixelId = process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID;
  const gtmId = process.env.NEXT_PUBLIC_GTM_ID;

  return (
    <html lang="fr" className={`dark ${plusJakarta.variable} ${manrope.variable}`}>
      <head>
        {/* Google Tag Manager — Head script */}
        {gtmId && (
          <Script
            id="gtm-head"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${gtmId}');`,
            }}
          />
        )}

        {/* Google Analytics 4 */}
        {gaId && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
              strategy="afterInteractive"
            />
            <Script
              id="ga4-init"
              strategy="afterInteractive"
              dangerouslySetInnerHTML={{
                __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${gaId}');`,
              }}
            />
          </>
        )}

        {/* Facebook Pixel */}
        {fbPixelId && (
          <Script
            id="fb-pixel"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
document,'script','https://connect.facebook.net/en_US/fbevents.js');
fbq('init','${fbPixelId}');fbq('track','PageView');`,
            }}
          />
        )}
      </head>
      <body style={{ fontFamily: "var(--font-manrope), Manrope, sans-serif" }}>
        {/* Google Tag Manager — noscript fallback */}
        {gtmId && (
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${gtmId}`}
              height="0"
              width="0"
              style={{ display: "none", visibility: "hidden" }}
            />
          </noscript>
        )}

        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: "#1a1a1a",
              color: "#fff",
              border: "1px solid rgba(97,205,255,0.15)",
              borderRadius: "12px",
              fontFamily: "var(--font-manrope), Manrope, sans-serif",
            },
            success: { iconTheme: { primary: "#61cdff", secondary: "#004259" } },
            error:   { iconTheme: { primary: "#ff716c", secondary: "#fff" } },
          }}
        />
      </body>
    </html>
  );
}
