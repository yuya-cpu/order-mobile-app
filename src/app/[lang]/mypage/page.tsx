"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Ticket } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { customerAuthClient } from "@/app/lib/customer-auth-client";
import { customerPath } from "@/i18n/config";
import { useDictionary } from "@/i18n/use-dictionary";
import { localizedText } from "@/i18n/localized";

export default function Mypage() {
    const { lang } = useParams<{ lang: string }>();
    const dict = useDictionary();
    const router = useRouter();

    function goBack() {
      if (window.history.length > 1) {
        router.back();
        return;
      }
      router.push(customerPath(lang, "/order/order-type"));
    }
    const { data: session, isPending } = customerAuthClient.useSession();
    const [coupons, setCoupons] = useState<{ id: string; name: string; name_en?: string | null }[]>([]);
    useEffect(() => {
      fetch("/api/coupons")
        .then((res) => res.json())
        .then((data) => setCoupons(Array.isArray(data) ? data : []));
    }, []);
    if (isPending) return null;
    if (!session) {
      return (
        <main className="relative flex min-h-screen items-center justify-center bg-[#FBF8F3] px-6">
          <button
            type="button"
            onClick={goBack}
            className="absolute left-4 top-4 inline-flex items-center gap-0.5 text-sm text-[#E2584B]"
          >
            <ChevronLeft className="size-4" />
            {dict.common.back}
          </button>
          <p className="text-center text-sm text-zinc-500">
            {dict.mypage.notLoggedIn}
          </p>
        </main>
      );
    }
const { name, email } = session.user;
const isEmail = name === email || name.includes("@");

return (
    <main className="relative flex min-h-screen flex-col bg-[#FBF8F3] px-6 pb-10">
        <button
          type="button"
          onClick={goBack}
          className="absolute left-4 top-4 inline-flex items-center gap-0.5 text-sm text-[#E2584B]"
        >
          <ChevronLeft className="size-4" />
          {dict.common.back}
        </button>
        <div className="mx-auto mt-20 w-full max-w-xs">
            <h1 className="text-center text-3xl font-bold text-zinc-900">{dict.mypage.title}</h1>
            
        {isEmail ? (
          <section className="mt-10 text-center">
            <p className="text-sm text-zinc-400">{dict.mypage.registeredEmail}</p>
            <p className="mt-1 text-lg font-bold text-zinc-900">{email}</p>
            <div className="mt-3 flex justify-center gap-6 text-sm text-[#E2584B]">
              <Link href={customerPath(lang, "/reset-password")}>{dict.mypage.changePassword}</Link>
            </div>
          </section>
        ) : (
          <section className="mt-10 text-center">
            <p className="text-sm text-zinc-400">{dict.mypage.username}</p>
            <p className="mt-1 text-lg font-bold text-zinc-900">{name}</p>
          </section>
        )}
         <div className="mt-8 flex flex-col gap-3">
          <button
            type="button"
            className="flex items-center justify-between rounded-xl bg-[#F4F1EA] px-5 py-4 text-sm font-medium text-zinc-800"
          >
            {dict.mypage.orderHistory}
            <ChevronRight className="size-4 text-zinc-400" />
          </button>
          <button
            type="button"
            className="flex items-center justify-between rounded-xl bg-[#F4F1EA] px-5 py-4 text-sm font-medium text-zinc-800"
          >
            {dict.mypage.receipt}
            <ChevronRight className="size-4 text-zinc-400" />
          </button>
          </div>

          <hr className="my-8 border-zinc-200" />
        <h2 className="text-sm font-bold text-zinc-800">{dict.mypage.coupons}</h2>
        <ul className="mt-4 flex flex-col gap-3">
          {coupons.map((coupon) => (
            <li
              key={coupon.id}
              className="flex items-center gap-3  border border-zinc-200 bg-white px-4 py-4"
            >
              <Ticket
                className="size-5 shrink-0 text-[#E2584B]"
                aria-label={dict.mypage.couponBadge}
              />
              <span className="text-sm font-medium text-zinc-800">
                {localizedText(String(lang), coupon.name, coupon.name_en)}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
