import { db } from "@/db";
import { menu_categories, menus, setmenu } from "@/db/schema";
import { eq, isNull, sql } from "drizzle-orm";
import { connection } from "next/server";
import { SetMenuForm } from "./setMenuForm";

const defaultCategories = [
    { id: "33333333-3333-3333-3333-333333333331", name: "メイン" },
    { id: "33333333-3333-3333-3333-333333333332", name: "サイド" },
    { id: "33333333-3333-3333-3333-333333333333", name: "ドリンク" },
];

export default async function NewSetMenuPage() {
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
    .filter((row) => row != null)
    .map((row) => ({ id: row.id, name: row.name }));

  const setRows = await db.select({ menus_id: setmenu.menus_id }).from(setmenu);
  const setIds = new Set(setRows.map((row) => row.menus_id));
  const rows = await db
    .select({
      id: menus.id,
      name: menus.name,
      price: menus.price,
      category_name: sql<string | null>`${menu_categories.name}`.as("category_name"),
    })
    .from(menus)
    .leftJoin(menu_categories, eq(menus.category_id, menu_categories.id))
    .where(isNull(menus.deleted_at));

  const items = rows
    .filter((row) => !setIds.has(row.id))
    .map((row) => ({
      id: row.id,
      name: row.name,
      price: row.price,
      category_name: row.category_name ?? "",
    }));

  if (items.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center px-4 py-8">
        <div className="mx-auto flex w-full max-w-md flex-col items-center gap-4">
          <h1 className="text-center font-bold text-2xl">新しいセットの登録</h1>
          <div className="grid w-full grid-cols-2 gap-4">
            <a
              href="/store_admin/menus/new"
              className="w-full rounded-md px-4 py-3 text-center bg-gray-200 text-gray-700"
            >
              単品
            </a>
            <span className="w-full rounded-md px-4 py-3 text-center bg-[#E2584B] text-white">
              セット
            </span>
          </div>
          <p className="text-sm text-gray-500">先に単品メニューを登録してください</p>
          <a
            href="/store_admin/menus/new"
            className="flex w-full items-center justify-center rounded-full bg-[#E2584B] px-4 py-2 text-sm text-white"
          >
            メニュー登録へ
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 items-center justify-center px-4 py-8">
      <SetMenuForm items={items} categories={categoryOptions} />
    </div>
  );
}
