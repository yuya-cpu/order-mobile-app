"use client";

export function QuantityButtons({
    price,
    count,
    onChange,
}: {
    price: number;
    count: number;
    onChange: (count: number) => void;
}) {
    return (
        <div className="flex flex-row gap-2">
            <button type="button" onClick={() => onChange(Math.max(1, count - 1))}>
                -
            </button>
            <span>{count}</span>
            <button type="button" onClick={() => onChange(count + 1)}>
                +
            </button>
            <p>{price * count}円</p>
        </div>
    );
}