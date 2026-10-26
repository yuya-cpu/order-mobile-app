import { db } from "@/db";
import { orders, menus, order_menus } from "@/db/schema";
import { eq, isNull, desc } from "drizzle-orm";
import Link from "next/link";

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

export default async function HistoryPage() {
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
    .where(isNull(orders.deleted_at))
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
        <h1 className="text-2xl font-bold">注文履歴</h1>
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
              <th className="px-4 py-2 text-right">詳細</th>
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
                    <Link
                      href={`/store_admin/history/${order.id}/edit`}
                      className="inline-block rounded-xl border border-[#E2584B] px-4 py-1.5 text-sm text-[#E2584B]"
                    >
                      詳細
                    </Link>
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
