"use server";

import { db } from "../../../../db";
import { orders } from "../../../../db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function updateOrderStatus(formData: FormData) {
    const id = String(formData.get("id") ?? "");
    const status = String(formData.get("status") ?? "");

    if (!id || !status) return;

    await db.update(orders)
            .set({ status, updated_at: new Date() })
            .where(eq(orders.id, id));

            revalidatePath("/store_admin/orders");
}

