CREATE TABLE "user_discounts" (
	"id" uuid PRIMARY KEY NOT NULL,
	"user_id" uuid NOT NULL,
	"discount_id" uuid NOT NULL,
	"order_id" uuid,
	"acquired_at" timestamp DEFAULT now() NOT NULL,
	"used_at" timestamp
);
--> statement-breakpoint
ALTER TABLE "discounts" ADD COLUMN "code" text;--> statement-breakpoint
ALTER TABLE "discounts" ADD COLUMN "target_category_id" uuid;--> statement-breakpoint
ALTER TABLE "discounts" ADD COLUMN "expires_at" timestamp;--> statement-breakpoint
ALTER TABLE "user_discounts" ADD CONSTRAINT "user_discounts_user_id_customer_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."customer_user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_discounts" ADD CONSTRAINT "user_discounts_discount_id_discounts_id_fk" FOREIGN KEY ("discount_id") REFERENCES "public"."discounts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_discounts" ADD CONSTRAINT "user_discounts_order_id_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "user_discounts_user_discount_uidx" ON "user_discounts" USING btree ("user_id","discount_id");--> statement-breakpoint
CREATE INDEX "user_discounts_user_id_idx" ON "user_discounts" USING btree ("user_id");--> statement-breakpoint
ALTER TABLE "discounts" ADD CONSTRAINT "discounts_target_category_id_menu_categories_id_fk" FOREIGN KEY ("target_category_id") REFERENCES "public"."menu_categories"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "discounts" ADD CONSTRAINT "discounts_code_unique" UNIQUE("code");