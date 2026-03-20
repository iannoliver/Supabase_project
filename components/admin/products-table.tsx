"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { PencilLine, Star, ToggleLeft, ToggleRight, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { ProductsFilterBar } from "@/components/admin/products-filter-bar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TBody, TD, TH, THead, TR } from "@/components/ui/table";
import { queryKeys } from "@/lib/query/keys";
import { fetcher } from "@/lib/utils/fetcher";
import { formatCurrency, formatDate } from "@/lib/utils/format";
import type { ApiResponse, Product } from "@/types";

type Filters = {
  search: string;
  category: string;
  status: "all" | "active" | "inactive";
};

export function ProductsTable() {
  const queryClient = useQueryClient();
  const [filters, setFilters] = useState<Filters>({ search: "", category: "", status: "all" });

  const params = useMemo(() => {
    const searchParams = new URLSearchParams();

    if (filters.search) searchParams.set("search", filters.search);
    if (filters.category) searchParams.set("category", filters.category);
    if (filters.status !== "all") searchParams.set("status", filters.status);

    return searchParams.toString();
  }, [filters]);

  const query = useQuery({
    queryKey: queryKeys.adminProducts(params),
    queryFn: async () => {
      const response = await fetcher<ApiResponse<Product[]>>(`/api/admin/products?${params}`);
      if (!response.success) throw new Error(response.message);
      return response.data;
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, values }: { id: string; values: Partial<Product> }) => {
      const current = query.data?.find((product) => product.id === id);
      if (!current) {
        throw new Error("Produto nao encontrado no estado atual da tabela.");
      }

      const payload = {
        ...current,
        ...values,
      };

      const response = await fetcher<ApiResponse<Product>>(`/api/admin/products/${id}`, {
        method: "PATCH",
        body: JSON.stringify(payload),
      });

      if (!response.success) throw new Error(response.message);
      return response.data;
    },
    onSuccess: async () => {
      toast.success("Produto atualizado.");
      await queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      await queryClient.invalidateQueries({ queryKey: queryKeys.adminMetrics });
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetcher<ApiResponse<{ id: string }>>(`/api/admin/products/${id}`, {
        method: "DELETE",
      });
      if (!response.success) throw new Error(response.message);
      return response.data;
    },
    onSuccess: async () => {
      toast.success("Produto excluído.");
      await queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      await queryClient.invalidateQueries({ queryKey: queryKeys.adminMetrics });
    },
    onError: (error: Error) => toast.error(error.message),
  });

  function handleDelete(id: string) {
    if (!window.confirm("Deseja realmente excluir este produto?")) return;
    deleteMutation.mutate(id);
  }

  const products = query.data ?? [];

  return (
    <div className="space-y-4">
      <ProductsFilterBar onChange={setFilters} />
      {query.isLoading ? (
        <Skeleton className="h-96 rounded-3xl" />
      ) : query.isError ? (
        <EmptyState
          title="Falha ao carregar produtos"
          description={query.error.message || "Confira a configuração do projeto e tente novamente."}
        />
      ) : products.length > 0 ? (
        <Table>
          <THead>
            <TR>
              <TH>Produto</TH>
              <TH>Preço</TH>
              <TH>Status</TH>
              <TH>Categoria</TH>
              <TH>Atualizado em</TH>
              <TH className="text-right">Ações</TH>
            </TR>
          </THead>
          <TBody>
            {products.map((product) => (
              <TR key={product.id}>
                <TD>
                  <div>
                    <p className="font-medium text-slate-950">{product.name}</p>
                    <p className="text-xs text-slate-500">{product.slug}</p>
                  </div>
                </TD>
                <TD>{formatCurrency(product.price)}</TD>
                <TD>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant={product.active ? "success" : "danger"}>
                      {product.active ? "Ativo" : "Inativo"}
                    </Badge>
                    {product.featured ? <Badge variant="accent">Destaque</Badge> : null}
                  </div>
                </TD>
                <TD>{product.category || "-"}</TD>
                <TD>{formatDate(product.updated_at)}</TD>
                <TD className="text-right">
                  <div className="flex justify-end gap-1">
                    <Button asChild size="sm" variant="ghost">
                      <Link href={`/admin/produtos/${product.id}`}>
                        <PencilLine className="size-4" />
                        Editar
                      </Link>
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => updateMutation.mutate({ id: product.id, values: { active: !product.active } })}
                      disabled={updateMutation.isPending}
                    >
                      {product.active ? <ToggleRight className="size-4" /> : <ToggleLeft className="size-4" />}
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => updateMutation.mutate({ id: product.id, values: { featured: !product.featured } })}
                      disabled={updateMutation.isPending}
                    >
                      <Star className={`size-4 ${product.featured ? "fill-current" : ""}`} />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDelete(product.id)}
                      disabled={deleteMutation.isPending}
                    >
                      <Trash2 className="size-4 text-rose-600" />
                    </Button>
                  </div>
                </TD>
              </TR>
            ))}
          </TBody>
        </Table>
      ) : (
        <EmptyState
          title="Nenhum produto encontrado"
          description="Ajuste os filtros ou crie um novo produto para começar."
          action={
            <Button asChild>
              <Link href="/admin/produtos/novo">Novo produto</Link>
            </Button>
          }
        />
      )}
    </div>
  );
}
