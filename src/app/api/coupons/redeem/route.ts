import { NextResponse } from "next/server";
import { and, eq, isNull } from "drizzle-orm";
import { db } from "@/db";
import { discounts, user_discounts } from "@/db/schema";
import { getCustomerSession } from "@/app/lib/customer-session";
import { normalizeCouponCode } from "@/app/lib/coupon-code";

export async function POST(request: Request) {
  const session = await getCustomerSession();
  if (!session) {
    return NextResponse.json({ error: "notLoggedIn" }, { status: 401 });
  }

  const body = (await request.json()) as { code?: string };
  const code = normalizeCouponCode(body.code);
  if (!code) {
    return NextResponse.json({ error: "emptyCode" }, { status: 400 });
  }

  const [coupon] = await db
    .select()
    .from(discounts)
    .where(and(eq(discounts.code, code), isNull(discounts.deleted_at)))
    .limit(1);
  if (!coupon) {
    return NextResponse.json({ error: "notFound" }, { status: 404 });
  }

  if (coupon.expires_at && coupon.expires_at.getTime() < Date.now()) {
    return NextResponse.json({ error: "expired" }, { status: 400 });
  }

  const [owned] = await db
    .select({ id: user_discounts.id })
    .from(user_discounts)
    .where(
      and(
        eq(user_discounts.user_id, session.user.id),
        eq(user_discounts.discount_id, coupon.id),
      ),
    )
    .limit(1);
  if (owned) {
    return NextResponse.json({ error: "alreadyOwned" }, { status: 409 });
  }

  await db.insert(user_discounts).values({
    id: crypto.randomUUID(),
    user_id: session.user.id,
    discount_id: coupon.id,
  });

  return NextResponse.json({
    coupon: {
      id: coupon.id,
      name: coupon.name,
      name_en: coupon.name_en,
      type: coupon.type,
      number: coupon.number,
    },
  });
}
