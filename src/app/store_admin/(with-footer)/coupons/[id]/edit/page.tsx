import { eq, isNull } from "drizzle-orm";
import { notFound } from "next/navigation";
import { db } from "@/db";
import { discounts, menu_categories, menus } from "@/db/schema";
import { updateCoupon, deleteCoupon } from "../../actions";
import { CouponForm } from "../../coupon-form";
import { PendingSubmitButton } from "@/components/admin/pending-submit-button";

export default async function EditCouponPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [coupon, menuRows, categoryRows] = await Promise.all([
    db.query.discounts.findFirst({ where: eq(discounts.id, id) }),
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

  if (!coupon) {
    notFound();
  }

  return (
    <div className="flex flex-1 flex-col items-center px-4 py-8 sm:px-8">
      <CouponForm
        action={updateCoupon}
        menus={menuRows}
        categories={categoryRows}
        coupon={{
          id: coupon.id,
          name: coupon.name,
          name_en: coupon.name_en,
          type: coupon.type,
          number: coupon.number,
          code: coupon.code,
          target_menu_id: coupon.target_menu_id,
          target_category_id: coupon.target_category_id,
        }}
      >
        <form action={deleteCoupon}>
          <input type="hidden" name="id" value={coupon.id} />
          <PendingSubmitButton
            idleLabel="削除"
            pendingLabel="削除中..."
            className="rounded-xl bg-[#F8E8E6] px-4 py-1.5 text-sm text-[#E2584B] disabled:opacity-50"
          />
        </form>
      </CouponForm>
    </div>
  );
}
