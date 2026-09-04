"use server";

import { db } from "@/db";
import { user } from "@/db/customer-auth-schema";
import { eq } from "drizzle-orm";

export async function customerEmailExists(email: string) {
  const normalized = email.trim().toLowerCase();
  const [row] = await db
    .select({ id: user.id })
    .from(user)
    .where(eq(user.email, normalized))
    .limit(1);
  return Boolean(row);
}