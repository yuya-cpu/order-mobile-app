import Link from "next/link";
import { shopIsOpen } from "../shop-status";

export default async function OrderTypePage() {
    if (!(await shopIsOpen())) {
        return (
            <main className="flex min-h-screen items-center justify-center px-4">
                <p className="text-center text-lg font-bold">ただいま注文を停止しています</p>
            </main>
        );
    }

    return (
      <main className="flex min-h-screen items-center justify-center px-4">
      <div className="flex flex-row gap-4">
        <Link
          href="/order/take-out"
          className="rounded-2xl border-2 border-[#E2584B] px-6 py-8 text-center text-xl font-semibold text-[#E2584B]"
        >
          テイクアウト
        </Link>
        <Link
          href="/order/guest-count"
          className="rounded-2xl border-2 border-[#E2584B] px-6 py-8 text-center text-xl font-semibold text-[#E2584B]"
        >
          店内飲食
        </Link>
      </div>
    </main>
    );
}
