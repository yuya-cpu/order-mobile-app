"use client";

import { useEffect, useState } from "react";
import { useDictionary } from "@/i18n/use-dictionary";

type CartItem = { id: string; quantity: number };

export default function OrderCompletePage() {
  const dict = useDictionary();
  const [orderNumber, setOrderNumber] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    async function saveOrder() {
      const last = sessionStorage.getItem("last-order-number") ?? "";
      const key = sessionStorage.getItem("orderType") === "here" ? "here-cart" : "cart";
      const raw = localStorage.getItem(key);
      const cart: CartItem[] = raw ? JSON.parse(raw) : [];
      const paymentFlowId = sessionStorage.getItem("paymentFlowId") ?? "";
      const orderType = sessionStorage.getItem("orderType") === "here" ? "here" : "take-out";
      const guestCount = Number(sessionStorage.getItem("guestCount") ?? "1");

      if (cart.length === 0) {
        setOrderNumber(last);
        if (!last) setError(dict.complete.notFound);
        return;
      }

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: cart.map((item) => ({
            id: item.id,
            quantity: item.quantity,
          })),
          paymentFlowId,
          orderType,
          customerNumber: orderType === "here" ? guestCount : 1,
          discountId: sessionStorage.getItem("discountId") ?? "",
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? dict.complete.saveFailed);
        return;
      }

      setOrderNumber(data.order_number);
      sessionStorage.setItem("last-order-number", data.order_number);
      sessionStorage.removeItem("discountId");
      localStorage.removeItem(key);
    }

    saveOrder();
  }, [dict.complete.notFound, dict.complete.saveFailed]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6">
      <h1 className="text-2xl font-bold">{dict.complete.title}</h1>
      {error ? (
        <p className="mt-6 text-sm text-red-600">{error}</p>
      ) : (
        <>
          <p className="mt-6 text-sm text-zinc-400">{dict.complete.callNumber}</p>
          <p className="mt-2 text-5xl font-bold">{orderNumber}</p>
        </>
      )}
    </main>
  );
}
