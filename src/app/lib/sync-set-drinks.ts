import { db } from "@/db";
import {
  menu_categories,
  menus,
  setmenu,
  setmenu_option,
  setmenu_option_detail,
} from "@/db/schema";
import { and, eq, inArray, isNull } from "drizzle-orm";

export async function syncSetDrinkOptions() {
  const [category] = await db
    .select({ id: menu_categories.id })
    .from(menu_categories)
    .where(eq(menu_categories.name, "ドリンク"))
    .limit(1);
  if (!category) return;

  const sets = await db.select({ id: setmenu.id, menus_id: setmenu.menus_id }).from(setmenu);
  if (sets.length === 0) return;

  const setMenuIds = new Set(sets.map((row) => row.menus_id));
  const drinks = await db
    .select({ id: menus.id })
    .from(menus)
    .where(
      and(
        eq(menus.category_id, category.id),
        isNull(menus.deleted_at),
        eq(menus.is_accepted, true),
      ),
    );
  const drinkIds = drinks.map((row) => row.id).filter((id) => !setMenuIds.has(id));
  const drinkIdSet = new Set(drinkIds);

  for (const set of sets) {
    const options = await db
      .select()
      .from(setmenu_option)
      .where(eq(setmenu_option.setmenu_id, set.id));
    let drinkOptionId = options.find((option) => option.name === "ドリンク")?.id;
    if (!drinkOptionId) {
      drinkOptionId = crypto.randomUUID();
      await db.insert(setmenu_option).values({
        id: drinkOptionId,
        setmenu_id: set.id,
        name: "ドリンク",
      });
    }

    const details = await db
      .select({
        id: setmenu_option_detail.id,
        menus_id: setmenu_option_detail.menus_id,
      })
      .from(setmenu_option_detail)
      .where(eq(setmenu_option_detail.setmenu_option_id, drinkOptionId));

    const have = new Set(details.map((detail) => detail.menus_id));
    const missing = drinkIds.filter((id) => !have.has(id));
    if (missing.length > 0) {
      await db.insert(setmenu_option_detail).values(
        missing.map((menus_id) => ({
          id: crypto.randomUUID(),
          setmenu_option_id: drinkOptionId,
          menus_id,
          addprice: 0,
        })),
      );
    }

    const staleIds = details
      .filter((detail) => !drinkIdSet.has(detail.menus_id))
      .map((detail) => detail.id);
    if (staleIds.length > 0) {
      await db
        .delete(setmenu_option_detail)
        .where(inArray(setmenu_option_detail.id, staleIds));
    }
  }
}
