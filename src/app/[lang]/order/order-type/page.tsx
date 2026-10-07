import Link from "next/link";
import { shopIsOpen } from "../shop-status";
import { customerPath, isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { notFound } from "next/navigation";

export default async function OrderTypePage({
    params,
}: {
    params: Promise<{ lang: string }>;
}) {
    const { lang } = await params;
    if (!isLocale(lang)) notFound();
    const dict = await getDictionary(lang);

    if (!(await shopIsOpen())) {
        return (
            <main className="flex flex-1 items-center justify-center bg-[#FBF8F3] px-4">
                <p className="text-center text-lg font-bold">{dict.common.closed}</p>
            </main>
        );
    }

    return (
      <main className="flex flex-1 flex-col bg-[#FBF8F3] px-6">
        <div className="flex flex-1 items-center">
          <div className="grid w-full grid-cols-2 gap-4">
            <Link
              href={customerPath(lang, "/order/take-out")}
              className="flex aspect-square flex-col items-center justify-center rounded-2xl border border-[#E8DCC8] bg-[#F7F1E3] px-3"
            >
              <TakeoutIllustration />
              <span className="mt-5 text-center text-lg font-bold text-zinc-900">
                {dict.orderType.takeout}
              </span>
            </Link>
            <Link
              href={customerPath(lang, "/order/guest-count")}
              className="flex aspect-square flex-col items-center justify-center rounded-2xl border border-[#E8DCC8] bg-[#F7F1E3] px-3"
            >
              <DineInIllustration />
              <span className="mt-5 text-center text-lg font-bold text-zinc-900">
                {dict.orderType.here}
              </span>
            </Link>
          </div>
        </div>
      </main>
    );
}

function TakeoutIllustration() {
    return (
        <svg
            viewBox="0 0 72 72"
            className="size-[4.5rem] text-[#E39A68]"
            fill="none"
            aria-hidden
        >
            <path
                d="M24 36c0-13 4-18 8.5-18S41 23 41 36"
                stroke="currentColor"
                strokeWidth="2.4"
                strokeLinecap="round"
            />
            <path
                d="M31 36c0-13 4-18 8.5-18S48 23 48 36"
                stroke="currentColor"
                strokeWidth="2.4"
                strokeLinecap="round"
            />
            <path
                d="M20 35h32c1.4 0 2.5 1.1 2.5 2.5v22c0 2.5-2 4.5-4.5 4.5H22c-2.5 0-4.5-2-4.5-4.5v-22c0-1.4 1.1-2.5 2.5-2.5Z"
                stroke="currentColor"
                strokeWidth="2.4"
                strokeLinejoin="round"
            />
        </svg>
    );
}

function DineInIllustration() {
    return (
        <svg
            viewBox="0 0 72 72"
            className="size-[4.5rem] text-[#E39A68]"
            fill="none"
            aria-hidden
        >
            <circle cx="36" cy="38" r="14" stroke="currentColor" strokeWidth="2.4" />
            <path
                d="M14 18v9M17.5 18v9M21 18v9"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
            />
            <path
                d="M14 27h7M17.5 27v29"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M55 18c3.2 4.5 3.2 9 0 14.5M55 32.5V56"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
            />
        </svg>
    );
}
