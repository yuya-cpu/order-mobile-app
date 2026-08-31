import { db } from "../../../db";
import { discounts } from "../../../db/schema";
import { isNull } from "drizzle-orm";
import Link from "next/link";

const defaultCoupons = [
  {
    id: "44444444-4444-4444-4444-444444444442",
    name: "チーズバーガー",
    discount_number: 0,
    discount_percentage: 10,
  },
];

export default async function CouponsPage() {
  const existing = await db.select({ id: discounts.id }).from(discounts);
  const missing = defaultCoupons.filter(
    (coupon) => !existing.some((row) => row.id === coupon.id),
  );
  if (missing.length > 0) {
    await db.insert(discounts).values(missing);
  }

  const rows = await db
    .select({
      id: discounts.id,
      name: discounts.name,
      discount_number: discounts.discount_number,
      discount_percentage: discounts.discount_percentage,
      created_at: discounts.created_at,
      shop_id: discounts.shop_id,
    })
    .from(discounts)
    .where(isNull(discounts.deleted_at));

  if (rows.length === 0) {
    return (
      <div className="px-8 py-8">
        <p>クーポンが見つかりません</p>
      </div>
    );
  }

  return (
    <div className="px-8 py-8">
      <h1 className="mb-6 text-2xl font-bold">現在有効な店舗クーポン</h1>
      <ul className="flex flex-col gap-4">
        {rows.map((row) => (
          <li
            key={row.id}
            className="rounded-2xl bg-white p-5"
          >
            <div className="mb-2 flex items-start justify-between gap-4">
              <span className="rounded-md bg-[#E2584B] px-3 py-1 text-sm font-medium text-white">
                {row.discount_percentage > 0
                  ? `${row.discount_percentage}% OFF`
                  : `${row.discount_number}円 OFF`}
              </span>
            </div>
            <p className="text-lg font-bold">{row.name}</p>
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
