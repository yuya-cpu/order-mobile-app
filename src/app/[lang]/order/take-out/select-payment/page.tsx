"use client";

import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import { loadPayments } from "@payjp/payments-js";
import { customerPath } from "@/i18n/config";
import { useDictionary } from "@/i18n/use-dictionary";

type CartItem = { id: string; quantity: number; option_detail_ids?: string[] };

export default function CheckoutPage() {
  const { lang } = useParams<{ lang: string }>();
  const dict = useDictionary();
  const formRef = useRef<HTMLDivElement>(null);
  const widgetsRef = useRef<{ confirmPayment: (opts: { return_url: string }) => Promise<{ error?: { message?: string } }> } | null>(null);
  const [amount, setAmount] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [paying, setPaying] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function setup() {
      const key = sessionStorage.getItem("orderType") === "here" ? "here-cart" : "cart";
      const raw = localStorage.getItem(key);
      const cart: CartItem[] = raw ? JSON.parse(raw) : [];
      if (cart.length === 0) {
        setError(dict.pay.emptyCart);
        return;
      }

      const res = await fetch("/api/payjp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: cart.map((item) => ({
            id: item.id,
            quantity: item.quantity,
            option_detail_ids: item.option_detail_ids,
          })),
          discountId: sessionStorage.getItem("discountId") ?? "",
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? dict.pay.prepareFailed);
        return;
      }

      const payments = await loadPayments(
        process.env.NEXT_PUBLIC_PAYJP_PUBLIC_KEY!,
      );
      if (cancelled || !formRef.current) return;

      const widgets = payments.widgets({ clientSecret: data.clientSecret });
      widgetsRef.current = widgets;

      const paymentForm = widgets.createForm("payment");
      paymentForm.mount(formRef.current);

      if (data.paymentFlowId) {
        sessionStorage.setItem("paymentFlowId", data.paymentFlowId);
      }
      setAmount(data.amount);
    }

    setup();
    return () => {
      cancelled = true;
    };
  }, [dict.pay.emptyCart, dict.pay.prepareFailed]);

  async function pay() {
    if (!widgetsRef.current) return;
    setPaying(true);
    setError("");

    const complete = `${window.location.origin}${customerPath(lang, "/order/take-out/select-payment/complete")}`;
    const result = await widgetsRef.current.confirmPayment({
      return_url: complete,
    });

    if (result.error) {
      setError(result.error.message ?? dict.pay.payFailed);
      setPaying(false);
      return;
    }

    window.location.href = complete;
  }

  return (
    <main className="mx-auto w-full max-w-md px-4 py-8">
      <h1 className="text-center text-2xl font-bold">{dict.pay.title}</h1>
      {amount != null && (
        <p className="mt-4 text-center font-bold text-[#E2584B]">{amount} {dict.common.yen}</p>
      )}
      <div ref={formRef} className="mt-8 w-full min-w-0 overflow-x-auto" />
      {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
      <button
        type="button"
        onClick={pay}
        disabled={paying || amount == null}
        className="mt-8 w-full rounded-xl bg-[#E2584B] py-3 text-white disabled:opacity-50"
      >
        {paying ? dict.pay.paying : dict.pay.pay}
      </button>
    </main>
  );
}