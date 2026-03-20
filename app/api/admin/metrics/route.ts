import { NextRequest } from "next/server";
import { getApiAuth, hasRole } from "@/lib/auth/api";
import { getDashboardMetrics } from "@/lib/admin/metrics";
import { apiError, apiSuccess } from "@/lib/utils/api-response";

export async function GET(request: NextRequest) {
  const { profile } = await getApiAuth(request);

  if (!profile || !hasRole(profile.role, ["admin", "editor"])) {
    return apiError("Acesso não autorizado.", "UNAUTHORIZED", 401);
  }

  const metrics = await getDashboardMetrics();
  return apiSuccess(metrics);
}
