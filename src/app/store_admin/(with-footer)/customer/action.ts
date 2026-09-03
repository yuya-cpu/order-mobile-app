"use server";

import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function updateStatus(formData: FormData) {
    const id = String(formData.get("id") ?? "");
    const isAccepted = String(formData.get("is_accepted") ?? "") === "true";

    if (!id) return;

    await db
        .update(users)
        .set({ is_accepted: isAccepted, updated_at: new Date() })
        .where(eq(users.id, id));

    revalidatePath("/store_admin/customer");
}
