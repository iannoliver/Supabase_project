import { ProductCard } from "@/components/public/product-card";
import { PageHeader } from "@/components/ui/page-header";
import type { Product } from "@/types";

export function FeaturedProducts({ products }: { products: Product[] }) {
  if (!products.length) return null;

  return (
    <section id="destaques" className="page-section">
      <div className="container-shell space-y-8">
        <PageHeader
          eyebrow="Curadoria"
          title="Produtos em destaque"
          description="Itens priorizados para campanhas, vitrines sazonais e maior conversão."
        />
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
