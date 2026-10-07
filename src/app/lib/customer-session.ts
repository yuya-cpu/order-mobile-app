import { headers } from "next/headers";
import { customerAuth } from "./customer-auth";

export async function getCustomerSession() {
  return customerAuth.api.getSession({
    headers: await headers(),
  });
}
