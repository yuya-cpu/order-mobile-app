import { NextResponse } from "next/server";
import { and, eq, inArray, isNull } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { menus, orders, order_menus, payments, payment_pay_jpt, shops, user_discounts } from "@/db/schema";
import { calculateDiscount } from "@/app/lib/apply-discount";
import { getCustomerSession } from "@/app/lib/customer-session";
import { COUPON_UNAVAILABLE_MESSAGE, findUsableCoupon } from "@/app/lib/coupon-eligibility";

const shopId = "11111111-1111-1111-1111-111111111111";

class CouponUnavailableError extends Error {}

type CartItem = {
  id: string;
  quantity: number;
};

export async function POST(request: Request) {
  const session = await getCustomerSession();
  if (!session) {
    return NextResponse.json({ error: "ログインが必要です" }, { status: 401 });
  }

  const body = (await request.json()) as {
    items?: CartItem[];
    paymentFlowId?: string;
    orderType?: string;
    customerNumber?: number;
    discountId?: string;
  };
  const items = (body.items ?? []).filter((item) => item.id && item.quantity > 0);
  const paymentFlowId = String(body.paymentFlowId ?? "");
  const orderType = body.orderType === "here" ? "here" : "take-out";
  const parsedGuests = Number(body.customerNumber);
  const customerNumber =
    Number.isFinite(parsedGuests) && parsedGuests > 0 ? Math.floor(parsedGuests) : 1;

  if (items.length === 0) {
    return NextResponse.json({ error: "カートが空です" }, { status: 400 });
  }

  const shop = await db.query.shops.findFirst({
    where: eq(shops.id, shopId),
  });
  if (shop?.is_accepted !== true) {
    return NextResponse.json({ error: "ただいま注文を停止しています" }, { status: 400 });
  }

  if (paymentFlowId) {
    const [existing] = await db
      .select({ order_number: orders.order_number })
      .from(payment_pay_jpt)
      .innerJoin(payments, eq(payments.id, payment_pay_jpt.payment_id))
      .innerJoin(orders, eq(orders.id, payments.order_id))
      .where(eq(payment_pay_jpt.pay_jp_id, paymentFlowId))
      .limit(1);
    if (existing) {
      return NextResponse.json({ order_number: existing.order_number });
    }
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

  const lines = items.map((item) => {
    const menu = menuById.get(item.id);
    return {
      menu_id: item.id,
      category_id: menu?.category_id ?? null,
      price: menu?.price ?? 0,
      quantity: item.quantity,
    };
  });

  const couponCheck = await findUsableCoupon(body.discountId, session.user.id);
  if (!couponCheck.ok) {
    return NextResponse.json({ error: couponCheck.error }, { status: 400 });
  }
  const coupon = couponCheck.coupon;
  const { total: sumPrice } = calculateDiscount(lines, coupon);

  if (sumPrice <= 0) {
    return NextResponse.json({ error: "金額が正しくありません" }, { status: 400 });
  }

  const existingOrders = await db.select({ order_number: orders.order_number }).from(orders);
  const maxNumber = existingOrders.reduce((max, row) => {
    const n = Number(row.order_number);
    return Number.isFinite(n) ? Math.max(max, n) : max;
  }, 1000);
  const orderNumber = String(maxNumber + 1);
  const orderId = crypto.randomUUID();
  const paymentId = crypto.randomUUID();
  const userId = session.user.id;

  try {
    await db.transaction(async (tx) => {
      await tx.insert(orders).values({
        id: orderId,
        user_id: userId,
        shop_id: shopId,
        order_type: orderType,
        customer_number: customerNumber,
        sum_price: sumPrice,
        discount_id: coupon?.id,
        order_number: orderNumber,
        tax: 0,
        status: "processing",
      });

      // コード付きクーポンは、注文行を作ったあとで未使用レコードを使用済みに切り替える
      // （order_id の FK があるため注文が先）。同時に2回使われても片方しか成功しないよう
      // used_at IS NULL を条件にし、0件ならロールバックして注文ごと取り消す。
      if (coupon?.code) {
        const marked = await tx
          .update(user_discounts)
          .set({ used_at: new Date(), order_id: orderId })
          .where(
            and(
              eq(user_discounts.user_id, userId),
              eq(user_discounts.discount_id, coupon.id),
              isNull(user_discounts.used_at),
            ),
          )
          .returning({ id: user_discounts.id });
        if (marked.length === 0) {
          throw new CouponUnavailableError();
        }
      }

      await tx.insert(order_menus).values(
        lines.map((line) => ({
          id: crypto.randomUUID(),
          order_id: orderId,
          menu_id: line.menu_id,
          order_order_number: line.quantity,
          order_order_price: line.price * line.quantity,
        })),
      );

      if (paymentFlowId) {
        await tx.insert(payments).values({
          id: paymentId,
          order_id: orderId,
          amount: sumPrice,
          payment_method: "card",
          type: "payjp",
        });
        await tx.insert(payment_pay_jpt).values({
          id: crypto.randomUUID(),
          payment_id: paymentId,
          pay_jp_id: paymentFlowId,
          payment_method: "card",
        });
      }
    });
  } catch (error) {
    if (error instanceof CouponUnavailableError) {
      return NextResponse.json({ error: COUPON_UNAVAILABLE_MESSAGE }, { status: 400 });
    }
    throw error;
  }

  revalidatePath("/store_admin/history");
  revalidatePath("/store_admin/orders");

  return NextResponse.json({ order_number: orderNumber });
}
