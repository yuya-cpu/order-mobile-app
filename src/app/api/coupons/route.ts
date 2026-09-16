import { NextResponse } from "next/server";
import { db } from "@/db";
import { isNull } from "drizzle-orm";
import { discounts } from "@/db/schema";

export async function GET() {
    const coupons = await db.select({
        id: discounts.id,
        name: discounts.name,
        type: discounts.type,
        number: discounts.number,
    })
    .from(discounts).where(isNull(discounts.deleted_at));
    return NextResponse.json(coupons);
}