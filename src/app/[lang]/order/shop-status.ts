import { db } from "@/db";
import { shops } from "@/db/schema";
import { eq } from "drizzle-orm";

const shopId = "11111111-1111-1111-1111-111111111111";

export async function shopIsOpen() {
  const shop = await db.query.shops.findFirst({
    where: eq(shops.id, shopId),
  });
  return shop?.is_accepted === true;
}
