import type { Metadata } from "next";
import { ProductsGrid } from "@/components/public/products-grid";
import { getPublicProducts } from "@/lib/public/products";

export const metadata: Metadata = {
  title: "Produtos",
  description: "Explore o catálogo público de produtos ativos.",
};

export default async function ProductsPage() {
  const { products } = await getPublicProducts();

  return (
    <main>
      <ProductsGrid
        title="Todos os produtos"
        description="Uma vitrine comercial elegante, carregada via API interna do Next.js."
        products={products}
      />
    </main>
  );
}
