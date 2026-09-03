import { updateCoupon } from "../../actions";
import { db } from "@/db";
import { discounts } from "@/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import Link from "next/link";

export default async function EditCouponPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const coupon = await db.query.discounts.findFirst({
    where: eq(discounts.id, id),
  });

  if (!coupon) {
    notFound();
  }

  return (
    <div className="flex flex-1 items-center justify-center px-8 py-8">
      <form
        action={updateCoupon}
        className="mx-auto flex w-full max-w-3xl flex-col gap-6 rounded-2xl bg-white p-8"
      >
        <h1 className="text-2xl font-bold">クーポンの編集</h1>
        <input type="hidden" name="id" value={coupon.id} />
        <input type="hidden" name="type" value={coupon.type} />

        <label className="flex flex-col gap-2 font-medium">
          クーポン名
          <input
            name="name"
            required
            defaultValue={coupon.name}
            className="rounded-md border border-gray-300 p-3"
          />
        </label>

        <label className="flex flex-col gap-2 font-medium">
          {coupon.type === "percent" ? "割引率" : "割引金額"}
          <div className="flex items-center gap-3">
            <input
              name="number"
              type="number"
              required
              min={1}
              defaultValue={coupon.number}
              className="min-w-0 flex-1 rounded-md border border-gray-300 p-3"
            />
            <span className="shrink-0 text-zinc-600">
              {coupon.type === "percent" ? "%" : "円"}
            </span>
          </div>
        </label>

        <div className="flex gap-4">
          <Link
            href="/store_admin/coupons"
            className="flex flex-1 items-center justify-center rounded-full border py-3"
          >
            戻る
          </Link>
          <button
            type="submit"
            className="flex-1 rounded-full bg-[#E2584B] py-3 text-white"
          >
            更新
          </button>
        </div>
      </form>
    </div>
  );
}
