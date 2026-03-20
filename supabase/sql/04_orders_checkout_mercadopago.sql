create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid null references auth.users(id) on delete set null,
  customer_name text not null,
  customer_email text not null,
  customer_document text null,
  status text not null check (
    status in (
      'pending',
      'approved',
      'authorized',
      'in_process',
      'in_mediation',
      'rejected',
      'cancelled',
      'refunded',
      'charged_back'
    )
  ),
  currency text not null default 'BRL',
  subtotal numeric(10,2) not null default 0,
  total numeric(10,2) not null default 0,
  external_reference text not null unique,
  mercado_pago_preference_id text null,
  mercado_pago_payment_id text null,
  mercado_pago_merchant_order_id text null,
  mercado_pago_status text null,
  mercado_pago_status_detail text null,
  notes text null,
  stock_deducted_at timestamptz null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid null references public.products(id) on delete set null,
  product_name text not null,
  product_slug text null,
  unit_price numeric(10,2) not null default 0,
  quantity integer not null default 1,
  line_total numeric(10,2) not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists idx_orders_user_id on public.orders(user_id);
create index if not exists idx_orders_status on public.orders(status);
create index if not exists idx_orders_customer_email on public.orders(customer_email);
create index if not exists idx_orders_external_reference on public.orders(external_reference);
create index if not exists idx_orders_created_at on public.orders(created_at desc);
create index if not exists idx_order_items_order_id on public.order_items(order_id);
create index if not exists idx_order_items_product_id on public.order_items(product_id);

drop trigger if exists set_orders_updated_at on public.orders;
create trigger set_orders_updated_at
before update on public.orders
for each row
execute function public.set_updated_at();

alter table public.orders enable row level security;
alter table public.order_items enable row level security;

drop policy if exists "orders_select_own_or_admin" on public.orders;
create policy "orders_select_own_or_admin"
on public.orders
for select
to authenticated
using (
  user_id = auth.uid()
  or public.get_user_role() = 'admin'
);

drop policy if exists "order_items_select_own_or_admin" on public.order_items;
create policy "order_items_select_own_or_admin"
on public.order_items
for select
to authenticated
using (
  exists (
    select 1
    from public.orders
    where orders.id = order_items.order_id
      and (
        orders.user_id = auth.uid()
        or public.get_user_role() = 'admin'
      )
  )
);

create or replace function public.apply_order_stock(target_order_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  current_order public.orders%rowtype;
  current_item record;
begin
  select *
  into current_order
  from public.orders
  where id = target_order_id
  for update;

  if not found then
    raise exception 'ORDER_NOT_FOUND';
  end if;

  if current_order.stock_deducted_at is not null then
    return;
  end if;

  for current_item in
    select product_id, quantity
    from public.order_items
    where order_id = target_order_id
  loop
    if current_item.product_id is null then
      continue;
    end if;

    update public.products
    set stock = stock - current_item.quantity
    where id = current_item.product_id
      and stock >= current_item.quantity;

    if not found then
      raise exception 'INSUFFICIENT_STOCK_FOR_PRODUCT';
    end if;
  end loop;

  update public.orders
  set stock_deducted_at = now(),
      updated_at = now()
  where id = target_order_id;
end;
$$;
