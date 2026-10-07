import { db } from "@/db";
import { menus } from "@/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { AddToCart } from "./add-to-cart";
import { getSetOptions } from "../../get-set-options";
import { shopIsOpen } from "../../shop-status";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { localizedText } from "@/i18n/localized";
import { isMenuId, menuImageSrc, MenuPhoto } from "@/app/lib/menu-image";


export default async function MenuDetailPage({
    params,
  }: {
    params: Promise<{ lang: string; id: string }>;
  }) {
      const { lang, id } = await params;
      if (!isLocale(lang) || !isMenuId(id)) notFound();
      const dict = await getDictionary(lang);

      if (!(await shopIsOpen())) {
          return (
              <main className="flex min-h-screen items-center justify-center px-4">
                  <p className="text-center text-lg font-bold">{dict.common.closed}</p>
              </main>
          );
      }
  
      const menu = await db.query.menus.findFirst({
        where: eq(menus.id, id),
        columns: {
          id: true,
          name: true,
          name_en: true,
          description: true,
          description_en: true,
          image_url: true,
          price: true,
          is_accepted: true,
        },
      });
    if (!menu || !menu.is_accepted) {
        notFound();
    }
    const options = await getSetOptions(menu.id, lang);
    const title = localizedText(lang, menu.name, menu.name_en);
    const description = localizedText(lang, menu.description, menu.description_en);
    return (
        <main className="mx-auto flex w-full flex-col px-4 py-6 pb-28">
            <MenuPhoto url={menu.image_url} alt={title} className="mb-4 h-48 w-full rounded-xl object-cover" />
            <h1 className="mb-2 text-center text-2xl font-bold">{title}</h1>
            <p className="mb-4 text-center text-sm text-gray-500">{description}</p>
            
            <AddToCart
                id={menu.id}
                name={title}
                price={menu.price}
                image_url={menu.image_url}
                options={options}
            />
        </main>
        );
    }
