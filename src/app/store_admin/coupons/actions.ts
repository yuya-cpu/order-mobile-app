"use server";

import { db } from "../../../db";
import { discounts } from "../../../db/schema";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";

const shopId = "11111111-1111-1111-1111-111111111111";

export async function createCoupon(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const type = String(formData.get("type") ?? "");
  const number = Number(formData.get("number"));

  if (!name || !type || !number) {
    throw new Error("名前・割引タイプ・割引値は必須です");
  }

  await db.insert(discounts).values({
    id: crypto.randomUUID(),
    name,
    type,
    number,
    shop_id: shopId,
  });

  revalidatePath("/store_admin/coupons");
  redirect("/store_admin/coupons");
}

export async function updateCoupon(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const name = String(formData.get("name") ?? "").trim();
  const type = String(formData.get("type") ?? "");
  const number = Number(formData.get("number"));

  if (!id || !name || !type || !number) {
    throw new Error("ID・名前・割引タイプ・割引値は必須です");
  }

  await db
    .update(discounts)
    .set({
      name,
      type,
      number,
      updated_at: new Date(),
    })
    .where(eq(discounts.id, id));

  revalidatePath("/store_admin/coupons");
  redirect("/store_admin/coupons");
}
