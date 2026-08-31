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
  const value = Number(formData.get("value"));

  if (!name || !type || !value) {
    throw new Error("名前・割引タイプ・割引値は必須です");
  }

  let discount_percentage;

if (type === "percent") {
  discount_percentage = value;
} else {
  discount_percentage = 0;
}

let discount_number;

if (type === "amount") {
  discount_number = value;
} else {
  discount_number = 0;
}

  await db.insert(discounts).values({
    id: crypto.randomUUID(),
    name,
    discount_number,
    discount_percentage,
    shop_id: shopId,
  });

  revalidatePath("/store_admin/coupons");
  redirect("/store_admin/coupons");
}
export async function updateCoupon(formData: FormData) {
    const id = String(formData.get("id") ?? "");
    const name = String(formData.get("name") ?? "").trim();
    const type = String(formData.get("type") ?? "");
    const value = Number(formData.get("value"));
  
    if (!id || !name || !type || !value) {
      throw new Error("ID・名前・割引タイプ・割引値は必須です");
    }
  
    await db
      .update(discounts)
      .set({
        name,
        discount_percentage: type === "percent" ? value : 0,
        discount_number: type === "amount" ? value : 0,
        updated_at: new Date(),
      })
      .where(eq(discounts.id, id));
  
    revalidatePath("/store_admin/coupons");
    redirect("/store_admin/coupons");
  }