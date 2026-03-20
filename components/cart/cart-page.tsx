"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useCart } from "@/hooks/use-cart";
import { fetcher } from "@/lib/utils/fetcher";
import { formatCurrency } from "@/lib/utils/format";
import type { ApiResponse, Product } from "@/types";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { ProductImage } from "@/components/ui/product-image";
import { Skeleton } from "@/components/ui/skeleton";

type PublicProductsPayload = {
  featured: Product[];
  products: Product[];
};

export function CartPage() {
  const { items, isReady, removeItem, updateItemQuantity } = useCart();

  const query = useQuery({
    queryKey: ["public-products-cart"],
    queryFn: async () => {
      const response = await fetcher<ApiResponse<PublicProductsPayload>>("/api/products/public");
      if (!response.success) throw new Error(response.message);
      return response.data.products;
    },
  });

  const enrichedItems = useMemo(() => {
    const products = query.data ?? [];
    const productMap = new Map(products.map((product) => [product.id, product]));

    return items
      .map((item) => {
        const product = productMap.get(item.productId);
        if (!product) return null;

        return {
          item,
          product,
          lineTotal: product.price * item.quantity,
        };
      })
      .filter(Boolean) as Array<{
      item: { productId: string; quantity: number };
      product: Product;
      lineTotal: number;
    }>;
  }, [items, query.data]);

  const subtotal = enrichedItems.reduce((accumulator, currentItem) => accumulator + currentItem.lineTotal, 0);

  if (!isReady || query.isLoading) {
    return <Skeleton className="h-96 rounded-[2rem]" />;
  }

  if (query.isError) {
    return (
      <EmptyState
        title="Nao foi possivel carregar o carrinho"
        description={query.error.message || "Tente novamente em alguns instantes."}
      />
    );
  }

  if (!items.length) {
    return (
      <EmptyState
        title="Seu carrinho esta vazio"
        description="Adicione produtos ao carrinho para iniciar uma compra."
        action={
          <Button asChild>
            <Link href="/produtos">Explorar produtos</Link>
          </Button>
        }
      />
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
      <div className="space-y-4">
        {enrichedItems.map(({ item, product, lineTotal }) => (
          <article
            key={product.id}
            className="flex flex-col gap-4 rounded-[2rem] border border-white/60 bg-white/90 p-5 shadow-sm transition hover:shadow-md sm:flex-row"
          >
            <div className="relative h-40 w-full overflow-hidden rounded-2xl bg-slate-100 sm:w-44">
              <ProductImage
                src={product.image_url}
                alt={product.name}
                sizes="176px"
                fallbackLabel={product.name}
              />
            </div>
            <div className="flex flex-1 flex-col justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold text-slate-950">{product.name}</h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {product.short_description || "Produto selecionado."}
                </p>
                <p className="mt-3 text-sm font-medium text-slate-500">Estoque disponivel: {product.stock}</p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-2">
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={() => updateItemQuantity(product.id, Math.max(1, item.quantity - 1))}
                  >
                    <Minus className="size-4" />
                  </Button>
                  <span className="w-10 text-center text-sm font-semibold">{item.quantity}</span>
                  <Button size="icon" variant="outline" onClick={() => updateItemQuantity(product.id, item.quantity + 1)}>
                    <Plus className="size-4" />
                  </Button>
                </div>
                <div className="flex items-center gap-3">
                  <p className="text-lg font-semibold text-slate-950">{formatCurrency(lineTotal)}</p>
                  <Button size="icon" variant="ghost" onClick={() => removeItem(product.id)}>
                    <Trash2 className="size-4 text-rose-600" />
                  </Button>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
      <aside className="glass-card h-fit rounded-[2rem] p-6">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">Resumo</p>
        <div className="mt-6 space-y-3 text-sm text-slate-600">
          <div className="flex items-center justify-between">
            <span>Itens</span>
            <span>{items.length}</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Subtotal</span>
            <span className="font-semibold text-slate-950">{formatCurrency(subtotal)}</span>
          </div>
        </div>
        <Button asChild className="mt-6 w-full">
          <Link href="/checkout">Ir para checkout</Link>
        </Button>
      </aside>
    </div>
  );
}
