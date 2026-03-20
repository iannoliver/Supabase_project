import type { Metadata } from "next";
import { FeaturedProducts } from "@/components/public/featured-products";
import { HeroSection } from "@/components/public/hero-section";
import { ProductsGrid } from "@/components/public/products-grid";
import { getPublicProducts } from "@/lib/public/products";

export const metadata: Metadata = {
  title: "Home",
  description: "Vitrine pública premium com produtos ativos e itens em destaque.",
};

export default async function HomePage() {
  const { featured, products } = await getPublicProducts();

  return (
    <main>
      <HeroSection />
      <FeaturedProducts products={featured} />
      <ProductsGrid
        title="Catálogo disponível"
        description="Somente produtos ativos e publicados aparecem na área pública da aplicação."
        products={products}
      />
    </main>
  );
}
