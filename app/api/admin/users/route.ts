import { NextRequest } from "next/server";
import { getApiAuth, hasRole } from "@/lib/auth/api";
import { createServiceClient } from "@/lib/supabase/service";
import { apiError, apiSuccess } from "@/lib/utils/api-response";

export async function GET(request: NextRequest) {
  const { profile } = await getApiAuth(request);

  if (!profile || !hasRole(profile.role, ["admin"])) {
    return apiError("Apenas administradores podem acessar usuários.", "FORBIDDEN", 403);
  }

  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return apiError("Não foi possível carregar os usuários.", "USERS_FETCH_FAILED", 500);
  }

  return apiSuccess(data);
}
