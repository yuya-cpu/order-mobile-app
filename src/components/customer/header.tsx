"use client";

import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { customerPath } from "@/i18n/config";
import { useDictionary } from "@/i18n/use-dictionary";

function orderBackPath(lang: string, pathname: string) {
  const prefix = `/${lang}`;
  const path = pathname.startsWith(prefix) ? pathname.slice(prefix.length) : pathname;

  if (path === "/order/order-type") return customerPath(lang, "/login");
  if (path === "/order/guest-count") return customerPath(lang, "/order/order-type");
  if (path === "/order/take-out") return customerPath(lang, "/order/order-type");
  if (path === "/order/here") return customerPath(lang, "/order/guest-count");
  if (path === "/order/take-out/cart") return customerPath(lang, "/order/take-out");
  if (path === "/order/here/cart") return customerPath(lang, "/order/here");
  if (path === "/order/take-out/select-payment/complete") {
    return customerPath(lang, "/order/order-type");
  }
  if (path === "/order/take-out/select-payment") {
    if (typeof window !== "undefined" && sessionStorage.getItem("orderType") === "here") {
      return customerPath(lang, "/order/here/cart");
    }
    return customerPath(lang, "/order/take-out/cart");
  }
  if (path.startsWith("/order/take-out/")) return customerPath(lang, "/order/take-out");
  if (path.startsWith("/order/here/")) return customerPath(lang, "/order/here");
  return customerPath(lang, "/order/order-type");
}

export function CustomerHeader() {
    const pathname = usePathname();
    const { lang } = useParams<{ lang: string }>();
    const locale = Array.isArray(lang) ? lang[0] : lang;
    const dict = useDictionary();
    const href = orderBackPath(locale, pathname);
    const isCart = pathname.endsWith("/cart");
    const isOrderType = pathname.endsWith("/order/order-type");
    if (isCart) return null;

    return (
        <header className={`flex items-center justify-between px-4 py-4 ${isOrderType ? "bg-[#FBF8F3]" : ""}`}>
            <Link href={href} className="inline-flex items-center gap-0.5 text-sm text-[#E2584B]">
                <ChevronLeft className="size-4" />
                {dict.common.back}
            </Link>
            <Link href={customerPath(locale, "/mypage")} className="text-sm font-bold text-zinc-900">{dict.common.mypage}</Link>
        </header>
    )
}
