import { notFound } from "next/navigation";
import { UserEditForm } from "@/components/admin/user-edit-form";
import { PageHeader } from "@/components/ui/page-header";
import { requireRole } from "@/lib/auth/session";
import { createServiceClient } from "@/lib/supabase/service";

export default async function AdminUserDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireRole(["admin"]);
  const { id } = await params;
  const supabase = createServiceClient();
  const { data } = await supabase.from("profiles").select("*").eq("id", id).single();

  if (!data) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Admin only"
        title="Editar usuário"
        description="Atualize nome completo e role do usuário de forma segura."
      />
      <UserEditForm user={data} />
    </div>
  );
}
