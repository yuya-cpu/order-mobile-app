import { NextResponse } from "next/server";
import { and, eq, inArray } from "drizzle-orm";
import { db } from "@/db";
import { menus, setmenu, setmenu_option, setmenu_option_detail, shops, discounts } from "@/db/schema";
import { createPaymentFlow } from "@payjp/payjpv2";
import { payjp } from "@/app/lib/pay.jp";
import { applyDiscount } from "@/app/order/apply-discount";

type CartItem = {
    id: string;
    quantity: number;
    option_detail_ids?: string[];
};

export async function POST(request: Request) {
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
    const rows = await db.select({id: menus.id, price: menus.price, is_accepted: menus.is_accepted}).from(menus).where(inArray(menus.id, ids));
    if (rows.some((row) => !row.is_accepted)) {
        return NextResponse.json({ error: "注文できない商品が含まれています" }, { status: 400 });
    }

    const priceByItemId = new Map(rows.map((row) => [row.id, row.price]));

    let amount = 0;
    for (const item of items) {
        const base = priceByItemId.get(item.id) ?? 0;
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

        amount += base * item.quantity;
    }

    let coupon = null;
    if (body.discountId) {
        const [row] = await db
            .select()
            .from(discounts)
            .where(eq(discounts.id, body.discountId))
            .limit(1);
        coupon = row ?? null;
    }
    amount = applyDiscount(amount, coupon);

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
