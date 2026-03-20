import Link from "next/link";
import { ProductsTable } from "@/components/admin/products-table";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/page-header";
import { requireRole } from "@/lib/auth/session";

export default async function AdminProductsPage() {
  await requireRole(["admin", "editor"]);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Catálogo"
        title="Gestão de produtos"
        description="Cadastre, edite, filtre e publique produtos com uma operação simples e robusta."
        action={
          <Button asChild>
            <Link href="/admin/produtos/novo">Novo produto</Link>
          </Button>
        }
      />
      <ProductsTable />
    </div>
  );
}
