"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { QuantityButtons } from "../[id]/quantityButtons";
import { applyDiscount } from "../../apply-discount";

type Coupon = { id: string; name: string; type: "percent" | "amount"; number: number };

const KEY = "here-cart";
type CartItem = {
  id: string;
  cartId?: string;
  name: string;
  price: number;
  quantity: number;
  image_url: string;
  choices?: { optionName: string; itemName: string }[];
};
export default function CartPage() {
  const [items, setItems] = useState<CartItem[] | null>(null);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [discountId, setDiscountId] = useState("");
  useEffect(() => {
    const raw = localStorage.getItem(KEY);
    setItems(raw ? JSON.parse(raw) : []);
    fetch("/api/coupons")
      .then((res) => res.json())
      .then((data) => setCoupons(Array.isArray(data) ? data : data.coupons ?? []));
  }, []);

  function lineId(item: CartItem) {
    return item.cartId ?? item.id;
  }

  function updateQuantity(id: string, quantity: number) {
    setItems((currentItems) => {
        if (!currentItems) return currentItems;
        const newItems = currentItems.map((item) => 
            lineId(item) === id ? { ...item, quantity } : item 
    );
    localStorage.setItem(KEY, JSON.stringify(newItems));
    return newItems;
    });
}

  function deleteItem(id: string) {
    setItems((currentItems) => {
        if (!currentItems) return currentItems;
        const newItems = currentItems.filter((item) => lineId(item) !== id);
        localStorage.setItem(KEY, JSON.stringify(newItems));
        return newItems;
    });
}

  if (!items) {
    return (
    <main className="mx-auto max-w-screen-lg px-4 py-16">
    <div>Loading...</div>;
    </main>
    );
  }
    
    if (items.length === 0) {
        return (
            <main className="mx-auto max-w-screen-lg px-4 py-16">
                <h1 className="text-2xl text-center font-bold mb-4">注文確認</h1>
                <p className="text-sm text-gray-500 mb-4">カートに商品がありません</p>
                <Link href="/order/here">
                    <button className="w-full rounded-full bg-[#E2584B] py-2 text-white">
                        メニューに戻る
                    </button>
                </Link>
            </main>
        )
    }
    
    
        return (
            <main className="mx-auto max-w-screen-lg px-4 py-16 pb-40">
                <h1 className="text-2xl text-center font-bold mb-4">注文確認</h1>
                <div className="flex flex-col gap-4">
                {items.map((item) => (
  <li key={lineId(item)} className="flex flex-row items-center justify-between gap-4 rounded-2xl bg-[#EFEBE3] p-3">
    <img src={item.image_url} alt={item.name} className="h-16 w-16 rounded-xl object-cover" />
    <div>
    <h2 className="text-lg font-bold">{item.name}</h2>
    {item.choices && item.choices.length > 0 && (
      <p className="text-sm text-gray-500">
        {item.choices.map((choice) => `${choice.optionName}:${choice.itemName}`).join(" / ")}
      </p>
    )}
    </div>
    <QuantityButtons
      price={item.price}
      quantity={item.quantity}
      onChange={(quantity) => updateQuantity(lineId(item), quantity)}
    />
    <button type="button" onClick={() => deleteItem(lineId(item))}>
  削除
</button>
  </li>
))}

                </div>
                <div className="fixed bottom-0 left-0 right-0 bg-white p-4 border-t ">
                <select
                  value={discountId}
                  onChange={(e) => setDiscountId(e.target.value)}
                  className="mb-4 w-full rounded-md border p-2"
                >
                  <option value="">クーポンを使わない</option>
                  {coupons.map((coupon) => (
                    <option key={coupon.id} value={coupon.id}>{coupon.name}</option>
                  ))}
                </select>
                <div className="mb-4 flex items-center justify-between">
                    <span className="font-bold">合計</span>
                    <span className="rounded-xl bg-[#EFEBE3] px-4 py-2 text-xl font-bold text-[#E2584B]">
                        {applyDiscount(
                          items.reduce((sum, item) => sum + item.price * item.quantity, 0),
                          coupons.find((coupon) => coupon.id === discountId) ?? null,
                        )} 円
                    </span>
                </div>
                <div className="mt-2 flex gap-3">
                    <Link
                        href="/order/here"
                        className="flex-[3] rounded-full border border-zinc-400 py-3 text-center"
                    >
                        戻る
                    </Link>
                    <Link
                        href="/order/take-out/select-payment"
                        onClick={() => {
                          sessionStorage.setItem("orderType", "here");
                          sessionStorage.setItem("discountId", discountId);
                        }}
                        className="flex flex-[7] items-center justify-center rounded-full bg-[#E2584B] py-3 text-center text-white"
                    >
                        レジに進む
                    </Link>
                </div>
                </div>
            </main>
        )
} 