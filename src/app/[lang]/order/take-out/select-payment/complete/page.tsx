"use client";

import { useEffect, useLayoutEffect, useState } from "react";
import { submitCurrentOrder } from "@/app/lib/submit-current-order";
import { useDictionary } from "@/i18n/use-dictionary";

export default function OrderCompletePage() {
  const dict = useDictionary();
  const [orderNumber, setOrderNumber] = useState("");
  const [error, setError] = useState("");

  useLayoutEffect(() => {
    const last = sessionStorage.getItem("last-order-number") ?? "";
    if (last) setOrderNumber(last);
  }, []);

  useEffect(() => {
    async function saveOrder() {
      const result = await submitCurrentOrder();
      if (!result.ok) {
        const last = sessionStorage.getItem("last-order-number") ?? "";
        if (last) {
          setOrderNumber(last);
          return;
        }
        setError(result.error ?? dict.complete.notFound);
        return;
      }
      setOrderNumber(result.orderNumber);
    }

    saveOrder();
  }, [dict.complete.notFound]);

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
