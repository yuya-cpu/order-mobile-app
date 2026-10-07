"use server";

import { requireStoreAdmin } from "@/app/lib/store-admin";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function updateStatus(formData: FormData) {
    await requireStoreAdmin();
    const id = String(formData.get("id") ?? "");
    const isAccepted = String(formData.get("is_accepted") ?? "") === "true";

    if (!id) return;

    await db
        .update(users)
        .set({ is_accepted: isAccepted, updated_at: new Date() })
        .where(eq(users.id, id));

    revalidatePath("/store_admin/customer");
}
