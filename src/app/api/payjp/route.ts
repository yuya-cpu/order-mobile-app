import { NextResponse } from "next/server";
import { and, eq, inArray } from "drizzle-orm";
import { db } from "@/db";
import { menus, setmenu, setmenu_option, setmenu_option_detail, shops } from "@/db/schema";
import { createPaymentFlow } from "@payjp/payjpv2";
import { payjp } from "@/app/lib/pay.jp";
import { calculateDiscount, type DiscountLine } from "@/app/lib/apply-discount";
import { getCustomerSession } from "@/app/lib/customer-session";
import { findUsableCoupon } from "@/app/lib/coupon-eligibility";

type CartItem = {
    id: string;
    quantity: number;
    option_detail_ids?: string[];
};

export async function POST(request: Request) {
    const session = await getCustomerSession();
    if (!session) {
        return NextResponse.json({ error: "ログインが必要です" }, { status: 401 });
    }

    const body = (await request.json()) as { items: CartItem[]; discountId?: string };
    const items = body.items?? [];

    if (items.length === 0) {
        return NextResponse.json({ error: "No items in cart" }, { status: 400 });
    }

    const shopId = "11111111-1111-1111-1111-111111111111";
    const shop = await db.query.shops.findFirst({
        where: eq(shops.id, shopId),
    });
    if (shop?.is_accepted !== true) {
        return NextResponse.json({ error: "ただいま注文を停止しています" }, { status: 400 });
    }

    const ids = items.map((item) => item.id);
    const rows = await db
        .select({
            id: menus.id,
            price: menus.price,
            is_accepted: menus.is_accepted,
            category_id: menus.category_id,
        })
        .from(menus)
        .where(inArray(menus.id, ids));
    if (rows.some((row) => !row.is_accepted)) {
        return NextResponse.json({ error: "注文できない商品が含まれています" }, { status: 400 });
    }

    const menuById = new Map(rows.map((row) => [row.id, row]));

    const lines: DiscountLine[] = [];
    for (const item of items) {
        const menu = menuById.get(item.id);
        const optionDetailIds = item.option_detail_ids ?? [];

        const [set] = await db
            .select()
            .from(setmenu)
            .where(eq(setmenu.menus_id, item.id))
            .limit(1);
        if (set) {
            const options = await db
                .select()
                .from(setmenu_option)
                .where(eq(setmenu_option.setmenu_id, set.id));
            if (options.length > 0 && optionDetailIds.length !== options.length) {
                return NextResponse.json({ error: "セット内容が正しくありません" }, { status: 400 });
            }
        }

        if (optionDetailIds.length > 0) {
            const details = await db
                .select({
                    id: setmenu_option_detail.id,
                    optionId: setmenu_option.id,
                })
                .from(setmenu_option_detail)
                .innerJoin(
                    setmenu_option,
                    eq(setmenu_option.id, setmenu_option_detail.setmenu_option_id),
                )
                .innerJoin(setmenu, eq(setmenu.id, setmenu_option.setmenu_id))
                .where(
                    and(
                        inArray(setmenu_option_detail.id, optionDetailIds),
                        eq(setmenu.menus_id, item.id),
                    ),
                );

            const optionIds = new Set(details.map((detail) => detail.optionId));
            if (details.length !== optionDetailIds.length || optionIds.size !== optionDetailIds.length) {
                return NextResponse.json({ error: "セット内容が正しくありません" }, { status: 400 });
            }
        }

        lines.push({
            menu_id: item.id,
            category_id: menu?.category_id ?? null,
            price: menu?.price ?? 0,
            quantity: item.quantity,
        });
    }

    const couponCheck = await findUsableCoupon(body.discountId, session.user.id);
    if (!couponCheck.ok) {
        return NextResponse.json({ error: couponCheck.error }, { status: 400 });
    }
    const { total: amount } = calculateDiscount(lines, couponCheck.coupon);
    if (amount <= 0) {
        return NextResponse.json({ error: "金額が正しくありません" }, { status: 400 });
    }

    const {data, error} = await createPaymentFlow({
        client: payjp,
        body: {
            amount,
            currency: "jpy",
            payment_method_types: ["card","paypay"],
        },
    });
    if (error || !data) {
        return NextResponse.json({ error: "Failed to create payment flow" }, { status: 500 });
    }
    return NextResponse.json({
        clientSecret: data.client_secret,
        paymentFlowId: data.id,
        amount,
    });
}
