import { createMenu } from "../actions";
import { db } from "@/db";
import { menu_categories } from "@/db/schema";
import { connection } from "next/server";
import { MenuSubmitButton } from "../submit-button";
import { MenuImageInput } from "../image-input";

const defaultCategories = [
    { id: "33333333-3333-3333-3333-333333333331", name: "メイン" },
    { id: "33333333-3333-3333-3333-333333333332", name: "サイド" },
    { id: "33333333-3333-3333-3333-333333333333", name: "ドリンク" },
];

const fieldClass =
  "w-full rounded-full border border-zinc-200 bg-white px-5 py-3 outline-none placeholder:text-zinc-400";
const areaClass =
  "w-full rounded-2xl border border-zinc-200 bg-white px-5 py-3 outline-none placeholder:text-zinc-400";
const labelClass = "flex w-full flex-col gap-2 text-sm text-zinc-800";

export default async function NewMenuPage() {
    await connection();
    const existing = await db.select().from(menu_categories);
    const missing = defaultCategories.filter(
        (category) => !existing.some((row) => row.name === category.name),
    );
    if (missing.length > 0) {
        await db.insert(menu_categories).values(missing);
    }
    const categories = await db.select().from(menu_categories);
    const categoryOptions = defaultCategories
        .map((category) => categories.find((row) => row.name === category.name))
        .filter((row) => row != null);

    return (
        <div className="flex flex-1 justify-center px-6 py-10">
        <form action={createMenu} className="flex w-full max-w-2xl flex-col gap-6">
            <h1 className="text-center text-2xl font-bold">新しい料理の登録</h1>
            <div className="grid w-full grid-cols-2 gap-3">
                <span className="rounded-full bg-[#E2584B] py-3 text-center text-white">
                    単品
                </span>
                <a
                    href="/store_admin/menus/new-set"
                    className="rounded-full bg-[#F4F1EA] py-3 text-center text-zinc-700"
                >
                    セット
                </a>
            </div>
            <MenuImageInput required />
            <label className={labelClass}>
                商品名
                <input name="name" required placeholder="例: チーズバーガー" className={fieldClass} />
            </label>
            <label className={labelClass}>
                英語名
                <input name="name_en" placeholder="English name" className={fieldClass} />
            </label>
            <label className={labelClass}>
                カテゴリー
                <select name="category_id" required className={fieldClass}>
                    <option value="">例: メイン / サイド / ドリンク</option>
                    {categoryOptions.map((category) => (
                        <option key={category.id} value={category.id}>
                            {category.name}
                        </option>
                    ))}
                </select>
            </label>
            <label className={labelClass}>
                価格（税込）
                <div className="flex items-center gap-3">
                    <input name="price" required placeholder="例: 500" className={fieldClass} />
                    <span className="shrink-0 text-zinc-700">円</span>
                </div>
            </label>
            <label className={labelClass}>
                説明
                <textarea
                    name="description"
                    required
                    placeholder="商品の特徴やアレルギーを入力"
                    className={areaClass}
                />
            </label>
            <label className={labelClass}>
                英語説明
                <textarea name="description_en" placeholder="Description" className={areaClass} />
            </label>

            <div className="flex w-full gap-3 pt-2">
                <a
                    href="/store_admin/menus"
                    className="flex flex-1 items-center justify-center rounded-full bg-white py-4 text-zinc-800"
                >
                    戻る
                </a>
                <MenuSubmitButton idleLabel="メニュー登録" />
            </div>
        </form>
        </div>
    )
}
