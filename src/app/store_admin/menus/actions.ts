"use server";

import { db } from "../../../db";
import { revalidatePath } from "next/cache";
import { menus } from "../../../db/schema";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";

const shopId ="11111111-1111-1111-1111-111111111111";

export async function createMenu(formData: FormData) {
    const name = String(formData.get("name"));
    const description = String(formData.get("description"));
    const imageUrl = String(formData.get("image"));
    const price = Number(formData.get("price"));
    const categoryId = String(formData.get("category_id"));

    if (!name || !description || !imageUrl || !price || !categoryId) {
        throw new Error("名前、説明、画像、価格、カテゴリーは必須です");
    }

    await db.insert(menus).values({
        id: crypto.randomUUID(),
        name,
        description,
        price,
        image_url: imageUrl,
        shop_id: shopId,
        category_id: categoryId,
        is_accepted: true,
    });

    revalidatePath("/store_admin/menus");
    redirect("/store_admin/menus");
}

export async function toggleMenuAccepted(id: string) {
    const menu = await db.select().from(menus).where(eq(menus.id, id)).limit(1);
    await db.update(menus).set({
        is_accepted: !menu[0].is_accepted,
    }).where(eq(menus.id, id));
    revalidatePath("/store_admin/menus");
}


export async function updateMenu(formData: FormData) {
    const id = String(formData.get("id"));
    const name = String(formData.get("name"));
    const description = String(formData.get("description"));
    const imageUrl = String(formData.get("image"));
    const price = Number(formData.get("price"));

    if (!id || !name || !description || !imageUrl || !price) {
        throw new Error("ID、名前、説明、画像、価格は必須です");
    }

    await db.update(menus).set({
        name,
        description,
        image_url: imageUrl,
        price,
    }).where(eq(menus.id, id));

    revalidatePath("/store_admin/menus");
    redirect("/store_admin/menus");
}