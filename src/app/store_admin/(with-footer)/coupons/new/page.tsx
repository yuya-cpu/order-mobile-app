"use client"
import { useState } from "react"
import Link from "next/link"
import { createCoupon } from "../actions"

export default function NewCouponPage() {
    const [type, setType] = useState<"percent" | "amount">("percent")

return (
    <div className="flex flex-1 items-center justify-center px-8 py-8">
    <form action={createCoupon} className="mx-auto flex w-full max-w-3xl flex-col gap-6 rounded-2xl bg-white p-8">
        <h1 className="text-center text-2xl font-bold">新規クーポン情報の入力</h1>

        <label className="flex flex-col gap-2 font-medium">クーポン名
            <input
            name="name"
            required
            placeholder="クーポン名"
            className="rounded-md border border-gray-300 p-3"
            />
        </label>

       <div>
        <p className="mb-2 font-medium">割引タイプ</p>
            <div className="grid grid-cols-2 gap-4">
                <button type="button"
                onClick={() => setType("percent")}
                className={`w-full rounded-md px-4 py-3 ${type === "percent" ? "bg-[#E2584B] text-white" : "bg-gray-200 text-gray-700"}`}
                >
                    %割引
                </button>
                <button type="button"
                onClick={() => setType("amount")}
                className={`w-full rounded-md px-4 py-3 ${type === "amount" ? "bg-[#E2584B] text-white" : "bg-gray-200 text-gray-700"}`}
                >
                    金額割引
                </button>
            </div>
            <input type="hidden" name="type" value={type} />
       </div>

        <label className="flex flex-col gap-2 font-medium">割引率/割引金額
            <div className="flex items-center gap-3">
                <input
                name="number"
                type="number"
                required
                min={1}
                placeholder="割引率/割引金額"
                className="min-w-0 flex-1 rounded-md border border-gray-300 p-3"
                />
                <span className="shrink-0 text-zinc-600">
                    {type === "percent" ? "%" : "円"}
                </span>
            </div>
        </label>

        <div className="flex w-full gap-4">
            <Link href="/store_admin/coupons" className="flex flex-1 items-center justify-center rounded-full border border-zinc-300 py-3 text-center">戻る</Link>
            <button type="submit" className="flex-1 rounded-full bg-[#E2584B] py-3 text-white">クーポンを作成
            </button>
        </div>
    </form>
    </div>
    )
}
