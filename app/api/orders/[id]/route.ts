import { NextRequest } from "next/server";
import { getApiAuth, hasRole } from "@/lib/auth/api";
import { getOrderById } from "@/lib/orders/service";
import { apiError, apiSuccess } from "@/lib/utils/api-response";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { user, profile } = await getApiAuth(request);
  const order = await getOrderById(id);

  if (!order) {
    return apiError("Pedido nao encontrado.", "NOT_FOUND", 404);
  }

  const isAdmin = hasRole(profile?.role, ["admin"]);
  const isOwner = user?.id && order.user_id === user.id;

  if (!isAdmin && !isOwner) {
    return apiError("Acesso nao autorizado.", "UNAUTHORIZED", 401);
  }

  return apiSuccess(order);
}
