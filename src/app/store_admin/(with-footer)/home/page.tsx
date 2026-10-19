import Link from "next/link";
import { updateShopStatus } from "./actions";
import { db } from "@/db";
import { orders, shops } from "@/db/schema";
import { and, count, eq, isNull } from "drizzle-orm";
import { PendingSubmitButton } from "@/components/admin/pending-submit-button";

const shopId = "11111111-1111-1111-1111-111111111111";

export default async function AdminHomePage() {
    const shop = await db.query.shops.findFirst({
        where: eq(shops.id, shopId),
    });

    const accepting = shop?.is_accepted === true;
    const [cooking] = await db
        .select({ value: count() })
        .from(orders)
        .where(and(isNull(orders.deleted_at), eq(orders.status, "processing")));

    return (
        <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col items-center justify-center px-4 py-8">
            <div className="mb-6 flex w-full flex-col gap-4 rounded-2xl bg-white px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                <div className="flex items-start gap-3">
                    <span
                        className={`mt-1.5 size-2.5 shrink-0 rounded-full ${accepting ? "bg-emerald-500" : "bg-zinc-400"}`}
                        aria-hidden
                    />
                    <div>
                        <p className="font-bold text-zinc-900">
                            {accepting ? "現在店舗は「営業中」です" : "現在店舗は「注文一時停止中」です"}
                        </p>
                        <p className="mt-1 text-sm text-zinc-500">
                            {accepting
                                ? "オンライン注文をリアルタイムで受け付けています。"
                                : "オンライン注文の受け付けを停止しています。"}
                        </p>
                    </div>
                </div>
                <Link href="/store_admin/orders?status=processing" className="sm:text-right">
                    <p className="text-sm text-zinc-500">現在調理中</p>
                    <p className="text-3xl font-bold text-[#E2584B]">
                        {cooking.value}
                        <span className="ml-0.5 text-base font-bold">件</span>
                    </p>
                </Link>
            </div>
            <div className="mb-6 grid w-full grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6">
                <Link href="/store_admin/orders"
                className="w-full rounded-2xl bg-white px-5 py-8 sm:px-6 sm:py-14">
                <h2 className="text-xl font-bold">注文一覧</h2>
                <p className="mt-2 text-sm text-zinc-500">注文の一覧を表示します</p>
                </Link>
                <Link href="/store_admin/menus"
                className="w-full rounded-2xl bg-white px-5 py-8 sm:px-6 sm:py-14">
                <h2 className="text-xl font-bold">メニュー一覧</h2>
                <p className="mt-2 text-sm text-zinc-500">メニュー一覧を表示します</p>
                </Link>
                <Link href="/store_admin/coupons"
                className="w-full rounded-2xl bg-white px-5 py-8 sm:px-6 sm:py-14">
                <h2 className="text-xl font-bold">クーポン一覧</h2>
                <p className="mt-2 text-sm text-zinc-500">クーポン一覧を表示します</p>
                </Link>
                <Link href="/store_admin/customer"
                className="w-full rounded-2xl bg-white px-5 py-8 sm:px-6 sm:py-14">
                <h2 className="text-xl font-bold">顧客情報の閲覧</h2>
                <p className="mt-2 text-sm text-zinc-500">顧客情報の一覧を表示します</p>
                </Link>
                <Link href="/store_admin/history"
                className="w-full rounded-2xl bg-white px-5 py-8 sm:px-6 sm:py-14">
                <h2 className="text-xl font-bold">履歴一覧</h2>
                <p className="mt-2 text-sm text-zinc-500">履歴の一覧を表示します</p>
                </Link>
            </div>
            <div className="grid w-full grid-cols-1 gap-4 rounded-2xl bg-white p-4 sm:grid-cols-2 sm:gap-6 sm:p-5">
            <form action={updateShopStatus}>
                <input type="hidden" name="id" value={shopId} />
                <input type="hidden" name="is_accepted" value="false" />
                <PendingSubmitButton
                    idleLabel="注文の一時停止"
                    disabled={!accepting}
                    className={
                        accepting
                            ? "w-full rounded-xl border-2 border-[#E2584B] bg-white px-6 py-3 text-[#E2584B]"
                            : "w-full rounded-xl bg-[#E2584B] px-6 py-3 text-white hover:bg-[#E2584B]/80"
                    }
                />
            </form>
            <form action={updateShopStatus}>
                <input type="hidden" name="id" value={shopId} />
                <input type="hidden" name="is_accepted" value="true" />
                <PendingSubmitButton
                    idleLabel="注文受け入れ開始"
                    disabled={accepting}
                    className={
                        accepting
                            ? "w-full rounded-xl bg-[#E2584B] px-6 py-3 text-white hover:bg-[#E2584B]/80"
                            : "w-full rounded-xl border-2 border-[#E2584B] bg-white px-6 py-3 text-[#E2584B]"
                    }
                />
            </form>
            </div>
        </main>
    );
}
