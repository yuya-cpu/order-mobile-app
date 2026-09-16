import { updateMenu, deleteMenu } from "../../actions";
import { db } from "@/db";
import { notFound } from "next/navigation";
import { menus } from "@/db/schema";
import { eq } from "drizzle-orm";

export default async function EditMenuPage({
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
        <div className="flex flex-1 items-center justify-center px-4 py-8">
        <form action={updateMenu} className="mx-auto flex w-full max-w-md flex-col items-center gap-4">
            <div className="flex w-full items-center justify-between gap-4">
                <h1 className="font-bold text-2xl">メニューの編集</h1>
                <button
                    type="submit"
                    form="delete-menu"
                    className="rounded-full bg-[#F8E8E6] px-4 py-1.5 text-sm text-[#E2584B]"
                >
                    削除
                </button>
            </div>
            <input name="id" type="hidden" value={menu.id} />
            <input name="current_image" type="hidden" value={menu.image_url} />
            <label className="flex w-full flex-col gap-1 font-medium">
                画像
                <input name="image" type="file" accept="image/*" className="border border-gray-300 rounded-md p-2" />
            </label>
            <label className="flex w-full flex-col gap-1 font-medium">
                商品名
                <input name="name" required className="border border-gray-300 rounded-md p-2" defaultValue={menu.name} />
            </label>
            <label className="flex w-full flex-col gap-1 font-medium">
                価格（税込）
                <input name="price" required className="border border-gray-300 rounded-md p-2" defaultValue={menu.price} />
            </label>
            <label className="flex w-full flex-col gap-1 font-medium">
                説明
                <textarea name="description" required className="border border-gray-300 rounded-md p-2" defaultValue={menu.description} />
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
                    更新
                </button>
            </div>
        </form>
        <form id="delete-menu" action={deleteMenu}>
            <input name="id" type="hidden" value={menu.id} />
        </form>
        </div>
    );
}
