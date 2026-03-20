import { z } from "zod";

const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const productSchema = z.object({
  name: z.string().min(2, "Informe o nome do produto."),
  slug: z
    .string()
    .min(2, "Informe um slug.")
    .regex(slugRegex, "Use apenas letras minúsculas, números e hífens."),
  short_description: z.string().max(180, "Use no máximo 180 caracteres.").optional().or(z.literal("")),
  description: z.string().max(4000, "Descrição muito longa.").optional().or(z.literal("")),
  price: z.coerce.number().min(0, "O preço não pode ser negativo."),
  image_url: z
    .string()
    .url("Informe uma URL válida.")
    .optional()
    .or(z.literal("")),
  active: z.boolean().default(true),
  featured: z.boolean().default(false),
  category: z.string().max(80, "Categoria muito longa.").optional().or(z.literal("")),
  stock: z.coerce.number().int("Use um número inteiro.").min(0, "O estoque não pode ser negativo."),
});

export const productFiltersSchema = z.object({
  search: z.string().optional(),
  category: z.string().optional(),
  status: z.enum(["all", "active", "inactive"]).optional(),
});

export type ProductFormValues = z.infer<typeof productSchema>;
