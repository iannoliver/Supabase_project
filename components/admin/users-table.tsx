"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { PencilLine } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TBody, TD, TH, THead, TR } from "@/components/ui/table";
import { fetcher } from "@/lib/utils/fetcher";
import { formatDate } from "@/lib/utils/format";
import { queryKeys } from "@/lib/query/keys";
import type { ApiResponse, Profile } from "@/types";

export function UsersTable() {
  const query = useQuery({
    queryKey: queryKeys.adminUsers,
    queryFn: async () => {
      const response = await fetcher<ApiResponse<Profile[]>>("/api/admin/users");
      if (!response.success) throw new Error(response.message);
      return response.data;
    },
  });

  if (query.isLoading) {
    return <Skeleton className="h-80 rounded-3xl" />;
  }

  if (query.isError) {
    return (
      <EmptyState
        title="Falha ao carregar usuários"
        description={query.error.message || "Verifique suas permissões e a configuração do Supabase."}
      />
    );
  }

  const profiles = query.data ?? [];

  if (!profiles.length) {
    return (
      <EmptyState
        title="Nenhum perfil encontrado"
        description="Os usuários aparecerão aqui após criarem conta e terem perfil registrado."
      />
    );
  }

  return (
    <Table>
      <THead>
        <TR>
          <TH>Nome</TH>
          <TH>E-mail</TH>
          <TH>Perfil</TH>
          <TH>Criado em</TH>
          <TH className="text-right">Ações</TH>
        </TR>
      </THead>
      <TBody>
        {profiles.map((user) => (
          <TR key={user.id}>
            <TD>
              <div>
                <p className="font-medium text-slate-950">{user.full_name || "Sem nome definido"}</p>
                <p className="text-xs text-slate-500">{user.id}</p>
              </div>
            </TD>
            <TD>{user.email}</TD>
            <TD>
              <Badge variant={user.role === "admin" ? "accent" : "neutral"}>{user.role}</Badge>
            </TD>
            <TD>{formatDate(user.created_at)}</TD>
            <TD className="text-right">
              <Button asChild variant="ghost" size="sm">
                <Link href={`/admin/usuarios/${user.id}`}>
                  <PencilLine className="size-4" />
                  Editar
                </Link>
              </Button>
            </TD>
          </TR>
        ))}
      </TBody>
    </Table>
  );
}
