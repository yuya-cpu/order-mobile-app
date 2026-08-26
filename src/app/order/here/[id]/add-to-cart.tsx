"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { QuantityButtons } from "./quantityButtons";
import Link from "next/link";

const KEY = "cart";

type Cartitem = {
    id: string;
    name: string;
    price: number;
    quantity: number;
    image_url: string;
}

export function AddToCart(props : {
    id: string;
    name: string;
    price: number;
    image_url: string;
}) {
    const [count, setCount] = useState(1);
    const router = useRouter();

function add() {
    const raw = localStorage.getItem(KEY);
    const items: Cartitem[] = raw ? JSON.parse(raw) : [];

    const i = items.findIndex((item) => item.id === props.id);
    if (i >= 0) {
        items[i].quantity = count;
    } else {
        items.push({ ...props, quantity: count });
}
    localStorage.setItem(KEY, JSON.stringify(items));
    router.push("/order/take-out/cart");
}

return (    
    <div className="w-full">
      <div className="flex w-full flex-row justify-between">
        <span>税込み価格</span>
        <QuantityButtons price={props.price} count={count} onChange={setCount} />
      </div>
      <Link href="/order/take-out/cart" className="mt-6 w-full rounded-full bg-[#E2584B] py-2 text-white">
      <button
        type="button"
        onClick={add}
        className="mt-6 w-full rounded-full bg-[#E2584B] py-2 text-white"
      >
        カートに追加
      </button>
      </Link>
      </div>
  );
}