with first_product as (
  select id, name, slug, price
  from public.products
  where active = true
  order by created_at asc
  limit 1
),
new_order as (
  insert into public.orders (
    customer_name,
    customer_email,
    status,
    currency,
    subtotal,
    total,
    external_reference,
    notes
  )
  select
    'Cliente Exemplo',
    'cliente@example.com',
    'pending',
    'BRL',
    price,
    price,
    'sample_order_' || replace(gen_random_uuid()::text, '-', ''),
    'Seed opcional para validar listagem de pedidos.'
  from first_product
  returning id
)
insert into public.order_items (
  order_id,
  product_id,
  product_name,
  product_slug,
  unit_price,
  quantity,
  line_total
)
select
  new_order.id,
  first_product.id,
  first_product.name,
  first_product.slug,
  first_product.price,
  1,
  first_product.price
from new_order
cross join first_product;
