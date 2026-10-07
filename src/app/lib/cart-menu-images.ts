import { menuImageSrc } from "@/app/lib/menu-image";

type CartImageItem = {
  id: string;
  image_url: string;
  category_id?: string | null;
};

type MenuRow = {
  id: string;
  image_url: string;
  category_id: string | null;
};

export async function withCurrentMenuImages<T extends CartImageItem>(
  items: T[],
): Promise<T[]> {
  try {
    const res = await fetch("/api/menus");
    if (!res.ok) return items;
    const menus = (await res.json()) as MenuRow[];
    const byId = new Map(menus.map((menu) => [menu.id, menu]));
    return items.map((item) => {
      const menu = byId.get(item.id);
      return {
        ...item,
        image_url: menuImageSrc(menu?.image_url ?? item.image_url) ?? "",
        category_id: menu?.category_id ?? item.category_id ?? null,
      };
    });
  } catch {
    return items.map((item) => ({
      ...item,
      image_url: menuImageSrc(item.image_url) ?? "",
    }));
  }
}
