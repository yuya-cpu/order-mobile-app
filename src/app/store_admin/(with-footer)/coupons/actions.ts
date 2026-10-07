"use server";

import { requireStoreAdmin } from "@/app/lib/store-admin";
import { db } from "@/db";
import { discounts } from "@/db/schema";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { optionalEnglish } from "@/i18n/localized";

const shopId = "11111111-1111-1111-1111-111111111111";

type DiscountType = "percent" | "amount";

function parseDiscountType(value: FormDataEntryValue | null): DiscountType {
  const type = String(value ?? "");
  if (type !== "percent" && type !== "amount") {
    throw new Error("名前・割引タイプ・割引値は必須です");
  }
  return type;
}

export async function createCoupon(formData: FormData) {
  await requireStoreAdmin();
  const name = String(formData.get("name") ?? "").trim();
  const nameEn = optionalEnglish(formData.get("name_en"));
  const type = parseDiscountType(formData.get("type"));
  const number = Number(formData.get("number"));

  if (!name || !number) {
    throw new Error("名前・割引タイプ・割引値は必須です");
  }

  await db.insert(discounts).values({
    id: crypto.randomUUID(),
    name,
    name_en: nameEn,
    type,
    number,
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

  if (!id || !name || !number) {
    throw new Error("ID・名前・割引タイプ・割引値は必須です");
  }

  await db
    .update(discounts)
    .set({
      name,
      name_en: nameEn,
      type,
      number,
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
