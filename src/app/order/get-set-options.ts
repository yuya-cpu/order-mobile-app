import { db } from "@/db";
import { menus, setmenu, setmenu_option, setmenu_option_detail } from "@/db/schema";
import { eq, inArray } from "drizzle-orm";

export type SetOption = {
  id: string;
  name: string;
  items: { id: string; name: string }[];
};

export async function getSetOptions(menuId: string): Promise<SetOption[]> {
  const [set] = await db
    .select()
    .from(setmenu)
    .where(eq(setmenu.menus_id, menuId))
    .limit(1);
  if (!set) return [];

  const options = await db
    .select()
    .from(setmenu_option)
    .where(eq(setmenu_option.setmenu_id, set.id));
  if (options.length === 0) return [];

  const details = await db
    .select({
      id: setmenu_option_detail.id,
      optionId: setmenu_option_detail.setmenu_option_id,
      name: menus.name,
    })
    .from(setmenu_option_detail)
    .innerJoin(menus, eq(menus.id, setmenu_option_detail.menus_id))
    .where(
      inArray(
        setmenu_option_detail.setmenu_option_id,
        options.map((option) => option.id),
      ),
    );

  return options.map((option) => ({
    id: option.id,
    name: option.name,
    items: details
      .filter((detail) => detail.optionId === option.id)
      .map((detail) => ({
        id: detail.id,
        name: detail.name,
      })),
  }));
}
