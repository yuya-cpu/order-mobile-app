import Link from "next/link";
import { updateShopStatus } from "./actions";
import { db } from "@/db";
import { shops } from "@/db/schema";
import { eq } from "drizzle-orm";

const shopId = "11111111-1111-1111-1111-111111111111";

export default async function AdminHomePage() {
    const shop = await db.query.shops.findFirst({
        where: eq(shops.id, shopId),
    });

    const accepting = shop?.is_accepted === true;

    return (
        <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col items-center justify-center px-4 py-10">
            <div className="mb-8 grid w-full grid-cols-2 gap-6">
                <Link href="/store_admin/orders"
                className="w-full rounded-2xl  px-6 py-14 bg-white">
                <h2 className="text-xl font-bold">注文一覧</h2>
                <p className="mt-2 text-sm text-zinc-500">注文の一覧を表示します</p>
                </Link>
                <Link href="/store_admin/orders"
                className="w-full rounded-2xl px-6 py-14 bg-white">
                <h2 className="text-xl font-bold">メニュー一覧</h2>
                <p className="mt-2 text-sm text-zinc-500">メニュー一覧を表示します</p>
                </Link>
                <Link href="/store_admin/coupons"
                className="w-full rounded-2xl px-6 py-14 bg-white">
                <h2 className="text-xl font-bold">クーポン一覧</h2>
                <p className="mt-2 text-sm text-zinc-500">クーポン一覧を表示します</p>
                </Link>
                <Link href="/store_admin/orders"
                className="w-full rounded-2xl px-6 py-14 bg-white">
                <h2 className="text-xl font-bold">顧客情報の閲覧</h2>
                <p className="mt-2 text-sm text-zinc-500">顧客情報の一覧を表示します</p>
                </Link>
                <Link href="/store_admin/history"
                className="w-full rounded-2xl px-6 py-14 bg-white">
                <h2 className="text-xl font-bold">履歴一覧</h2>
                <p className="mt-2 text-sm text-zinc-500">履歴の一覧を表示します</p>
                </Link>
            </div>
            <div className="grid w-full grid-cols-2 gap-6">
            <form action={updateShopStatus}>
                <input type="hidden" name="id" value={shopId} />
                <input type="hidden" name="is_accepted" value="false" />
                <button
                    type="submit"
                    disabled={!accepting}
                    className={
                        accepting
                            ? "w-full rounded-2xl border-2 border-zinc-300 bg-white px-6 py-3 text-zinc-400"
                            : "w-full rounded-2xl bg-[#E2584B] px-6 py-3 text-white hover:bg-[#E2584B]/80"
                    }
                >
                    注文の一時停止
                </button>
            </form>
            <form action={updateShopStatus}>
                <input type="hidden" name="id" value={shopId} />
                <input type="hidden" name="is_accepted" value="true" />
                <button
                    type="submit"
                    disabled={accepting}
                    className={
                        accepting
                            ? "w-full rounded-2xl bg-[#E2584B] px-6 py-3 text-white hover:bg-[#E2584B]/80"
                            : "w-full rounded-2xl border-2 border-zinc-300 bg-white px-6 py-3 text-zinc-400"
                    }
                >
                    注文受け入れ開始
                </button>
            </form>
            </div>
        </main>
    );
}
