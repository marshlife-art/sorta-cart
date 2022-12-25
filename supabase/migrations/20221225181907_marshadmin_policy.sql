drop policy "authenticated users only" on "public"."Members";

drop policy "authenticated users only" on "public"."WholesaleOrders";

drop policy "any authenticated" on "public"."catmap";

drop policy "anyone can insert" on "public"."events";

drop policy "authenticated delete" on "public"."events";

drop policy "authenticated select" on "public"."events";

drop policy "anyone can select" on "public"."products";

drop policy "authenticated delete" on "public"."products";

drop policy "authenticated insert" on "public"."products";

drop policy "authenticated update" on "public"."products";

create policy "marsh admins only"
on "public"."Members"
as permissive
for all
to public
using ((auth.marshrole() = 'admin'::text))
with check ((auth.marshrole() = 'admin'::text));


create policy "marsh admins only"
on "public"."WholesaleOrders"
as permissive
for all
to public
using ((auth.marshrole() = 'admin'::text))
with check ((auth.marshrole() = 'admin'::text));


create policy "any authenticated select; marsh admin check"
on "public"."catmap"
as permissive
for all
to public
using ((auth.role() = 'authenticated'::text))
with check ((auth.marshrole() = 'admin'::text));


create policy "marsh admins only"
on "public"."events"
as permissive
for all
to public
using ((auth.marshrole() = 'admin'::text))
with check ((auth.marshrole() = 'admin'::text));


create policy "marsh admins only"
on "public"."legacyMembers"
as permissive
for all
to public
using ((auth.marshrole() = 'admin'::text))
with check ((auth.marshrole() = 'admin'::text));


create policy "marsh admins only"
on "public"."legacyOrderLineItems"
as permissive
for all
to public
using ((auth.marshrole() = 'admin'::text))
with check ((auth.marshrole() = 'admin'::text));


create policy "marsh admins only"
on "public"."legacyOrders"
as permissive
for all
to public
using ((auth.marshrole() = 'admin'::text))
with check ((auth.marshrole() = 'admin'::text));


create policy "marsh admins only"
on "public"."legacyPages"
as permissive
for all
to public
using ((auth.marshrole() = 'admin'::text))
with check ((auth.marshrole() = 'admin'::text));


create policy "marsh admins only"
on "public"."legacyProducts"
as permissive
for all
to public
using ((auth.marshrole() = 'admin'::text))
with check ((auth.marshrole() = 'admin'::text));


create policy "marsh admins only"
on "public"."legacyWholesaleOrders"
as permissive
for all
to public
using ((auth.marshrole() = 'admin'::text))
with check ((auth.marshrole() = 'admin'::text));


create policy "anyone select, marsh admins check"
on "public"."products"
as permissive
for all
to public
using (true)
with check ((auth.marshrole() = 'admin'::text));



