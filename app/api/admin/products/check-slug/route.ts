import { NextRequest } from "next/server";
import { getApiAuth, hasRole } from "@/lib/auth/api";
import { createServiceClient } from "@/lib/supabase/service";
import { apiError, apiSuccess } from "@/lib/utils/api-response";

export async function GET(request: NextRequest) {
  const { profile } = await getApiAuth(request);

  if (!profile || !hasRole(profile.role, ["admin", "editor"])) {
    return apiError("Acesso não autorizado.", "UNAUTHORIZED", 401);
  }

  const slug = request.nextUrl.searchParams.get("slug");
  const excludeId = request.nextUrl.searchParams.get("excludeId");

  if (!slug) {
    return apiError("Informe o slug.", "VALIDATION_ERROR", 422);
  }

  const supabase = createServiceClient();
  let query = supabase.from("products").select("id").eq("slug", slug);

  if (excludeId) {
    query = query.neq("id", excludeId);
  }

  const { data, error } = await query.limit(1);

  if (error) {
    return apiError("Não foi possível validar o slug.", "SLUG_CHECK_FAILED", 500);
  }

  return apiSuccess({ available: (data?.length ?? 0) === 0 });
}
