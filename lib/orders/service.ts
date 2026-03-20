import "server-only";

import {
  buildCheckoutBackUrls,
  buildNotificationUrl,
  createCheckoutPreference,
  getMercadoPagoPayment,
} from "@/lib/mercadopago/utils";
import { mapMercadoPagoStatus } from "@/lib/orders/status";
import { createExternalReference, createOrderId, normalizeDocument } from "@/lib/orders/utils";
import { createServiceClient } from "@/lib/supabase/service";
import type { CheckoutValues } from "@/lib/validators/checkout";
import type { OrderWithItems, Product } from "@/types";

type ProductSnapshot = Pick<Product, "id" | "name" | "slug" | "price" | "active" | "stock">;

export async function createOrderPreference(input: CheckoutValues, userId?: string | null) {
  const supabase = createServiceClient();
  const productIds = [...new Set(input.items.map((item) => item.productId))];

  const { data: products, error: productsError } = await supabase
    .from("products")
    .select("id, name, slug, price, active, stock")
    .in("id", productIds);

  if (productsError) {
    throw new Error("Nao foi possivel validar os produtos do pedido.");
  }

  const productMap = new Map((products as ProductSnapshot[]).map((product) => [product.id, product]));

  const orderItems = input.items.map((item) => {
    const product = productMap.get(item.productId);

    if (!product) {
      throw new Error("Um dos produtos nao foi encontrado.");
    }

    if (!product.active) {
      throw new Error(`O produto ${product.name} nao esta disponivel para compra.`);
    }

    if (product.stock < item.quantity) {
      throw new Error(`Estoque insuficiente para ${product.name}.`);
    }

    return {
      product_id: product.id,
      product_name: product.name,
      product_slug: product.slug,
      unit_price: Number(product.price),
      quantity: item.quantity,
      line_total: Number(product.price) * item.quantity,
    };
  });

  const subtotal = orderItems.reduce((accumulator, item) => accumulator + item.line_total, 0);
  const orderId = createOrderId();
  const externalReference = createExternalReference(orderId);

  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      id: orderId,
      user_id: userId ?? null,
      customer_name: input.customer_name,
      customer_email: input.customer_email,
      customer_document: normalizeDocument(input.customer_document),
      status: "pending",
      currency: "BRL",
      subtotal,
      total: subtotal,
      external_reference: externalReference,
    })
    .select("id")
    .single();

  if (orderError || !order) {
    throw new Error("Nao foi possivel criar o pedido.");
  }

  const { error: itemsError } = await supabase.from("order_items").insert(
    orderItems.map((item) => ({
      order_id: orderId,
      ...item,
    })),
  );

  if (itemsError) {
    await supabase.from("orders").delete().eq("id", orderId);
    throw new Error("Nao foi possivel salvar os itens do pedido.");
  }

  try {
    const backUrls = buildCheckoutBackUrls(orderId);

    const preference = await createCheckoutPreference({
      externalReference,
      customerName: input.customer_name,
      customerEmail: input.customer_email,
      items: orderItems.map((item) => ({
        id: item.product_id,
        title: item.product_name,
        quantity: item.quantity,
        currency_id: "BRL",
        unit_price: item.unit_price,
      })),
      successUrl: backUrls.success,
      pendingUrl: backUrls.pending,
      failureUrl: backUrls.failure,
      notificationUrl: buildNotificationUrl(),
    });

    const normalizedResponse =
      "response" in preference && preference.response ? preference.response : preference;

const isObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

const preferenceId =
  isObject(normalizedResponse) && typeof normalizedResponse.id === "string"
    ? normalizedResponse.id
    : null;

 const initPoint =
  isObject(normalizedResponse) && typeof normalizedResponse.init_point === "string"
    ? normalizedResponse.init_point
    : null;

    if (!preferenceId || !initPoint) {
      throw new Error("Mercado Pago nao retornou os dados esperados da preferencia.");
    }

    const { error: updateError } = await supabase
      .from("orders")
      .update({
        mercado_pago_preference_id: preferenceId,
      })
      .eq("id", orderId);

    if (updateError) {
      throw new Error("Nao foi possivel vincular a preferencia ao pedido.");
    }

    return {
      orderId,
      externalReference,
      checkoutUrl: initPoint,
    };
  } catch (error) {
    await supabase
      .from("orders")
      .update({
        notes: error instanceof Error ? error.message : "Falha ao criar preferencia de pagamento.",
      })
      .eq("id", orderId);

    throw error;
  }
}

export async function syncOrderFromMercadoPagoPayment(paymentId: string) {
  const payment = await getMercadoPagoPayment(paymentId);
  const externalReference = payment.external_reference;

  if (!externalReference) {
    console.error("[mercadopago:webhook] payment without external_reference", { paymentId });
    return null;
  }

  const supabase = createServiceClient();
  const internalStatus = mapMercadoPagoStatus(payment.status);

  const { data: order } = await supabase
    .from("orders")
    .select("id, stock_deducted_at")
    .eq("external_reference", externalReference)
    .maybeSingle();

  if (!order) {
    console.warn("[mercadopago:webhook] order not found", { paymentId, externalReference });
    return null;
  }

  const { data: updatedOrder, error: updateError } = await supabase
    .from("orders")
    .update({
      status: internalStatus,
      mercado_pago_payment_id: String(payment.id),
      mercado_pago_merchant_order_id: payment.order?.id ? String(payment.order.id) : null,
      mercado_pago_status: payment.status,
      mercado_pago_status_detail: payment.status_detail,
    })
    .eq("id", order.id)
    .select("*")
    .single();

  if (updateError || !updatedOrder) {
    throw new Error("Nao foi possivel atualizar o pedido com o status do pagamento.");
  }

  if (internalStatus === "approved" && !updatedOrder.stock_deducted_at) {
    const { error: stockError } = await supabase.rpc("apply_order_stock", {
      target_order_id: updatedOrder.id,
    });

    if (stockError) {
      console.error("[mercadopago:webhook] stock apply failed", {
        orderId: updatedOrder.id,
        paymentId,
        message: stockError.message,
      });

      await supabase
        .from("orders")
        .update({
          notes: "Pagamento aprovado, mas houve falha ao aplicar estoque. Revisao manual recomendada.",
        })
        .eq("id", updatedOrder.id);
    }
  }

  return updatedOrder;
}

export async function getOrderById(orderId: string) {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("orders")
    .select("*, order_items(*)")
    .eq("id", orderId)
    .single();

  if (error || !data) {
    return null;
  }

  return data as OrderWithItems;
}
