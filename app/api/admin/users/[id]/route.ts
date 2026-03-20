import { NextRequest } from "next/server";
import { revalidatePath } from "next/cache";
import { getApiAuth, hasRole } from "@/lib/auth/api";
import { createServiceClient } from "@/lib/supabase/service";
import { apiError, apiSuccess } from "@/lib/utils/api-response";
import { profileUpdateSchema } from "@/lib/validators/user";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { profile } = await getApiAuth(request);
  const { id } = await params;

  if (!profile || !hasRole(profile.role, ["admin"])) {
    return apiError("Apenas administradores podem acessar usuários.", "FORBIDDEN", 403);
  }

  const supabase = createServiceClient();
  const { data, error } = await supabase.from("profiles").select("*").eq("id", id).single();

  if (error || !data) {
    return apiError("Usuário não encontrado.", "NOT_FOUND", 404);
  }

  return apiSuccess(data);
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { profile } = await getApiAuth(request);
  const { id } = await params;

  if (!profile || !hasRole(profile.role, ["admin"])) {
    return apiError("Apenas administradores podem atualizar usuários.", "FORBIDDEN", 403);
  }

  const body = await request.json();
  const parsed = profileUpdateSchema.safeParse(body);

  if (!parsed.success) {
    return apiError(parsed.error.issues[0]?.message || "Dados inválidos.", "VALIDATION_ERROR", 422);
  }

  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("profiles")
    .update(parsed.data)
    .eq("id", id)
    .select("*")
    .single();

  if (error || !data) {
    return apiError("Não foi possível atualizar o usuário.", "USER_UPDATE_FAILED", 500);
  }

  revalidatePath("/admin/usuarios");
  return apiSuccess(data, "Usuário atualizado com sucesso.");
}
