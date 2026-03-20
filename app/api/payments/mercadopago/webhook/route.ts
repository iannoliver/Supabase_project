import { NextRequest } from "next/server";
import { syncOrderFromMercadoPagoPayment } from "@/lib/orders/service";
import type { MercadoPagoWebhookPayload } from "@/lib/mercadopago/types";
import { validateMercadoPagoWebhookSignature } from "@/lib/mercadopago/webhook";
import { apiError, apiSuccess } from "@/lib/utils/api-response";

function isPaymentNotFoundError(error: unknown) {
  if (!error || typeof error !== "object") {
    return false;
  }

  const paymentError = error as {
    message?: string;
    error?: string;
    status?: number;
  };

  return paymentError.status === 404 || paymentError.error === "not_found";
}

export async function POST(request: NextRequest) {
  try {
    const payload = (await request.json().catch(() => ({}))) as MercadoPagoWebhookPayload;
    const legacyId = request.nextUrl.searchParams.get("id") ?? payload.id?.toString() ?? null;
    const legacyTopic = request.nextUrl.searchParams.get("topic") ?? null;
    const dataId = request.nextUrl.searchParams.get("data.id") ?? payload.data?.id ?? null;
    const eventType = request.nextUrl.searchParams.get("type") ?? payload.type ?? null;
    const sourceNews = request.nextUrl.searchParams.get("source_news");
    const signatureHeader = request.headers.get("x-signature");
    const requestId = request.headers.get("x-request-id");

    if (legacyTopic === "payment" || legacyTopic === "merchant_order") {
      console.info("[mercadopago:webhook] ignored legacy notification", {
        legacyTopic,
        legacyId,
      });

      return apiSuccess({
        received: true,
        ignored: true,
        reason: "legacy_notification_ignored",
      });
    }

    if (sourceNews !== "webhooks") {
      console.info("[mercadopago:webhook] ignored notification without webhook source", {
        eventType,
        dataId,
        sourceNews,
      });

      return apiSuccess({
        received: true,
        ignored: true,
        reason: "unsupported_notification_source",
      });
    }

    const isValidSignature = validateMercadoPagoWebhookSignature({
      dataId,
      requestId,
      signatureHeader,
    });

    if (!isValidSignature) {
      console.warn("[mercadopago:webhook] invalid signature", {
        eventType,
        dataId,
      });

      return apiError("Webhook invalido.", "INVALID_SIGNATURE", 401);
    }

    if (eventType !== "payment" || !dataId) {
      return apiSuccess({ received: true, ignored: true, reason: "event_not_supported" });
    }

    const order = await syncOrderFromMercadoPagoPayment(dataId);

    if (!order) {
      return apiSuccess({ received: true, ignored: true, reason: "order_not_found_or_not_linked" });
    }

    return apiSuccess({ received: true, orderId: order.id });
  } catch (error) {
    if (isPaymentNotFoundError(error)) {
      console.warn("[mercadopago:webhook] payment not found", error);
      return apiSuccess({ received: true, ignored: true, reason: "payment_not_found" });
    }

    console.error("[mercadopago:webhook]", error);
    return apiError("Falha ao processar webhook.", "WEBHOOK_PROCESSING_FAILED", 500);
  }
}
