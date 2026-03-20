import { z } from "zod";

export const profileUpdateSchema = z.object({
  full_name: z.string().min(2, "Informe o nome completo.").max(120, "Nome muito longo."),
  role: z.enum(["admin", "editor"], {
    message: "Selecione um perfil válido.",
  }),
});

export type ProfileUpdateValues = z.infer<typeof profileUpdateSchema>;
