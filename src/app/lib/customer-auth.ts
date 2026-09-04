import { db } from "@/db";
import { betterAuth } from "better-auth";
import { nextCookies } from "better-auth/next-js";
import { emailOTP, genericOAuth } from "better-auth/plugins";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import * as customerAuthSchema from "@/db/customer-auth-schema";

export const customerAuth = betterAuth({
    secret: process.env.BETTER_AUTH_SECRET,
    baseURL: process.env.BETTER_AUTH_URL,
    basePath: "/api/customer-auth",
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
                providerId: "line",
                clientId: process.env.LINE_CLIENT_ID as string,
                clientSecret: process.env.LINE_CLIENT_SECRET as string,
                authorizationUrl: "https://access.line.me/oauth2/v2.1/authorize",
                tokenUrl: "https://api.line.me/oauth2/v2.1/token",
                userInfoUrl: "https://api.line.me/oauth2/v2.1/userinfo",
                scopes: ["openid", "profile"],
              },
            ],
          }),
            
    nextCookies(),
],
});