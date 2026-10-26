import { db } from "@/db";
import { discounts, menu_categories, menus } from "@/db/schema";
import { eq, isNull } from "drizzle-orm";
import Link from "next/link";

function discountLabel(type: string, number: number) {
  return type === "percent" ? `${number}% OFF` : `${number}円 OFF`;
}

export default async function CouponsPage() {
  const rows = await db
    .select({
      id: discounts.id,
      name: discounts.name,
      type: discounts.type,
      number: discounts.number,
      code: discounts.code,
      created_at: discounts.created_at,
      shop_id: discounts.shop_id,
      target_menu_name: menus.name,
      target_category_name: menu_categories.name,
    })
    .from(discounts)
    .leftJoin(menus, eq(menus.id, discounts.target_menu_id))
    .leftJoin(menu_categories, eq(menu_categories.id, discounts.target_category_id))
    .where(isNull(discounts.deleted_at))
    .orderBy(discounts.created_at);

  if (rows.length === 0) {
    return (
      <main className="px-4 py-8 sm:px-8">
        <p>クーポンが見つかりません</p>
      </main>
    );
  }

  return (
    <main className="px-4 py-8 sm:px-8">
      <h1 className="mb-6 text-2xl font-bold">現在有効な店舗クーポン</h1>
      <div className="overflow-x-auto rounded-2xl bg-white shadow-sm">
        <div className="min-w-[720px]">
          <table className="w-full text-left">
            <thead>
              <tr>
                <th className="py-2 pl-4 pr-2">クーポン名</th>
                <th className="px-4 py-2">対象</th>
                <th className="px-4 py-2">割引</th>
                <th className="px-4 py-2">コード</th>
                <th className="px-4 py-2 text-right">操作</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id} className="border-b border-zinc-200 last:border-b-0">
                  <td className="py-2 pl-4 pr-2">{row.name}</td>
                  <td className="px-4 py-2">
                    {row.target_menu_name ?? row.target_category_name ?? "全商品"}
                  </td>
                  <td className="px-4 py-2">
                    <span className="rounded-md bg-[#E2584B] px-3 py-1 text-sm font-medium text-white">
                      {discountLabel(row.type, row.number)}
                    </span>
                  </td>
                  <td className="px-4 py-2">
                    {row.code ? (
                      <span className="font-mono tracking-wider">{row.code}</span>
                    ) : (
                      "なし（公開クーポン）"
                    )}
                  </td>
                  <td className="px-4 py-2 text-right">
                    <Link
                      href={`/store_admin/coupons/${row.id}/edit`}
                      className="inline-block rounded-xl border border-[#E2584B] px-4 py-1.5 text-sm text-[#E2584B]"
                    >
                      編集
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
