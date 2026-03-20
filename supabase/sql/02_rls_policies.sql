alter table public.profiles enable row level security;
alter table public.products enable row level security;

drop policy if exists "profiles_select_own_or_admin" on public.profiles;
create policy "profiles_select_own_or_admin"
on public.profiles
for select
to authenticated
using (
  auth.uid() = id
  or public.get_user_role() = 'admin'
);

drop policy if exists "profiles_update_admin_only" on public.profiles;
create policy "profiles_update_admin_only"
on public.profiles
for update
to authenticated
using (public.get_user_role() = 'admin')
with check (public.get_user_role() = 'admin');

drop policy if exists "products_public_read_active" on public.products;
create policy "products_public_read_active"
on public.products
for select
to anon, authenticated
using (
  active = true
  or public.get_user_role() in ('admin', 'editor')
);

drop policy if exists "products_manage_admin_editor" on public.products;
create policy "products_manage_admin_editor"
on public.products
for all
to authenticated
using (public.get_user_role() in ('admin', 'editor'))
with check (public.get_user_role() in ('admin', 'editor'));
