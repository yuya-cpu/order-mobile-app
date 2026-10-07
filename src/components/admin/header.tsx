"use client";

import Link from "next/link";
import { authClient } from "@/app/lib/auth-client";

export function AdminHeader() {
  async function logout() {
    await authClient.signOut();
    window.location.href = "/store_admin";
  }

  return (
    <header className="mt-6 flex items-center justify-between border-y border-zinc-300 bg-white px-4 py-4">
      <div className="flex items-center gap-5">
        <div className="text-2xl font-bold text-zinc-900">Hello World</div>
      </div>
      <div className="flex items-center gap-6">
        <Link
          href="/store_admin/password"
          className="text-lg text-zinc-900 hover:text-zinc-600"
        >
          パスワード変更
        </Link>
        <button
          type="button"
          className="text-lg text-zinc-900 hover:text-zinc-600"
          onClick={logout}
        >
          ログアウト
        </button>
      </div>
    </header>
  );
}