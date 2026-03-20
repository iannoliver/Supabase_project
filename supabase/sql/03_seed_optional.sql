insert into public.products (
  name,
  slug,
  short_description,
  description,
  price,
  image_url,
  active,
  featured,
  category,
  stock
)
values
  (
    'Pulse Desk Pro',
    'pulse-desk-pro',
    'Mesa premium para setups de alta performance.',
    'Mesa com acabamento sofisticado, estrutura reforcada e foco em ergonomia para ambientes profissionais.',
    2499.90,
    'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=80',
    true,
    true,
    'Moveis',
    12
  ),
  (
    'Orbit Chair',
    'orbit-chair',
    'Cadeira executiva com design contemporaneo.',
    'Cadeira com apoio lombar, revestimento premium e regulagens para jornadas intensas de uso.',
    1899.00,
    'https://images.unsplash.com/photo-1505843513577-22bb7d21e455?auto=format&fit=crop&w=1200&q=80',
    true,
    true,
    'Escritorio',
    8
  ),
  (
    'Nimbus Lamp',
    'nimbus-lamp',
    'Iluminacao de apoio com acabamento fosco.',
    'Luminaria pensada para destacar ambientes e valorizar o produto na vitrine digital.',
    359.90,
    'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80',
    true,
    false,
    'Decoracao',
    25
  )
on conflict (slug) do nothing;
