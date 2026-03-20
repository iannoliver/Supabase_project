import type { Metadata } from "next";
import { CheckoutStatusCard } from "@/components/checkout/status-card";

export const metadata: Metadata = {
  title: "Pagamento nao concluido",
  description: "Tente novamente a partir do carrinho ou checkout.",
};

export default async function CheckoutFailurePage({
  searchParams,
}: {
  searchParams: Promise<{ order?: string }>;
}) {
  const { order } = await searchParams;

  return (
    <main className="flex min-h-[70vh] items-center justify-center px-4 py-16">
      <CheckoutStatusCard
        eyebrow="Falha no pagamento"
        title="Nao foi possivel concluir a compra"
        description="Voce pode revisar o carrinho e iniciar um novo pagamento com seguranca."
        orderId={order}
        primaryAction={{ href: "/carrinho", label: "Voltar ao carrinho" }}
        secondaryAction={{ href: "/checkout", label: "Tentar novamente" }}
      />
    </main>
  );
}
