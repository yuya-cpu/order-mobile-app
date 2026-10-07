"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { customerPath } from "@/i18n/config";
import { useDictionary } from "@/i18n/use-dictionary";

export default function GuestCountPage() {
    const options = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    const [count, setCount] = useState("1");
    const router = useRouter();
    const { lang } = useParams<{ lang: string }>();
    const dict = useDictionary();

    function go() {
        sessionStorage.setItem("orderType", "here");
        sessionStorage.setItem("guestCount", count);
        router.push(customerPath(lang, "/order/here"));
    }

    return (
      <main className="mx-auto flex min-h-screen w-full max-w-md flex-col items-center justify-center gap-10 px-4">
        <h1 className="text-center text-3xl font-bold">{dict.guestCount.title}</h1>
        <select
          name="guest_count"
          value={count}
          onChange={(e) => setCount(e.target.value)}
          className="h-20 w-full rounded-2xl border border-zinc-300 px-4 text-center text-2xl font-bold"
        >
          {options.map((n) => (
            <option key={n} value={n}>
              {dict.guestCount.people.replace("{{n}}", String(n))}
            </option>
          ))}
        </select>
        <button
          type="button"
          onClick={go}
          className="w-full rounded-full bg-[#E2584B] px-6 py-4 text-xl font-semibold text-white text-center"
        >
            {dict.guestCount.toMenu}
        </button>
      </main>
    );
  }
