alter table "public"."products" alter column "id" set default uuid_generate_v4();

CREATE TRIGGER products_create_id_trigger BEFORE INSERT ON public.products FOR EACH ROW EXECUTE FUNCTION products_update_id();


