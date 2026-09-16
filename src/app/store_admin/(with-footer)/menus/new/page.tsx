import { createMenu } from "../actions";
import { db } from "@/db";
import { menu_categories } from "@/db/schema";
import { connection } from "next/server";

const defaultCategories = [
    { id: "33333333-3333-3333-3333-333333333331", name: "メイン" },
    { id: "33333333-3333-3333-3333-333333333332", name: "サイド" },
    { id: "33333333-3333-3333-3333-333333333333", name: "ドリンク" },
];

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
        <div className="flex flex-1 items-center justify-center px-4 py-8">
        <form action={createMenu} className="mx-auto flex w-full max-w-md flex-col items-center gap-4">
            <h1 className="text-center font-bold text-2xl">新しい料理の登録</h1>
            <div className="grid w-full grid-cols-2 gap-4">
                <span className="w-full rounded-md px-4 py-3 text-center bg-[#E2584B] text-white">
                    単品
                </span>
                <a
                    href="/store_admin/menus/new-set"
                    className="w-full rounded-md px-4 py-3 text-center bg-gray-200 text-gray-700"
                >
                    セット
                </a>
            </div>
            <label className="flex w-full flex-col gap-1 font-medium">
                画像
                <input name="image" type="file" accept="image/*" required className="border border-gray-300 rounded-md p-2" />
            </label>
            <label className="flex w-full flex-col gap-1 font-medium">
                商品名
                <input name="name" required className="border border-gray-300 rounded-md p-2" />
            </label>
            <label className="flex w-full flex-col gap-1 font-medium">
                カテゴリー
                <select name="category_id" required className="border border-gray-300 rounded-md p-2">
                    <option value="">選択してください</option>
                    {categoryOptions.map((category) => (
                        <option key={category.id} value={category.id}>
                            {category.name}
                        </option>
                    ))}
                </select>
            </label>
            <label className="flex w-full flex-col gap-1 font-medium">
                価格（税込）
                <input name="price" required className="border border-gray-300 rounded-md p-2" />
            </label>
            <label className="flex w-full flex-col gap-1 font-medium">
                説明
                <textarea name="description" required className="border border-gray-300 rounded-md p-2" />
            </label>

            <div className="flex w-full gap-3">
                <a
                    href="/store_admin/menus"
                    className="flex flex-1 items-center justify-center rounded-full bg-zinc-100 px-4 py-2 text-sm text-zinc-700"
                >
                    一覧に戻る
                </a>
                <button
                    type="submit"
                    className="flex flex-1 items-center justify-center rounded-full bg-[#E2584B] px-4 py-2 text-sm text-white"
                >
                    メニュー登録
                </button>
            </div>
        </form>
        </div>
    )
}
