import { db } from "@/db";
import { menus, setmenu } from "@/db/schema";
import { and, eq, isNull } from "drizzle-orm";
import Link from "next/link";
import { shopIsOpen } from "../shop-status";
import { customerPath, isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { notFound } from "next/navigation";
import { localizedText } from "@/i18n/localized";
import { MenuPhoto } from "@/app/lib/menu-image";
import { customerFixedBarClass } from "@/components/customer/shell";

export default async function MenusPage({
    params,
    searchParams,
}: {
    params: Promise<{ lang: string }>;
    searchParams: Promise<{ kind?: string }>;
}) {
    const { lang } = await params;
    if (!isLocale(lang)) notFound();
    const dict = await getDictionary(lang);
    const kind = (await searchParams).kind;
    const filter = kind === "set" || kind === "single" ? kind : "all";

    if (!(await shopIsOpen())) {
        return (
            <main className="flex min-h-screen items-center justify-center px-4">
                <p className="text-center text-lg font-bold">{dict.common.closed}</p>
            </main>
        );
    }

    const query = db
        .select({
            id: menus.id,
            name: menus.name,
            name_en: menus.name_en,
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
            ? "inline-flex min-w-[4.75rem] items-center justify-center rounded-full bg-black px-4 py-2 text-center text-white"
            : "inline-flex min-w-[4.75rem] items-center justify-center rounded-full bg-zinc-200 px-4 py-2 text-center text-black";
    }

    return (
        <main className="mx-auto w-full max-w-lg px-4 py-8 pb-28">
                <h1 className="mb-6 text-center text-2xl font-bold">{dict.menu.title}</h1>
                <div className="mb-4 flex justify-start gap-2">
                    <Link href={customerPath(lang, "/order/take-out")} className={tabClass("all")}>{dict.menu.all}</Link>
                    <Link href={`${customerPath(lang, "/order/take-out")}?kind=set`} className={tabClass("set")}>{dict.menu.set}</Link>
                    <Link href={`${customerPath(lang, "/order/take-out")}?kind=single`} className={tabClass("single")}>{dict.menu.single}</Link>
                </div>

                <ul className="grid grid-cols-2 gap-4">
                    {rows.map((menu) => {
                        const title = localizedText(lang, menu.name, menu.name_en);
                        return (
                        <li
                            key={menu.id}
                            className="overflow-hidden rounded-2xl bg-[#EFEBE3] p-2"
                        >
                            <Link href={customerPath(lang, `/order/take-out/${menu.id}`)}>
                            <MenuPhoto
                                url={menu.image_url}
                                alt={title}
                                className="h-28 w-full rounded-xl object-cover"
                            />
                            <p className="mt-2.5 text-sm font-bold">{title}</p>
                            <p className="text-base font-bold text-[#E2584B]">￥{menu.price}</p>
                            </Link>
                        </li>
                        );
                    })}
                </ul>
            
            <div className={`${customerFixedBarClass} bg-white p-4 pb-[calc(1rem+env(safe-area-inset-bottom))]`}>
                <Link
                    href={customerPath(lang, "/order/take-out/cart")}
                    className="flex h-12 w-full items-center justify-center rounded-xl bg-[#E2584B] text-white"
                >
                    {dict.menu.cart}
                </Link>
            </div>
        </main>
    );
}
