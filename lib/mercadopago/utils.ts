import "server-only";

import { mercadoPagoPaymentClient, mercadoPagoPreferenceClient } from "@/lib/mercadopago/client";
import { mercadoPagoEnvClient } from "@/lib/mercadopago/env.client";
import type {
  MercadoPagoCreatePreferenceInput,
  MercadoPagoPaymentDetails,
} from "@/lib/mercadopago/types";

function normalizeBaseAppUrl() {
  const baseUrl = mercadoPagoEnvClient.NEXT_PUBLIC_APP_URL.trim();

  try {
    const url = new URL(baseUrl);
    return url.toString().replace(/\/$/, "");
  } catch {
    throw new Error("NEXT_PUBLIC_APP_URL deve ser uma URL absoluta valida.");
  }
}

function toAbsoluteAppUrl(pathname: string) {
  return new URL(pathname, `${normalizeBaseAppUrl()}/`).toString();
}

function isAbsoluteHttpUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

export async function createCheckoutPreference(input: MercadoPagoCreatePreferenceInput) {
  const backUrls = {
    success: input.successUrl,
    pending: input.pendingUrl,
    failure: input.failureUrl,
  };
  const notificationUrl = input.notificationUrl;

  if (!isAbsoluteHttpUrl(backUrls.success) || !isAbsoluteHttpUrl(backUrls.pending) || !isAbsoluteHttpUrl(backUrls.failure)) {
    throw new Error("As back_urls do Mercado Pago precisam ser URLs absolutas validas.");
  }

  if (!isAbsoluteHttpUrl(notificationUrl)) {
    throw new Error("A notification_url do Mercado Pago precisa ser uma URL absoluta valida.");
  }

  console.log("[mercadopago:create-preference] back_urls", backUrls);

  return mercadoPagoPreferenceClient.create({
    body: {
      items: input.items,
      external_reference: input.externalReference,
      payer: {
        name: input.customerName,
        email: input.customerEmail,
      },
      ...(isAbsoluteHttpUrl(backUrls.success) ? { auto_return: "approved" as const } : {}),
      back_urls: backUrls,
      notification_url: notificationUrl,
      statement_descriptor: "PULSECOM",
    },
  });
}

export async function getMercadoPagoPayment(paymentId: string) {
  return (await mercadoPagoPaymentClient.get({
    id: paymentId,
  })) as MercadoPagoPaymentDetails;
}

export function buildNotificationUrl() {
  const notificationUrl = new URL("/api/payments/mercadopago/webhook", `${normalizeBaseAppUrl()}/`);
  notificationUrl.searchParams.set("source_news", "webhooks");
  return notificationUrl.toString();
}

export function buildCheckoutBackUrls(orderId: string) {
  return {
    success: toAbsoluteAppUrl(`/checkout/sucesso?order=${orderId}`),
    pending: toAbsoluteAppUrl(`/checkout/pendente?order=${orderId}`),
    failure: toAbsoluteAppUrl(`/checkout/falha?order=${orderId}`),
  };
}

export function getMercadoPagoBaseAppUrl() {
  return normalizeBaseAppUrl();
}
