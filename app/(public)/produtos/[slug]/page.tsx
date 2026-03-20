import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AddToCartButton } from "@/components/cart/add-to-cart-button";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ProductImage } from "@/components/ui/product-image";
import { getPublicProductBySlug } from "@/lib/public/products";
import { formatCurrency } from "@/lib/utils/format";

type ProductDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: ProductDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getPublicProductBySlug(slug);

  if (!product) {
    return {
      title: "Produto nao encontrado",
    };
  }

  return {
    title: product.name,
    description: product.short_description || product.description || `Detalhes de ${product.name}`,
  };
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { slug } = await params;
  const product = await getPublicProductBySlug(slug);

  if (!product) {
    notFound();
  }

  return (
    <main className="page-section">
      <div className="container-shell grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
        <div className="overflow-hidden rounded-[2rem] border border-white/60 bg-white shadow-sm">
          <div className="relative aspect-[5/4] bg-slate-100">
            <ProductImage
              src={product.image_url}
              alt={product.name}
              priority
              sizes="(min-width: 1024px) 56vw, 100vw"
              className="transition duration-700"
              fallbackLabel={product.name}
            />
          </div>
        </div>
        <div className="glass-card rounded-[2rem] p-8">
          <div className="flex flex-wrap items-center gap-3">
            {product.category ? <Badge variant="accent">{product.category}</Badge> : null}
            {product.featured ? <Badge variant="success">Em destaque</Badge> : null}
          </div>
          <h1 className="mt-5 text-4xl font-semibold tracking-tight text-slate-950">{product.name}</h1>
          <p className="mt-4 text-base leading-7 text-slate-600">
            {product.description || product.short_description || "Descricao em atualizacao."}
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-white p-5">
              <p className="text-sm text-slate-500">Preco</p>
              <p className="mt-2 text-2xl font-semibold text-slate-950">{formatCurrency(product.price)}</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-5">
              <p className="text-sm text-slate-500">Estoque</p>
              <p className="mt-2 text-2xl font-semibold text-slate-950">{product.stock} unidades</p>
            </div>
          </div>
          {product.short_description ? (
            <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <p className="text-sm font-medium text-slate-700">Resumo</p>
              <p className="mt-2 text-sm leading-6 text-slate-600">{product.short_description}</p>
            </div>
          ) : null}
          <div className="mt-8 flex flex-wrap gap-3">
            <AddToCartButton productId={product.id} className="h-12 px-6 text-base" />
            <Button asChild size="lg" variant="secondary">
              <Link href="/produtos">Voltar ao catalogo</Link>
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}
