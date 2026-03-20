import type { Metadata } from "next";
import { CheckoutStatusCard } from "@/components/checkout/status-card";

export const metadata: Metadata = {
  title: "Pagamento iniciado",
  description: "O status final do pedido sera confirmado pelo webhook.",
};

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ order?: string }>;
}) {
  const { order } = await searchParams;

  return (
    <main className="flex min-h-[70vh] items-center justify-center px-4 py-16">
      <CheckoutStatusCard
        eyebrow="Pagamento enviado"
        title="Recebemos seu retorno do Mercado Pago"
        description="Seu pedido foi registrado. O status final sera confirmado automaticamente assim que o Mercado Pago notificar nossa aplicacao."
        orderId={order}
        primaryAction={{ href: "/produtos", label: "Continuar comprando" }}
        secondaryAction={{ href: "/", label: "Voltar para home" }}
      />
    </main>
  );
}
