import { ProductForm } from "@/components/admin/product-form";
import { PageHeader } from "@/components/ui/page-header";
import { requireRole } from "@/lib/auth/session";

export default async function AdminCreateProductPage() {
  await requireRole(["admin", "editor"]);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Novo cadastro"
        title="Criar produto"
        description="Preencha os dados do produto e publique quando estiver pronto."
      />
      <ProductForm mode="create" />
    </div>
  );
}
