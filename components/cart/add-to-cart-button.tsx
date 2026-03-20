"use client";

import { ShoppingCart } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/use-cart";

export function AddToCartButton({
  productId,
  className,
}: {
  productId: string;
  className?: string;
}) {
  const { addItem } = useCart();

  function handleClick() {
    addItem(productId, 1);
    toast.success("Produto adicionado ao carrinho.");
  }

  return (
    <Button className={className} onClick={handleClick}>
      <ShoppingCart className="size-4" />
      Adicionar
    </Button>
  );
}
