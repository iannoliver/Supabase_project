import type { Metadata } from "next";
import { CartPage } from "@/components/cart/cart-page";
import { PageHeader } from "@/components/ui/page-header";

export const metadata: Metadata = {
  title: "Carrinho",
  description: "Revise os itens antes de ir para o checkout.",
};

export default function CartRoutePage() {
  return (
    <main className="page-section">
      <div className="container-shell space-y-8">
        <PageHeader
          eyebrow="Compra"
          title="Seu carrinho"
          description="Ajuste as quantidades e siga para o checkout quando estiver pronto."
        />
        <CartPage />
      </div>
    </main>
  );
}
