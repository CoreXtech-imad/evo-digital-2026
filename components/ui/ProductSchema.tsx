import { Product } from "@/types";

interface ProductSchemaProps {
  product: Product;
  url: string;
}

export default function ProductSchema({ product, url }: ProductSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: product.images,
    url,
    sku: product.id,
    brand: {
      "@type": "Brand",
      name: "Evo Digital",
    },
    offers: {
      "@type": "Offer",
      url,
      priceCurrency: "DZD",
      price: product.price,
      availability:
        product.stock === -1 || product.stock > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
      seller: {
        "@type": "Organization",
        name: "Evo Digital",
      },
    },
    aggregateRating:
      product.rating > 0 && product.reviewCount > 0
        ? {
            "@type": "AggregateRating",
            ratingValue: product.rating,
            reviewCount: product.reviewCount,
            bestRating: 5,
            worstRating: 1,
          }
        : undefined,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function StoreSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Store",
    name: "Evo Digital",
    description:
      "La boutique numérique premium d'Algérie. Logiciels, templates, ebooks et formations.",
    url: process.env.NEXT_PUBLIC_APP_URL,
    logo: `${process.env.NEXT_PUBLIC_APP_URL}/favicon.svg`,
    sameAs: [],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      availableLanguage: ["French", "Arabic"],
    },
    areaServed: {
      "@type": "Country",
      name: "Algeria",
    },
    currenciesAccepted: "DZD",
    paymentAccepted: "Cash",
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
