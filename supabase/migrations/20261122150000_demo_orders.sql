alter table public.products enable row level security;

drop policy if exists "Public can read products" on public.products;
create policy "Public can read products"
    on public.products
    for select
    to anon, authenticated
    using (true);

revoke all on public.products from public, anon, authenticated;
grant select on public.products to anon, authenticated;

create table if not exists public.demo_orders (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null references auth.users (id) on delete cascade,
    status text not null default 'received'
        check (status in ('received', 'processing', 'shipped', 'delivered', 'cancelled')),
    subtotal numeric(12, 2) not null check (subtotal >= 0),
    shipping numeric(12, 2) not null check (shipping >= 0),
    total numeric(12, 2) not null check (total = subtotal + shipping),
    created_at timestamptz not null default now()
);

create table if not exists public.demo_order_items (
    id uuid primary key default gen_random_uuid(),
    order_id uuid not null references public.demo_orders (id) on delete cascade,
    product_id bigint not null,
    title text not null,
    thumbnail text not null,
    quantity integer not null check (quantity between 1 and 10),
    unit_price numeric(12, 2) not null check (unit_price >= 0)
);

create index if not exists demo_orders_user_created_idx
    on public.demo_orders (user_id, created_at desc);
create index if not exists demo_order_items_order_idx
    on public.demo_order_items (order_id);

alter table public.demo_orders enable row level security;
alter table public.demo_order_items enable row level security;

drop policy if exists "Users can read their own demo orders" on public.demo_orders;
create policy "Users can read their own demo orders"
    on public.demo_orders
    for select
    to authenticated
    using (user_id = (select auth.uid()));

drop policy if exists "Users can read their own demo order items" on public.demo_order_items;
create policy "Users can read their own demo order items"
    on public.demo_order_items
    for select
    to authenticated
    using (
        exists (
            select 1
            from public.demo_orders
            where demo_orders.id = demo_order_items.order_id
              and demo_orders.user_id = (select auth.uid())
        )
    );

revoke all on public.demo_orders from public, anon, authenticated;
revoke all on public.demo_order_items from public, anon, authenticated;
grant select on public.demo_orders, public.demo_order_items to authenticated;

create or replace function public.place_demo_order(p_items jsonb)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
    v_user_id uuid := auth.uid();
    v_order_id uuid;
    v_item jsonb;
    v_product_id bigint;
    v_quantity integer;
    v_item_count integer;
    v_available_count bigint;
    v_subtotal numeric(12, 2);
    v_shipping numeric(12, 2);
begin
    if v_user_id is null then
        raise exception 'Authentication required.' using errcode = '28000';
    end if;

    if jsonb_typeof(p_items) is distinct from 'array' then
        raise exception 'Invalid order items.' using errcode = '22023';
    end if;

    v_item_count := jsonb_array_length(p_items);
    if v_item_count < 1
        or v_item_count > 30
        or octet_length(p_items::text) > 8192 then
        raise exception 'Invalid order items.' using errcode = '22023';
    end if;

    for v_item in select value from jsonb_array_elements(p_items) as items(value)
    loop
        if jsonb_typeof(v_item) is distinct from 'object'
            or coalesce(v_item ->> 'productId', '') !~ '^[1-9][0-9]{0,8}$'
            or coalesce(v_item ->> 'quantity', '') !~ '^[1-9][0-9]?$' then
            raise exception 'Invalid order item.' using errcode = '22023';
        end if;

        v_product_id := (v_item ->> 'productId')::bigint;
        v_quantity := (v_item ->> 'quantity')::integer;
        if v_quantity > 10 then
            raise exception 'Invalid order quantity.' using errcode = '22023';
        end if;
    end loop;

    if (
        select count(distinct (item ->> 'productId'))
        from jsonb_array_elements(p_items) as items(item)
    ) <> v_item_count then
        raise exception 'Duplicate products are not allowed.' using errcode = '22023';
    end if;

    perform pg_advisory_xact_lock(hashtext(v_user_id::text));
    if (
        select count(*)
        from public.demo_orders
        where user_id = v_user_id
          and created_at > now() - interval '1 hour'
    ) >= 5 then
        raise exception 'Demo order limit reached.' using errcode = '54000';
    end if;

    with requested as (
        select
            (item ->> 'productId')::bigint as product_id,
            (item ->> 'quantity')::integer as quantity
        from jsonb_array_elements(p_items) as items(item)
    ),
    available as (
        select
            requested.product_id,
            requested.quantity,
            p.price::numeric as price,
            least(greatest(coalesce(p.discount_percentage, 0)::numeric, 0), 100) as discount_percentage
        from requested
        join public.products as p on p.id::bigint = requested.product_id
        where p.stock >= requested.quantity
          and p.price >= 0
    )
    select
        count(*),
        coalesce(
            round(sum(round(price * (100 - discount_percentage) / 100, 2) * quantity), 2),
            0
        )
    into v_available_count, v_subtotal
    from available;

    if v_available_count <> v_item_count then
        raise exception 'One or more products are unavailable.' using errcode = '22023';
    end if;

    v_shipping := case when v_subtotal >= 50 then 0 else 4.99 end;

    insert into public.demo_orders (user_id, status, subtotal, shipping, total)
    values (v_user_id, 'received', v_subtotal, v_shipping, v_subtotal + v_shipping)
    returning id into v_order_id;

    with requested as (
        select
            (item ->> 'productId')::bigint as product_id,
            (item ->> 'quantity')::integer as quantity
        from jsonb_array_elements(p_items) as items(item)
    )
    insert into public.demo_order_items (order_id, product_id, title, thumbnail, quantity, unit_price)
    select
        v_order_id,
        p.id::bigint,
        p.title,
        p.thumbnail,
        requested.quantity,
        round(p.price::numeric * (
            100 - least(greatest(coalesce(p.discount_percentage, 0)::numeric, 0), 100)
        ) / 100, 2)
    from requested
    join public.products as p on p.id::bigint = requested.product_id;

    return v_order_id;
end;
$$;

revoke all on function public.place_demo_order(jsonb) from public, anon;
grant execute on function public.place_demo_order(jsonb) to authenticated;
