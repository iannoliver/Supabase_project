import { PageHeader } from "@/components/ui/page-header";
import { requireRole } from "@/lib/auth/session";
import { UsersTable } from "@/components/admin/users-table";

export default async function AdminUsersPage() {
  await requireRole(["admin"]);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Admin only"
        title="Gestão de usuários"
        description="Administradores podem revisar perfis e ajustar nome ou papel de acesso."
      />
      <UsersTable />
    </div>
  );
}
