import { NextRequest } from "next/server";
import { revalidatePath } from "next/cache";
import { getApiAuth, hasRole } from "@/lib/auth/api";
import { createServiceClient } from "@/lib/supabase/service";
import { apiError, apiSuccess } from "@/lib/utils/api-response";
import { productSchema } from "@/lib/validators/product";

export async function GET(request: NextRequest) {
  const { profile } = await getApiAuth(request);

  if (!profile || !hasRole(profile.role, ["admin", "editor"])) {
    return apiError("Acesso não autorizado.", "UNAUTHORIZED", 401);
  }

  const search = request.nextUrl.searchParams.get("search");
  const category = request.nextUrl.searchParams.get("category");
  const status = request.nextUrl.searchParams.get("status");

  const supabase = createServiceClient();
  let query = supabase.from("products").select("*").order("created_at", { ascending: false });

  if (search) {
    query = query.ilike("name", `%${search}%`);
  }

  if (category) {
    query = query.eq("category", category);
  }

  if (status === "active") {
    query = query.eq("active", true);
  }

  if (status === "inactive") {
    query = query.eq("active", false);
  }

  const { data, error } = await query;

  if (error) {
    return apiError("Não foi possível carregar os produtos.", "PRODUCTS_FETCH_FAILED", 500);
  }

  return apiSuccess(data);
}

export async function POST(request: NextRequest) {
  const { profile } = await getApiAuth(request);

  if (!profile || !hasRole(profile.role, ["admin", "editor"])) {
    return apiError("Acesso não autorizado.", "UNAUTHORIZED", 401);
  }

  const body = await request.json();
  const parsed = productSchema.safeParse(body);

  if (!parsed.success) {
    return apiError(parsed.error.issues[0]?.message || "Dados inválidos.", "VALIDATION_ERROR", 422);
  }

  const supabase = createServiceClient();
  const { data: existing } = await supabase.from("products").select("id").eq("slug", parsed.data.slug).maybeSingle();

  if (existing) {
    return apiError("Esse slug já está em uso.", "SLUG_ALREADY_EXISTS", 409);
  }

  const payload = {
    ...parsed.data,
    short_description: parsed.data.short_description || null,
    description: parsed.data.description || null,
    image_url: parsed.data.image_url || null,
    category: parsed.data.category || null,
  };

  const { data, error } = await supabase.from("products").insert(payload).select("*").single();

  if (error) {
    return apiError("Não foi possível criar o produto.", "PRODUCT_CREATE_FAILED", 500);
  }

  revalidatePath("/");
  revalidatePath("/produtos");
  revalidatePath(`/produtos/${payload.slug}`);
  revalidatePath("/admin/produtos");

  return apiSuccess(data, "Produto criado com sucesso.", { status: 201 });
}
