"use client";

import { useState } from "react";
import { customerAuthClient } from "@/app/lib/customer-auth-client";
import Link from "next/link";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [agreed, setAgreed] = useState(false);
    const [error, setError] = useState("");

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError("");
        const { error } = await customerAuthClient.signIn.email({
            email,
            password,
            callbackURL: "/order/order-type",
});
if (error) {
    setError("メールアドレスまたはパスワードが正しくありません");
}
}

return (
    <main className="relative flex min-h-screen flex-col bg-[#F5F2EB] px-6">
        <form onSubmit={onSubmit} className="mx-auto flex w-full max-w-ws flex-1 flex-col justify-center">
        <h1 className="text-center text-3xl font-bold text-zinc-900">login</h1>
          <label className="mt-10 block text-sm font-bold text-zinc-900">
          E-mail adress
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
            className="mt-2 w-full rounded-xl bg-[#EFEBE3] px-4 py-3 outline-none placeholder:text-zinc-400"
          />
          </label>

          <label className="mt-5 block text-sm font-bold text-zinc-900">
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            required
            className="mt-2 w-full rounded-xl bg-[#EFEBE3] px-4 py-3 outline-none placeholder:text-zinc-400"
          />
        </label>

        <label className="mt-6 flex items-center gap-2 text-sm text-zinc-900">
          <input
            type="checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="size-4 accent-[#E2584B]"
          />
          利用規約/プライバシーポリシーに同意
        </label>

        <Link
  href="/order/order-type"
  className={`mt-8 block w-full rounded-xl bg-[#E2584B] py-4 text-center text-sm font-bold text-white ${
    !agreed ? "pointer-events-none opacity-50" : ""
  }`}
>
  login for using E-mail adress
</Link>


        <Link
          href="/en/forgot-password"
          className="mt-6 block text-center text-sm text-[#E2584B]"
        >
          パスワードを忘れた方はこちら
        </Link>
        </form>
    </main>
);
}
