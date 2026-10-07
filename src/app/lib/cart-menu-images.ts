import { menuImageSrc } from "@/app/lib/menu-image";

type CartImageItem = {
  id: string;
  image_url: string;
};

export async function withCurrentMenuImages<T extends CartImageItem>(
  items: T[],
): Promise<T[]> {
  try {
    const res = await fetch("/api/menus");
    if (!res.ok) return items;
    const menus = (await res.json()) as CartImageItem[];
    const byId = new Map(menus.map((menu) => [menu.id, menu.image_url]));
    return items.map((item) => ({
      ...item,
      image_url: menuImageSrc(byId.get(item.id) ?? item.image_url) ?? "",
    }));
  } catch {
    return items.map((item) => ({
      ...item,
      image_url: menuImageSrc(item.image_url) ?? "",
    }));
  }
}
