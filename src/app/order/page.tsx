import Link from "next/link";

export default function OrderTypePage() {
    return (
        <main className="mx-auto max-w-screen-lg px-4 py-8">
             <div className="flex w-full max-w-md flex-col gap-4">
        <Link
          href="/order/menus"
          className="rounded-2xl border-2 border-[#E2584B] px-6 py-8 text-center text-xl font-semibold text-[#E2584B]"
        >
          テイクアウト
        </Link>
        <Link
          href="/order/menus"
          className="rounded-2xl border-2 border-[#E2584B] px-6 py-8 text-center text-xl font-semibold text-[#E2584B]"
        >
          店内飲食
        </Link>
      </div>
        </main>
    );
}