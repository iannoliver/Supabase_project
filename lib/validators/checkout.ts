import { z } from "zod";

export const cartItemSchema = z.object({
  productId: z.string().uuid("Item de carrinho invalido."),
  quantity: z.coerce.number().int("Quantidade invalida.").min(1, "Quantidade minima: 1."),
});

export const checkoutSchema = z.object({
  customer_name: z.string().min(2, "Informe o nome do comprador."),
  customer_email: z.string().email("Informe um e-mail valido."),
  customer_document: z
    .string()
    .trim()
    .max(32, "Documento muito longo.")
    .optional()
    .or(z.literal("")),
  items: z.array(cartItemSchema).min(1, "O carrinho nao pode estar vazio."),
});

export type CheckoutValues = z.infer<typeof checkoutSchema>;
