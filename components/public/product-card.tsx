import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { AddToCartButton } from "@/components/cart/add-to-cart-button";
import { Badge } from "@/components/ui/badge";
import { ProductImage } from "@/components/ui/product-image";
import { formatCurrency } from "@/lib/utils/format";
import type { Product } from "@/types";

export function ProductCard({ product }: { product: Product }) {
  return (
    <article className="group overflow-hidden rounded-[1.75rem] border border-white/60 bg-white/90 shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
      <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
        <ProductImage
          src={product.image_url}
          alt={product.name}
          sizes="(min-width: 1280px) 24rem, (min-width: 768px) 50vw, 100vw"
          className="transition duration-700 group-hover:scale-105"
          fallbackLabel={product.name}
        />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-slate-950/10 to-transparent opacity-0 transition group-hover:opacity-100" />
      </div>
      <div className="space-y-4 p-6">
        <div className="flex items-start justify-between gap-3">
          <div>
            {product.category ? <Badge variant="accent">{product.category}</Badge> : null}
            <h3 className="mt-3 text-xl font-semibold text-slate-950">{product.name}</h3>
          </div>
          <ArrowUpRight className="mt-1 size-5 text-slate-400 transition group-hover:text-slate-950" />
        </div>
        <p className="line-clamp-2 min-h-12 text-sm leading-6 text-slate-600">
          {product.short_description || product.description || "Produto pronto para ganhar destaque."}
        </p>
        <div className="flex items-center justify-between">
          <p className="text-lg font-semibold text-slate-950">{formatCurrency(product.price)}</p>
          <div className="flex items-center gap-2">
            <Link
              href={`/produtos/${product.slug}`}
              className="text-sm font-semibold text-slate-950 underline-offset-4 hover:underline"
            >
              Ver detalhes
            </Link>
            <AddToCartButton productId={product.id} className="h-10 px-4 text-sm" />
          </div>
        </div>
      </div>
    </article>
  );
}
