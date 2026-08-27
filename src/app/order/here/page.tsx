import { db } from "../../../db";
import { menus } from "../../../db/schema";
import { isNull } from "drizzle-orm";
import Link from "next/link";

export default async function MenusPage() {
    const rows = await db.select({
        id: menus.id,
        name: menus.name,
        price: menus.price,
        image_url: menus.image_url,
        is_accepted: menus.is_accepted,
    })
    .from(menus)
    .where(isNull(menus.deleted_at));

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
                    <span className="rounded-full py-2">すべて</span>
                    <span className="rounded-full py-2">セット</span>
                    <span className="rounded-full py-2">単品</span>
                </div>

                <ul className="grid grid-cols-2 gap-4">
                    {rows.map((menu) => (
                        <li
                            key={menu.id}
                            className={
                                menu.is_accepted
                                    ? "overflow-hidden rounded-2xl bg-[#EFEBE3] p-2"
                                    : "overflow-hidden rounded-2xl bg-[#EFEBE3] p-2 opacity-40"
                            }
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
                <Link href="/order/take-out/cart" className="w-full rounded-full bg-[#E2584B] py-2 text-white">
    <button type="button" className="w-full rounded-full bg-[#E2584B] py-2 text-white">カートを見る</button>
    </Link>
    </div>
        </main>
    );
}

