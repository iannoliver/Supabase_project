import { Badge } from "@/components/ui/badge";
import type { OrderStatus } from "@/types";

const variants: Record<OrderStatus, "neutral" | "success" | "warning" | "danger" | "accent"> = {
  pending: "neutral",
  approved: "success",
  authorized: "accent",
  in_process: "warning",
  in_mediation: "warning",
  rejected: "danger",
  cancelled: "danger",
  refunded: "neutral",
  charged_back: "danger",
};

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  return <Badge variant={variants[status]}>{status}</Badge>;
}
