"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const KEY = "cart";
type CartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image_url: string;
};
export default function CartPage() {
  const [items, setItems] = useState<CartItem[] | null>(null);
  useEffect(() => {
    const raw = localStorage.getItem(KEY);
    setItems(raw ? JSON.parse(raw) : []);
  }, []);

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
                <Link href="/order/menus">
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
                        <li key={item.id} className="flex flex-row items-center justify-between gap-4 rounded-2xl bg-[#EFEBE3] p-3">
                            <img src={item.image_url} alt={item.name} className="w-16 h-16 object-cover rounded-xl" />
                            <h2 className="text-lg font-bold">{item.name}</h2>
                            <p className="text-sm text-gray-500">{item.price * item.quantity}円</p>
                            <p className="text-sm text-gray-500">{item.quantity}個</p>
                        </li>
                    ))}

                </div>
                <div className="fixed bottom-0 left-0 right-0 bg-white p-4 border-t ">
                <div className="mb-4 flex items-center justify-between">
                    <span className="font-bold">合計</span>
                    <span className="rounded-xl bg-[#EFEBE3] px-4 py-2 text-xl font-bold text-[#E2584B]">
                        {items.reduce((sum, item) => sum + item.price * item.quantity, 0)} 円
                    </span>
                </div>
                <div className="mt-2 flex gap-3">
                    <Link
                        href="/order/here"
                        className="flex-[3] rounded-full border border-zinc-400 py-3 text-center"
                    >
                        戻る
                    </Link>
                    <button
                        type="button"
                        className="flex-[7] rounded-full bg-[#E2584B] py-3 text-white"
                    >
                        レジに進む
                    </button>
                </div>
                </div>
            </main>
        )
} 