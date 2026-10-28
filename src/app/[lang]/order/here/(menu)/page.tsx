import { db } from "@/db";
import { menu_categories, menus } from "@/db/schema";
import { and, eq, isNull } from "drizzle-orm";
import { shopIsOpen } from "../../shop-status";
import { customerPath, isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { notFound } from "next/navigation";
import { MenuBrowse } from "../../menu-browse";

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
    const { kind } = await searchParams;

    if (!(await shopIsOpen())) {
        return (
            <main className="flex min-h-screen items-center justify-center px-4">
                <p className="text-center text-lg font-bold">{dict.common.closed}</p>
            </main>
        );
    }

    const rows = await db
        .select({
            id: menus.id,
            name: menus.name,
            name_en: menus.name_en,
            price: menus.price,
            image_url: menus.image_url,
            category_name: menu_categories.name,
        })
        .from(menus)
        .leftJoin(menu_categories, eq(menus.category_id, menu_categories.id))
        .where(and(isNull(menus.deleted_at), eq(menus.is_accepted, true)))
        .orderBy(menus.created_at);

    return (
        <MenuBrowse
            items={rows}
            lang={lang}
            initialKind={kind}
            menuPath={customerPath(lang, "/order/here")}
            cartPath={customerPath(lang, "/order/here/cart")}
            labels={{
                title: dict.menu.title,
                orderType: dict.orderType.here,
                orderingSuffix: dict.menu.orderingSuffix,
                set: dict.menu.set,
                main: dict.menu.main,
                side: dict.menu.side,
                drink: dict.menu.drink,
                cart: dict.menu.cart,
            }}
        />
    );
}
