import Link from "next/link";
import { createServiceClient } from "@/lib/supabase/service";
import { requireRole } from "@/lib/auth/session";
import { formatCurrency, formatDate } from "@/lib/utils/format";
import { truncateId } from "@/lib/orders/utils";
import { PageHeader } from "@/components/ui/page-header";
import { EmptyState } from "@/components/ui/empty-state";
import { Button } from "@/components/ui/button";
import { Table, TBody, TD, TH, THead, TR } from "@/components/ui/table";
import { OrderStatusBadge } from "@/components/orders/order-status-badge";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import type { Order } from "@/types";

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; email?: string }>;
}) {
  await requireRole(["admin"]);
  const { status, email } = await searchParams;
  const supabase = createServiceClient();
  let query = supabase.from("orders").select("*").order("created_at", { ascending: false });

  if (status) {
    query = query.eq("status", status);
  }

  if (email) {
    query = query.ilike("customer_email", `%${email}%`);
  }

  const { data } = await query;
  const orders = (data ?? []) as Order[];

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Financeiro"
        title="Pedidos"
        description="Acompanhe o status dos pedidos e os retornos do Mercado Pago."
      />
      <form className="grid gap-3 rounded-3xl border border-slate-200/70 bg-white p-4 md:grid-cols-[0.8fr_0.8fr_auto]">
        <Input name="email" defaultValue={email ?? ""} placeholder="Filtrar por e-mail" />
        <Select name="status" defaultValue={status ?? ""}>
          <option value="">Todos os status</option>
          <option value="pending">pending</option>
          <option value="approved">approved</option>
          <option value="authorized">authorized</option>
          <option value="in_process">in_process</option>
          <option value="in_mediation">in_mediation</option>
          <option value="rejected">rejected</option>
          <option value="cancelled">cancelled</option>
          <option value="refunded">refunded</option>
          <option value="charged_back">charged_back</option>
        </Select>
        <Button type="submit">Filtrar</Button>
      </form>
      {orders.length ? (
        <Table>
          <THead>
            <TR>
              <TH>Pedido</TH>
              <TH>Cliente</TH>
              <TH>Status</TH>
              <TH>Total</TH>
              <TH>Criado em</TH>
              <TH>External ref</TH>
              <TH className="text-right">Acoes</TH>
            </TR>
          </THead>
          <TBody>
            {orders.map((order) => (
              <TR key={order.id}>
                <TD className="font-medium text-slate-950">{truncateId(order.id)}</TD>
                <TD>
                  <div>
                    <p className="font-medium text-slate-950">{order.customer_name}</p>
                    <p className="text-xs text-slate-500">{order.customer_email}</p>
                  </div>
                </TD>
                <TD>
                  <OrderStatusBadge status={order.status} />
                </TD>
                <TD>{formatCurrency(order.total)}</TD>
                <TD>{formatDate(order.created_at)}</TD>
                <TD className="text-xs text-slate-500">{order.external_reference}</TD>
                <TD className="text-right">
                  <Button asChild size="sm" variant="ghost">
                    <Link href={`/admin/pedidos/${order.id}`}>Ver detalhe</Link>
                  </Button>
                </TD>
              </TR>
            ))}
          </TBody>
        </Table>
      ) : (
        <EmptyState
          title="Nenhum pedido encontrado"
          description="Assim que houver compras iniciadas, os pedidos aparecerao aqui."
        />
      )}
    </div>
  );
}
