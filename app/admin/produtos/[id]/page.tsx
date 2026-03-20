import { notFound } from "next/navigation";
import { ProductForm } from "@/components/admin/product-form";
import { PageHeader } from "@/components/ui/page-header";
import { requireRole } from "@/lib/auth/session";
import { createServiceClient } from "@/lib/supabase/service";

export default async function AdminEditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireRole(["admin", "editor"]);
  const { id } = await params;
  const supabase = createServiceClient();
  const { data } = await supabase.from("products").select("*").eq("id", id).single();

  if (!data) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Catálogo"
        title="Editar produto"
        description="Altere campos, destaque e status com validação no cliente e no servidor."
      />
      <ProductForm mode="edit" product={data} />
    </div>
  );
}
