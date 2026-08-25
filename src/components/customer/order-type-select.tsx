"use client";

import { useState } from "react";

type OrderType = "takeout" | "dine_in";

const options: {
    value: OrderType;
    label: string;
    description: string;
    icon: "bag" | "table";
}[] = [
    {
        value: "takeout",
        label: "テイクアウト",
        description: "お持ち帰り",
        icon: "bag",
    },
    {
        value: "dine_in",
        label: "店内飲食",
        description: "店内でお食事",
        icon: "table",
    },
];

function OrderTypeIcon({ icon }: { icon: "bag" | "table" }) {
    if (icon === "bag") {
        return (
            <svg
                viewBox="0 0 24 24"
                className="h-12 w-12"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                aria-hidden
            >
                <path d="M6 8h12l-1 12H7L6 8Z" strokeLinejoin="round" />
                <path d="M9 8V6a3 3 0 0 1 6 0v2" strokeLinecap="round" />
            </svg>
        );
    }

    return (
        <svg
            viewBox="0 0 24 24"
            className="h-12 w-12"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            aria-hidden
        >
            <path d="M4 10h16M6 10v10M18 10v10M4 20h16" strokeLinecap="round" />
            <path d="M8 7V4M12 7V3M16 7V4" strokeLinecap="round" />
        </svg>
    );
}

export function OrderTypeSelect() {
    const [selected, setSelected] = useState<OrderType | null>(null);

    return (
        <div className="mx-auto flex w-full max-w-md flex-col gap-6 px-4 py-10">
            <h1 className="text-center text-2xl font-bold text-zinc-900">
                ご利用方法を
                <br />
                選択してください
            </h1>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {options.map((option) => {
                    const isSelected = selected === option.value;
                    return (
                        <button
                            key={option.value}
                            type="button"
                            onClick={() => setSelected(option.value)}
                            className={
                                isSelected
                                    ? "flex flex-col items-center gap-3 rounded-2xl border-2 border-[#E2584B] bg-[#E2584B]/10 px-4 py-8 text-[#E2584B]"
                                    : "flex flex-col items-center gap-3 rounded-2xl border-2 border-zinc-200 bg-white px-4 py-8 text-zinc-800 hover:border-zinc-400"
                            }
                        >
                            <OrderTypeIcon icon={option.icon} />
                            <span className="text-lg font-bold">{option.label}</span>
                            <span
                                className={
                                    isSelected
                                        ? "text-sm text-[#E2584B]"
                                        : "text-sm text-zinc-500"
                                }
                            >
                                {option.description}
                            </span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
