import { db } from "@/db";
import { menus } from "@/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { AddToCart } from "./add-to-cart";
import { getSetOptions } from "../../get-set-options";
import { shopIsOpen } from "../../shop-status";


export default async function MenuDetailPage({
    params,
  }: {
    params: Promise<{ id: string }>;
  }) {
      const { id } = await params;

      if (!(await shopIsOpen())) {
          return (
              <main className="flex min-h-screen items-center justify-center px-4">
                  <p className="text-center text-lg font-bold">ただいま注文を停止しています</p>
              </main>
          );
      }
  
      const menu = await db.query.menus.findFirst({
        where: eq(menus.id, id),
        columns: {
          id: true,
          name: true,
          description: true,
          image_url: true,
          price: true,
          is_accepted: true,
        },
      });
    if (!menu || !menu.is_accepted) {
        notFound();
    }
    const options = await getSetOptions(menu.id);
    return (
        <main className="mx-auto max-w-screen-lg px-4 py-16 flex flex-col items-center justify-center">
            <header className="mb-6 w-full">
            <Link href="/order/here" className="left-0 text-[#E2584B]">
                戻る
             </Link>
             </header>
            <img src={menu.image_url} alt={menu.name} className="w-full h-96 object-cover rounded-xl mb-8" />
            <h1 className="text-2xl font-bold mb-4">{menu.name}</h1>
            <p className="text-sm text-gray-500 mb-4">{menu.description}</p>
            
            <AddToCart
                id={menu.id}
                name={menu.name}
                price={menu.price}
                image_url={menu.image_url}
                options={options}
            />
        </main>
        );
    }
