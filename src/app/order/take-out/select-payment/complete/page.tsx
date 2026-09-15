"use client";

import { useEffect, useState } from "react";

function nextNumberForToday() {
  const today = new Date().toLocaleDateString("ja-JP");
  const key = `order-count-${today}`;
  const next = Number(localStorage.getItem(key) ?? "0") + 1;
  localStorage.setItem(key, String(next));
  return String(next);
}

export default function OrderCompletePage() {
  const [orderNumber, setOrderNumber] = useState("");

  useEffect(() => {
    setOrderNumber(nextNumberForToday());
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6">
      <h1 className="text-2xl font-bold">ご注文が完了しました</h1>
      <p className="mt-6 text-sm text-zinc-400">お呼び出し番号</p>
      <p className="mt-2 text-5xl font-bold">{orderNumber}</p>
    </main>
  );
}