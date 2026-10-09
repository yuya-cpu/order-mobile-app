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
    .where(isNull(discounts.deleted_at));

  if (rows.length === 0) {
    return (
      <div className="px-4 py-8 sm:px-8">
        <p>クーポンが見つかりません</p>
      </div>
    );
  }

  return (
    <div className="px-4 py-8 sm:px-8">
      <h1 className="mb-6 text-2xl font-bold">現在有効な店舗クーポン</h1>
      <ul className="flex flex-col gap-4">
        {rows.map((row) => (
          <li key={row.id} className="rounded-2xl bg-white p-5">
            <div className="mb-2 flex items-start justify-between gap-4">
              <span className="rounded-md bg-[#E2584B] px-3 py-1 text-sm font-medium text-white">
                {discountLabel(row.type, row.number)}
              </span>
            </div>
            <p className="text-lg font-bold">{row.name}</p>
            <dl className="mt-3 flex flex-col gap-1 text-sm text-zinc-600">
              <div className="flex gap-2">
                <dt className="shrink-0">対象</dt>
                <dd className="font-medium text-zinc-800">
                  {row.target_menu_name ?? row.target_category_name ?? "全商品"}
                </dd>
              </div>
              <div className="flex gap-2">
                <dt className="shrink-0">コード</dt>
                <dd className="font-medium text-zinc-800">
                  {row.code ? (
                    <span className="font-mono tracking-wider">{row.code}</span>
                  ) : (
                    "なし（公開クーポン）"
                  )}
                </dd>
              </div>
            </dl>
            <div className="mt-4 flex justify-end">
              <Link
                href={`/store_admin/coupons/${row.id}/edit`}
                className="rounded-full border border-[#E2584B] px-4 py-1.5 text-sm text-[#E2584B]"
              >
                編集
              </Link>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
