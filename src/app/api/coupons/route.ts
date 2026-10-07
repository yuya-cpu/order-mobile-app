import { NextResponse } from "next/server";
import { and, eq, gt, isNull, or } from "drizzle-orm";
import { db } from "@/db";
import { discounts, menu_categories, menus, user_discounts } from "@/db/schema";
import { getCustomerSession } from "@/app/lib/customer-session";

export async function GET() {
    const session = await getCustomerSession();
    const userId = session?.user.id;

    const selection = {
        id: discounts.id,
        name: discounts.name,
        name_en: discounts.name_en,
        type: discounts.type,
        number: discounts.number,
        target_menu_id: discounts.target_menu_id,
        target_menu_name: menus.name,
        target_menu_name_en: menus.name_en,
        target_category_id: discounts.target_category_id,
        target_category_name: menu_categories.name,
    };

    // コードが未設定のクーポンは引き換え不要の公開クーポンとして全員に見せる。
    const publicCoupons = await db
        .select(selection)
        .from(discounts)
        .leftJoin(menus, eq(menus.id, discounts.target_menu_id))
        .leftJoin(menu_categories, eq(menu_categories.id, discounts.target_category_id))
        .where(and(isNull(discounts.deleted_at), isNull(discounts.code)));

    if (!userId) {
        return NextResponse.json(publicCoupons);
    }

    const ownedCoupons = await db
        .select(selection)
        .from(user_discounts)
        .innerJoin(discounts, eq(discounts.id, user_discounts.discount_id))
        .leftJoin(menus, eq(menus.id, discounts.target_menu_id))
        .leftJoin(menu_categories, eq(menu_categories.id, discounts.target_category_id))
        .where(
            and(
                eq(user_discounts.user_id, userId),
                isNull(user_discounts.used_at),
                isNull(discounts.deleted_at),
                or(isNull(discounts.expires_at), gt(discounts.expires_at, new Date())),
            ),
        );

    const byId = new Map(publicCoupons.map((coupon) => [coupon.id, coupon]));
    for (const coupon of ownedCoupons) {
        byId.set(coupon.id, coupon);
    }
    return NextResponse.json([...byId.values()]);
}
