"use client";

import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/hooks/use-cart";

export function CartLink() {
  const { itemCount, isReady } = useCart();

  return (
    <Link href="/carrinho" className="inline-flex items-center gap-2 text-sm font-medium text-slate-700">
      <ShoppingBag className="size-4" />
      Carrinho
      <Badge variant="neutral">{isReady ? itemCount : 0}</Badge>
    </Link>
  );
}
