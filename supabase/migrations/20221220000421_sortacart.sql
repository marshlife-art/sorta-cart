-- 
-- sorta-cart tables
--

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
  "sq_variation_id" "text"
);
--
-- Name: default_products(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION "public"."default_products"() RETURNS SETOF "public"."products" LANGUAGE "sql" AS $$
SELECT *
FROM products
ORDER BY array_position(
    ARRAY ['MARSH SCHEDULE','MUTUAL AID','MUTUAL AID','MARSH','ALBERT''S FRESH','ALBERT''S PRODUCE','CHILL','REFRIGERATED','FROZEN','GROCERY','GROCERY & BEVERAGES','PERSONAL CARE','BULK', 'BULK FOODS''SUPPLEMENTS'],
    category
  ),
  sub_category;
$$;
--
-- Name: distinct_product_categories(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION "public"."distinct_product_categories"() RETURNS TABLE("category" "text") LANGUAGE "sql" AS $$
SELECT DISTINCT category
FROM products;
$$;
--
-- Name: distinct_product_import_tags(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION "public"."distinct_product_import_tags"() RETURNS TABLE("import_tag" "text") LANGUAGE "sql" AS $$
SELECT DISTINCT import_tag
FROM products;
$$;
--
-- Name: distinct_product_sub_categories("text"); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION "public"."distinct_product_sub_categories"("category" "text") RETURNS TABLE("category" "text") LANGUAGE "sql" AS $_$
SELECT DISTINCT sub_category
FROM products
WHERE category = $1;
$_$;
--
-- Name: distinct_product_vendors(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION "public"."distinct_product_vendors"() RETURNS TABLE("vendor" "text") LANGUAGE "sql" AS $$
SELECT DISTINCT vendor
FROM products;
$$;
--
-- Name: products_update_id(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION "public"."products_update_id"() RETURNS "trigger" LANGUAGE "plpgsql" AS $$ BEGIN NEW.id = coalesce(NEW.unf, '') || '__' || coalesce(NEW.upc_code, '');
RETURN NEW;
END;
$$;
--
-- Name: products_updatedAt(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION "public"."products_updatedAt"() RETURNS "trigger" LANGUAGE "plpgsql" AS $$BEGIN NEW.updatedAt = NOW();
RETURN NEW;
END;
$$;
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
  "api_key" "uuid" DEFAULT "extensions"."uuid_generate_v4"()
);
--
-- Name: recent_orders(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION "public"."recent_orders"() RETURNS SETOF "public"."Orders" LANGUAGE "sql" AS $$
SELECT *
FROM "Orders"
WHERE "createdAt" BETWEEN NOW()::DATE - EXTRACT(
    DOW
    FROM NOW()
  )::INTEGER -14
  AND NOW()
ORDER BY "createdAt" DESC;
$$;
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
  "is_admin" boolean DEFAULT false NOT NULL
);
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
  "status" "text",
  "invalid" "text"
);
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
--
-- Name: catmap; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE "public"."catmap" (
  "from" "text" NOT NULL,
  "to" "text" NOT NULL
);
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
--
-- Name: events_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE "public"."events"
ALTER COLUMN "id"
ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."events_id_seq" START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1
  );
--
-- Name: members_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE "public"."Members"
ALTER COLUMN "id"
ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."members_id_seq" START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1
  );
--
-- Name: orderlineitems_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE "public"."OrderLineItems"
ALTER COLUMN "id"
ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."orderlineitems_id_seq" START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1
  );
--
-- Name: orders_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE "public"."Orders"
ALTER COLUMN "id"
ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."orders_id_seq" START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1
  );
--
-- Name: wholesaleorders_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE "public"."WholesaleOrders"
ALTER COLUMN "id"
ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."wholesaleorders_id_seq" START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1
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
-- Name: WholesaleOrders wholesaleorders_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."WholesaleOrders"
ADD CONSTRAINT "wholesaleorders_pkey" PRIMARY KEY ("id");
--
-- Name: products products_update_id_trigger; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER "products_update_id_trigger" BEFORE
UPDATE ON "public"."products" FOR EACH ROW
  WHEN (
    (
      (
        "old"."unf" IS DISTINCT
        FROM "new"."unf"
      )
      OR (
        "old"."upc_code" IS DISTINCT
        FROM "new"."upc_code"
      )
    )
  ) EXECUTE FUNCTION "public"."products_update_id"();
--
-- Name: products products_update_updatedAt; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER "products_update_updatedAt" BEFORE
UPDATE ON "public"."products" FOR EACH ROW EXECUTE FUNCTION "public"."products_updatedAt"();
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

CREATE POLICY "anyone can insert" ON "public"."events" FOR
INSERT WITH CHECK (true);
--
-- Name: products anyone can select; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "anyone can select" ON "public"."products" FOR
SELECT USING (true);
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

CREATE POLICY "authenticated insert" ON "public"."products" FOR
INSERT WITH CHECK (("auth"."role"() = 'authenticated'::"text"));
--
-- Name: events authenticated select; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "authenticated select" ON "public"."events" FOR
SELECT USING (("auth"."role"() = 'authenticated'::"text"));
--
-- Name: products authenticated update; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "authenticated update" ON "public"."products" FOR
UPDATE USING (("auth"."role"() = 'authenticated'::"text")) WITH CHECK (("auth"."role"() = 'authenticated'::"text"));
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