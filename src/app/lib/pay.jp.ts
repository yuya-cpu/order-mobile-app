import { createClient } from "@payjp/payjpv2";

export const payjp = createClient({
    apiKey: process.env.PAYJP_SECRET_KEY!,
})