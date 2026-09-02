import { db } from "../../../../db";
import { discounts } from "../../../../db/schema";
import { isNull } from "drizzle-orm";
import Link from "next/link";

const defaultCoupons = [
  {
    id: "44444444-4444-4444-4444-444444444442",
    name: "新規オープン記念10%OFF",
    type: "percent",
    number: 10,
  },
];

function discountLabel(type: string, number: number) {
  return type === "percent" ? `${number}% OFF` : `${number}円 OFF`;
}

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
      type: discounts.type,
      number: discounts.number,
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
          <li key={row.id} className="rounded-2xl bg-white p-5">
            <div className="mb-2 flex items-start justify-between gap-4">
              <span className="rounded-md bg-[#E2584B] px-3 py-1 text-sm font-medium text-white">
                {discountLabel(row.type, row.number)}
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
