import { and, eq, isNull } from "drizzle-orm";
import { db } from "@/db";
import { discounts, user_discounts } from "@/db/schema";

export type UsableCoupon = typeof discounts.$inferSelect;

export type CouponCheck =
  | { ok: true; coupon: UsableCoupon | null }
  | { ok: false; error: string };

export const COUPON_UNAVAILABLE_MESSAGE = "このクーポンは使用できません";
export const COUPON_EXPIRED_MESSAGE = "このクーポンは有効期限が切れています";

/**
 * 注文・決済で使おうとしているクーポンが、このユーザーにとって有効か確認する。
 * - 削除済み / 期限切れは誰でも不可
 * - コード付きクーポンは引き換え済み（user_discounts に未使用レコードがある）ことが必要
 * - コードなしの公開クーポンは誰でも使える
 */
export async function findUsableCoupon(
  discountId: string | undefined | null,
  userId: string,
): Promise<CouponCheck> {
  if (!discountId) return { ok: true, coupon: null };

  const [coupon] = await db
    .select()
    .from(discounts)
    .where(and(eq(discounts.id, discountId), isNull(discounts.deleted_at)))
    .limit(1);
  if (!coupon) return { ok: false, error: COUPON_UNAVAILABLE_MESSAGE };

  if (coupon.expires_at && coupon.expires_at.getTime() <= Date.now()) {
    return { ok: false, error: COUPON_EXPIRED_MESSAGE };
  }

  if (coupon.code) {
    const [owned] = await db
      .select({ id: user_discounts.id })
      .from(user_discounts)
      .where(
        and(
          eq(user_discounts.user_id, userId),
          eq(user_discounts.discount_id, coupon.id),
          isNull(user_discounts.used_at),
        ),
      )
      .limit(1);
    if (!owned) return { ok: false, error: COUPON_UNAVAILABLE_MESSAGE };
  }

  return { ok: true, coupon };
}
