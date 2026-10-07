import { NextResponse } from "next/server";
import { eq, inArray } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { menus, orders, order_menus, payments, payment_pay_jpt, shops, discounts } from "@/db/schema";
import { calculateDiscount } from "@/app/lib/apply-discount";
import { getCustomerSession } from "@/app/lib/customer-session";

const shopId = "11111111-1111-1111-1111-111111111111";

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

  let coupon = null;
  if (body.discountId) {
    const [row] = await db
      .select()
      .from(discounts)
      .where(eq(discounts.id, body.discountId))
      .limit(1);
    coupon = row ?? null;
  }
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

  await db.insert(orders).values({
    id: orderId,
    shop_id: shopId,
    order_type: orderType,
    customer_number: customerNumber,
    sum_price: sumPrice,
    discount_id: coupon?.id,
    order_number: orderNumber,
    tax: 0,
    status: "processing",
  });

  await db.insert(order_menus).values(
    lines.map((line) => ({
      id: crypto.randomUUID(),
      order_id: orderId,
      menu_id: line.menu_id,
      order_order_number: line.quantity,
      order_order_price: line.price * line.quantity,
    })),
  );

  if (paymentFlowId) {
    await db.insert(payments).values({
      id: paymentId,
      order_id: orderId,
      amount: sumPrice,
      payment_method: "card",
      type: "payjp",
    });
    await db.insert(payment_pay_jpt).values({
      id: crypto.randomUUID(),
      payment_id: paymentId,
      pay_jp_id: paymentFlowId,
      payment_method: "card",
    });
  }

  revalidatePath("/store_admin/history");
  revalidatePath("/store_admin/orders");

  return NextResponse.json({ order_number: orderNumber });
}
