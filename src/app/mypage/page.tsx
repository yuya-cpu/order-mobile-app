"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { customerAuthClient } from "@/app/lib/customer-auth-client";

export default function Mypage() {
    const { data: session, isPending } = customerAuthClient.useSession();
    const [coupons, setCoupons] = useState<{ id: string; name: string }[]>([]);
    useEffect(() => {
      fetch("/api/coupons")
        .then((res) => res.json())
        .then((data) => setCoupons(Array.isArray(data) ? data : []));
    }, []);
    if (isPending) return null;
    if (!session) {
      return (
        <main className="flex min-h-screen items-center justify-center bg-[#FBF8F3] px-6">
          <p className="text-center text-sm text-zinc-500">
            ログインしていません
          </p>
        </main>
      );
    }
const { name, email } = session.user;
const isEmail = name === email || name.includes("@");

return (
    <main className="relative flex min-h-screen flex-col bg-[#FBF8F3] px-6 pb-10">
        <div className="mx-auto mt-20 w-full max-w-xs">
            <h1 className="text-center text-3xl font-bold text-zinc-900">マイページ</h1>
            
        {isEmail ? (
          <section className="mt-10 text-center">
            <p className="text-sm text-zinc-400">登録中のメールアドレス</p>
            <p className="mt-1 text-lg font-bold text-zinc-900">{email}</p>
            <div className="mt-3 flex justify-center gap-6 text-sm text-[#E2584B]">
              <Link href="/en/reset-password">パスワード変更</Link>
            </div>
          </section>
        ) : (
          <section className="mt-10 text-center">
            <p className="text-sm text-zinc-400">ユーザーネーム</p>
            <p className="mt-1 text-lg font-bold text-zinc-900">{name}</p>
          </section>
        )}
         <div className="mt-8 flex flex-col gap-3">
          <button
            type="button"
            className="flex items-center justify-between rounded-xl bg-[#F4F1EA] px-5 py-4 text-sm font-medium text-zinc-800"
          >
            注文履歴
            <span className="text-zinc-400">&gt;</span>
          </button>
          <button
            type="button"
            className="flex items-center justify-between rounded-xl bg-[#F4F1EA] px-5 py-4 text-sm font-medium text-zinc-800"
          >
            領収書発行
            <span className="text-zinc-400">&gt;</span>
          </button>
          </div>

          <hr className="my-8 border-zinc-200" />
        <h2 className="text-sm font-bold text-zinc-800">所持クーポン</h2>
        <ul className="mt-4 flex flex-col gap-3">
          {coupons.map((coupon) => (
            <li
              key={coupon.id}
              className="flex items-center gap-3  border border-zinc-200 bg-white px-4 py-4"
            >
              <span className="flex size-8 shrink-0 items-center justify-center border-[#E2584B] text-xs font-bold text-[#E2584B]">
                クー
                ポン
              </span>
              <span className="text-sm font-medium text-zinc-800">
                {coupon.name}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
