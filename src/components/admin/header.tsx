"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { authClient } from "@/app/lib/auth-client";

const headerButtonClass =
  "shrink-0 whitespace-nowrap rounded-xl bg-zinc-100 px-4 py-2 text-sm font-medium text-zinc-700";

export function AdminHeader() {
  const pathname = usePathname();
  const passwordActive = pathname === "/store_admin/password";

  async function logout() {
    await authClient.signOut();
    window.location.href = "/store_admin";
  }

  return (
    <header className="mt-6 flex items-center justify-between gap-4 border-y border-zinc-300 bg-white px-4 py-4">
      <p className="shrink-0 whitespace-nowrap text-2xl font-bold text-zinc-900">Hello World</p>
      <div className="flex items-center gap-2">
        <Link
          href="/store_admin/password"
          className={
            passwordActive
              ? "shrink-0 whitespace-nowrap rounded-xl bg-[#E2584B] px-4 py-2 text-sm font-medium text-white"
              : headerButtonClass
          }
        >
          パスワード変更
        </Link>
        <button type="button" className={headerButtonClass} onClick={logout}>
          ログアウト
        </button>
      </div>
    </header>
  );
}