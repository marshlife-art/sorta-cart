--
-- PostgreSQL database dump
--

-- Dumped from database version 13.3
-- Dumped by pg_dump version 15.1 (Debian 15.1-1.pgdg110+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: pg_net; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "pg_net" WITH SCHEMA "extensions";


--
-- Name: public; Type: SCHEMA; Schema: -; Owner: postgres
--

-- *not* creating schema, since initdb creates it


ALTER SCHEMA "public" OWNER TO "postgres";

--
-- Name: plv8; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "plv8" WITH SCHEMA "pg_catalog";


--
-- Name: pg_stat_statements; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";


--
-- Name: pgcrypto; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";


--
-- Name: pgjwt; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "pgjwt" WITH SCHEMA "extensions";


--
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";


SET default_tablespace = '';

SET default_table_access_method = "heap";

--
-- Name: products; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE "public"."products" (
    "unf" "text",
    "upc_code" "text",
    "category" "text",
    "sub_category" "text",
    "name" "text",
    "pk" integer,
    "size" "text",
    "unit_type" "text",
    "ws_price" double precision,
    "u_price" double precision,
    "ws_price_cost" double precision,
    "u_price_cost" double precision,
    "codes" "text",
    "vendor" "text",
    "import_tag" "text",
    "createdAt" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()),
    "updatedAt" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()),
    "count_on_hand" integer,
    "no_backorder" boolean,
    "plu" "text",
    "id" "text" NOT NULL,
    "description_orig" "text",
    "description_edit" "text",
    "description" "text" GENERATED ALWAYS AS (COALESCE("description_edit", "description_orig")) STORED,
    "featured" boolean DEFAULT false,
    "sq_variation_id" "text",
    "updated_at" timestamp with time zone
);


ALTER TABLE "public"."products" OWNER TO "postgres";

--
-- Name: default_products(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION "public"."default_products"() RETURNS SETOF "public"."products"
    LANGUAGE "sql"
    AS $$
    SELECT * FROM products ORDER BY array_position(ARRAY ['MARSH SCHEDULE','MUTUAL AID','MUTUAL AID','MARSH','ALBERT''S FRESH','ALBERT''S PRODUCE','CHILL','REFRIGERATED','FROZEN','GROCERY','GROCERY & BEVERAGES','PERSONAL CARE','BULK', 'BULK FOODS''SUPPLEMENTS'], category), sub_category;
$$;


ALTER FUNCTION "public"."default_products"() OWNER TO "postgres";

--
-- Name: distinct_product_categories(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION "public"."distinct_product_categories"() RETURNS TABLE("category" "text")
    LANGUAGE "sql"
    AS $$
    SELECT DISTINCT category FROM products;
$$;


ALTER FUNCTION "public"."distinct_product_categories"() OWNER TO "postgres";

--
-- Name: distinct_product_import_tags(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION "public"."distinct_product_import_tags"() RETURNS TABLE("import_tag" "text")
    LANGUAGE "sql"
    AS $$
    SELECT DISTINCT import_tag FROM products;
$$;


ALTER FUNCTION "public"."distinct_product_import_tags"() OWNER TO "postgres";

--
-- Name: distinct_product_sub_categories("text"); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION "public"."distinct_product_sub_categories"("category" "text") RETURNS TABLE("category" "text")
    LANGUAGE "sql"
    AS $_$
    SELECT DISTINCT sub_category FROM products WHERE category = $1;
$_$;


ALTER FUNCTION "public"."distinct_product_sub_categories"("category" "text") OWNER TO "postgres";

--
-- Name: distinct_product_vendors(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION "public"."distinct_product_vendors"() RETURNS TABLE("vendor" "text")
    LANGUAGE "sql"
    AS $$
    SELECT DISTINCT vendor FROM products;
$$;


ALTER FUNCTION "public"."distinct_product_vendors"() OWNER TO "postgres";

--
-- Name: products_update_id(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION "public"."products_update_id"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$ BEGIN NEW.id = coalesce(NEW.unf, '') || '__' || coalesce(NEW.upc_code, '');
RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."products_update_id"() OWNER TO "postgres";

--
-- Name: products_updated_at(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION "public"."products_updated_at"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$BEGIN NEW.updated_at = NOW();
RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."products_updated_at"() OWNER TO "postgres";

--
-- Name: Orders; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE "public"."Orders" (
    "id" bigint NOT NULL,
    "UserId" "uuid",
    "status" "text",
    "payment_status" "text",
    "shipment_status" "text",
    "total" real,
    "subtotal" real,
    "name" "text",
    "email" "text",
    "phone" "text",
    "address" "text",
    "notes" "text",
    "email_sent" boolean,
    "item_count" smallint,
    "history" "jsonb",
    "createdAt" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()),
    "updatedAt" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()),
    "MemberId" bigint,
    "fts" "tsvector" GENERATED ALWAYS AS ("to_tsvector"('"english"'::"regconfig", ((((((((COALESCE("name", ''::"text") || ' '::"text") || COALESCE("email", ''::"text")) || ' '::"text") || COALESCE("phone", ''::"text")) || ' '::"text") || COALESCE("address", ''::"text")) || ' '::"text") || COALESCE("notes", ''::"text")))) STORED,
    "api_key" "uuid" DEFAULT "extensions"."uuid_generate_v4"()
);


ALTER TABLE "public"."Orders" OWNER TO "postgres";

--
-- Name: recent_orders(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION "public"."recent_orders"() RETURNS SETOF "public"."Orders"
    LANGUAGE "sql"
    AS $$
    SELECT * FROM "Orders" WHERE "createdAt" BETWEEN
    NOW()::DATE-EXTRACT(DOW FROM NOW())::INTEGER-14
    AND NOW() ORDER BY "createdAt" DESC;
$$;


ALTER FUNCTION "public"."recent_orders"() OWNER TO "postgres";

--
-- Name: Members; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE "public"."Members" (
    "id" bigint NOT NULL,
    "UserId" "uuid",
    "registration_email" "text",
    "name" "text",
    "phone" "text",
    "address" "text",
    "discount" smallint,
    "discount_type" "text",
    "fees_paid" real,
    "store_credit" real,
    "shares" smallint,
    "member_type" "text",
    "data" "jsonb",
    "createdAt" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()),
    "updatedAt" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()),
    "is_admin" boolean DEFAULT false NOT NULL,
    "fts" "tsvector" GENERATED ALWAYS AS ("to_tsvector"('"english"'::"regconfig", ((((((COALESCE("name", ''::"text") || ' '::"text") || COALESCE("phone", ''::"text")) || ' '::"text") || COALESCE("address", ''::"text")) || ' '::"text") || COALESCE("registration_email", ''::"text")))) STORED
);


ALTER TABLE "public"."Members" OWNER TO "postgres";

--
-- Name: OrderLineItems; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE "public"."OrderLineItems" (
    "id" bigint NOT NULL,
    "OrderId" bigint,
    "WholesaleOrderId" bigint,
    "price" real,
    "quantity" smallint,
    "total" real,
    "kind" "text",
    "description" "text",
    "vendor" "text",
    "selected_unit" "text",
    "data" "jsonb",
    "createdAt" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()),
    "updatedAt" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()),
    "status" "text"
);


ALTER TABLE "public"."OrderLineItems" OWNER TO "postgres";

--
-- Name: WholesaleOrders; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE "public"."WholesaleOrders" (
    "id" bigint NOT NULL,
    "vendor" "text",
    "notes" "text",
    "status" "text",
    "payment_status" "text",
    "shipment_status" "text",
    "createdAt" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()),
    "updatedAt" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()),
    "calc_adjustments" boolean,
    "square_status" "text",
    "square_loaded_at" timestamp with time zone,
    "data" "jsonb",
    "api_key" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL
);


ALTER TABLE "public"."WholesaleOrders" OWNER TO "postgres";

--
-- Name: catmap; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE "public"."catmap" (
    "from" "text" NOT NULL,
    "to" "text" NOT NULL
);


ALTER TABLE "public"."catmap" OWNER TO "postgres";

--
-- Name: events; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE "public"."events" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "level" "text",
    "tag" "text",
    "message" "text",
    "data" "jsonb",
    "env" "text"
);


ALTER TABLE "public"."events" OWNER TO "postgres";

--
-- Name: events_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE "public"."events" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."events_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: members_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE "public"."Members" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."members_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: orderlineitems_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE "public"."OrderLineItems" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."orderlineitems_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: orders_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE "public"."Orders" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."orders_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: squareimport; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE "public"."squareimport" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "api_key" "uuid" DEFAULT "extensions"."uuid_generate_v4"(),
    "status" "text",
    "products" "jsonb",
    "name" "text",
    "notes" "text"
);


ALTER TABLE "public"."squareimport" OWNER TO "postgres";

--
-- Name: squareimport_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE "public"."squareimport" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."squareimport_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: stock; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE "public"."stock" (
    "variation_id" "text" NOT NULL,
    "name" "text",
    "description" "text",
    "price" integer,
    "unit" "text",
    "quantity" smallint,
    "sku" "text",
    "item_id" "text",
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."stock" OWNER TO "postgres";

--
-- Name: wholesaleorders_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE "public"."WholesaleOrders" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."wholesaleorders_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: catmap catmap_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."catmap"
    ADD CONSTRAINT "catmap_pkey" PRIMARY KEY ("from");


--
-- Name: events events_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."events"
    ADD CONSTRAINT "events_pkey" PRIMARY KEY ("id");


--
-- Name: Members members_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."Members"
    ADD CONSTRAINT "members_pkey" PRIMARY KEY ("id");


--
-- Name: OrderLineItems orderlineitems_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."OrderLineItems"
    ADD CONSTRAINT "orderlineitems_pkey" PRIMARY KEY ("id");


--
-- Name: Orders orders_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."Orders"
    ADD CONSTRAINT "orders_pkey" PRIMARY KEY ("id");


--
-- Name: products products_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."products"
    ADD CONSTRAINT "products_pkey" PRIMARY KEY ("id");


--
-- Name: squareimport squareimport_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."squareimport"
    ADD CONSTRAINT "squareimport_pkey" PRIMARY KEY ("id");


--
-- Name: stock stock_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."stock"
    ADD CONSTRAINT "stock_pkey" PRIMARY KEY ("variation_id");


--
-- Name: WholesaleOrders wholesaleorders_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."WholesaleOrders"
    ADD CONSTRAINT "wholesaleorders_pkey" PRIMARY KEY ("id");


--
-- Name: books_fts; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "books_fts" ON "public"."Orders" USING "gin" ("fts");


--
-- Name: members_fts; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "members_fts" ON "public"."Members" USING "gin" ("fts");


--
-- Name: products products_update_id_trigger; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER "products_update_id_trigger" BEFORE UPDATE ON "public"."products" FOR EACH ROW WHEN ((("old"."unf" IS DISTINCT FROM "new"."unf") OR ("old"."upc_code" IS DISTINCT FROM "new"."upc_code"))) EXECUTE FUNCTION "public"."products_update_id"();


--
-- Name: products products_update_updatedAt; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER "products_update_updatedAt" BEFORE UPDATE ON "public"."products" FOR EACH ROW EXECUTE FUNCTION "public"."products_updated_at"();


--
-- Name: Members members_UserId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."Members"
    ADD CONSTRAINT "members_UserId_fkey" FOREIGN KEY ("UserId") REFERENCES "auth"."users"("id");


--
-- Name: OrderLineItems orderlineitems_OrderId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."OrderLineItems"
    ADD CONSTRAINT "orderlineitems_OrderId_fkey" FOREIGN KEY ("OrderId") REFERENCES "public"."Orders"("id");


--
-- Name: OrderLineItems orderlineitems_WholesaleOrderId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."OrderLineItems"
    ADD CONSTRAINT "orderlineitems_WholesaleOrderId_fkey" FOREIGN KEY ("WholesaleOrderId") REFERENCES "public"."WholesaleOrders"("id");


--
-- Name: Orders orders_MemberId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."Orders"
    ADD CONSTRAINT "orders_MemberId_fkey" FOREIGN KEY ("MemberId") REFERENCES "public"."Members"("id");


--
-- Name: Orders orders_UserId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."Orders"
    ADD CONSTRAINT "orders_UserId_fkey" FOREIGN KEY ("UserId") REFERENCES "auth"."users"("id");


--
-- Name: OrderLineItems Enable for authenticated users only; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Enable for authenticated users only" ON "public"."OrderLineItems" USING (("auth"."role"() = 'authenticated'::"text")) WITH CHECK (("auth"."role"() = 'authenticated'::"text"));


--
-- Name: Members; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE "public"."Members" ENABLE ROW LEVEL SECURITY;

--
-- Name: OrderLineItems; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE "public"."OrderLineItems" ENABLE ROW LEVEL SECURITY;

--
-- Name: Orders; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE "public"."Orders" ENABLE ROW LEVEL SECURITY;

--
-- Name: WholesaleOrders; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE "public"."WholesaleOrders" ENABLE ROW LEVEL SECURITY;

--
-- Name: catmap any authenticated; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "any authenticated" ON "public"."catmap" USING (("auth"."role"() = 'authenticated'::"text")) WITH CHECK (("auth"."role"() = 'authenticated'::"text"));


--
-- Name: events anyone can insert; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "anyone can insert" ON "public"."events" FOR INSERT WITH CHECK (true);


--
-- Name: products anyone can select; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "anyone can select" ON "public"."products" FOR SELECT USING (true);


--
-- Name: stock anyone can select; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "anyone can select" ON "public"."stock" FOR SELECT USING (true);


--
-- Name: events authenticated delete; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "authenticated delete" ON "public"."events" FOR DELETE USING (("auth"."role"() = 'authenticated'::"text"));


--
-- Name: products authenticated delete; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "authenticated delete" ON "public"."products" FOR DELETE USING (("auth"."role"() = 'authenticated'::"text"));


--
-- Name: products authenticated insert; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "authenticated insert" ON "public"."products" FOR INSERT WITH CHECK (("auth"."role"() = 'authenticated'::"text"));


--
-- Name: events authenticated select; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "authenticated select" ON "public"."events" FOR SELECT USING (("auth"."role"() = 'authenticated'::"text"));


--
-- Name: products authenticated update; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "authenticated update" ON "public"."products" FOR UPDATE USING (("auth"."role"() = 'authenticated'::"text")) WITH CHECK (("auth"."role"() = 'authenticated'::"text"));


--
-- Name: Members authenticated users only; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "authenticated users only" ON "public"."Members" USING (("auth"."role"() = 'authenticated'::"text")) WITH CHECK (("auth"."role"() = 'authenticated'::"text"));


--
-- Name: Orders authenticated users only; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "authenticated users only" ON "public"."Orders" USING (("auth"."role"() = 'authenticated'::"text")) WITH CHECK (("auth"."role"() = 'authenticated'::"text"));


--
-- Name: WholesaleOrders authenticated users only; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "authenticated users only" ON "public"."WholesaleOrders" USING (("auth"."role"() = 'authenticated'::"text")) WITH CHECK (("auth"."role"() = 'authenticated'::"text"));


--
-- Name: squareimport authenticated users only; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "authenticated users only" ON "public"."squareimport" USING (("auth"."role"() = 'authenticated'::"text")) WITH CHECK (("auth"."role"() = 'authenticated'::"text"));


--
-- Name: catmap; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE "public"."catmap" ENABLE ROW LEVEL SECURITY;

--
-- Name: events; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE "public"."events" ENABLE ROW LEVEL SECURITY;

--
-- Name: products; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE "public"."products" ENABLE ROW LEVEL SECURITY;

--
-- Name: squareimport; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE "public"."squareimport" ENABLE ROW LEVEL SECURITY;

--
-- Name: stock; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE "public"."stock" ENABLE ROW LEVEL SECURITY;

--
-- Name: SCHEMA "net"; Type: ACL; Schema: -; Owner: postgres
--

REVOKE ALL ON SCHEMA "net" FROM "supabase_admin";
REVOKE ALL ON SCHEMA "net" FROM "postgres";
GRANT ALL ON SCHEMA "net" TO "postgres";
GRANT USAGE ON SCHEMA "net" TO "supabase_functions_admin";
GRANT USAGE ON SCHEMA "net" TO "anon";
GRANT USAGE ON SCHEMA "net" TO "authenticated";
GRANT USAGE ON SCHEMA "net" TO "service_role";


--
-- Name: SCHEMA "public"; Type: ACL; Schema: -; Owner: postgres
--

REVOKE USAGE ON SCHEMA "public" FROM PUBLIC;
GRANT ALL ON SCHEMA "public" TO PUBLIC;
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";


--
-- Name: FUNCTION "algorithm_sign"("signables" "text", "secret" "text", "algorithm" "text"); Type: ACL; Schema: extensions; Owner: postgres
--

GRANT ALL ON FUNCTION "extensions"."algorithm_sign"("signables" "text", "secret" "text", "algorithm" "text") TO "dashboard_user";


--
-- Name: FUNCTION "armor"("bytea"); Type: ACL; Schema: extensions; Owner: postgres
--

GRANT ALL ON FUNCTION "extensions"."armor"("bytea") TO "dashboard_user";


--
-- Name: FUNCTION "armor"("bytea", "text"[], "text"[]); Type: ACL; Schema: extensions; Owner: postgres
--

GRANT ALL ON FUNCTION "extensions"."armor"("bytea", "text"[], "text"[]) TO "dashboard_user";


--
-- Name: FUNCTION "crypt"("text", "text"); Type: ACL; Schema: extensions; Owner: postgres
--

GRANT ALL ON FUNCTION "extensions"."crypt"("text", "text") TO "dashboard_user";


--
-- Name: FUNCTION "dearmor"("text"); Type: ACL; Schema: extensions; Owner: postgres
--

GRANT ALL ON FUNCTION "extensions"."dearmor"("text") TO "dashboard_user";


--
-- Name: FUNCTION "decrypt"("bytea", "bytea", "text"); Type: ACL; Schema: extensions; Owner: postgres
--

GRANT ALL ON FUNCTION "extensions"."decrypt"("bytea", "bytea", "text") TO "dashboard_user";


--
-- Name: FUNCTION "decrypt_iv"("bytea", "bytea", "bytea", "text"); Type: ACL; Schema: extensions; Owner: postgres
--

GRANT ALL ON FUNCTION "extensions"."decrypt_iv"("bytea", "bytea", "bytea", "text") TO "dashboard_user";


--
-- Name: FUNCTION "digest"("bytea", "text"); Type: ACL; Schema: extensions; Owner: postgres
--

GRANT ALL ON FUNCTION "extensions"."digest"("bytea", "text") TO "dashboard_user";


--
-- Name: FUNCTION "digest"("text", "text"); Type: ACL; Schema: extensions; Owner: postgres
--

GRANT ALL ON FUNCTION "extensions"."digest"("text", "text") TO "dashboard_user";


--
-- Name: FUNCTION "encrypt"("bytea", "bytea", "text"); Type: ACL; Schema: extensions; Owner: postgres
--

GRANT ALL ON FUNCTION "extensions"."encrypt"("bytea", "bytea", "text") TO "dashboard_user";


--
-- Name: FUNCTION "encrypt_iv"("bytea", "bytea", "bytea", "text"); Type: ACL; Schema: extensions; Owner: postgres
--

GRANT ALL ON FUNCTION "extensions"."encrypt_iv"("bytea", "bytea", "bytea", "text") TO "dashboard_user";


--
-- Name: FUNCTION "gen_random_bytes"(integer); Type: ACL; Schema: extensions; Owner: postgres
--

GRANT ALL ON FUNCTION "extensions"."gen_random_bytes"(integer) TO "dashboard_user";


--
-- Name: FUNCTION "gen_random_uuid"(); Type: ACL; Schema: extensions; Owner: postgres
--

GRANT ALL ON FUNCTION "extensions"."gen_random_uuid"() TO "dashboard_user";


--
-- Name: FUNCTION "gen_salt"("text"); Type: ACL; Schema: extensions; Owner: postgres
--

GRANT ALL ON FUNCTION "extensions"."gen_salt"("text") TO "dashboard_user";


--
-- Name: FUNCTION "gen_salt"("text", integer); Type: ACL; Schema: extensions; Owner: postgres
--

GRANT ALL ON FUNCTION "extensions"."gen_salt"("text", integer) TO "dashboard_user";


--
-- Name: FUNCTION "hmac"("bytea", "bytea", "text"); Type: ACL; Schema: extensions; Owner: postgres
--

GRANT ALL ON FUNCTION "extensions"."hmac"("bytea", "bytea", "text") TO "dashboard_user";


--
-- Name: FUNCTION "hmac"("text", "text", "text"); Type: ACL; Schema: extensions; Owner: postgres
--

GRANT ALL ON FUNCTION "extensions"."hmac"("text", "text", "text") TO "dashboard_user";


--
-- Name: FUNCTION "pg_stat_statements"("showtext" boolean, OUT "userid" "oid", OUT "dbid" "oid", OUT "queryid" bigint, OUT "query" "text", OUT "plans" bigint, OUT "total_plan_time" double precision, OUT "min_plan_time" double precision, OUT "max_plan_time" double precision, OUT "mean_plan_time" double precision, OUT "stddev_plan_time" double precision, OUT "calls" bigint, OUT "total_exec_time" double precision, OUT "min_exec_time" double precision, OUT "max_exec_time" double precision, OUT "mean_exec_time" double precision, OUT "stddev_exec_time" double precision, OUT "rows" bigint, OUT "shared_blks_hit" bigint, OUT "shared_blks_read" bigint, OUT "shared_blks_dirtied" bigint, OUT "shared_blks_written" bigint, OUT "local_blks_hit" bigint, OUT "local_blks_read" bigint, OUT "local_blks_dirtied" bigint, OUT "local_blks_written" bigint, OUT "temp_blks_read" bigint, OUT "temp_blks_written" bigint, OUT "blk_read_time" double precision, OUT "blk_write_time" double precision, OUT "wal_records" bigint, OUT "wal_fpi" bigint, OUT "wal_bytes" numeric); Type: ACL; Schema: extensions; Owner: postgres
--

GRANT ALL ON FUNCTION "extensions"."pg_stat_statements"("showtext" boolean, OUT "userid" "oid", OUT "dbid" "oid", OUT "queryid" bigint, OUT "query" "text", OUT "plans" bigint, OUT "total_plan_time" double precision, OUT "min_plan_time" double precision, OUT "max_plan_time" double precision, OUT "mean_plan_time" double precision, OUT "stddev_plan_time" double precision, OUT "calls" bigint, OUT "total_exec_time" double precision, OUT "min_exec_time" double precision, OUT "max_exec_time" double precision, OUT "mean_exec_time" double precision, OUT "stddev_exec_time" double precision, OUT "rows" bigint, OUT "shared_blks_hit" bigint, OUT "shared_blks_read" bigint, OUT "shared_blks_dirtied" bigint, OUT "shared_blks_written" bigint, OUT "local_blks_hit" bigint, OUT "local_blks_read" bigint, OUT "local_blks_dirtied" bigint, OUT "local_blks_written" bigint, OUT "temp_blks_read" bigint, OUT "temp_blks_written" bigint, OUT "blk_read_time" double precision, OUT "blk_write_time" double precision, OUT "wal_records" bigint, OUT "wal_fpi" bigint, OUT "wal_bytes" numeric) TO "dashboard_user";


--
-- Name: FUNCTION "pg_stat_statements_reset"("userid" "oid", "dbid" "oid", "queryid" bigint); Type: ACL; Schema: extensions; Owner: postgres
--

GRANT ALL ON FUNCTION "extensions"."pg_stat_statements_reset"("userid" "oid", "dbid" "oid", "queryid" bigint) TO "dashboard_user";


--
-- Name: FUNCTION "pgp_armor_headers"("text", OUT "key" "text", OUT "value" "text"); Type: ACL; Schema: extensions; Owner: postgres
--

GRANT ALL ON FUNCTION "extensions"."pgp_armor_headers"("text", OUT "key" "text", OUT "value" "text") TO "dashboard_user";


--
-- Name: FUNCTION "pgp_key_id"("bytea"); Type: ACL; Schema: extensions; Owner: postgres
--

GRANT ALL ON FUNCTION "extensions"."pgp_key_id"("bytea") TO "dashboard_user";


--
-- Name: FUNCTION "pgp_pub_decrypt"("bytea", "bytea"); Type: ACL; Schema: extensions; Owner: postgres
--

GRANT ALL ON FUNCTION "extensions"."pgp_pub_decrypt"("bytea", "bytea") TO "dashboard_user";


--
-- Name: FUNCTION "pgp_pub_decrypt"("bytea", "bytea", "text"); Type: ACL; Schema: extensions; Owner: postgres
--

GRANT ALL ON FUNCTION "extensions"."pgp_pub_decrypt"("bytea", "bytea", "text") TO "dashboard_user";


--
-- Name: FUNCTION "pgp_pub_decrypt"("bytea", "bytea", "text", "text"); Type: ACL; Schema: extensions; Owner: postgres
--

GRANT ALL ON FUNCTION "extensions"."pgp_pub_decrypt"("bytea", "bytea", "text", "text") TO "dashboard_user";


--
-- Name: FUNCTION "pgp_pub_decrypt_bytea"("bytea", "bytea"); Type: ACL; Schema: extensions; Owner: postgres
--

GRANT ALL ON FUNCTION "extensions"."pgp_pub_decrypt_bytea"("bytea", "bytea") TO "dashboard_user";


--
-- Name: FUNCTION "pgp_pub_decrypt_bytea"("bytea", "bytea", "text"); Type: ACL; Schema: extensions; Owner: postgres
--

GRANT ALL ON FUNCTION "extensions"."pgp_pub_decrypt_bytea"("bytea", "bytea", "text") TO "dashboard_user";


--
-- Name: FUNCTION "pgp_pub_decrypt_bytea"("bytea", "bytea", "text", "text"); Type: ACL; Schema: extensions; Owner: postgres
--

GRANT ALL ON FUNCTION "extensions"."pgp_pub_decrypt_bytea"("bytea", "bytea", "text", "text") TO "dashboard_user";


--
-- Name: FUNCTION "pgp_pub_encrypt"("text", "bytea"); Type: ACL; Schema: extensions; Owner: postgres
--

GRANT ALL ON FUNCTION "extensions"."pgp_pub_encrypt"("text", "bytea") TO "dashboard_user";


--
-- Name: FUNCTION "pgp_pub_encrypt"("text", "bytea", "text"); Type: ACL; Schema: extensions; Owner: postgres
--

GRANT ALL ON FUNCTION "extensions"."pgp_pub_encrypt"("text", "bytea", "text") TO "dashboard_user";


--
-- Name: FUNCTION "pgp_pub_encrypt_bytea"("bytea", "bytea"); Type: ACL; Schema: extensions; Owner: postgres
--

GRANT ALL ON FUNCTION "extensions"."pgp_pub_encrypt_bytea"("bytea", "bytea") TO "dashboard_user";


--
-- Name: FUNCTION "pgp_pub_encrypt_bytea"("bytea", "bytea", "text"); Type: ACL; Schema: extensions; Owner: postgres
--

GRANT ALL ON FUNCTION "extensions"."pgp_pub_encrypt_bytea"("bytea", "bytea", "text") TO "dashboard_user";


--
-- Name: FUNCTION "pgp_sym_decrypt"("bytea", "text"); Type: ACL; Schema: extensions; Owner: postgres
--

GRANT ALL ON FUNCTION "extensions"."pgp_sym_decrypt"("bytea", "text") TO "dashboard_user";


--
-- Name: FUNCTION "pgp_sym_decrypt"("bytea", "text", "text"); Type: ACL; Schema: extensions; Owner: postgres
--

GRANT ALL ON FUNCTION "extensions"."pgp_sym_decrypt"("bytea", "text", "text") TO "dashboard_user";


--
-- Name: FUNCTION "pgp_sym_decrypt_bytea"("bytea", "text"); Type: ACL; Schema: extensions; Owner: postgres
--

GRANT ALL ON FUNCTION "extensions"."pgp_sym_decrypt_bytea"("bytea", "text") TO "dashboard_user";


--
-- Name: FUNCTION "pgp_sym_decrypt_bytea"("bytea", "text", "text"); Type: ACL; Schema: extensions; Owner: postgres
--

GRANT ALL ON FUNCTION "extensions"."pgp_sym_decrypt_bytea"("bytea", "text", "text") TO "dashboard_user";


--
-- Name: FUNCTION "pgp_sym_encrypt"("text", "text"); Type: ACL; Schema: extensions; Owner: postgres
--

GRANT ALL ON FUNCTION "extensions"."pgp_sym_encrypt"("text", "text") TO "dashboard_user";


--
-- Name: FUNCTION "pgp_sym_encrypt"("text", "text", "text"); Type: ACL; Schema: extensions; Owner: postgres
--

GRANT ALL ON FUNCTION "extensions"."pgp_sym_encrypt"("text", "text", "text") TO "dashboard_user";


--
-- Name: FUNCTION "pgp_sym_encrypt_bytea"("bytea", "text"); Type: ACL; Schema: extensions; Owner: postgres
--

GRANT ALL ON FUNCTION "extensions"."pgp_sym_encrypt_bytea"("bytea", "text") TO "dashboard_user";


--
-- Name: FUNCTION "pgp_sym_encrypt_bytea"("bytea", "text", "text"); Type: ACL; Schema: extensions; Owner: postgres
--

GRANT ALL ON FUNCTION "extensions"."pgp_sym_encrypt_bytea"("bytea", "text", "text") TO "dashboard_user";


--
-- Name: FUNCTION "sign"("payload" "json", "secret" "text", "algorithm" "text"); Type: ACL; Schema: extensions; Owner: postgres
--

GRANT ALL ON FUNCTION "extensions"."sign"("payload" "json", "secret" "text", "algorithm" "text") TO "dashboard_user";


--
-- Name: FUNCTION "try_cast_double"("inp" "text"); Type: ACL; Schema: extensions; Owner: postgres
--

GRANT ALL ON FUNCTION "extensions"."try_cast_double"("inp" "text") TO "dashboard_user";


--
-- Name: FUNCTION "url_decode"("data" "text"); Type: ACL; Schema: extensions; Owner: postgres
--

GRANT ALL ON FUNCTION "extensions"."url_decode"("data" "text") TO "dashboard_user";


--
-- Name: FUNCTION "url_encode"("data" "bytea"); Type: ACL; Schema: extensions; Owner: postgres
--

GRANT ALL ON FUNCTION "extensions"."url_encode"("data" "bytea") TO "dashboard_user";


--
-- Name: FUNCTION "uuid_generate_v1"(); Type: ACL; Schema: extensions; Owner: postgres
--

GRANT ALL ON FUNCTION "extensions"."uuid_generate_v1"() TO "dashboard_user";


--
-- Name: FUNCTION "uuid_generate_v1mc"(); Type: ACL; Schema: extensions; Owner: postgres
--

GRANT ALL ON FUNCTION "extensions"."uuid_generate_v1mc"() TO "dashboard_user";


--
-- Name: FUNCTION "uuid_generate_v3"("namespace" "uuid", "name" "text"); Type: ACL; Schema: extensions; Owner: postgres
--

GRANT ALL ON FUNCTION "extensions"."uuid_generate_v3"("namespace" "uuid", "name" "text") TO "dashboard_user";


--
-- Name: FUNCTION "uuid_generate_v4"(); Type: ACL; Schema: extensions; Owner: postgres
--

GRANT ALL ON FUNCTION "extensions"."uuid_generate_v4"() TO "dashboard_user";


--
-- Name: FUNCTION "uuid_generate_v5"("namespace" "uuid", "name" "text"); Type: ACL; Schema: extensions; Owner: postgres
--

GRANT ALL ON FUNCTION "extensions"."uuid_generate_v5"("namespace" "uuid", "name" "text") TO "dashboard_user";


--
-- Name: FUNCTION "uuid_nil"(); Type: ACL; Schema: extensions; Owner: postgres
--

GRANT ALL ON FUNCTION "extensions"."uuid_nil"() TO "dashboard_user";


--
-- Name: FUNCTION "uuid_ns_dns"(); Type: ACL; Schema: extensions; Owner: postgres
--

GRANT ALL ON FUNCTION "extensions"."uuid_ns_dns"() TO "dashboard_user";


--
-- Name: FUNCTION "uuid_ns_oid"(); Type: ACL; Schema: extensions; Owner: postgres
--

GRANT ALL ON FUNCTION "extensions"."uuid_ns_oid"() TO "dashboard_user";


--
-- Name: FUNCTION "uuid_ns_url"(); Type: ACL; Schema: extensions; Owner: postgres
--

GRANT ALL ON FUNCTION "extensions"."uuid_ns_url"() TO "dashboard_user";


--
-- Name: FUNCTION "uuid_ns_x500"(); Type: ACL; Schema: extensions; Owner: postgres
--

GRANT ALL ON FUNCTION "extensions"."uuid_ns_x500"() TO "dashboard_user";


--
-- Name: FUNCTION "verify"("token" "text", "secret" "text", "algorithm" "text"); Type: ACL; Schema: extensions; Owner: postgres
--

GRANT ALL ON FUNCTION "extensions"."verify"("token" "text", "secret" "text", "algorithm" "text") TO "dashboard_user";


--
-- Name: FUNCTION "http_collect_response"("request_id" bigint, "async" boolean); Type: ACL; Schema: net; Owner: postgres
--

REVOKE ALL ON FUNCTION "net"."http_collect_response"("request_id" bigint, "async" boolean) FROM PUBLIC;
GRANT ALL ON FUNCTION "net"."http_collect_response"("request_id" bigint, "async" boolean) TO "supabase_functions_admin";
GRANT ALL ON FUNCTION "net"."http_collect_response"("request_id" bigint, "async" boolean) TO "anon";
GRANT ALL ON FUNCTION "net"."http_collect_response"("request_id" bigint, "async" boolean) TO "authenticated";
GRANT ALL ON FUNCTION "net"."http_collect_response"("request_id" bigint, "async" boolean) TO "service_role";


--
-- Name: FUNCTION "http_get"("url" "text", "params" "jsonb", "headers" "jsonb", "timeout_milliseconds" integer); Type: ACL; Schema: net; Owner: postgres
--

REVOKE ALL ON FUNCTION "net"."http_get"("url" "text", "params" "jsonb", "headers" "jsonb", "timeout_milliseconds" integer) FROM PUBLIC;
GRANT ALL ON FUNCTION "net"."http_get"("url" "text", "params" "jsonb", "headers" "jsonb", "timeout_milliseconds" integer) TO "supabase_functions_admin";
GRANT ALL ON FUNCTION "net"."http_get"("url" "text", "params" "jsonb", "headers" "jsonb", "timeout_milliseconds" integer) TO "anon";
GRANT ALL ON FUNCTION "net"."http_get"("url" "text", "params" "jsonb", "headers" "jsonb", "timeout_milliseconds" integer) TO "authenticated";
GRANT ALL ON FUNCTION "net"."http_get"("url" "text", "params" "jsonb", "headers" "jsonb", "timeout_milliseconds" integer) TO "service_role";


--
-- Name: FUNCTION "http_post"("url" "text", "body" "jsonb", "params" "jsonb", "headers" "jsonb", "timeout_milliseconds" integer); Type: ACL; Schema: net; Owner: postgres
--

REVOKE ALL ON FUNCTION "net"."http_post"("url" "text", "body" "jsonb", "params" "jsonb", "headers" "jsonb", "timeout_milliseconds" integer) FROM PUBLIC;
GRANT ALL ON FUNCTION "net"."http_post"("url" "text", "body" "jsonb", "params" "jsonb", "headers" "jsonb", "timeout_milliseconds" integer) TO "supabase_functions_admin";
GRANT ALL ON FUNCTION "net"."http_post"("url" "text", "body" "jsonb", "params" "jsonb", "headers" "jsonb", "timeout_milliseconds" integer) TO "anon";
GRANT ALL ON FUNCTION "net"."http_post"("url" "text", "body" "jsonb", "params" "jsonb", "headers" "jsonb", "timeout_milliseconds" integer) TO "authenticated";
GRANT ALL ON FUNCTION "net"."http_post"("url" "text", "body" "jsonb", "params" "jsonb", "headers" "jsonb", "timeout_milliseconds" integer) TO "service_role";


--
-- Name: FUNCTION "plv8_info"(); Type: ACL; Schema: pg_catalog; Owner: postgres
--

REVOKE ALL ON FUNCTION "pg_catalog"."plv8_info"() FROM "supabase_admin";
GRANT ALL ON FUNCTION "pg_catalog"."plv8_info"() TO "postgres";


--
-- Name: TABLE "products"; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE "public"."products" TO "anon";
GRANT ALL ON TABLE "public"."products" TO "authenticated";
GRANT ALL ON TABLE "public"."products" TO "service_role";


--
-- Name: FUNCTION "default_products"(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION "public"."default_products"() TO "anon";
GRANT ALL ON FUNCTION "public"."default_products"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."default_products"() TO "service_role";


--
-- Name: FUNCTION "distinct_product_categories"(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION "public"."distinct_product_categories"() TO "anon";
GRANT ALL ON FUNCTION "public"."distinct_product_categories"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."distinct_product_categories"() TO "service_role";


--
-- Name: FUNCTION "distinct_product_import_tags"(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION "public"."distinct_product_import_tags"() TO "anon";
GRANT ALL ON FUNCTION "public"."distinct_product_import_tags"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."distinct_product_import_tags"() TO "service_role";


--
-- Name: FUNCTION "distinct_product_sub_categories"("category" "text"); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION "public"."distinct_product_sub_categories"("category" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."distinct_product_sub_categories"("category" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."distinct_product_sub_categories"("category" "text") TO "service_role";


--
-- Name: FUNCTION "distinct_product_vendors"(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION "public"."distinct_product_vendors"() TO "anon";
GRANT ALL ON FUNCTION "public"."distinct_product_vendors"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."distinct_product_vendors"() TO "service_role";


--
-- Name: FUNCTION "products_update_id"(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION "public"."products_update_id"() TO "anon";
GRANT ALL ON FUNCTION "public"."products_update_id"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."products_update_id"() TO "service_role";


--
-- Name: FUNCTION "products_updated_at"(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION "public"."products_updated_at"() TO "anon";
GRANT ALL ON FUNCTION "public"."products_updated_at"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."products_updated_at"() TO "service_role";


--
-- Name: TABLE "Orders"; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE "public"."Orders" TO "anon";
GRANT ALL ON TABLE "public"."Orders" TO "authenticated";
GRANT ALL ON TABLE "public"."Orders" TO "service_role";


--
-- Name: FUNCTION "recent_orders"(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION "public"."recent_orders"() TO "anon";
GRANT ALL ON FUNCTION "public"."recent_orders"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."recent_orders"() TO "service_role";


--
-- Name: TABLE "pg_stat_statements"; Type: ACL; Schema: extensions; Owner: postgres
--

GRANT ALL ON TABLE "extensions"."pg_stat_statements" TO "dashboard_user";


--
-- Name: TABLE "_http_response"; Type: ACL; Schema: net; Owner: postgres
--

REVOKE ALL ON TABLE "net"."_http_response" FROM "supabase_admin";
REVOKE ALL ON TABLE "net"."_http_response" FROM "postgres";
GRANT ALL ON TABLE "net"."_http_response" TO "postgres";


--
-- Name: TABLE "http_request_queue"; Type: ACL; Schema: net; Owner: postgres
--

REVOKE ALL ON TABLE "net"."http_request_queue" FROM "supabase_admin";
REVOKE ALL ON TABLE "net"."http_request_queue" FROM "postgres";
GRANT ALL ON TABLE "net"."http_request_queue" TO "postgres";


--
-- Name: TABLE "Members"; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE "public"."Members" TO "anon";
GRANT ALL ON TABLE "public"."Members" TO "authenticated";
GRANT ALL ON TABLE "public"."Members" TO "service_role";


--
-- Name: TABLE "OrderLineItems"; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE "public"."OrderLineItems" TO "anon";
GRANT ALL ON TABLE "public"."OrderLineItems" TO "authenticated";
GRANT ALL ON TABLE "public"."OrderLineItems" TO "service_role";


--
-- Name: TABLE "WholesaleOrders"; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE "public"."WholesaleOrders" TO "anon";
GRANT ALL ON TABLE "public"."WholesaleOrders" TO "authenticated";
GRANT ALL ON TABLE "public"."WholesaleOrders" TO "service_role";


--
-- Name: TABLE "catmap"; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE "public"."catmap" TO "anon";
GRANT ALL ON TABLE "public"."catmap" TO "authenticated";
GRANT ALL ON TABLE "public"."catmap" TO "service_role";


--
-- Name: TABLE "events"; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE "public"."events" TO "anon";
GRANT ALL ON TABLE "public"."events" TO "authenticated";
GRANT ALL ON TABLE "public"."events" TO "service_role";


--
-- Name: SEQUENCE "events_id_seq"; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE "public"."events_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."events_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."events_id_seq" TO "service_role";


--
-- Name: SEQUENCE "members_id_seq"; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE "public"."members_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."members_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."members_id_seq" TO "service_role";


--
-- Name: SEQUENCE "orderlineitems_id_seq"; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE "public"."orderlineitems_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."orderlineitems_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."orderlineitems_id_seq" TO "service_role";


--
-- Name: SEQUENCE "orders_id_seq"; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE "public"."orders_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."orders_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."orders_id_seq" TO "service_role";


--
-- Name: TABLE "squareimport"; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE "public"."squareimport" TO "anon";
GRANT ALL ON TABLE "public"."squareimport" TO "authenticated";
GRANT ALL ON TABLE "public"."squareimport" TO "service_role";


--
-- Name: SEQUENCE "squareimport_id_seq"; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE "public"."squareimport_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."squareimport_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."squareimport_id_seq" TO "service_role";


--
-- Name: TABLE "stock"; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE "public"."stock" TO "anon";
GRANT ALL ON TABLE "public"."stock" TO "authenticated";
GRANT ALL ON TABLE "public"."stock" TO "service_role";


--
-- Name: SEQUENCE "wholesaleorders_id_seq"; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE "public"."wholesaleorders_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."wholesaleorders_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."wholesaleorders_id_seq" TO "service_role";


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: public; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "service_role";


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: public; Owner: supabase_admin
--

-- ALTER DEFAULT PRIVILEGES FOR ROLE "supabase_admin" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "postgres";
-- ALTER DEFAULT PRIVILEGES FOR ROLE "supabase_admin" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "anon";
-- ALTER DEFAULT PRIVILEGES FOR ROLE "supabase_admin" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "authenticated";
-- ALTER DEFAULT PRIVILEGES FOR ROLE "supabase_admin" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "service_role";


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: public; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "service_role";


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: public; Owner: supabase_admin
--

-- ALTER DEFAULT PRIVILEGES FOR ROLE "supabase_admin" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "postgres";
-- ALTER DEFAULT PRIVILEGES FOR ROLE "supabase_admin" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "anon";
-- ALTER DEFAULT PRIVILEGES FOR ROLE "supabase_admin" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "authenticated";
-- ALTER DEFAULT PRIVILEGES FOR ROLE "supabase_admin" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "service_role";


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: public; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "service_role";


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: public; Owner: supabase_admin
--

-- ALTER DEFAULT PRIVILEGES FOR ROLE "supabase_admin" IN SCHEMA "public" GRANT ALL ON TABLES  TO "postgres";
-- ALTER DEFAULT PRIVILEGES FOR ROLE "supabase_admin" IN SCHEMA "public" GRANT ALL ON TABLES  TO "anon";
-- ALTER DEFAULT PRIVILEGES FOR ROLE "supabase_admin" IN SCHEMA "public" GRANT ALL ON TABLES  TO "authenticated";
-- ALTER DEFAULT PRIVILEGES FOR ROLE "supabase_admin" IN SCHEMA "public" GRANT ALL ON TABLES  TO "service_role";


--
-- PostgreSQL database dump complete
--

RESET ALL;
