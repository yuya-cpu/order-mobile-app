"use server";

import { requireStoreAdmin } from "@/app/lib/store-admin";
import { db } from "@/db";
import { discounts } from "@/db/schema";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { and, eq, ne } from "drizzle-orm";
import { optionalEnglish } from "@/i18n/localized";
import { normalizeCouponCode } from "@/app/lib/coupon-code";

const shopId = "11111111-1111-1111-1111-111111111111";

type DiscountType = "percent" | "amount";

function parseDiscountType(value: FormDataEntryValue | null): DiscountType {
  const type = String(value ?? "");
  if (type !== "percent" && type !== "amount") {
    throw new Error("名前・割引タイプ・割引値は必須です");
  }
  return type;
}

// 対象は「全商品」「特定メニュー」「カテゴリ」の排他選択。
function parseTarget(formData: FormData) {
  const scope = String(formData.get("target_scope") ?? "all");
  if (scope === "menu") {
    const menuId = String(formData.get("target_menu_id") ?? "");
    if (!menuId) {
      throw new Error("対象メニューを選択してください");
    }
    return { target_menu_id: menuId, target_category_id: null };
  }
  if (scope === "category") {
    const categoryId = String(formData.get("target_category_id") ?? "");
    if (!categoryId) {
      throw new Error("対象カテゴリを選択してください");
    }
    return { target_menu_id: null, target_category_id: categoryId };
  }
  return { target_menu_id: null, target_category_id: null };
}

async function assertCodeAvailable(code: string | null, excludeId?: string) {
  if (!code) return;
  const [taken] = await db
    .select({ id: discounts.id })
    .from(discounts)
    .where(
      excludeId
        ? and(eq(discounts.code, code), ne(discounts.id, excludeId))
        : eq(discounts.code, code),
    )
    .limit(1);
  if (taken) {
    throw new Error("このクーポンコードは既に使われています");
  }
}

export async function createCoupon(formData: FormData) {
  await requireStoreAdmin();
  const name = String(formData.get("name") ?? "").trim();
  const nameEn = optionalEnglish(formData.get("name_en"));
  const type = parseDiscountType(formData.get("type"));
  const number = Number(formData.get("number"));
  const code = normalizeCouponCode(formData.get("code"));
  const target = parseTarget(formData);

  if (!name || !number) {
    throw new Error("名前・割引タイプ・割引値は必須です");
  }

  await assertCodeAvailable(code);

  await db.insert(discounts).values({
    id: crypto.randomUUID(),
    name,
    name_en: nameEn,
    type,
    number,
    code,
    ...target,
    shop_id: shopId,
  });

  revalidatePath("/store_admin/coupons");
  redirect("/store_admin/coupons");
}

export async function updateCoupon(formData: FormData) {
  await requireStoreAdmin();
  const id = String(formData.get("id") ?? "");
  const name = String(formData.get("name") ?? "").trim();
  const nameEn = optionalEnglish(formData.get("name_en"));
  const type = parseDiscountType(formData.get("type"));
  const number = Number(formData.get("number"));
  const code = normalizeCouponCode(formData.get("code"));
  const target = parseTarget(formData);

  if (!id || !name || !number) {
    throw new Error("ID・名前・割引タイプ・割引値は必須です");
  }

  await assertCodeAvailable(code, id);

  await db
    .update(discounts)
    .set({
      name,
      name_en: nameEn,
      type,
      number,
      code,
      ...target,
      updated_at: new Date(),
    })
    .where(eq(discounts.id, id));

  revalidatePath("/store_admin/coupons");
  redirect("/store_admin/coupons");
}

export async function deleteCoupon(formData: FormData) {
  await requireStoreAdmin();
  const id = String(formData.get("id") ?? "");
  if (!id) {
    throw new Error("IDは必須です");
  }

  await db
    .update(discounts)
    .set({
      deleted_at: new Date(),
      updated_at: new Date(),
    })
    .where(eq(discounts.id, id));

  revalidatePath("/store_admin/coupons");
  redirect("/store_admin/coupons");
}