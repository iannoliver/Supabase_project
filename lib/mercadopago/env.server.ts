import "server-only";

const mercadoPagoAccessToken = process.env.MERCADO_PAGO_ACCESS_TOKEN;
const mercadoPagoWebhookSecret = process.env.MERCADO_PAGO_WEBHOOK_SECRET;

if (!mercadoPagoAccessToken) {
  throw new Error("Missing environment variable: MERCADO_PAGO_ACCESS_TOKEN");
}

if (!mercadoPagoWebhookSecret) {
  throw new Error("Missing environment variable: MERCADO_PAGO_WEBHOOK_SECRET");
}

export const mercadoPagoEnvServer = {
  MERCADO_PAGO_ACCESS_TOKEN: mercadoPagoAccessToken,
  MERCADO_PAGO_WEBHOOK_SECRET: mercadoPagoWebhookSecret,
} as const;
