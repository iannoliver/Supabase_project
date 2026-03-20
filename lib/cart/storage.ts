import type { CartItem } from "@/types";

const CART_STORAGE_KEY = "pulse-commerce-cart";
export const CART_UPDATED_EVENT = "pulse-commerce-cart-updated";

function dispatchCartUpdatedEvent() {
  if (typeof window === "undefined") return;

  window.setTimeout(() => {
    window.dispatchEvent(new Event(CART_UPDATED_EVENT));
  }, 0);
}

export function readCartStorage() {
  if (typeof window === "undefined") {
    return [] as CartItem[];
  }

  try {
    const rawValue = window.localStorage.getItem(CART_STORAGE_KEY);

    if (!rawValue) {
      return [] as CartItem[];
    }

    const parsed = JSON.parse(rawValue) as CartItem[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [] as CartItem[];
  }
}

export function writeCartStorage(items: CartItem[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  dispatchCartUpdatedEvent();
}

export function clearCartStorage() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(CART_STORAGE_KEY);
  dispatchCartUpdatedEvent();
}
