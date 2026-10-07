import { headers } from "next/headers";
import { auth } from "./auth";

export async function getStoreAdmin() {
    return auth.api.getSession({
        headers: await headers(),
    });
}

export async function requireStoreAdmin() {
    const session = await getStoreAdmin();
    if (!session){
        throw new Error("Unauthorized");

    }
    return session;
}