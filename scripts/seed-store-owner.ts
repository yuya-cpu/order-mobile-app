import { auth } from "../src/app/lib/auth";
import { db } from "../src/db";
import { user, account } from "../src/db/auth-schema";

const SHOP_ID = "11111111-1111-1111-1111-111111111111";
const EMAIL = "shop@example.com";
const PASSWORD = "password1234";

async function main() {
  const ctx = await auth.$context;
  const id = crypto.randomUUID();
  const hash = await ctx.password.hash(PASSWORD);
  const now = new Date();

  await db.insert(user).values({
    id,
    name: "デモ店舗",
    email: EMAIL,
    emailVerified: true,
    shopId: SHOP_ID,
  });

  await db.insert(account).values({
    userId: id,
    accountId: id,
    providerId: "credential",
    issuer: "local:credential",
    password: hash,
    createdAt: now,
    updatedAt: now,
  });

  console.log("OK", EMAIL, PASSWORD);
}

main();