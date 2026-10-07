ALTER TABLE "menus" ADD COLUMN IF NOT EXISTS "name_en" text;
ALTER TABLE "menus" ADD COLUMN IF NOT EXISTS "description_en" text;
ALTER TABLE "discounts" ADD COLUMN IF NOT EXISTS "name_en" text;
