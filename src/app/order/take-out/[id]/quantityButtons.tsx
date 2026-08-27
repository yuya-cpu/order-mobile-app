"use client";

export function QuantityButtons({
    price,
    quantity,
    onChange,
}: {
    price: number;
    quantity: number;
    onChange: (quantity: number) => void;
}) {
    return (
        <div className="flex flex-row gap-2">
            <button type="button" onClick={() => onChange(Math.max(1, quantity - 1))}>
                -
            </button>
            <span>{quantity}</span>
            <button type="button" onClick={() => onChange(quantity + 1)}>
                +
            </button>
            <p>{price * quantity}円</p>
        </div>
    );
}
