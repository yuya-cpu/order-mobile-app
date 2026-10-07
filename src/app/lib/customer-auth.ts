import { db } from "@/db";
import { betterAuth } from "better-auth";
import { nextCookies } from "better-auth/next-js";
import { emailOTP, genericOAuth, line } from "better-auth/plugins";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import * as customerAuthSchema from "@/db/customer-auth-schema";

export const customerAuth = betterAuth({
    secret: process.env.BETTER_AUTH_SECRET,
    baseURL: process.env.BETTER_AUTH_URL,
    basePath: "/api/customer-auth",
    trustedOrigins: [process.env.BETTER_AUTH_URL].filter(
        (origin): origin is string => Boolean(origin),
    ),
    onAPIError: {
        errorURL: "/ja/login",
    },
    database: drizzleAdapter(db, {
        provider: "pg",
        schema: customerAuthSchema,
    }),
    emailAndPassword: {
        enabled: true,
    },
    advanced: {
        cookiePrefix: "customer-auth",
        database: {
            generateId: "uuid",
        }
    },
    plugins: [
        emailOTP({
            sendVerificationOnSignUp: true,
            async sendVerificationOTP({email, otp, type}) {
                console.log("customer OTP", type, email, otp);
        },
    }),
    genericOAuth({
        config: [
            {
                ...line({
                    providerId: "line",
                    clientId: process.env.LINE_CLIENT_ID as string,
                    clientSecret: process.env.LINE_CLIENT_SECRET as string,
                    scopes: ["openid", "profile", ],
                    pkce: true,
                }),
                mapProfileToUser(profile) {
                    const sub = String(profile.sub ?? profile.id ?? "");
                    const email =
                        typeof profile.email === "string" && profile.email.length > 0
                            ? profile.email
                            : `line-${sub}@noreply.line.local`;
                    const name =
                        typeof profile.name === "string" && profile.name.length > 0
                            ? profile.name
                            : "LINEユーザー";
                    return { email, name };
                },
            },
        ],
    }),
    nextCookies(),
],
});
