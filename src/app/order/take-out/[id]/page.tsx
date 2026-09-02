import { db } from "@/db";
import { menus } from "@/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { AddToCart } from "./add-to-cart";
import Link from "next/link";


export default async function MenuDetailPage({
    params,
  }: {
    params: Promise<{ id: string }>;
  }) {
      const { id } = await params;
  
      const menu = await db.query.menus.findFirst({
        where: eq(menus.id, id),
        columns: {
          id: true,
          name: true,
          description: true,
          image_url: true,
          price: true,
        },
      });
    if (!menu) {
        notFound();
    }
    return (
        <main className="mx-auto max-w-screen-lg px-4 py-16 flex flex-col items-center justify-center">
            <header className="mb-6 w-full">
            <Link href="/order/take-out" className="left-0 text-[#E2584B]">
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
            />
        </main>
        );
    }
