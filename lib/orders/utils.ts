import { randomUUID } from "crypto";

export function createExternalReference(orderId: string) {
  return `order_${orderId.replace(/-/g, "")}`;
}

export function createOrderId() {
  return randomUUID();
}

export function normalizeDocument(value?: string | null) {
  if (!value) return null;

  const normalized = value.replace(/\D/g, "");
  return normalized || null;
}

export function truncateId(value: string) {
  return `${value.slice(0, 8)}...`;
}
