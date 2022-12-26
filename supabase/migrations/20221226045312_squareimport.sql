create table "public"."squareImport" (
    "id" uuid not null default uuid_generate_v4(),
    "createdAt" timestamp with time zone default now(),
    "data" json,
    "status" text,
    "notes" text
);


alter table "public"."squareImport" enable row level security;

CREATE UNIQUE INDEX "squareImport_pkey" ON public."squareImport" USING btree (id);

alter table "public"."squareImport" add constraint "squareImport_pkey" PRIMARY KEY using index "squareImport_pkey";

create policy "marsh admins only"
on "public"."squareImport"
as permissive
for all
to public
using ((auth.marshrole() = 'admin'::text))
with check ((auth.marshrole() = 'admin'::text));



