import { db } from "@/db";
import { menus, setmenu } from "@/db/schema";
import { and, eq, isNull } from "drizzle-orm";
import Link from "next/link";
import { shopIsOpen } from "../shop-status";

export default async function MenusPage({
    searchParams,
}: {
    searchParams: Promise<{ kind?: string }>;
}) {
    const kind = (await searchParams).kind;
    const filter = kind === "set" || kind === "single" ? kind : "all";

    if (!(await shopIsOpen())) {
        return (
            <main className="flex min-h-screen items-center justify-center px-4">
                <p className="text-center text-lg font-bold">ただいま注文を停止しています</p>
            </main>
        );
    }

    const query = db
        .select({
            id: menus.id,
            name: menus.name,
            price: menus.price,
            image_url: menus.image_url,
            is_accepted: menus.is_accepted,
        })
        .from(menus)
        .leftJoin(setmenu, eq(setmenu.menus_id, menus.id))
        .where(
            filter === "set"
                ? and(isNull(menus.deleted_at), eq(menus.is_accepted, true), eq(setmenu.menus_id, menus.id))
                : filter === "single"
                    ? and(isNull(menus.deleted_at), eq(menus.is_accepted, true), isNull(setmenu.id))
                    : and(isNull(menus.deleted_at), eq(menus.is_accepted, true)),
        );

    const rows = await query;

    function tabClass(value: "all" | "set" | "single") {
        return filter === value
            ? "rounded-full bg-[#E2584B] px-4 py-2 text-white"
            : "rounded-full py-2";
    }

    return (
        <main className="max-w py-8 max-auto px-4">
                <div className="mb-6 grid grid-cols-3 items-center">
  <Link href="/order/order-type" className="justify-self-start text-[#E2584B]">
    オーダータイプを選択
  </Link>
  <h1 className="text-center text-2xl font-bold">メニュー</h1>
  <span aria-hidden="true" />
</div>
                <div className="flex flex-row gap-8">
                    <Link href="/order/here" className={tabClass("all")}>すべて</Link>
                    <Link href="/order/here?kind=set" className={tabClass("set")}>セット</Link>
                    <Link href="/order/here?kind=single" className={tabClass("single")}>単品</Link>
                </div>

                <ul className="grid grid-cols-2 gap-4">
                    {rows.map((menu) => (
                        <li
                            key={menu.id}
                            className="overflow-hidden rounded-2xl bg-[#EFEBE3] p-2"
                        >
                            <Link href={`/order/here/${menu.id}`}>
                            <img
                                src={menu.image_url}
                                alt={menu.name}
                                className="h-28 w-full rounded-xl object-cover"
                            />
                            <p className="text-sm font-bold">{menu.name}</p>
                            <p className="text-sm text-gray-500">￥{menu.price}</p>
                            </Link>
                        </li>
                    ))}
                </ul>
            
            <div className="fixed bottom-0 left-0 right-0 bg-white p-4">
                <Link href="/order/here/cart" className="w-full rounded-full bg-[#E2584B] py-2 text-white">
    <button type="button" className="w-full rounded-full bg-[#E2584B] py-2 text-white">カートを見る</button>
    </Link>
    </div>
        </main>
    );
}
