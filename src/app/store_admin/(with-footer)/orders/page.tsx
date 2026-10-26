import { db } from "@/db";
import { orders, menus, order_menus } from "@/db/schema";
import { and, eq, isNull, desc } from "drizzle-orm";
import { StatusModal } from "./status-modal";
import Link from "next/link";

const defaultOrders = [
  {
    id: "55555555-5555-5555-5555-555555555551",
    order_type: "take-out",
    customer_number: 1,
    sum_price: 500,
    order_number: "1001",
    tax: 50,
    status: "processing",
  },
];

const defaultOrderMenus = [
  {
    id: "66666666-6666-6666-6666-666666666661",
    order_id: "55555555-5555-5555-5555-555555555551",
    menu_id: "22222222-2222-2222-2222-222222222222",
    order_order_number: 1,
    order_order_price: 500,
  },
];

function OrderStatus(status: string) {
  if (status === "done") return "完了";
  if (status === "cancel") return "キャンセル";
  return "調理中";
}

function statusColor(status: string) {
  if (status === "done") return "bg-emerald-600 text-white";
  if (status === "cancel") return "bg-zinc-600 text-white";
  return "bg-[#E2584B] text-white";
}

function elapsedLabel(createdAt: Date) {
    const mins = Math.floor((Date.now() - createdAt.getTime()) / 60000);
    if (mins < 1) return "たった今";
    if (mins < 60) return `${mins}分前`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}時間前`;
    return `${Math.floor(hours / 24)}日前`;
  }

export default async function OrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  const onlyProcessing = status === "processing";

  const existing = await db.select({ id: orders.id }).from(orders);
  const missing = defaultOrders.filter(
    (o) => !existing.some((row) => row.id === o.id),
  );
  if (missing.length > 0) {
    await db.insert(orders).values(missing);
    await db.insert(order_menus).values(defaultOrderMenus);
  }

  const rows = await db
    .select({
      id: orders.id,
      order_number: orders.order_number,
      status: orders.status,
      menus: menus.name,
      quantity: order_menus.order_order_number,
      created_at: orders.created_at,
    })
    .from(orders)
    .leftJoin(order_menus, eq(order_menus.order_id, orders.id))
    .leftJoin(menus, eq(menus.id, order_menus.menu_id))
    .where(and(isNull(orders.deleted_at), onlyProcessing ? eq(orders.status, "processing") : undefined))
    .orderBy(desc(orders.created_at));

  const map = new Map<
    string,
    {
      id: string;
      order_number: string;
      status: string;
      name: string[];
      quantity: number[];
      created_at: Date;
    }
  >();

  for (const row of rows) {
    const key = row.order_number;
    if (!map.has(key)) {
      map.set(key, {
        id: row.id,
        order_number: row.order_number,
        status: row.status,
        name: [],
        quantity: [],
        created_at: row.created_at,
      });
    }
    const current = map.get(key)!;
    if (row.menus) current.name.push(row.menus);
    if (row.quantity != null) current.quantity.push(row.quantity);
  }

  const list = [...map.values()];

  return (
    <main className="px-4 py-8 sm:px-8">
      <div className="mb-6 flex items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">注文一覧</h1>
        <Link
    href={
      onlyProcessing
        ? "/store_admin/orders"
        : "/store_admin/orders?status=processing"
    }
    className={
      onlyProcessing
        ? "rounded-xl bg-[#E2584B] px-4 py-1.5 text-sm text-white"
        : "rounded-xl border border-[#E2584B] px-4 py-1.5 text-sm text-[#E2584B]"
    }
  >
    {onlyProcessing ? "すべて表示" : "調理中のみ"}
  </Link>
      </div>
      <div className="overflow-x-auto rounded-2xl bg-white shadow-sm">
        <div className="min-w-[720px]">
        <table className="w-full text-left">
          <thead>
            <tr>
              <th className="py-2 pl-4 pr-2">ステータス</th>
              <th className="px-4 py-2">注文番号</th>
              <th className="px-4 py-2">商品名</th>
              <th className="px-4 py-2">注文時間</th>
              <th className="px-4 py-2">個数</th>
              <th className="px-4 py-2 text-right">操作</th>
            </tr>
          </thead>
          <tbody>
            {list.length === 0 ? (
              <tr>
                <td className="px-4 py-6 text-zinc-500" colSpan={6}>
                  注文がありません
                </td>
              </tr>
            ) : (
              list.map((order) => (
                <tr key={order.id} className="border-b border-zinc-200 last:border-b-0">
                  <td className="py-2 pl-4 pr-2">
                    <span
                      className={`inline-block rounded-full px-2 py-1 text-sm text-white ${statusColor(order.status)}`}
                    >
                      {OrderStatus(order.status)}
                    </span>
                  </td>
                  <td className="px-4 py-2"># {order.order_number}</td>
                  <td className="px-4 py-2">{order.name.join(", ")}</td>
                  <td className="px-4 py-2">{elapsedLabel(order.created_at)}</td>
                  <td className="px-4 py-2">
                    {order.quantity.reduce((a, b) => a + b, 0)}個
                  </td>
                  <td className="px-4 py-2 text-right">
                    <StatusModal
                      orderId={order.id}
                      status={order.status}
                      orderNumber={order.order_number}
                      items={order.name}
                      orderedAt={order.created_at.toLocaleTimeString("ja-JP", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        </div>
      </div>
    </main>
  );
}
