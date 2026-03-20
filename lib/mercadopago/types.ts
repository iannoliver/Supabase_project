export type MercadoPagoPreferenceItem = {
  id: string;
  title: string;
  quantity: number;
  currency_id: "BRL";
  unit_price: number;
};

export type MercadoPagoCreatePreferenceInput = {
  externalReference: string;
  customerName: string;
  customerEmail: string;
  items: MercadoPagoPreferenceItem[];
  successUrl: string;
  pendingUrl: string;
  failureUrl: string;
  notificationUrl: string;
};

export type MercadoPagoPaymentDetails = {
  id: string | number;
  external_reference: string | null;
  status: string | null;
  status_detail: string | null;
  order?: {
    id?: string | number | null;
  } | null;
};

export type MercadoPagoWebhookPayload = {
  action?: string;
  api_version?: string;
  data?: {
    id?: string;
  };
  date_created?: string;
  id?: number | string;
  live_mode?: boolean;
  type?: string;
  user_id?: number;
};
