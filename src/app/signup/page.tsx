"use client";
import { useState } from "react";
import Link from "next/link";
import { customerAuthClient } from "@/app/lib/customer-auth-client";
export default function LineSignupPage() {
  const [agreed, setAgreed] = useState(false);
  const [pending, setPending] = useState(false);
  async function signupWithLine() {
    if (pending) return;
    setPending(true);
    await customerAuthClient.signIn.social({
      provider: "line",
      callbackURL: "/order/order-type",
    });
  }
  return (
    <main className="relative flex min-h-screen flex-col bg-white px-6">
      <Link href="/" className="absolute left-4 top-4 text-[#E2584B]">
        &lt; 戻る
      </Link>
      <div className="flex flex-1 flex-col items-center justify-center">
        <h1 className="text-center text-2xl font-bold">LINE登録フォーム</h1>
        <p className="mt-4 max-w-xs text-center text-sm text-zinc-500">
          LINEアカウントを連携すると、クーポンなどのお知らせを受け取れます
        </p>
        <label className="mt-8 flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="size-4 accent-[#E2584B]"
          />
          利用規約/プライバシーポリシーに同意
        </label>
        <button
          type="button"
          disabled={!agreed || pending}
          onClick={signupWithLine}
          className="mt-10 w-full max-w-xs rounded-xl bg-[#06C755] py-4 text-lg font-bold text-white disabled:opacity-50"
        >
          LINE連携
        </button>
        </div>
    </main>
  );
}