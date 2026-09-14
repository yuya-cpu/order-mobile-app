import { NextResponse } from "next/server";
import { inArray } from "drizzle-orm";
import { db } from "@/db";
import { menus } from "@/db/schema";
import { createPaymentFlow } from "@payjp/payjpv2";
import { payjp } from "@/app/lib/pay.jp";

type CartItem = { id: string; quantity: number };

export async function POST(request: Request) {
    const body = (await request.json()) as { items: CartItem[] };
    const items = body.items?? [];

    if (items.length === 0) {
        return NextResponse.json({ error: "No items in cart" }, { status: 400 });
    }
    const ids = items.map((item) => item.id);
    const rows = await db.select({id: menus.id, price: menus.price}).from(menus).where(inArray(menus.id, ids));

    const priceByItemId = new Map(rows.map((row) => [row.id, row.price]));

    let amount = 0;
    for (const item of items) {
        const price = priceByItemId.get(item.id);
        if (price === undefined) {
            return NextResponse.json({ error: "Invalid item id" }, { status: 400 });
        }
        amount += price * item.quantity;
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