"use client";

import { useState } from "react";
import Link from "next/link";
import { customerAuthClient } from "@/app/lib/customer-auth-client";

export default function LineLoginPage() {
  const [agreed, setAgreed] = useState(false);

  async function loginWithLine() {
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
        <h1 className="text-3xl font-bold">ログイン</h1>
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
          disabled={!agreed}
          onClick={loginWithLine}
          className="mt-10 w-full max-w-xs rounded-xl bg-[#06C755] py-4 text-lg font-bold text-white disabled:opacity-50"
        >
          LINEでログイン
        </button>
        <Link href="/signup" className="mt-6 text-sm text-[#E2584B]">
          アカウントを登録する
        </Link>
      </div>
    </main>
  );
}