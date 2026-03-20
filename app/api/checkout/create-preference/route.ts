import { NextRequest } from "next/server";
import { getApiAuth } from "@/lib/auth/api";
import { createOrderPreference } from "@/lib/orders/service";
import { apiError, apiSuccess } from "@/lib/utils/api-response";
import { checkoutSchema } from "@/lib/validators/checkout";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = checkoutSchema.safeParse(body);

    if (!parsed.success) {
      return apiError(parsed.error.issues[0]?.message || "Dados invalidos.", "VALIDATION_ERROR", 422);
    }

    const { user } = await getApiAuth(request);
    const result = await createOrderPreference(parsed.data, user?.id);

    return apiSuccess(result, "Pagamento iniciado com sucesso.");
  } catch (error) {
    console.error("[checkout:create-preference]", error);
    const message = error instanceof Error ? error.message : "Nao foi possivel iniciar o pagamento.";
    const safeMessage =
      message.includes("Estoque") ||
      message.includes("produto") ||
      message.includes("pedido") ||
      message.includes("carrinho")
        ? message
        : "Nao foi possivel iniciar o pagamento no momento.";

    return apiError(
      safeMessage,
      "CHECKOUT_PREFERENCE_FAILED",
      400,
    );
  }
}
