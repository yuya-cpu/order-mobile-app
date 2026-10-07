import { isNull } from "drizzle-orm";
import { db } from "@/db";
import { menu_categories, menus } from "@/db/schema";
import { createCoupon } from "../actions";
import { CouponForm } from "../coupon-form";

export default async function NewCouponPage() {
  const [menuRows, categoryRows] = await Promise.all([
    db
      .select({ id: menus.id, name: menus.name })
      .from(menus)
      .where(isNull(menus.deleted_at))
      .orderBy(menus.name),
    db
      .select({ id: menu_categories.id, name: menu_categories.name })
      .from(menu_categories)
      .orderBy(menu_categories.name),
  ]);

  return (
    <div className="flex flex-1 items-center justify-center px-4 py-8 sm:px-8">
      <CouponForm action={createCoupon} menus={menuRows} categories={categoryRows} />
    </div>
  );
}
