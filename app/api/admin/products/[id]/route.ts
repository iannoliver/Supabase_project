import { NextRequest } from "next/server";
import { revalidatePath } from "next/cache";
import { getApiAuth, hasRole } from "@/lib/auth/api";
import { createServiceClient } from "@/lib/supabase/service";
import { apiError, apiSuccess } from "@/lib/utils/api-response";
import { productSchema } from "@/lib/validators/product";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { profile } = await getApiAuth(request);
  const { id } = await params;

  if (!profile || !hasRole(profile.role, ["admin", "editor"])) {
    return apiError("Acesso não autorizado.", "UNAUTHORIZED", 401);
  }

  const supabase = createServiceClient();
  const { data, error } = await supabase.from("products").select("*").eq("id", id).single();

  if (error || !data) {
    return apiError("Produto não encontrado.", "NOT_FOUND", 404);
  }

  return apiSuccess(data);
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { profile } = await getApiAuth(request);
  const { id } = await params;

  if (!profile || !hasRole(profile.role, ["admin", "editor"])) {
    return apiError("Acesso não autorizado.", "UNAUTHORIZED", 401);
  }

  const body = await request.json();
  const parsed = productSchema.safeParse(body);

  if (!parsed.success) {
    return apiError(parsed.error.issues[0]?.message || "Dados inválidos.", "VALIDATION_ERROR", 422);
  }

  const supabase = createServiceClient();
  const { data: conflict } = await supabase
    .from("products")
    .select("id")
    .eq("slug", parsed.data.slug)
    .neq("id", id)
    .maybeSingle();

  if (conflict) {
    return apiError("Esse slug já está em uso.", "SLUG_ALREADY_EXISTS", 409);
  }

  const payload = {
    ...parsed.data,
    short_description: parsed.data.short_description || null,
    description: parsed.data.description || null,
    image_url: parsed.data.image_url || null,
    category: parsed.data.category || null,
  };

  const { data, error } = await supabase.from("products").update(payload).eq("id", id).select("*").single();

  if (error || !data) {
    return apiError("Não foi possível atualizar o produto.", "PRODUCT_UPDATE_FAILED", 500);
  }

  revalidatePath("/");
  revalidatePath("/produtos");
  revalidatePath(`/produtos/${data.slug}`);
  revalidatePath("/admin/produtos");
  revalidatePath(`/admin/produtos/${id}`);

  return apiSuccess(data, "Produto atualizado com sucesso.");
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { profile } = await getApiAuth(request);
  const { id } = await params;

  if (!profile || !hasRole(profile.role, ["admin", "editor"])) {
    return apiError("Acesso não autorizado.", "UNAUTHORIZED", 401);
  }

  const supabase = createServiceClient();
  const { data: current } = await supabase.from("products").select("slug").eq("id", id).maybeSingle();
  const { error } = await supabase.from("products").delete().eq("id", id);

  if (error) {
    return apiError("Não foi possível excluir o produto.", "PRODUCT_DELETE_FAILED", 500);
  }

  revalidatePath("/");
  revalidatePath("/produtos");
  revalidatePath("/admin/produtos");

  if (current?.slug) {
    revalidatePath(`/produtos/${current.slug}`);
  }

  return apiSuccess({ id }, "Produto excluído com sucesso.");
}
