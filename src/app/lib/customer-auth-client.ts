import { createAuthClient } from "better-auth/client";
import { emailOTPClient } from "better-auth/client/plugins";

export const customerAuthClient = createAuthClient({
  basePath: "/api/customer-auth",
  plugins: [emailOTPClient()],
});
const authClient = createAuthClient();
    await authClient.signIn.social({ provider: "line" });
