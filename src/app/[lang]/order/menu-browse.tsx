"use client";

import { useState } from "react";
import Link from "next/link";
import { localizedText } from "@/i18n/localized";
import { MenuPhoto } from "@/app/lib/menu-image";
import { customerFixedBarClass } from "@/components/customer/shell";

const CATEGORY_NAMES = {
    set: "セット",
    main: "メイン",
    side: "サイド",
    drink: "ドリンク",
} as const;

type CategoryKind = keyof typeof CATEGORY_NAMES;

function parseKind(kind?: string): CategoryKind | null {
    return kind === "set" || kind === "main" || kind === "side" || kind === "drink" ? kind : null;
}

export type MenuBrowseItem = {
    id: string;
    name: string;
    name_en: string | null;
    price: number;
    image_url: string | null;
    category_name: string | null;
};

type Labels = {
    title: string;
    orderType: string;
    orderingSuffix: string;
    set: string;
    main: string;
    side: string;
    drink: string;
    cart: string;
};

export function MenuBrowse({
    items,
    lang,
    initialKind,
    menuPath,
    cartPath,
    labels,
}: {
    items: MenuBrowseItem[];
    lang: string;
    initialKind?: string;
    menuPath: string;
    cartPath: string;
    labels: Labels;
}) {
    const [filter, setFilter] = useState<CategoryKind | null>(() => parseKind(initialKind));
    const rows = filter
        ? items.filter((item) => item.category_name === CATEGORY_NAMES[filter])
        : items;

    function toggle(value: CategoryKind) {
        const next = filter === value ? null : value;
        setFilter(next);
        window.history.replaceState(null, "", next ? `${menuPath}?kind=${next}` : menuPath);
    }

    function tabClass(value: CategoryKind) {
        return filter === value
            ? "inline-flex min-w-[4.75rem] items-center justify-center rounded-full bg-black px-4 py-2 text-center text-white"
            : "inline-flex min-w-[4.75rem] items-center justify-center rounded-full bg-zinc-200 px-4 py-2 text-center text-black";
    }

    return (
        <main className="mx-auto w-full max-w-lg px-4 py-8 pb-28">
            <h1 className="mb-4 text-center text-2xl font-bold">{labels.title}</h1>
            <div className="-mx-4 mb-4 bg-[#F7F3EC] px-4 py-2.5 text-sm text-zinc-700">
                <span className="font-bold">{labels.orderType}</span>
                {labels.orderingSuffix}
            </div>
            <div className="mb-4 flex justify-start gap-2">
                <button type="button" aria-pressed={filter === "set"} className={tabClass("set")} onClick={() => toggle("set")}>
                    {labels.set}
                </button>
                <button type="button" aria-pressed={filter === "main"} className={tabClass("main")} onClick={() => toggle("main")}>
                    {labels.main}
                </button>
                <button type="button" aria-pressed={filter === "side"} className={tabClass("side")} onClick={() => toggle("side")}>
                    {labels.side}
                </button>
                <button type="button" aria-pressed={filter === "drink"} className={tabClass("drink")} onClick={() => toggle("drink")}>
                    {labels.drink}
                </button>
            </div>

            <ul className="grid grid-cols-2 gap-4">
                {rows.map((menu) => {
                    const title = localizedText(lang, menu.name, menu.name_en);
                    return (
                        <li key={menu.id} className="overflow-hidden rounded-2xl bg-[#EFEBE3] p-2">
                            <Link href={`${menuPath}/${menu.id}`}>
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
                    href={cartPath}
                    className="flex h-12 w-full items-center justify-center rounded-xl bg-[#E2584B] text-white"
                >
                    {labels.cart}
                </Link>
            </div>
        </main>
    );
}
