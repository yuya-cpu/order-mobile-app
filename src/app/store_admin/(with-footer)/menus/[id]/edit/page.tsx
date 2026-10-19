import { updateMenu, deleteMenu } from "../../actions";
import { db } from "@/db";
import { notFound } from "next/navigation";
import { menus } from "@/db/schema";
import { eq } from "drizzle-orm";
import { MenuImageInput } from "../../image-input";
import { PendingSubmitButton } from "@/components/admin/pending-submit-button";

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
        name_en: true,
        description: true,
        description_en: true,
        image_url: true,
        price: true,
      },
    });

    if (!menu) {
        notFound();
    }
    return (
        <div className="flex flex-1 items-center justify-center px-4 py-8">
        <div className="mx-auto flex w-full max-w-2xl flex-col items-center gap-4 rounded-2xl bg-white p-6 shadow-sm">
            <div className="flex w-full items-center justify-between gap-4">
                <h1 className="font-bold text-2xl">メニューの編集</h1>
                <form action={deleteMenu}>
                    <input name="id" type="hidden" value={menu.id} />
                    <PendingSubmitButton
                        idleLabel="削除"
                        pendingLabel="削除中..."
                        className="rounded-xl bg-[#F8E8E6] px-4 py-1.5 text-sm text-[#E2584B] disabled:opacity-50"
                    />
                </form>
            </div>
            <form action={updateMenu} className="flex w-full flex-col items-center gap-4">
            <input name="id" type="hidden" value={menu.id} />
            <input name="current_image" type="hidden" value={menu.image_url} />
            <label className="flex w-full flex-col gap-1 font-medium">
                画像
                <MenuImageInput />
            </label>
            <label className="flex w-full flex-col gap-1 font-medium">
                商品名
                <input name="name" required className="border border-gray-300 rounded-md p-2" defaultValue={menu.name} />
            </label>
            <label className="flex w-full flex-col gap-1 font-medium">
                英語名
                <input name="name_en" className="border border-gray-300 rounded-md p-2" defaultValue={menu.name_en ?? ""} />
            </label>
            <label className="flex w-full flex-col gap-1 font-medium">
                価格（税込）
                <input name="price" required className="border border-gray-300 rounded-md p-2" defaultValue={menu.price} />
            </label>
            <label className="flex w-full flex-col gap-1 font-medium">
                説明
                <textarea name="description" required className="border border-gray-300 rounded-md p-2" defaultValue={menu.description} />
            </label>
            <label className="flex w-full flex-col gap-1 font-medium">
                英語説明
                <textarea name="description_en" className="border border-gray-300 rounded-md p-2" defaultValue={menu.description_en ?? ""} />
            </label>

            <div className="flex w-full gap-3">
                <a
                    href="/store_admin/menus"
                    className="flex flex-1 items-center justify-center rounded-xl bg-zinc-100 px-4 py-2 text-sm text-zinc-700"
                >
                    一覧に戻る
                </a>
                <PendingSubmitButton
                    idleLabel="更新"
                    pendingLabel="更新中..."
                    className="flex flex-1 items-center justify-center rounded-xl bg-[#E2584B] px-4 py-2 text-sm text-white disabled:opacity-50"
                />
            </div>
            </form>
        </div>
        </div>
    );
}
