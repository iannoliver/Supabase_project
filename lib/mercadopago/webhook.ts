import "server-only";

import { createHmac, timingSafeEqual } from "crypto";
import { mercadoPagoEnvServer } from "@/lib/mercadopago/env.server";

type MercadoPagoSignatureParts = {
  ts: string | null;
  v1: string | null;
};

function parseSignatureHeader(signatureHeader: string | null): MercadoPagoSignatureParts {
  if (!signatureHeader) {
    return { ts: null, v1: null };
  }

  const parts = signatureHeader.split(",");
  let ts: string | null = null;
  let v1: string | null = null;

  for (const part of parts) {
    const [key, value] = part.split("=");
    const normalizedKey = key?.trim();
    const normalizedValue = value?.trim() ?? null;

    if (normalizedKey === "ts") {
      ts = normalizedValue;
    }

    if (normalizedKey === "v1") {
      v1 = normalizedValue;
    }
  }

  return { ts, v1 };
}

export function validateMercadoPagoWebhookSignature(input: {
  dataId: string | null;
  requestId: string | null;
  signatureHeader: string | null;
}) {
  const { dataId, requestId, signatureHeader } = input;
  const { ts, v1 } = parseSignatureHeader(signatureHeader);

  if (!ts || !v1) {
    return false;
  }

  const manifest = [
    dataId ? `id:${dataId.toLowerCase()};` : null,
    requestId ? `request-id:${requestId};` : null,
    `ts:${ts};`,
  ]
    .filter(Boolean)
    .join("");

  const expectedSignature = createHmac("sha256", mercadoPagoEnvServer.MERCADO_PAGO_WEBHOOK_SECRET)
    .update(manifest)
    .digest("hex");

  const expectedBuffer = Buffer.from(expectedSignature);
  const receivedBuffer = Buffer.from(v1);

  if (expectedBuffer.length !== receivedBuffer.length) {
    return false;
  }

  return timingSafeEqual(expectedBuffer, receivedBuffer);
}
