const mercadoPagoPublicKey = process.env.NEXT_PUBLIC_MERCADO_PAGO_PUBLIC_KEY;
const appUrl = process.env.NEXT_PUBLIC_APP_URL;

if (!mercadoPagoPublicKey) {
  throw new Error("Missing environment variable: NEXT_PUBLIC_MERCADO_PAGO_PUBLIC_KEY");
}

if (!appUrl) {
  throw new Error("Missing environment variable: NEXT_PUBLIC_APP_URL");
}

export const mercadoPagoEnvClient = {
  NEXT_PUBLIC_MERCADO_PAGO_PUBLIC_KEY: mercadoPagoPublicKey,
  NEXT_PUBLIC_APP_URL: appUrl,
} as const;
