create or replace function public.delete_own_account()
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
    v_user_id uuid := auth.uid();
    v_session_id uuid := (auth.jwt() ->> 'session_id')::uuid;
begin
    if v_user_id is null or v_session_id is null or not exists (
        select 1
        from auth.sessions
        where id = v_session_id and user_id = v_user_id
    ) then
        raise exception 'An active session is required.' using errcode = '28000';
    end if;

    delete from auth.users where id = v_user_id;

    if not found then
        raise exception 'Account could not be deleted.' using errcode = '22023';
    end if;
end;
$$;

revoke all on function public.delete_own_account() from public, anon, authenticated;
grant execute on function public.delete_own_account() to authenticated;
