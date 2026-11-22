create or replace function public.cancel_demo_order(p_order_id uuid)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
    v_user_id uuid := auth.uid();
begin
    if v_user_id is null then
        raise exception 'Authentication required.' using errcode = '28000';
    end if;

    update public.demo_orders
    set status = 'cancelled'
    where id = p_order_id
      and user_id = v_user_id
      and status = 'received';

    if not found then
        raise exception 'Demo order cannot be cancelled.' using errcode = '22023';
    end if;
end;
$$;

revoke all on function public.cancel_demo_order(uuid) from public, anon;
grant execute on function public.cancel_demo_order(uuid) to authenticated;
