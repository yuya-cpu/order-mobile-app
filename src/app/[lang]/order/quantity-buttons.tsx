"use client";

import { Minus, Plus } from "lucide-react";
import { useDictionary } from "@/i18n/use-dictionary";

export function QuantityButtons({
    price,
    quantity,
    onChange,
    showPrice = true,
    buttonClassName = "bg-zinc-200",
    roundedClassName = "rounded-full",
    grouped = false,
}: {
    price: number;
    quantity: number;
    onChange: (quantity: number) => void;
    showPrice?: boolean;
    buttonClassName?: string;
    roundedClassName?: string;
    grouped?: boolean;
}) {
    const dict = useDictionary();
    const stepper = grouped ? (
        <div className="inline-flex items-center gap-3 rounded-full bg-white px-3 py-1.5">
            <button
                type="button"
                onClick={() => onChange(Math.max(1, quantity - 1))}
                className="flex size-6 items-center justify-center"
            >
                <Minus className="size-3.5" />
            </button>
            <span className="min-w-4 text-center text-sm">{quantity}</span>
            <button
                type="button"
                onClick={() => onChange(quantity + 1)}
                className="flex size-6 items-center justify-center"
            >
                <Plus className="size-3.5" />
            </button>
        </div>
    ) : (
        <div className="flex flex-row items-center gap-2">
            <button
                type="button"
                onClick={() => onChange(Math.max(1, quantity - 1))}
                className={`flex size-7 items-center justify-center ${roundedClassName} ${buttonClassName}`}
            >
                <Minus className="size-3.5" />
            </button>
            <span>{quantity}</span>
            <button
                type="button"
                onClick={() => onChange(quantity + 1)}
                className={`flex size-7 items-center justify-center ${roundedClassName} ${buttonClassName}`}
            >
                <Plus className="size-3.5" />
            </button>
        </div>
    );
    return (
        <div className="flex flex-row items-center gap-2">
            {stepper}
            {showPrice ? (
            <p className="text-base font-bold text-[#E2584B]">{price * quantity}{dict.common.yen}</p>
            ) : null}
        </div>
    );
}
