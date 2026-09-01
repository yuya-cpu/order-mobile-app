"use server";

import { db } from "../../../../db";
import { shops } from "../../../../db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function updateShopStatus(formData: FormData) {
  const id = formData.get("id");
  const is_accepted = formData.get("is_accepted");

  await db
    .update(shops)
    .set({
      is_accepted: is_accepted === "true",
    })
    .where(eq(shops.id, id as string));

  revalidatePath("/store_admin/home");
}