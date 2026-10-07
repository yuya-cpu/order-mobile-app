import { db } from "@/db";
import { menus, setmenu, setmenu_option, setmenu_option_detail } from "@/db/schema";
import { and, eq, inArray, isNull } from "drizzle-orm";
import { localizedText } from "@/i18n/localized";
import { syncSetDrinkOptions } from "@/app/lib/sync-set-drinks";

export type SetOption = {
  id: string;
  name: string;
  items: { id: string; name: string; description: string }[];
};

export async function getSetOptions(menuId: string, lang = "ja"): Promise<SetOption[]> {
  await syncSetDrinkOptions();
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
      name_en: menus.name_en,
      description: menus.description,
      description_en: menus.description_en,
    })
    .from(setmenu_option_detail)
    .innerJoin(menus, eq(menus.id, setmenu_option_detail.menus_id))
    .where(
      and(
        inArray(
          setmenu_option_detail.setmenu_option_id,
          options.map((option) => option.id),
        ),
        isNull(menus.deleted_at),
        eq(menus.is_accepted, true),
      ),
    );

  return options.map((option) => ({
    id: option.id,
    name: option.name,
    items: details
      .filter((detail) => detail.optionId === option.id)
      .sort((a, b) => a.name.localeCompare(b.name, "ja"))
      .map((detail) => ({
        id: detail.id,
        name: localizedText(lang, detail.name, detail.name_en),
        description: localizedText(lang, detail.description, detail.description_en),
      })),
  }));
}
