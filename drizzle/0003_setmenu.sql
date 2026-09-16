CREATE TABLE "setmenu" (
	"id" uuid PRIMARY KEY NOT NULL,
	"menus_id" uuid NOT NULL,
	CONSTRAINT "setmenu_menus_id_unique" UNIQUE("menus_id")
);
--> statement-breakpoint
CREATE TABLE "setmenu_option" (
	"id" uuid PRIMARY KEY NOT NULL,
	"setmenu_id" uuid NOT NULL,
	"name" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "setmenu_option_detail" (
	"id" uuid PRIMARY KEY NOT NULL,
	"setmenu_option_id" uuid NOT NULL,
	"menus_id" uuid NOT NULL,
	"addprice" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
ALTER TABLE "setmenu" ADD CONSTRAINT "setmenu_menus_id_menus_id_fk" FOREIGN KEY ("menus_id") REFERENCES "public"."menus"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "setmenu_option" ADD CONSTRAINT "setmenu_option_setmenu_id_setmenu_id_fk" FOREIGN KEY ("setmenu_id") REFERENCES "public"."setmenu"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "setmenu_option_detail" ADD CONSTRAINT "setmenu_option_detail_setmenu_option_id_setmenu_option_id_fk" FOREIGN KEY ("setmenu_option_id") REFERENCES "public"."setmenu_option"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "setmenu_option_detail" ADD CONSTRAINT "setmenu_option_detail_menus_id_menus_id_fk" FOREIGN KEY ("menus_id") REFERENCES "public"."menus"("id") ON DELETE no action ON UPDATE no action;
