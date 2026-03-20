import type { Metadata } from "next";
import { CheckoutPage } from "@/components/checkout/checkout-page";

export const metadata: Metadata = {
  title: "Checkout",
  description: "Finalize sua compra com Mercado Pago Checkout Pro.",
};

export default function CheckoutRoutePage() {
  return (
    <main className="page-section">
      <div className="container-shell">
        <CheckoutPage />
      </div>
    </main>
  );
}
