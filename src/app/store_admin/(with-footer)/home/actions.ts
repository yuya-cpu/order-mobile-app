"use server";

import { requireStoreAdmin } from "@/app/lib/store-admin";
import { db } from "@/db";
import { shops } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { customerPath, locales } from "@/i18n/config";

export async function updateShopStatus(formData: FormData) {
  await requireStoreAdmin();
  const id = formData.get("id");
  const is_accepted = formData.get("is_accepted");

  await db
    .update(shops)
    .set({
      is_accepted: is_accepted === "true",
    })
    .where(eq(shops.id, id as string));

  revalidatePath("/store_admin/home");
  for (const lang of locales) {
    revalidatePath(customerPath(lang, "/order/order-type"));
    revalidatePath(customerPath(lang, "/order/here"));
    revalidatePath(customerPath(lang, "/order/take-out"));
  }
}