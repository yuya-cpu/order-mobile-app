import { db } from "@/db";
import { orders, order_menus, menus, discounts } from "@/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import Link from "next/link";

function format(date: Date, format: string) {
    return date.toLocaleString("ja-JP", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
    });
}

export default async function HistorydetailPage({
    params
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params;

    const order = await db.query.orders.findFirst({
        where: eq(orders.id, id),
    });

    if (!order) {
        notFound();
    }

    const items = await db.select({
        name: menus.name,
        quantity: order_menus.order_order_number,
        price: order_menus.order_order_price,
    })
    .from(order_menus)
    .leftJoin(menus, eq(menus.id, order_menus.menu_id))
    .where(eq(order_menus.order_id, id));


const coupon = order.discount_id ? await db.query.discounts.findFirst({
    where: eq(discounts.id, order.discount_id),
}) : null;


    return (
       <main className="px-8 py-8">
        <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-[1.4fr_1fr]">
            <section className="rounded-2xl bg-white p-6 shadow-sm">
                <div className="mb-6 flex items-baseline justify-between gap-4">
                    <h1 className="text-xl font-bold text-gray-900">注文詳細 #{order.id}</h1>
                    <p className="text-sm text-zinc-500">{format(order.created_at, 'yyyy/MM/dd HH:mm')}</p>
                </div>

                <ul>
                    {items.map((item) => (
                        <li key={item.name} className="grid grid-cols-[1fr_auto_auto] items-center gap-6 border-b border-zinc-200 py-4">
                            <span>{item.name}</span>
                            <span>{item.quantity}個</span>
                            <span>{item.price}円</span>
                        </li>
                    ))}
                </ul>

                {coupon && (
            <div className="mt-6 rounded-xl bg-[#F5F1EA] px-4 py-3">
              <p className="mb-2 text-xs text-zinc-500">適用中のクーポン</p>
              <div className="flex items-center justify-between gap-3">
                <p className="font-medium text-[#E2584B]">{coupon.name}</p>
                <p className="font-medium text-[#E2584B]">
                  {coupon.type === "percent"
                    ? `${coupon.number}% OFF`
                    : `-${coupon.number}円`}
                </p>
              </div>
            </div>
          )}
        </section>

        <aside className="flex flex-col gap-4">
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <p className="mb-2 text-sm text-zinc-500">合計金額</p>
            <p className="text-3xl font-bold text-[#E2584B]">
              ¥{order.sum_price.toLocaleString("ja-JP")}
              <span className="ml-1 text-base font-normal text-zinc-600">
                (税込)
              </span>
            </p>
          </div>

          <button
            type="button"
            className="rounded-xl border border-zinc-300 bg-white px-4 py-3"
          >
            領収書の再発行
          </button>
          <button
            type="button"
            className="rounded-xl border border-zinc-300 bg-white px-4 py-3"
          >
            数量の変更
          </button>
          <button
            type="button"
            className="rounded-xl bg-[#F8E8E6] px-4 py-3 text-[#E2584B]"
          >
            注文のキャンセル
          </button>
        </aside>
       </div>
       </main>
    );
}