import type { OrderStatus } from "@/types";

export function mapMercadoPagoStatus(status: string | null | undefined): OrderStatus {
  switch (status) {
    case "approved":
      return "approved";
    case "authorized":
      return "authorized";
    case "in_process":
      return "in_process";
    case "in_mediation":
      return "in_mediation";
    case "rejected":
      return "rejected";
    case "cancelled":
      return "cancelled";
    case "refunded":
      return "refunded";
    case "charged_back":
      return "charged_back";
    default:
      return "pending";
  }
}
