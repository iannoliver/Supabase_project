"use client";

import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useMemo } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useCart } from "@/hooks/use-cart";
import { fetcher } from "@/lib/utils/fetcher";
import { formatCurrency } from "@/lib/utils/format";
import { checkoutSchema, type CheckoutValues } from "@/lib/validators/checkout";
import type { ApiResponse, Product } from "@/types";
import { FormField } from "@/components/forms/form-field";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";

type PublicProductsPayload = {
  featured: Product[];
  products: Product[];
};

type PreferenceResponse = {
  orderId: string;
  externalReference: string;
  checkoutUrl: string;
};

export function CheckoutPage() {
  const { items, isReady } = useCart();
  const form = useForm<CheckoutValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      customer_name: "",
      customer_email: "",
      customer_document: "",
      items: [],
    },
  });

  useEffect(() => {
    form.setValue("items", items, {
      shouldDirty: false,
      shouldValidate: false,
    });
  }, [form, items]);

  const query = useQuery({
    queryKey: ["public-products-checkout"],
    queryFn: async () => {
      const response = await fetcher<ApiResponse<PublicProductsPayload>>("/api/products/public");
      if (!response.success) throw new Error(response.message);
      return response.data.products;
    },
  });

  const enrichedItems = useMemo(() => {
    const productMap = new Map((query.data ?? []).map((product) => [product.id, product]));

    return items
      .map((item) => {
        const product = productMap.get(item.productId);
        if (!product) return null;

        return {
          product,
          quantity: item.quantity,
          lineTotal: product.price * item.quantity,
        };
      })
      .filter(Boolean) as Array<{ product: Product; quantity: number; lineTotal: number }>;
  }, [items, query.data]);

  const subtotal = enrichedItems.reduce((accumulator, item) => accumulator + item.lineTotal, 0);

  const mutation = useMutation({
    mutationFn: async (values: CheckoutValues) => {
      console.log("[checkout] calling create-preference api", {
        items: values.items,
        customer_email: values.customer_email,
      });

      const response = await fetcher<ApiResponse<PreferenceResponse>>("/api/checkout/create-preference", {
        method: "POST",
        body: JSON.stringify({
          ...values,
          items,
        }),
      });

      if (!response.success) throw new Error(response.message);
      return response.data;
    },
    onSuccess: (data) => {
      window.location.href = data.checkoutUrl;
    },
    onError: (error: Error) => {
      toast.error(error.message || "Nao foi possivel iniciar o pagamento.");
    },
  });

  function onSubmit(values: CheckoutValues) {
    console.log("[checkout] submit executed", {
      values,
    });

    mutation.mutate({
      ...values,
      items,
    });
  }

  if (!isReady || query.isLoading) {
    return <Skeleton className="h-96 rounded-[2rem]" />;
  }

  if (query.isError) {
    return (
      <EmptyState
        title="Nao foi possivel preparar o checkout"
        description={query.error.message || "Recarregue a pagina e tente novamente."}
        action={
          <Button asChild>
            <Link href="/carrinho">Voltar ao carrinho</Link>
          </Button>
        }
      />
    );
  }

  if (!items.length) {
    return (
      <EmptyState
        title="Carrinho vazio"
        description="Seu checkout precisa de ao menos um item no carrinho."
        action={
          <Button asChild>
            <Link href="/produtos">Ver produtos</Link>
          </Button>
        }
      />
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
      <div className="glass-card rounded-[2rem] p-6">
        <div className="space-y-2">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">Checkout</p>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-950">Finalizar compra</h1>
          <p className="text-sm leading-6 text-slate-600">
            O pedido sera criado no servidor antes do redirecionamento para o Mercado Pago Checkout Pro.
          </p>
        </div>
        <form onSubmit={form.handleSubmit(onSubmit)} className="mt-8 grid gap-4">
          <FormField label="Nome completo" error={form.formState.errors.customer_name?.message}>
            <Input placeholder="Seu nome" {...form.register("customer_name")} />
          </FormField>
          <FormField label="E-mail" error={form.formState.errors.customer_email?.message}>
            <Input type="email" placeholder="voce@empresa.com" {...form.register("customer_email")} />
          </FormField>
          <FormField label="Documento (opcional)" error={form.formState.errors.customer_document?.message}>
            <Input placeholder="CPF ou CNPJ" {...form.register("customer_document")} />
          </FormField>
          <Button
            type="submit"
            className="mt-2"
            disabled={mutation.isPending}
            onClick={() => console.log("[checkout] pay button clicked")}
          >
            {mutation.isPending ? "Gerando pagamento..." : "Ir para pagamento"}
          </Button>
        </form>
      </div>
      <aside className="glass-card h-fit rounded-[2rem] p-6">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">Resumo do pedido</p>
        <div className="mt-6 space-y-4">
          {enrichedItems.map(({ product, quantity, lineTotal }) => (
            <div key={product.id} className="flex items-center justify-between gap-4 border-b border-slate-200/70 pb-4">
              <div>
                <p className="font-medium text-slate-950">{product.name}</p>
                <p className="text-sm text-slate-500">Qtd: {quantity}</p>
              </div>
              <p className="text-sm font-semibold text-slate-950">{formatCurrency(lineTotal)}</p>
            </div>
          ))}
        </div>
        <div className="mt-6 flex items-center justify-between">
          <span className="text-sm text-slate-500">Total</span>
          <span className="text-xl font-semibold text-slate-950">{formatCurrency(subtotal)}</span>
        </div>
      </aside>
    </div>
  );
}
