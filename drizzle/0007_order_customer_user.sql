ALTER TABLE "orders" DROP CONSTRAINT "orders_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_user_id_customer_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."customer_user"("id") ON DELETE no action ON UPDATE no action;