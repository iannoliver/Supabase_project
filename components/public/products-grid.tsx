import { ProductCard } from "@/components/public/product-card";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/ui/page-header";
import type { Product } from "@/types";

export function ProductsGrid({
  title,
  description,
  products,
}: {
  title: string;
  description: string;
  products: Product[];
}) {
  return (
    <section className="page-section">
      <div className="container-shell space-y-8">
        <PageHeader title={title} description={description} />
        {products.length ? (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <EmptyState
            title="Nenhum produto publicado"
            description="Assim que houver itens ativos no catálogo, eles aparecerão aqui automaticamente."
          />
        )}
      </div>
    </section>
  );
}
