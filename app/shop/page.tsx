import { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ShopClient from "./ShopClient";

export const metadata: Metadata = {
  title: "Boutique — Explorer tous les produits",
  description: "Logiciels, templates, ebooks, scripts et assets numériques premium. La boutique digitale #1 en Algérie.",
};

export default function ShopPage() {
  return (
    <>
      <Navbar />
      <ShopClient />
      <Footer />
    </>
  );
}
