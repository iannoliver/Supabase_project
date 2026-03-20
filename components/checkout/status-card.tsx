import Link from "next/link";
import { Button } from "@/components/ui/button";

export function CheckoutStatusCard({
  eyebrow,
  title,
  description,
  orderId,
  primaryAction,
  secondaryAction,
}: {
  eyebrow: string;
  title: string;
  description: string;
  orderId?: string;
  primaryAction: {
    href: string;
    label: string;
  };
  secondaryAction?: {
    href: string;
    label: string;
  };
}) {
  return (
    <div className="glass-card max-w-2xl rounded-[2rem] p-8">
      <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">{eyebrow}</p>
      <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950">{title}</h1>
      <p className="mt-4 text-sm leading-7 text-slate-600">{description}</p>
      {orderId ? (
        <div className="mt-6 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700">
          Pedido: <span className="font-semibold text-slate-950">{orderId}</span>
        </div>
      ) : null}
      <div className="mt-8 flex flex-wrap gap-3">
        <Button asChild>
          <Link href={primaryAction.href}>{primaryAction.label}</Link>
        </Button>
        {secondaryAction ? (
          <Button asChild variant="secondary">
            <Link href={secondaryAction.href}>{secondaryAction.label}</Link>
          </Button>
        ) : null}
      </div>
    </div>
  );
}
