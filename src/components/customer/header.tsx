"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

export function CustomerHeader() {
    const router = useRouter();

    return (
        <header className="flex item-center justify-between px-4 py-4">
            <button
            type="button"
            onClick={() => router.back()}
            className="text-sm text-[#E2584B]"
            >
                &lt; 戻る
            </button>
            <Link href="/mypage" className="text-sm font-bold text-zinc-900">マイページ</Link>
        </header>
    )
}