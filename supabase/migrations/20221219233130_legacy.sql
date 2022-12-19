-- 
-- legacy data tables from digitalocean pg dayz
--

--
-- Name: legacyMembers; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE "public"."legacyMembers" (
  "id" integer NOT NULL,
  "UserId" integer,
  "registration_email" character varying(255),
  "name" character varying(255),
  "phone" character varying(255),
  "address" character varying(255),
  "discount" numeric,
  "discount_type" character varying(255),
  "fees_paid" numeric(10, 2) DEFAULT 0,
  "store_credit" numeric(10, 2) DEFAULT 0,
  "shares" numeric DEFAULT 0,
  "member_type" character varying(255),
  "data" "jsonb" DEFAULT '{}'::"jsonb",
  "createdAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
  "updatedAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);
ALTER TABLE "public"."legacyMembers" OWNER TO "postgres";
--
-- Name: legacyMembers_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE "public"."legacyMembers_id_seq" AS integer START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;
ALTER TABLE "public"."legacyMembers_id_seq" OWNER TO "postgres";
--
-- Name: Members_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE "public"."legacyMembers_id_seq" OWNED BY "public"."legacyMembers"."id";
--
-- Name: legacyOrderLineItems; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE "public"."legacyOrderLineItems" (
  "id" integer NOT NULL,
  "OrderId" integer,
  "WholesaleOrderId" integer,
  "price" numeric(10, 2),
  "quantity" integer,
  "total" numeric(10, 2),
  "kind" character varying(255),
  "description" character varying(255),
  "vendor" character varying(255),
  "selected_unit" character varying(255),
  "data" "jsonb",
  "createdAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
  "updatedAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
  "status" character varying(255)
);
ALTER TABLE "public"."legacyOrderLineItems" OWNER TO "postgres";
--
-- Name: legacyOrderLineItems_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE "public"."legacyOrderLineItems_id_seq" AS integer START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;
ALTER TABLE "public"."legacyOrderLineItems_id_seq" OWNER TO "postgres";
--
-- Name: legacyOrderLineItems_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE "public"."legacyOrderLineItems_id_seq" OWNED BY "public"."legacyOrderLineItems"."id";
--
-- Name: legacyOrders; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE "public"."legacyOrders" (
  "id" integer NOT NULL,
  "UserId" integer,
  "status" character varying(255),
  "payment_status" character varying(255),
  "shipment_status" character varying(255),
  "total" numeric(10, 2) DEFAULT 0,
  "subtotal" numeric(10, 2) DEFAULT 0,
  "name" character varying(255) NOT NULL,
  "email" character varying(255) NOT NULL,
  "phone" character varying(255),
  "address" character varying(255),
  "notes" "text",
  "email_sent" boolean,
  "item_count" integer DEFAULT 0,
  "history" "jsonb",
  "createdAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
  "updatedAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
  "MemberId" integer
);
ALTER TABLE "public"."legacyOrders" OWNER TO "postgres";
--
-- Name: legacyOrders_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE "public"."legacyOrders_id_seq" AS integer START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;
ALTER TABLE "public"."legacyOrders_id_seq" OWNER TO "postgres";
--
-- Name: Orders_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE "public"."legacyOrders_id_seq" OWNED BY "public"."legacyOrders"."id";
--
-- Name: legacyPages; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE "public"."legacyPages" (
  "id" integer NOT NULL,
  "slug" character varying(255),
  "content" "text",
  "createdAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
  "updatedAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);
ALTER TABLE "public"."legacyPages" OWNER TO "postgres";
--
-- Name: legacyPages_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE "public"."legacyPages_id_seq" AS integer START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;
ALTER TABLE "public"."legacyPages_id_seq" OWNER TO "postgres";
--
-- Name: legacyPages_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE "public"."legacyPages_id_seq" OWNED BY "public"."legacyPages"."id";
--
-- Name: legacyProducts; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE "public"."legacyProducts" (
  "id" integer NOT NULL,
  "unf" character varying(255),
  "upc_code" character varying(255),
  "category" character varying(255),
  "sub_category" character varying(255),
  "name" character varying(255),
  "description" character varying(255),
  "pk" integer,
  "size" character varying(255),
  "unit_type" character varying(255),
  "ws_price" numeric(10, 2),
  "u_price" numeric(10, 2),
  "ws_price_cost" numeric(10, 2),
  "u_price_cost" numeric(10, 2),
  "codes" character varying(255),
  "vendor" character varying(255),
  "import_tag" character varying(255),
  "createdAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
  "updatedAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
  "count_on_hand" integer,
  "no_backorder" boolean
);
ALTER TABLE "public"."legacyProducts" OWNER TO "postgres";
--
-- Name: legacyProducts_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE "public"."legacyProducts_id_seq" AS integer START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;
ALTER TABLE "public"."legacyProducts_id_seq" OWNER TO "postgres";
--
-- Name: legacyProducts_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE "public"."legacyProducts_id_seq" OWNED BY "public"."legacyProducts"."id";
--
-- Name: legacyWholesaleOrders; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE "public"."legacyWholesaleOrders" (
  "id" integer NOT NULL,
  "vendor" character varying(255),
  "notes" character varying(255),
  "status" character varying(255),
  "payment_status" character varying(255),
  "shipment_status" character varying(255),
  "createdAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
  "updatedAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);
ALTER TABLE "public"."legacyWholesaleOrders" OWNER TO "postgres";
--
-- Name: legacyWholesaleOrders_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE "public"."legacyWholesaleOrders_id_seq" AS integer START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;
ALTER TABLE "public"."legacyWholesaleOrders_id_seq" OWNER TO "postgres";
--
-- Name: legacyWholesaleOrders_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE "public"."legacyWholesaleOrders_id_seq" OWNED BY "public"."legacyWholesaleOrders"."id";
--
-- Name: legacyMembers id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."legacyMembers"
ALTER COLUMN "id"
SET DEFAULT "nextval"('"public"."legacyMembers_id_seq"'::"regclass");
--
-- Name: legacyOrderLineItems id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."legacyOrderLineItems"
ALTER COLUMN "id"
SET DEFAULT "nextval"(
    '"public"."legacyOrderLineItems_id_seq"'::"regclass"
  );
--
-- Name: legacyOrders id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."legacyOrders"
ALTER COLUMN "id"
SET DEFAULT "nextval"('"public"."legacyOrders_id_seq"'::"regclass");
--
-- Name: legacyPages id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."legacyPages"
ALTER COLUMN "id"
SET DEFAULT "nextval"('"public"."legacyPages_id_seq"'::"regclass");
--
-- Name: legacyProducts id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."legacyProducts"
ALTER COLUMN "id"
SET DEFAULT "nextval"('"public"."legacyProducts_id_seq"'::"regclass");
--
-- Name: legacyWholesaleOrders id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."legacyWholesaleOrders"
ALTER COLUMN "id"
SET DEFAULT "nextval"(
    '"public"."legacyWholesaleOrders_id_seq"'::"regclass"
  );
--
-- Name: legacyMembers legacyMembers_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."legacyMembers"
ADD CONSTRAINT "legacyMembers_pkey" PRIMARY KEY ("id");
--
-- Name: legacyOrderLineItems legacyOrderLineItems_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."legacyOrderLineItems"
ADD CONSTRAINT "legacyOrderLineItems_pkey" PRIMARY KEY ("id");
--
-- Name: legacyOrders legacyOrders_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."legacyOrders"
ADD CONSTRAINT "legacyOrders_pkey" PRIMARY KEY ("id");
--
-- Name: legacyPages legacyPages_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."legacyPages"
ADD CONSTRAINT "legacyPages_pkey" PRIMARY KEY ("id");
--
-- Name: legacyProducts Products_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."legacyProducts"
ADD CONSTRAINT "legacyProducts_pkey" PRIMARY KEY ("id");
--
-- Name: legacyWholesaleOrders legacyWholesaleOrders_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."legacyWholesaleOrders"
ADD CONSTRAINT "legacyWholesaleOrders_pkey" PRIMARY KEY ("id");
--
-- Name: legacymembers__user_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "legacymembers__user_id" ON "public"."legacyMembers" USING "btree" ("UserId");
--
-- Name: legacymembers_name; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "legacymembers_name" ON "public"."legacyMembers" USING "btree" ("name");
--
-- Name: legacymembers_phone; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "legacymembers_phone" ON "public"."legacyMembers" USING "btree" ("phone");
--
-- Name: legacymembers_registration_email; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "legacymembers_registration_email" ON "public"."legacyMembers" USING "btree" ("registration_email");
--
-- Name: legacyorder_line_items__order_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "legacyorder_line_items__order_id" ON "public"."legacyOrderLineItems" USING "btree" ("OrderId");
--
-- Name: legacyorder_line_items_kind; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "legacyorder_line_items_kind" ON "public"."legacyOrderLineItems" USING "btree" ("kind");
--
-- Name: legacyorders__member_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "legacyorders__member_id" ON "public"."legacyOrders" USING "btree" ("MemberId");
--
-- Name: legacyorders__user_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "legacyorders__user_id" ON "public"."legacyOrders" USING "btree" ("UserId");
--
-- Name: legacyorders_email; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "legacyorders_email" ON "public"."legacyOrders" USING "btree" ("email");
--
-- Name: legacyorders_name; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "legacyorders_name" ON "public"."legacyOrders" USING "btree" ("name");
--
-- Name: legacyorders_payment_status; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "legacyorders_payment_status" ON "public"."legacyOrders" USING "btree" ("payment_status");
--
-- Name: legacyorders_shipment_status; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "legacyorders_shipment_status" ON "public"."legacyOrders" USING "btree" ("shipment_status");
--
-- Name: legacyorders_status; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "legacyorders_status" ON "public"."legacyOrders" USING "btree" ("status");
--
-- Name: legacypages_slug; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "legacypages_slug" ON "public"."legacyPages" USING "btree" ("slug");
--
-- Name: legacyproducts_category; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "legacyproducts_category" ON "public"."legacyProducts" USING "btree" ("category");
--
-- Name: legacyproducts_count_on_hand; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "legacyproducts_count_on_hand" ON "public"."legacyProducts" USING "btree" ("count_on_hand");
--
-- Name: legacyproducts_import_tag; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "legacyproducts_import_tag" ON "public"."legacyProducts" USING "btree" ("import_tag");
--
-- Name: legacyproducts_sub_category; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "legacyproducts_sub_category" ON "public"."legacyProducts" USING "btree" ("sub_category");
--
-- Name: legacyproducts_u_price; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "legacyproducts_u_price" ON "public"."legacyProducts" USING "btree" ("u_price");
--
-- Name: legacyproducts_unf; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "legacyproducts_unf" ON "public"."legacyProducts" USING "btree" ("unf");
--
-- Name: legacyproducts_uniq_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "legacyproducts_uniq_id" ON "public"."legacyProducts" USING "btree" ("unf", "upc_code");
--
-- Name: legacyproducts_ws_price; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "legacyproducts_ws_price" ON "public"."legacyProducts" USING "btree" ("ws_price");
--
-- Name: legacyOrderLineItems legacyOrderLineItems_OrderId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."legacyOrderLineItems"
ADD CONSTRAINT "legacyOrderLineItems_OrderId_fkey" FOREIGN KEY ("OrderId") REFERENCES "public"."legacyOrders"("id");
--
-- Name: legacyOrderLineItems legacyOrderLineItems_WholesaleOrderId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."legacyOrderLineItems"
ADD CONSTRAINT "legacyOrderLineItems_WholesaleOrderId_fkey" FOREIGN KEY ("WholesaleOrderId") REFERENCES "public"."legacyWholesaleOrders"("id");
--
-- Name: legacyOrders legacyOrders_MemberId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."legacyOrders"
ADD CONSTRAINT "legacyOrders_MemberId_fkey" FOREIGN KEY ("MemberId") REFERENCES "public"."legacyMembers"("id");
--
-- Name: legacyMembers; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE "public"."legacyMembers" ENABLE ROW LEVEL SECURITY;
--
-- Name: legacyOrderLineItems; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE "public"."legacyOrderLineItems" ENABLE ROW LEVEL SECURITY;
--
-- Name: legacyOrders; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE "public"."legacyOrders" ENABLE ROW LEVEL SECURITY;
--
-- Name: legacyPages; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE "public"."legacyPages" ENABLE ROW LEVEL SECURITY;
--
-- Name: legacyProducts; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE "public"."legacyProducts" ENABLE ROW LEVEL SECURITY;
--
-- Name: legacyWholesaleOrders; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE "public"."legacyWholesaleOrders" ENABLE ROW LEVEL SECURITY;