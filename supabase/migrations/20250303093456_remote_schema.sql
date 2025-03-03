

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


CREATE EXTENSION IF NOT EXISTS "pgsodium";






COMMENT ON SCHEMA "public" IS 'standard public schema';



CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";






CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgjwt" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";






CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";






CREATE OR REPLACE FUNCTION "public"."get_default_income"() RETURNS TABLE("id" "uuid", "lucas_income" numeric, "camila_income" numeric, "other_income" numeric, "last_updated" timestamp with time zone, "created_at" timestamp with time zone)
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    -- Return the first row, ordered by created_at to be consistent
    RETURN QUERY 
    SELECT di.id, di.lucas_income, di.camila_income, di.other_income, di.last_updated, di.created_at
    FROM default_income di
    ORDER BY di.created_at ASC
    LIMIT 1;
    
    -- If no rows, return a default row (this shouldn't happen now that we inserted one)
    IF NOT FOUND THEN
        RETURN QUERY 
        SELECT 
            gen_random_uuid() as id,
            0::numeric as lucas_income,
            0::numeric as camila_income,
            0::numeric as other_income,
            now() as last_updated,
            now() as created_at;
    END IF;
END;
$$;


ALTER FUNCTION "public"."get_default_income"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_expenses"("p_year" integer, "p_month" integer) RETURNS TABLE("id" "uuid", "description" "text", "amount" numeric, "date" "text", "category_id" "uuid", "month" integer, "year" integer, "created_at" timestamp with time zone, "category_name" "text")
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
  RETURN QUERY
  SELECT 
    ve.id, 
    ve.description, 
    ve.amount, 
    ve.date, 
    ve.category_id, 
    ve.month, 
    ve.year, 
    ve.created_at,
    c.name AS category_name
  FROM variable_expenses ve
  LEFT JOIN categories c ON c.id = ve.category_id
  WHERE ve.year = p_year AND ve.month = p_month
  ORDER BY ve.date DESC;
END;
$$;


ALTER FUNCTION "public"."get_expenses"("p_year" integer, "p_month" integer) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_household_members"("p_household_id" "uuid") RETURNS TABLE("user_id" "uuid", "email" "text", "created_at" timestamp with time zone)
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
  RETURN QUERY
    SELECT uh.user_id, au.email, uh.created_at
    FROM users_households uh
    JOIN auth.users au ON uh.user_id = au.id
    WHERE uh.household_id = p_household_id;
END;
$$;


ALTER FUNCTION "public"."get_household_members"("p_household_id" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_investments"() RETURNS TABLE("id" "uuid", "name" "text", "current_value" numeric, "created_at" timestamp with time zone, "last_updated" timestamp with time zone)
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
  RETURN QUERY
  SELECT 
    i.id, 
    i.name, 
    i.current_value,
    i.created_at,
    i.last_updated
  FROM investments i
  ORDER BY i.name;
END;
$$;


ALTER FUNCTION "public"."get_investments"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_or_create_default_income"() RETURNS TABLE("id" "uuid", "lucas_income" numeric, "camila_income" numeric, "other_income" numeric, "last_updated" timestamp with time zone, "created_at" timestamp with time zone)
    LANGUAGE "plpgsql"
    AS $$
DECLARE
    v_record record;
BEGIN
    -- First try to get existing record
    SELECT * INTO v_record 
    FROM default_income 
    LIMIT 1;
    
    -- If not found, create it
    IF v_record IS NULL THEN
        INSERT INTO default_income (lucas_income, camila_income, other_income)
        VALUES (0, 0, 0)
        RETURNING * INTO v_record;
    END IF;
    
    -- Return the record
    RETURN QUERY 
    SELECT 
        v_record.id,
        v_record.lucas_income,
        v_record.camila_income,
        v_record.other_income,
        v_record.last_updated,
        v_record.created_at;
END;
$$;


ALTER FUNCTION "public"."get_or_create_default_income"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_or_create_household"("p_name" "text") RETURNS "uuid"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
DECLARE
  v_household_id UUID;
BEGIN
  -- First try to get the user's current household from metadata
  SELECT (raw_user_meta_data->>'household_id')::uuid INTO v_household_id
  FROM auth.users
  WHERE id = auth.uid();
  
  -- If user already has a household, return it
  IF v_household_id IS NOT NULL THEN
    RETURN v_household_id;
  END IF;
  
  -- Create new household
  INSERT INTO households (name)
  VALUES (p_name)
  RETURNING id INTO v_household_id;
  
  -- Update user's metadata with new household
  UPDATE auth.users
  SET raw_user_meta_data = 
    CASE 
      WHEN raw_user_meta_data IS NULL THEN 
        jsonb_build_object('household_id', v_household_id::text)
      ELSE 
        raw_user_meta_data || jsonb_build_object('household_id', v_household_id::text)
    END
  WHERE id = auth.uid();
  
  RETURN v_household_id;
END;
$$;


ALTER FUNCTION "public"."get_or_create_household"("p_name" "text") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_or_create_monthly_credit_card"("p_year" integer, "p_month" integer) RETURNS TABLE("id" "uuid", "year" integer, "month" integer, "amount" numeric, "created_at" timestamp with time zone)
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    -- First try to get existing record with qualified column names
    RETURN QUERY
    SELECT mcc.id, mcc.year, mcc.month, mcc.amount, mcc.created_at
    FROM monthly_credit_card mcc
    WHERE mcc.year = p_year AND mcc.month = p_month;

    -- If no rows returned, insert new record
    IF NOT FOUND THEN
        RETURN QUERY
        INSERT INTO monthly_credit_card (year, month, amount)
        VALUES (p_year, p_month, 0)
        RETURNING id, year, month, amount, created_at;
    END IF;
END;
$$;


ALTER FUNCTION "public"."get_or_create_monthly_credit_card"("p_year" integer, "p_month" integer) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_or_create_monthly_fixed_expense_status"("p_year" integer, "p_month" integer, "p_fixed_expense_id" "uuid") RETURNS TABLE("id" "uuid", "year" integer, "month" integer, "fixed_expense_id" "uuid", "completed" boolean, "completed_at" timestamp with time zone, "created_at" timestamp with time zone)
    LANGUAGE "plpgsql"
    AS $$
DECLARE
    v_record record;
BEGIN
    -- Try to get existing record
    SELECT * INTO v_record 
    FROM monthly_fixed_expense_status 
    WHERE year = p_year 
    AND month = p_month 
    AND fixed_expense_id = p_fixed_expense_id;
    
    -- If not found, create it
    IF v_record IS NULL THEN
        INSERT INTO monthly_fixed_expense_status (year, month, fixed_expense_id, completed)
        VALUES (p_year, p_month, p_fixed_expense_id, false)
        RETURNING * INTO v_record;
    END IF;
    
    -- Return the record
    RETURN QUERY 
    SELECT 
        v_record.id,
        v_record.year,
        v_record.month,
        v_record.fixed_expense_id,
        v_record.completed,
        v_record.completed_at,
        v_record.created_at;
END;
$$;


ALTER FUNCTION "public"."get_or_create_monthly_fixed_expense_status"("p_year" integer, "p_month" integer, "p_fixed_expense_id" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_or_create_monthly_income"("p_year" integer, "p_month" integer) RETURNS TABLE("id" "uuid", "year" integer, "month" integer, "lucas_income" numeric, "camila_income" numeric, "other_income" numeric, "created_at" timestamp with time zone)
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    -- First try to get existing record with qualified column names
    RETURN QUERY
    SELECT mi.id, mi.year, mi.month, mi.lucas_income, mi.camila_income, mi.other_income, mi.created_at
    FROM monthly_income mi
    WHERE mi.year = p_year AND mi.month = p_month;

    -- If no rows returned, insert new record
    IF NOT FOUND THEN
        RETURN QUERY
        INSERT INTO monthly_income (year, month, lucas_income, camila_income, other_income)
        VALUES (p_year, p_month, 0, 0, 0)
        RETURNING id, year, month, lucas_income, camila_income, other_income, created_at;
    END IF;
END;
$$;


ALTER FUNCTION "public"."get_or_create_monthly_income"("p_year" integer, "p_month" integer) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."initialize_monthly_fixed_expenses"("p_year" integer, "p_month" integer) RETURNS "void"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    -- Insert any fixed expenses that don't have a status record for this month
    INSERT INTO monthly_fixed_expense_status (fixed_expense_id, year, month, completed)
    SELECT 
        fe.id as fixed_expense_id,
        p_year as year,
        p_month as month,
        false as completed
    FROM fixed_expenses fe
    WHERE NOT EXISTS (
        SELECT 1 
        FROM monthly_fixed_expense_status mfes
        WHERE mfes.fixed_expense_id = fe.id
        AND mfes.year = p_year
        AND mfes.month = p_month
    );
END;
$$;


ALTER FUNCTION "public"."initialize_monthly_fixed_expenses"("p_year" integer, "p_month" integer) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."join_household"("p_household_id" "uuid") RETURNS "void"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
  -- Update user's metadata with new household
  UPDATE auth.users
  SET raw_user_meta_data = 
    CASE 
      WHEN raw_user_meta_data IS NULL THEN 
        jsonb_build_object('household_id', p_household_id::text)
      ELSE 
        raw_user_meta_data || jsonb_build_object('household_id', p_household_id::text)
    END
  WHERE id = auth.uid();
END;
$$;


ALTER FUNCTION "public"."join_household"("p_household_id" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."join_household"("p_household_id" "uuid", "user_id" "uuid") RETURNS "void"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
  -- First delete any existing household connections
  DELETE FROM users_households 
  WHERE users_households.user_id = join_household.user_id;
  
  -- Then add to the new household
  INSERT INTO users_households (user_id, household_id)
  VALUES (join_household.user_id, p_household_id);
END;
$$;


ALTER FUNCTION "public"."join_household"("p_household_id" "uuid", "user_id" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."leave_household"() RETURNS "void"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
  -- Remove household_id from user's metadata
  UPDATE auth.users
  SET raw_user_meta_data = raw_user_meta_data - 'household_id'
  WHERE id = auth.uid();
END;
$$;


ALTER FUNCTION "public"."leave_household"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."leave_household"("user_id" "uuid") RETURNS "void"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
  DELETE FROM users_households 
  WHERE users_households.user_id = leave_household.user_id;
END;
$$;


ALTER FUNCTION "public"."leave_household"("user_id" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."load_default_income"("p_year" integer, "p_month" integer) RETURNS "void"
    LANGUAGE "plpgsql"
    AS $$
begin
  -- Insert default income if not exists for the month
  insert into monthly_income (year, month, lucas_income, camila_income, other_income)
  select 
    p_year,
    p_month,
    lucas_income,
    camila_income,
    other_income
  from default_income
  where not exists (
    select 1 
    from monthly_income
    where year = p_year 
    and month = p_month
  )
  limit 1;
end;
$$;


ALTER FUNCTION "public"."load_default_income"("p_year" integer, "p_month" integer) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_user_household_id"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
  UPDATE auth.users
  SET raw_app_meta_data = jsonb_set(
    COALESCE(raw_app_meta_data, '{}'::jsonb),
    '{household_id}',
    to_jsonb(NEW.id)
  )
  WHERE id = NEW.id;
  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."update_user_household_id"() OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "public"."categories" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "name" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()) NOT NULL,
    "household_id" "uuid"
);


ALTER TABLE "public"."categories" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."default_income" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "lucas_income" numeric(12,2) DEFAULT 0 NOT NULL,
    "camila_income" numeric(12,2) DEFAULT 0 NOT NULL,
    "other_income" numeric(12,2) DEFAULT 0 NOT NULL,
    "last_updated" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()) NOT NULL,
    "created_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()) NOT NULL,
    "household_id" "uuid",
    "lucas_main_income" numeric DEFAULT 0,
    "lucas_other_income" numeric DEFAULT 0,
    "camila_main_income" numeric DEFAULT 0,
    "camila_other_income" numeric DEFAULT 0
);


ALTER TABLE "public"."default_income" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."fixed_expenses" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "category_id" "uuid" NOT NULL,
    "description" "text" NOT NULL,
    "estimated_amount" numeric(12,2) NOT NULL,
    "owner" "text" NOT NULL,
    "status_required" boolean DEFAULT false NOT NULL,
    "created_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()) NOT NULL,
    "household_id" "uuid",
    "due_date" "text",
    CONSTRAINT "fixed_expenses_owner_check" CHECK (("owner" = ANY (ARRAY['Lucas'::"text", 'Camila'::"text"])))
);


ALTER TABLE "public"."fixed_expenses" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."investment_history" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "investment_id" "uuid" NOT NULL,
    "previous_value" numeric(12,2) NOT NULL,
    "new_value" numeric(12,2) NOT NULL,
    "updated_by" "uuid" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()) NOT NULL
);


ALTER TABLE "public"."investment_history" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."investments" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "category" "text" NOT NULL,
    "name" "text" NOT NULL,
    "current_value" numeric(12,2) DEFAULT 0 NOT NULL,
    "last_updated" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()) NOT NULL,
    "created_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()) NOT NULL
);


ALTER TABLE "public"."investments" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."monthly_credit_card" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "year" integer NOT NULL,
    "month" integer NOT NULL,
    "amount" numeric(12,2) DEFAULT 0 NOT NULL,
    "created_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()) NOT NULL,
    "transfer_completed" boolean DEFAULT false,
    "transfer_completed_at" timestamp with time zone,
    "notes" "text",
    CONSTRAINT "monthly_credit_card_month_check" CHECK ((("month" >= 1) AND ("month" <= 12)))
);


ALTER TABLE "public"."monthly_credit_card" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."monthly_details" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "month" integer NOT NULL,
    "total_income" numeric(10,2) DEFAULT 0,
    "total_expenses" numeric(10,2) DEFAULT 0,
    "planned_amount" numeric(10,2) DEFAULT 0,
    "actual_amount" numeric(10,2) DEFAULT 0,
    "created_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()) NOT NULL,
    "year" integer DEFAULT 2025 NOT NULL
);


ALTER TABLE "public"."monthly_details" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."monthly_fixed_expense_status" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "year" integer NOT NULL,
    "month" integer NOT NULL,
    "fixed_expense_id" "uuid" NOT NULL,
    "completed" boolean DEFAULT false NOT NULL,
    "completed_at" timestamp with time zone,
    "created_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()) NOT NULL,
    CONSTRAINT "monthly_fixed_expense_status_month_check" CHECK ((("month" >= 1) AND ("month" <= 12)))
);


ALTER TABLE "public"."monthly_fixed_expense_status" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."monthly_income" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "year" integer NOT NULL,
    "month" integer NOT NULL,
    "lucas_income" numeric(12,2) DEFAULT 0 NOT NULL,
    "camila_income" numeric(12,2) DEFAULT 0 NOT NULL,
    "other_income" numeric(12,2) DEFAULT 0 NOT NULL,
    "created_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()) NOT NULL,
    "lucas_main_income" numeric DEFAULT 0,
    "lucas_other_income" numeric DEFAULT 0,
    "camila_main_income" numeric DEFAULT 0,
    "camila_other_income" numeric DEFAULT 0,
    CONSTRAINT "monthly_income_month_check" CHECK ((("month" >= 1) AND ("month" <= 12)))
);


ALTER TABLE "public"."monthly_income" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."reserve_history" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "reserve_id" "uuid" NOT NULL,
    "previous_value" numeric(12,2) NOT NULL,
    "new_value" numeric(12,2) NOT NULL,
    "updated_by" "uuid" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()) NOT NULL
);


ALTER TABLE "public"."reserve_history" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."reserves" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "category" "text" NOT NULL,
    "name" "text" NOT NULL,
    "current_value" numeric(12,2) DEFAULT 0 NOT NULL,
    "target_value" numeric(12,2),
    "last_updated" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()) NOT NULL,
    "created_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()) NOT NULL
);


ALTER TABLE "public"."reserves" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."variable_expenses" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "year" integer NOT NULL,
    "month" integer NOT NULL,
    "category_id" "uuid" NOT NULL,
    "description" "text" NOT NULL,
    "amount" numeric(10,2) NOT NULL,
    "date" "date" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()) NOT NULL,
    CONSTRAINT "valid_month" CHECK ((("month" >= 1) AND ("month" <= 12)))
);


ALTER TABLE "public"."variable_expenses" OWNER TO "postgres";


ALTER TABLE ONLY "public"."categories"
    ADD CONSTRAINT "categories_name_key" UNIQUE ("name");



ALTER TABLE ONLY "public"."categories"
    ADD CONSTRAINT "categories_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."default_income"
    ADD CONSTRAINT "default_income_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."fixed_expenses"
    ADD CONSTRAINT "fixed_expenses_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."investment_history"
    ADD CONSTRAINT "investment_history_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."investments"
    ADD CONSTRAINT "investments_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."monthly_credit_card"
    ADD CONSTRAINT "monthly_credit_card_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."monthly_credit_card"
    ADD CONSTRAINT "monthly_credit_card_year_month_key" UNIQUE ("year", "month");



ALTER TABLE ONLY "public"."monthly_details"
    ADD CONSTRAINT "monthly_details_month_year_key" UNIQUE ("month", "year");



ALTER TABLE ONLY "public"."monthly_details"
    ADD CONSTRAINT "monthly_details_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."monthly_fixed_expense_status"
    ADD CONSTRAINT "monthly_fixed_expense_status_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."monthly_fixed_expense_status"
    ADD CONSTRAINT "monthly_fixed_expense_status_year_month_fixed_expense_id_key" UNIQUE ("year", "month", "fixed_expense_id");



ALTER TABLE ONLY "public"."monthly_income"
    ADD CONSTRAINT "monthly_income_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."monthly_income"
    ADD CONSTRAINT "monthly_income_year_month_key" UNIQUE ("year", "month");



ALTER TABLE ONLY "public"."reserve_history"
    ADD CONSTRAINT "reserve_history_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."reserves"
    ADD CONSTRAINT "reserves_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."variable_expenses"
    ADD CONSTRAINT "variable_expenses_pkey" PRIMARY KEY ("id");



CREATE INDEX "monthly_credit_card_year_month_idx" ON "public"."monthly_credit_card" USING "btree" ("year", "month");



CREATE INDEX "monthly_details_year_month_idx" ON "public"."monthly_details" USING "btree" ("year", "month");



CREATE INDEX "monthly_fixed_expense_status_year_month_idx" ON "public"."monthly_fixed_expense_status" USING "btree" ("year", "month");



CREATE INDEX "monthly_income_year_month_idx" ON "public"."monthly_income" USING "btree" ("year", "month");



ALTER TABLE ONLY "public"."fixed_expenses"
    ADD CONSTRAINT "fixed_expenses_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id");



ALTER TABLE ONLY "public"."investment_history"
    ADD CONSTRAINT "investment_history_investment_id_fkey" FOREIGN KEY ("investment_id") REFERENCES "public"."investments"("id");



ALTER TABLE ONLY "public"."investment_history"
    ADD CONSTRAINT "investment_history_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."monthly_fixed_expense_status"
    ADD CONSTRAINT "monthly_fixed_expense_status_fixed_expense_id_fkey" FOREIGN KEY ("fixed_expense_id") REFERENCES "public"."fixed_expenses"("id");



ALTER TABLE ONLY "public"."reserve_history"
    ADD CONSTRAINT "reserve_history_reserve_id_fkey" FOREIGN KEY ("reserve_id") REFERENCES "public"."reserves"("id");



ALTER TABLE ONLY "public"."reserve_history"
    ADD CONSTRAINT "reserve_history_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."variable_expenses"
    ADD CONSTRAINT "variable_expenses_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id");



CREATE POLICY "All authenticated users can delete categories." ON "public"."categories" FOR DELETE USING (("auth"."role"() = 'authenticated'::"text"));



CREATE POLICY "All authenticated users can delete fixed expenses." ON "public"."fixed_expenses" FOR DELETE USING (("auth"."role"() = 'authenticated'::"text"));



CREATE POLICY "All authenticated users can insert categories." ON "public"."categories" FOR INSERT WITH CHECK (("auth"."role"() = 'authenticated'::"text"));



CREATE POLICY "All authenticated users can insert default income." ON "public"."default_income" FOR INSERT WITH CHECK (("auth"."role"() = 'authenticated'::"text"));



CREATE POLICY "All authenticated users can insert fixed expenses." ON "public"."fixed_expenses" FOR INSERT WITH CHECK (("auth"."role"() = 'authenticated'::"text"));



CREATE POLICY "All authenticated users can insert investment history." ON "public"."investment_history" FOR INSERT WITH CHECK (("auth"."role"() = 'authenticated'::"text"));



CREATE POLICY "All authenticated users can insert investments." ON "public"."investments" FOR INSERT WITH CHECK (("auth"."role"() = 'authenticated'::"text"));



CREATE POLICY "All authenticated users can insert monthly credit card." ON "public"."monthly_credit_card" FOR INSERT WITH CHECK (("auth"."role"() = 'authenticated'::"text"));



CREATE POLICY "All authenticated users can insert monthly fixed expense status" ON "public"."monthly_fixed_expense_status" FOR INSERT WITH CHECK (("auth"."role"() = 'authenticated'::"text"));



CREATE POLICY "All authenticated users can insert monthly income." ON "public"."monthly_income" FOR INSERT WITH CHECK (("auth"."role"() = 'authenticated'::"text"));



CREATE POLICY "All authenticated users can insert reserve history." ON "public"."reserve_history" FOR INSERT WITH CHECK (("auth"."role"() = 'authenticated'::"text"));



CREATE POLICY "All authenticated users can insert reserves." ON "public"."reserves" FOR INSERT WITH CHECK (("auth"."role"() = 'authenticated'::"text"));



CREATE POLICY "All authenticated users can update categories." ON "public"."categories" FOR UPDATE USING (("auth"."role"() = 'authenticated'::"text"));



CREATE POLICY "All authenticated users can update default income." ON "public"."default_income" FOR UPDATE USING (("auth"."role"() = 'authenticated'::"text"));



CREATE POLICY "All authenticated users can update fixed expenses." ON "public"."fixed_expenses" FOR UPDATE USING (("auth"."role"() = 'authenticated'::"text"));



CREATE POLICY "All authenticated users can update investments." ON "public"."investments" FOR UPDATE USING (("auth"."role"() = 'authenticated'::"text"));



CREATE POLICY "All authenticated users can update monthly credit card." ON "public"."monthly_credit_card" FOR UPDATE USING (("auth"."role"() = 'authenticated'::"text"));



CREATE POLICY "All authenticated users can update monthly fixed expense status" ON "public"."monthly_fixed_expense_status" FOR UPDATE USING (("auth"."role"() = 'authenticated'::"text"));



CREATE POLICY "All authenticated users can update monthly income." ON "public"."monthly_income" FOR UPDATE USING (("auth"."role"() = 'authenticated'::"text"));



CREATE POLICY "All authenticated users can update reserves." ON "public"."reserves" FOR UPDATE USING (("auth"."role"() = 'authenticated'::"text"));



CREATE POLICY "All authenticated users can view categories." ON "public"."categories" FOR SELECT USING (("auth"."role"() = 'authenticated'::"text"));



CREATE POLICY "All authenticated users can view default income." ON "public"."default_income" FOR SELECT USING (("auth"."role"() = 'authenticated'::"text"));



CREATE POLICY "All authenticated users can view fixed expenses." ON "public"."fixed_expenses" FOR SELECT USING (("auth"."role"() = 'authenticated'::"text"));



CREATE POLICY "All authenticated users can view investment history." ON "public"."investment_history" FOR SELECT USING (("auth"."role"() = 'authenticated'::"text"));



CREATE POLICY "All authenticated users can view investments." ON "public"."investments" FOR SELECT USING (("auth"."role"() = 'authenticated'::"text"));



CREATE POLICY "All authenticated users can view monthly credit card." ON "public"."monthly_credit_card" FOR SELECT USING (("auth"."role"() = 'authenticated'::"text"));



CREATE POLICY "All authenticated users can view monthly fixed expense status." ON "public"."monthly_fixed_expense_status" FOR SELECT USING (("auth"."role"() = 'authenticated'::"text"));



CREATE POLICY "All authenticated users can view monthly income." ON "public"."monthly_income" FOR SELECT USING (("auth"."role"() = 'authenticated'::"text"));



CREATE POLICY "All authenticated users can view reserve history." ON "public"."reserve_history" FOR SELECT USING (("auth"."role"() = 'authenticated'::"text"));



CREATE POLICY "All authenticated users can view reserves." ON "public"."reserves" FOR SELECT USING (("auth"."role"() = 'authenticated'::"text"));



CREATE POLICY "All users can delete categories" ON "public"."categories" FOR DELETE TO "authenticated" USING (true);



CREATE POLICY "All users can delete default_income" ON "public"."default_income" FOR DELETE TO "authenticated" USING (true);



CREATE POLICY "All users can delete fixed_expenses" ON "public"."fixed_expenses" FOR DELETE TO "authenticated" USING (true);



CREATE POLICY "All users can insert categories" ON "public"."categories" FOR INSERT TO "authenticated" WITH CHECK (true);



CREATE POLICY "All users can insert default_income" ON "public"."default_income" FOR INSERT TO "authenticated" WITH CHECK (true);



CREATE POLICY "All users can insert fixed_expenses" ON "public"."fixed_expenses" FOR INSERT TO "authenticated" WITH CHECK (true);



CREATE POLICY "All users can update categories" ON "public"."categories" FOR UPDATE TO "authenticated" USING (true);



CREATE POLICY "All users can update default_income" ON "public"."default_income" FOR UPDATE TO "authenticated" USING (true);



CREATE POLICY "All users can update fixed_expenses" ON "public"."fixed_expenses" FOR UPDATE TO "authenticated" USING (true);



CREATE POLICY "All users can view all categories" ON "public"."categories" FOR SELECT TO "authenticated" USING (true);



CREATE POLICY "All users can view all default_income" ON "public"."default_income" FOR SELECT TO "authenticated" USING (true);



CREATE POLICY "All users can view all fixed_expenses" ON "public"."fixed_expenses" FOR SELECT TO "authenticated" USING (true);



CREATE POLICY "Enable all for authenticated users" ON "public"."fixed_expenses" TO "authenticated" USING (true) WITH CHECK (true);



CREATE POLICY "Enable all for authenticated users" ON "public"."monthly_credit_card" TO "authenticated" USING (true) WITH CHECK (true);



CREATE POLICY "Enable all for authenticated users" ON "public"."monthly_fixed_expense_status" TO "authenticated" USING (true) WITH CHECK (true);



CREATE POLICY "Enable all for authenticated users" ON "public"."monthly_income" TO "authenticated" USING (true) WITH CHECK (true);



CREATE POLICY "Enable delete access for all users" ON "public"."variable_expenses" FOR DELETE TO "authenticated" USING (true);



CREATE POLICY "Enable insert access for all users" ON "public"."variable_expenses" FOR INSERT TO "authenticated" WITH CHECK (true);



CREATE POLICY "Enable read access for all users" ON "public"."variable_expenses" FOR SELECT TO "authenticated" USING (true);



CREATE POLICY "Enable update access for all users" ON "public"."variable_expenses" FOR UPDATE TO "authenticated" USING (true);



CREATE POLICY "Users can manage their household's categories" ON "public"."categories" USING ((("household_id")::"text" IN ( SELECT ("users"."raw_user_meta_data" ->> 'household_id'::"text")
   FROM "auth"."users"
  WHERE ("users"."id" = "auth"."uid"()))));



CREATE POLICY "Users can manage their household's default income" ON "public"."default_income" USING ((("household_id")::"text" IN ( SELECT ("users"."raw_user_meta_data" ->> 'household_id'::"text")
   FROM "auth"."users"
  WHERE ("users"."id" = "auth"."uid"()))));



CREATE POLICY "Users can manage their household's fixed expenses" ON "public"."fixed_expenses" USING ((("household_id")::"text" IN ( SELECT ("users"."raw_user_meta_data" ->> 'household_id'::"text")
   FROM "auth"."users"
  WHERE ("users"."id" = "auth"."uid"()))));



ALTER TABLE "public"."categories" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."default_income" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "default_income_policy" ON "public"."default_income" TO "authenticated" USING (true) WITH CHECK (true);



ALTER TABLE "public"."fixed_expenses" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."investment_history" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."investments" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."monthly_credit_card" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."monthly_fixed_expense_status" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."monthly_income" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."reserve_history" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."reserves" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."variable_expenses" ENABLE ROW LEVEL SECURITY;




ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";






GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";




















































































































































































GRANT ALL ON FUNCTION "public"."get_default_income"() TO "anon";
GRANT ALL ON FUNCTION "public"."get_default_income"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_default_income"() TO "service_role";



GRANT ALL ON FUNCTION "public"."get_expenses"("p_year" integer, "p_month" integer) TO "anon";
GRANT ALL ON FUNCTION "public"."get_expenses"("p_year" integer, "p_month" integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_expenses"("p_year" integer, "p_month" integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."get_household_members"("p_household_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."get_household_members"("p_household_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_household_members"("p_household_id" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."get_investments"() TO "anon";
GRANT ALL ON FUNCTION "public"."get_investments"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_investments"() TO "service_role";



GRANT ALL ON FUNCTION "public"."get_or_create_default_income"() TO "anon";
GRANT ALL ON FUNCTION "public"."get_or_create_default_income"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_or_create_default_income"() TO "service_role";



GRANT ALL ON FUNCTION "public"."get_or_create_household"("p_name" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."get_or_create_household"("p_name" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_or_create_household"("p_name" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."get_or_create_monthly_credit_card"("p_year" integer, "p_month" integer) TO "anon";
GRANT ALL ON FUNCTION "public"."get_or_create_monthly_credit_card"("p_year" integer, "p_month" integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_or_create_monthly_credit_card"("p_year" integer, "p_month" integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."get_or_create_monthly_fixed_expense_status"("p_year" integer, "p_month" integer, "p_fixed_expense_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."get_or_create_monthly_fixed_expense_status"("p_year" integer, "p_month" integer, "p_fixed_expense_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_or_create_monthly_fixed_expense_status"("p_year" integer, "p_month" integer, "p_fixed_expense_id" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."get_or_create_monthly_income"("p_year" integer, "p_month" integer) TO "anon";
GRANT ALL ON FUNCTION "public"."get_or_create_monthly_income"("p_year" integer, "p_month" integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_or_create_monthly_income"("p_year" integer, "p_month" integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."initialize_monthly_fixed_expenses"("p_year" integer, "p_month" integer) TO "anon";
GRANT ALL ON FUNCTION "public"."initialize_monthly_fixed_expenses"("p_year" integer, "p_month" integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."initialize_monthly_fixed_expenses"("p_year" integer, "p_month" integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."join_household"("p_household_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."join_household"("p_household_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."join_household"("p_household_id" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."join_household"("p_household_id" "uuid", "user_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."join_household"("p_household_id" "uuid", "user_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."join_household"("p_household_id" "uuid", "user_id" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."leave_household"() TO "anon";
GRANT ALL ON FUNCTION "public"."leave_household"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."leave_household"() TO "service_role";



GRANT ALL ON FUNCTION "public"."leave_household"("user_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."leave_household"("user_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."leave_household"("user_id" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."load_default_income"("p_year" integer, "p_month" integer) TO "anon";
GRANT ALL ON FUNCTION "public"."load_default_income"("p_year" integer, "p_month" integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."load_default_income"("p_year" integer, "p_month" integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."update_user_household_id"() TO "anon";
GRANT ALL ON FUNCTION "public"."update_user_household_id"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_user_household_id"() TO "service_role";


















GRANT ALL ON TABLE "public"."categories" TO "anon";
GRANT ALL ON TABLE "public"."categories" TO "authenticated";
GRANT ALL ON TABLE "public"."categories" TO "service_role";



GRANT ALL ON TABLE "public"."default_income" TO "anon";
GRANT ALL ON TABLE "public"."default_income" TO "authenticated";
GRANT ALL ON TABLE "public"."default_income" TO "service_role";



GRANT ALL ON TABLE "public"."fixed_expenses" TO "anon";
GRANT ALL ON TABLE "public"."fixed_expenses" TO "authenticated";
GRANT ALL ON TABLE "public"."fixed_expenses" TO "service_role";



GRANT ALL ON TABLE "public"."investment_history" TO "anon";
GRANT ALL ON TABLE "public"."investment_history" TO "authenticated";
GRANT ALL ON TABLE "public"."investment_history" TO "service_role";



GRANT ALL ON TABLE "public"."investments" TO "anon";
GRANT ALL ON TABLE "public"."investments" TO "authenticated";
GRANT ALL ON TABLE "public"."investments" TO "service_role";



GRANT ALL ON TABLE "public"."monthly_credit_card" TO "anon";
GRANT ALL ON TABLE "public"."monthly_credit_card" TO "authenticated";
GRANT ALL ON TABLE "public"."monthly_credit_card" TO "service_role";



GRANT ALL ON TABLE "public"."monthly_details" TO "anon";
GRANT ALL ON TABLE "public"."monthly_details" TO "authenticated";
GRANT ALL ON TABLE "public"."monthly_details" TO "service_role";



GRANT ALL ON TABLE "public"."monthly_fixed_expense_status" TO "anon";
GRANT ALL ON TABLE "public"."monthly_fixed_expense_status" TO "authenticated";
GRANT ALL ON TABLE "public"."monthly_fixed_expense_status" TO "service_role";



GRANT ALL ON TABLE "public"."monthly_income" TO "anon";
GRANT ALL ON TABLE "public"."monthly_income" TO "authenticated";
GRANT ALL ON TABLE "public"."monthly_income" TO "service_role";



GRANT ALL ON TABLE "public"."reserve_history" TO "anon";
GRANT ALL ON TABLE "public"."reserve_history" TO "authenticated";
GRANT ALL ON TABLE "public"."reserve_history" TO "service_role";



GRANT ALL ON TABLE "public"."reserves" TO "anon";
GRANT ALL ON TABLE "public"."reserves" TO "authenticated";
GRANT ALL ON TABLE "public"."reserves" TO "service_role";



GRANT ALL ON TABLE "public"."variable_expenses" TO "anon";
GRANT ALL ON TABLE "public"."variable_expenses" TO "authenticated";
GRANT ALL ON TABLE "public"."variable_expenses" TO "service_role";



ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "service_role";






























RESET ALL;
