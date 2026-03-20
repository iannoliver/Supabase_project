import { Users, Boxes, CircleCheck, Star } from "lucide-react";
import { StatCard } from "@/components/admin/stat-card";
import { Card, CardContent } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { requireRole } from "@/lib/auth/session";
import { getDashboardMetrics } from "@/lib/admin/metrics";

export default async function AdminDashboardPage() {
  await requireRole(["admin", "editor"]);
  const metrics = await getDashboardMetrics();

  const statItems = [
    { label: "Total de usuários", value: metrics.totalUsers, description: "Usuários com perfil registrado.", icon: Users },
    { label: "Total de produtos", value: metrics.totalProducts, description: "Itens cadastrados no catálogo.", icon: Boxes },
    { label: "Produtos ativos", value: metrics.activeProducts, description: "Visíveis na área pública.", icon: CircleCheck },
    { label: "Produtos em destaque", value: metrics.featuredProducts, description: "Exibidos na seção premium.", icon: Star },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Overview"
        title="Dashboard"
        description="Visão resumida da operação para acompanhar o catálogo e a base de acesso."
      />
      <div className="admin-grid">
        {statItems.map((item) => (
          <div key={item.label} className="relative">
            <div className="absolute right-6 top-6 rounded-2xl bg-slate-100 p-3 text-slate-700">
              <item.icon className="size-5" />
            </div>
            <StatCard label={item.label} value={item.value} description={item.description} />
          </div>
        ))}
      </div>
      <Card>
        <CardContent className="grid gap-6 lg:grid-cols-2">
          <div>
            <h2 className="text-lg font-semibold text-slate-950">Operação preparada</h2>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              O projeto já separa clientes Supabase por contexto, protege rotas com middleware e faz validação
              de perfil também no servidor para evitar vazamentos de permissão.
            </p>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-slate-950">Próximos passos sugeridos</h2>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              Integração com upload de imagens, paginação avançada, auditoria de mudanças e observabilidade podem ser
              adicionadas sem quebrar a estrutura atual.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
