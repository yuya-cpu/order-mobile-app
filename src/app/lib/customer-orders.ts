import { and, desc, eq, isNull } from "drizzle-orm";
import { db } from "@/db";
import { discounts, menus, order_menus, orders } from "@/db/schema";

export type CustomerOrderItem = {
  id: string;
  name: string;
  nameEn: string | null;
  quantity: number;
  price: number;
};

export type CustomerOrder = {
  id: string;
  orderNumber: string;
  status: string;
  orderType: string;
  sumPrice: number;
  createdAt: Date;
  couponName: string | null;
  couponNameEn: string | null;
  couponType: string | null;
  couponNumber: number | null;
  items: CustomerOrderItem[];
};

function isUuid(value: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value);
}

export async function listCustomerOrders(userId: string, orderId?: string) {
  if (orderId && !isUuid(orderId)) return [];

  const rows = await db
    .select({
      id: orders.id,
      orderNumber: orders.order_number,
      status: orders.status,
      orderType: orders.order_type,
      sumPrice: orders.sum_price,
      createdAt: orders.created_at,
      couponName: discounts.name,
      couponNameEn: discounts.name_en,
      couponType: discounts.type,
      couponNumber: discounts.number,
      itemId: order_menus.id,
      itemName: menus.name,
      itemNameEn: menus.name_en,
      quantity: order_menus.order_order_number,
      price: order_menus.order_order_price,
    })
    .from(orders)
    .leftJoin(order_menus, eq(order_menus.order_id, orders.id))
    .leftJoin(menus, eq(menus.id, order_menus.menu_id))
    .leftJoin(discounts, eq(discounts.id, orders.discount_id))
    .where(
      and(
        eq(orders.user_id, userId),
        isNull(orders.deleted_at),
        orderId ? eq(orders.id, orderId) : undefined,
      ),
    )
    .orderBy(desc(orders.created_at));

  const grouped = new Map<string, CustomerOrder>();
  for (const row of rows) {
    let order = grouped.get(row.id);
    if (!order) {
      order = {
        id: row.id,
        orderNumber: row.orderNumber,
        status: row.status,
        orderType: row.orderType,
        sumPrice: row.sumPrice,
        createdAt: row.createdAt,
        couponName: row.couponName,
        couponNameEn: row.couponNameEn,
        couponType: row.couponType,
        couponNumber: row.couponNumber,
        items: [],
      };
      grouped.set(row.id, order);
    }
    if (row.itemId) {
      order.items.push({
        id: row.itemId,
        name: row.itemName ?? "",
        nameEn: row.itemNameEn,
        quantity: row.quantity ?? 0,
        price: row.price ?? 0,
      });
    }
  }

  return [...grouped.values()];
}
