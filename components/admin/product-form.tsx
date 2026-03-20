"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { FormField } from "@/components/forms/form-field";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { fetcher } from "@/lib/utils/fetcher";
import { slugify } from "@/lib/utils/slugify";
import { productSchema, type ProductFormValues } from "@/lib/validators/product";
import type { ApiResponse, Product } from "@/types";

export function ProductForm({
  mode,
  product,
}: {
  mode: "create" | "edit";
  product?: Product;
}) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: product?.name || "",
      slug: product?.slug || "",
      short_description: product?.short_description || "",
      description: product?.description || "",
      price: product?.price ?? 0,
      image_url: product?.image_url || "",
      active: product?.active ?? true,
      featured: product?.featured ?? false,
      category: product?.category || "",
      stock: product?.stock ?? 0,
    },
  });

  const nameValue = form.watch("name");
  const imageUrlValue = form.watch("image_url");

  useEffect(() => {
    if (!product && nameValue && !form.formState.dirtyFields.slug) {
      form.setValue("slug", slugify(nameValue), { shouldValidate: true });
    }
  }, [form, nameValue, product]);

  const mutation = useMutation({
    mutationFn: async (values: ProductFormValues) => {
      const checkResponse = await fetcher<ApiResponse<{ available: boolean }>>(
        `/api/admin/products/check-slug?slug=${encodeURIComponent(values.slug)}${
          product ? `&excludeId=${product.id}` : ""
        }`,
      );

      if (!checkResponse.success) {
        throw new Error(checkResponse.message);
      }

      if (!checkResponse.data.available) {
        throw new Error("Esse slug já está em uso.");
      }

      const response = await fetcher<ApiResponse<Product>>(
        mode === "create" ? "/api/admin/products" : `/api/admin/products/${product?.id}`,
        {
          method: mode === "create" ? "POST" : "PATCH",
          body: JSON.stringify(values),
        },
      );

      if (!response.success) throw new Error(response.message);
      return response.data;
    },
    onSuccess: async (savedProduct) => {
      toast.success(mode === "create" ? "Produto criado com sucesso." : "Produto atualizado com sucesso.");
      await queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      router.push(`/admin/produtos/${savedProduct.id}`);
      router.refresh();
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const imagePreview = useMemo(() => {
    if (!imageUrlValue) return null;

    try {
      const url = new URL(imageUrlValue);
      return url.toString();
    } catch {
      return null;
    }
  }, [imageUrlValue]);

  return (
    <Card>
      <CardContent>
        <form onSubmit={form.handleSubmit((values) => mutation.mutate(values))} className="space-y-6">
          <div className="grid gap-5 lg:grid-cols-2">
            <FormField label="Nome" error={form.formState.errors.name?.message}>
              <Input placeholder="Nome do produto" {...form.register("name")} />
            </FormField>
            <FormField
              label="Slug"
              error={form.formState.errors.slug?.message}
              hint="Use letras minúsculas, números e hífens."
            >
              <Input placeholder="nome-do-produto" {...form.register("slug")} />
            </FormField>
            <FormField label="Categoria" error={form.formState.errors.category?.message}>
              <Input placeholder="Categoria" {...form.register("category")} />
            </FormField>
            <FormField label="URL da imagem" error={form.formState.errors.image_url?.message}>
              <Input placeholder="https://..." {...form.register("image_url")} />
            </FormField>
            <FormField label="Preço" error={form.formState.errors.price?.message}>
              <Input type="number" step="0.01" min="0" {...form.register("price")} />
            </FormField>
            <FormField label="Estoque" error={form.formState.errors.stock?.message}>
              <Input type="number" min="0" {...form.register("stock")} />
            </FormField>
            <div className="space-y-4 rounded-3xl border border-slate-200 bg-slate-50 p-5">
              <label className="flex items-center gap-3 text-sm font-medium text-slate-700">
                <input type="checkbox" className="size-4 rounded border-slate-300" {...form.register("active")} />
                Produto ativo/publicado
              </label>
              <label className="flex items-center gap-3 text-sm font-medium text-slate-700">
                <input type="checkbox" className="size-4 rounded border-slate-300" {...form.register("featured")} />
                Exibir na seção de destaque
              </label>
            </div>
            <div className="overflow-hidden rounded-3xl border border-slate-200 bg-slate-50">
              <div className="relative aspect-[4/3]">
                {imagePreview ? (
                  <Image src={imagePreview} alt="Preview da imagem do produto" fill className="object-cover" />
                ) : (
                  <div className="flex h-full items-center justify-center text-sm text-slate-500">Preview da imagem</div>
                )}
              </div>
            </div>
          </div>
          <div className="grid gap-5">
            <FormField label="Resumo curto" error={form.formState.errors.short_description?.message}>
              <Textarea
                rows={3}
                className="min-h-24"
                placeholder="Resumo para cards e destaques"
                {...form.register("short_description")}
              />
            </FormField>
            <FormField label="Descrição completa" error={form.formState.errors.description?.message}>
              <Textarea placeholder="Descrição detalhada do produto" {...form.register("description")} />
            </FormField>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? "Salvando..." : mode === "create" ? "Criar produto" : "Salvar alterações"}
            </Button>
            <Button type="button" variant="secondary" onClick={() => router.push("/admin/produtos")}>
              Voltar para a listagem
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
