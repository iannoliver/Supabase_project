"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { FormField } from "@/components/forms/form-field";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { queryKeys } from "@/lib/query/keys";
import { fetcher } from "@/lib/utils/fetcher";
import { profileUpdateSchema, type ProfileUpdateValues } from "@/lib/validators/user";
import type { ApiResponse, Profile } from "@/types";

export function UserEditForm({ user }: { user: Profile }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const form = useForm<ProfileUpdateValues>({
    resolver: zodResolver(profileUpdateSchema),
    defaultValues: {
      full_name: user.full_name || "",
      role: user.role,
    },
  });

  const mutation = useMutation({
    mutationFn: async (values: ProfileUpdateValues) => {
      const response = await fetcher<ApiResponse<Profile>>(`/api/admin/users/${user.id}`, {
        method: "PATCH",
        body: JSON.stringify(values),
      });
      if (!response.success) throw new Error(response.message);
      return response.data;
    },
    onSuccess: async () => {
      toast.success("Usuário atualizado com sucesso.");
      await queryClient.invalidateQueries({ queryKey: queryKeys.adminUsers });
      router.refresh();
    },
    onError: (error: Error) => toast.error(error.message),
  });

  return (
    <Card>
      <CardContent>
        <form onSubmit={form.handleSubmit((values) => mutation.mutate(values))} className="grid gap-4 md:grid-cols-2">
          <FormField label="Nome completo" error={form.formState.errors.full_name?.message}>
            <Input placeholder="Nome do usuário" {...form.register("full_name")} />
          </FormField>
          <FormField label="Perfil" error={form.formState.errors.role?.message}>
            <Select {...form.register("role")}>
              <option value="admin">admin</option>
              <option value="editor">editor</option>
            </Select>
          </FormField>
          <div className="md:col-span-2 flex gap-3">
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? "Salvando..." : "Salvar alterações"}
            </Button>
            <Button type="button" variant="secondary" onClick={() => router.push("/admin/usuarios")}>
              Voltar
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
