import { NextResponse } from "next/server";
import { db } from "@/db";
import { and, eq, isNull } from "drizzle-orm";
import { menus } from "@/db/schema";

export async function GET() {
  const rows = await db
    .select({
      id: menus.id,
      image_url: menus.image_url,
    })
    .from(menus)
    .where(and(isNull(menus.deleted_at), eq(menus.is_accepted, true)));
  return NextResponse.json(rows);
}
