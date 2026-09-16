"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function GuestCountPage() {
    const options = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    const [count, setCount] = useState("1");
    const router = useRouter();

    function go() {
        sessionStorage.setItem("orderType", "here");
        sessionStorage.setItem("guestCount", count);
        router.push("/order/here");
    }

    return (
      <main className="mx-auto flex min-h-screen w-full max-w-md flex-col items-center justify-center gap-10 px-4">
        <h1 className="text-center text-3xl font-bold">人数選択</h1>
        <select
          name="guest_count"
          value={count}
          onChange={(e) => setCount(e.target.value)}
          className="h-20 w-full rounded-2xl border border-zinc-300 px-4 text-center text-2xl font-bold"
        >
          {options.map((n) => (
            <option key={n} value={n}>
              {n}人
            </option>
          ))}
        </select>
        <button
          type="button"
          onClick={go}
          className="w-full rounded-2xl bg-[#E2584B] px-6 py-4 text-xl font-semibold text-white text-center"
        >
            メニューへ
        </button>
      </main>
    );
  }
