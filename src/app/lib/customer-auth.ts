import { db } from "@/db";
import { betterAuth } from "better-auth";
import { nextCookies } from "better-auth/next-js";
import { emailOTP } from "better-auth/plugins";
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
    nextCookies(),
],
});