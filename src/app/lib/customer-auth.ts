import { db } from "@/db";
import { betterAuth } from "better-auth";
import { nextCookies } from "better-auth/next-js";
import { emailOTP } from "better-auth/plugins";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import * as customerAuthSchema from "@/db/customer-auth-schema";

const siteUrl =
  process.env.BETTER_AUTH_URL ?? "https://order-mobile-app-inky.vercel.app";

type LineProfile = {
  sub?: string;
  userId?: string;
  email?: string;
  name?: string;
  displayName?: string;
  picture?: string;
  pictureUrl?: string;
};

function lineAccountId(profile: LineProfile) {
  return profile.sub ?? profile.userId ?? "";
}

export const customerAuth = betterAuth({
    secret: process.env.BETTER_AUTH_SECRET,
    baseURL: siteUrl,
    basePath: "/api/customer-auth",
    trustedOrigins: [
        siteUrl,
        "https://order-mobile-app-inky.vercel.app",
    ],
    onAPIError: {
        errorURL: "/login",
    },
    database: drizzleAdapter(db, {
        provider: "pg",
        schema: customerAuthSchema,
    }),
    emailAndPassword: {
        enabled: true,
    },
    account: {
        skipStateCookieCheck: true,
        storeStateStrategy: "database",
    },
    socialProviders: {
        line: {
            clientId: process.env.LINE_CLIENT_ID as string,
            clientSecret: process.env.LINE_CLIENT_SECRET as string,
            disableDefaultScope: true,
            scope: ["openid", "profile"],
            redirectURI: `${siteUrl}/api/customer-auth/callback/line`,
            mapProfileToUser: (profile) => {
                const lineProfile = profile as LineProfile;
                const accountId = lineAccountId(lineProfile);
                return {
                    name: lineProfile.name ?? lineProfile.displayName ?? "LINE user",
                    email:
                        lineProfile.email ??
                        `${accountId}@line.placeholder.invalid`,
                    image: lineProfile.picture ?? lineProfile.pictureUrl,
                };
            },
        },
    },
    advanced: {
        cookiePrefix: "customer-auth",
        database: {
            generateId: "uuid",
        },
        defaultCookieAttributes: {
            sameSite: "lax",
            secure: true,
            path: "/",
        },
    },
    plugins: [
        emailOTP({
            sendVerificationOnSignUp: true,
            async sendVerificationOTP({ email, otp, type }) {
                console.log("customer OTP", type, email, otp);
            },
        }),
        nextCookies(),
    ],
});
