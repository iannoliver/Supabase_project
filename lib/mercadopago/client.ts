import "server-only";

import { MercadoPagoConfig, Payment, Preference } from "mercadopago";
import { mercadoPagoEnvServer } from "@/lib/mercadopago/env.server";

const mercadoPagoClient = new MercadoPagoConfig({
  accessToken: mercadoPagoEnvServer.MERCADO_PAGO_ACCESS_TOKEN,
});

export const mercadoPagoPreferenceClient = new Preference(mercadoPagoClient);
export const mercadoPagoPaymentClient = new Payment(mercadoPagoClient);
