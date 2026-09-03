import { createAuthClient } from "better-auth/react";
import { emailOTPClient } from "better-auth/client/plugins";

export const customerAuthClient = createAuthClient({
  basePath: "/api/customer-auth",
  plugins: [emailOTPClient()],
});