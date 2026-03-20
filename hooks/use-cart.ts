"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  clearCartStorage,
  CART_UPDATED_EVENT,
  readCartStorage,
  writeCartStorage,
} from "@/lib/cart/storage";
import type { CartItem } from "@/types";

function areCartItemsEqual(left: CartItem[], right: CartItem[]) {
  if (left.length !== right.length) {
    return false;
  }

  return left.every(
    (item, index) =>
      item.productId === right[index]?.productId && item.quantity === right[index]?.quantity,
  );
}

export function useCart() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isReady, setIsReady] = useState(false);

  const syncCart = useCallback(() => {
    const nextItems = readCartStorage();

    setItems((currentItems) =>
      areCartItemsEqual(currentItems, nextItems) ? currentItems : nextItems,
    );
  }, []);

  useEffect(() => {
    syncCart();
    setIsReady(true);
  }, [syncCart]);

  useEffect(() => {
    window.addEventListener("storage", syncCart);
    window.addEventListener(CART_UPDATED_EVENT, syncCart);

    return () => {
      window.removeEventListener("storage", syncCart);
      window.removeEventListener(CART_UPDATED_EVENT, syncCart);
    };
  }, [syncCart]);

  const itemCount = useMemo(
    () => items.reduce((accumulator, item) => accumulator + item.quantity, 0),
    [items],
  );

  const addItem = useCallback((productId: string, quantity = 1) => {
    setItems((currentItems) => {
      const existingItem = currentItems.find((item) => item.productId === productId);
      const nextItems = existingItem
        ? currentItems.map((item) =>
            item.productId === productId
              ? { ...item, quantity: item.quantity + quantity }
              : item,
          )
        : [...currentItems, { productId, quantity }];

      writeCartStorage(nextItems);
      return nextItems;
    });
  }, []);

  const removeItem = useCallback((productId: string) => {
    setItems((currentItems) => {
      const nextItems = currentItems.filter((item) => item.productId !== productId);

      if (!nextItems.length) {
        clearCartStorage();
        return nextItems;
      }

      writeCartStorage(nextItems);
      return nextItems;
    });
  }, []);

  const updateItemQuantity = useCallback(
    (productId: string, quantity: number) => {
      if (quantity < 1) {
        removeItem(productId);
        return;
      }

      setItems((currentItems) => {
        const nextItems = currentItems.map((item) =>
          item.productId === productId ? { ...item, quantity } : item,
        );

        writeCartStorage(nextItems);
        return nextItems;
      });
    },
    [removeItem],
  );

  const clearCart = useCallback(() => {
    setItems([]);
    clearCartStorage();
  }, []);

  return {
    items,
    itemCount,
    isReady,
    addItem,
    updateItemQuantity,
    removeItem,
    clearCart,
  };
}
