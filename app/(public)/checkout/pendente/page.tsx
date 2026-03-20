import type { Metadata } from "next";
import { CheckoutStatusCard } from "@/components/checkout/status-card";

export const metadata: Metadata = {
  title: "Pagamento pendente",
  description: "Seu pedido foi criado e aguarda confirmacao de pagamento.",
};

export default async function CheckoutPendingPage({
  searchParams,
}: {
  searchParams: Promise<{ order?: string }>;
}) {
  const { order } = await searchParams;

  return (
    <main className="flex min-h-[70vh] items-center justify-center px-4 py-16">
      <CheckoutStatusCard
        eyebrow="Pagamento pendente"
        title="Seu pagamento ainda esta em analise"
        description="Nao se preocupe: o pedido foi criado e o status sera atualizado assim que o Mercado Pago confirmar a transacao."
        orderId={order}
        primaryAction={{ href: "/produtos", label: "Voltar ao catalogo" }}
        secondaryAction={{ href: "/carrinho", label: "Revisar carrinho" }}
      />
    </main>
  );
}
