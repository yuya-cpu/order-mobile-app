"use server";

import { requireStoreAdmin } from "@/app/lib/store-admin";
import { db } from "@/db";
import { revalidatePath } from "next/cache";
import { menu_categories, menus, setmenu, setmenu_option, setmenu_option_detail } from "@/db/schema";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { customerPath, locales } from "@/i18n/config";
import { optionalEnglish } from "@/i18n/localized";
import { imageUrlFromForm } from "@/app/lib/menu-image-upload";
import { syncSetDrinkOptions } from "@/app/lib/sync-set-drinks";

const shopId ="11111111-1111-1111-1111-111111111111";

// セット商品に自動で付けるカテゴリ。単品用の メイン/サイド/ドリンク とは別枠で、
// クーポンの「カテゴリ対象」でセット全体を指定できるようにする。
const SET_CATEGORY = { id: "33333333-3333-3333-3333-333333333334", name: "セット" };

async function ensureSetCategoryId() {
    const [existing] = await db
        .select({ id: menu_categories.id })
        .from(menu_categories)
        .where(eq(menu_categories.name, SET_CATEGORY.name))
        .limit(1);
    if (existing) return existing.id;
    await db.insert(menu_categories).values(SET_CATEGORY);
    return SET_CATEGORY.id;
}

export async function createMenu(formData: FormData) {
    await requireStoreAdmin();
    const name = String(formData.get("name"));
    const nameEn = optionalEnglish(formData.get("name_en"));
    const description = String(formData.get("description"));
    const descriptionEn = optionalEnglish(formData.get("description_en"));
    const imageUrl = await imageUrlFromForm(formData);
    const price = Number(formData.get("price"));
    const categoryId = String(formData.get("category_id"));

    if (!name || !description || !imageUrl || !price || !categoryId) {
        throw new Error("名前、説明、画像、価格、カテゴリーは必須です");
    }

    await db.insert(menus).values({
        id: crypto.randomUUID(),
        name,
        name_en: nameEn,
        description,
        description_en: descriptionEn,
        price,
        image_url: imageUrl,
        shop_id: shopId,
        category_id: categoryId,
        is_accepted: true,
    });

    await syncSetDrinkOptions();

    revalidatePath("/store_admin/menus");
    revalidatePath("/store_admin/menus/new-set");
    for (const lang of locales) {
      revalidatePath(customerPath(lang, "/order/take-out"));
      revalidatePath(customerPath(lang, "/order/here"));
    }
    redirect("/store_admin/menus");
}

type SetOptionInput = {
    name: string;
    items: { menus_id: string }[];
};

export async function createSetMenu(formData: FormData) {
    await requireStoreAdmin();
    const name = String(formData.get("name"));
    const nameEn = optionalEnglish(formData.get("name_en"));
    const description = String(formData.get("description"));
    const descriptionEn = optionalEnglish(formData.get("description_en"));
    const imageUrl = await imageUrlFromForm(formData);
    const price = Number(formData.get("price"));
    const rawOptions = String(formData.get("options") ?? "[]");

    let options: SetOptionInput[] = [];
    try {
        options = JSON.parse(rawOptions) as SetOptionInput[];
    } catch {
        throw new Error("セット内容が不正です");
    }

    const validOptions = options
        .map((option) => ({
            name: String(option.name ?? "").trim(),
            items: (option.items ?? []).filter((item) => item.menus_id),
        }))
        .filter((option) => option.name && option.items.length > 0);

    if (!name || !description || !imageUrl || !price || validOptions.length === 0) {
        throw new Error("名前、説明、画像、価格、セット内容は必須です");
    }

    const menuId = crypto.randomUUID();
    const setId = crypto.randomUUID();
    const setCategoryId = await ensureSetCategoryId();

    await db.insert(menus).values({
        id: menuId,
        name,
        name_en: nameEn,
        description,
        description_en: descriptionEn,
        price,
        image_url: imageUrl,
        shop_id: shopId,
        category_id: setCategoryId,
        is_accepted: true,
    });

    await db.insert(setmenu).values({
        id: setId,
        menus_id: menuId,
    });

    for (const option of validOptions) {
        const optionId = crypto.randomUUID();
        await db.insert(setmenu_option).values({
            id: optionId,
            setmenu_id: setId,
            name: option.name,
        });
        await db.insert(setmenu_option_detail).values(
            option.items.map((item) => ({
                id: crypto.randomUUID(),
                setmenu_option_id: optionId,
                menus_id: item.menus_id,
                addprice: 0,
            })),
        );
    }

    await syncSetDrinkOptions();

    revalidatePath("/store_admin/menus");
    revalidatePath("/store_admin/menus/new-set");
    for (const lang of locales) {
      revalidatePath(customerPath(lang, "/order/take-out"));
      revalidatePath(customerPath(lang, "/order/here"));
    }
    redirect("/store_admin/menus");
}

export async function toggleMenuAccepted(id: string) {
    await requireStoreAdmin();
    const menu = await db.query.menus.findFirst({
        where: eq(menus.id, id),
    });
if (!menu) {
    return;
}
await db.update(menus).set({
    is_accepted: !menu.is_accepted,
    }).where(eq(menus.id, id));
    await syncSetDrinkOptions();
    revalidatePath("/store_admin/menus");
}


export async function updateMenu(formData: FormData) {
    await requireStoreAdmin();
    const id = String(formData.get("id"));
    const name = String(formData.get("name"));
    const nameEn = optionalEnglish(formData.get("name_en"));
    const description = String(formData.get("description"));
    const descriptionEn = optionalEnglish(formData.get("description_en"));
    const imageUrl = await imageUrlFromForm(formData);
    const price = Number(formData.get("price"));

    if (!id || !name || !description || !imageUrl || !price) {
        throw new Error("ID、名前、説明、画像、価格は必須です");
    }

    await db.update(menus).set({
        name,
        name_en: nameEn,
        description,
        description_en: descriptionEn,
        image_url: imageUrl,
        price,
    }).where(eq(menus.id, id));

    await syncSetDrinkOptions();

    revalidatePath("/store_admin/menus");
    for (const lang of locales) {
      revalidatePath(customerPath(lang, "/order/take-out"));
      revalidatePath(customerPath(lang, "/order/here"));
    }
    redirect("/store_admin/menus");
}

export async function deleteMenu(formData: FormData) {
    await requireStoreAdmin();
    const id = String(formData.get("id") ?? "");
    if (!id) {
        throw new Error("IDは必須です");
    }

    await db.update(menus).set({
        deleted_at: new Date(),
        updated_at: new Date(),
    }).where(eq(menus.id, id));

    await syncSetDrinkOptions();

    revalidatePath("/store_admin/menus");
    for (const lang of locales) {
      revalidatePath(customerPath(lang, "/order/take-out"));
      revalidatePath(customerPath(lang, "/order/here"));
    }
    redirect("/store_admin/menus");
}