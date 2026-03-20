import { notFound } from "next/navigation";
import { requireRole } from "@/lib/auth/session";
import { getOrderById } from "@/lib/orders/service";
import { formatCurrency, formatDate } from "@/lib/utils/format";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TBody, TD, TH, THead, TR } from "@/components/ui/table";
import { OrderStatusBadge } from "@/components/orders/order-status-badge";

export default async function AdminOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireRole(["admin"]);
  const { id } = await params;
  const order = await getOrderById(id);

  if (!order) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Financeiro"
        title="Detalhe do pedido"
        description="Itens, totais e dados basicos do pagamento retornado pelo Mercado Pago."
      />
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-500">Status</span>
              <OrderStatusBadge status={order.status} />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-500">Cliente</span>
              <span className="text-sm font-medium text-slate-950">{order.customer_name}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-500">E-mail</span>
              <span className="text-sm font-medium text-slate-950">{order.customer_email}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-500">Criado em</span>
              <span className="text-sm font-medium text-slate-950">{formatDate(order.created_at)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-500">External ref</span>
              <span className="text-xs font-medium text-slate-950">{order.external_reference}</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-500">Subtotal</span>
              <span className="text-sm font-medium text-slate-950">{formatCurrency(order.subtotal)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-500">Total</span>
              <span className="text-sm font-medium text-slate-950">{formatCurrency(order.total)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-500">Payment ID</span>
              <span className="text-xs font-medium text-slate-950">{order.mercado_pago_payment_id || "-"}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-500">MP status</span>
              <span className="text-xs font-medium text-slate-950">{order.mercado_pago_status || "-"}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-500">Status detail</span>
              <span className="text-xs font-medium text-slate-950">{order.mercado_pago_status_detail || "-"}</span>
            </div>
          </CardContent>
        </Card>
      </div>
      <Table>
        <THead>
          <TR>
            <TH>Produto</TH>
            <TH>Quantidade</TH>
            <TH>Preco unitario</TH>
            <TH>Total</TH>
          </TR>
        </THead>
        <TBody>
          {order.order_items.map((item) => (
            <TR key={item.id}>
              <TD>{item.product_name}</TD>
              <TD>{item.quantity}</TD>
              <TD>{formatCurrency(item.unit_price)}</TD>
              <TD>{formatCurrency(item.line_total)}</TD>
            </TR>
          ))}
        </TBody>
      </Table>
    </div>
  );
}
